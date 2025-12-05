#!/bin/bash

# Start server in background
node main.js > server.log 2>&1 &
SERVER_PID=$!

echo "Server started with PID $SERVER_PID. Waiting for it to be ready..."
sleep 5

# Helper function to extract ID from JSON response
get_id() {
  echo $1 | grep -o '"id":"[^"]*"' | cut -d'"' -f4
}

# Helper function to extract nextCursor from JSON response
get_cursor() {
  echo $1 | grep -o '"nextCursor":"[^"]*"' | cut -d'"' -f4
}

echo "==================================================="
echo "1. Basic Checks"
echo "==================================================="

# 1. Health Check
echo "1-1. Health Check: GET /api/products"
curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:3000/api/products
echo -e "\n(Expected: 200)"

# 2. CORS Test
echo "1-2. CORS Test: OPTIONS /api/products"
curl -I -X OPTIONS http://localhost:3000/api/products \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: POST"
echo -e "\n(Expected: 204 No Content and Access-Control-Allow-Origin)"


echo "==================================================="
echo "2. Article Scenarios"
echo "==================================================="

# Create Article
echo "2-1. Creating Article for tests..."
ARTICLE_RESP=$(curl -s -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Searchable Title", "content":"Searchable Content inside"}')
echo "Created Article: $ARTICLE_RESP"
ARTICLE_ID=$(get_id "$ARTICLE_RESP")

if [ -n "$ARTICLE_ID" ]; then
  # Search Title
  echo "2-2. Search Article (Title)"
  curl -s -X GET "http://localhost:3000/api/articles?search=Searchable"
  echo -e "\n"

  # Search Content
  echo "2-3. Search Article (Content)"
  curl -s -X GET "http://localhost:3000/api/articles?search=Content"
  echo -e "\n"

  # Add Comment to Article
  echo "2-4. Add Comment to Article $ARTICLE_ID"
  curl -s -X POST http://localhost:3000/api/articles/$ARTICLE_ID/comments \
    -H "Content-Type: application/json" \
    -d '{"content": "Article Comment 1"}'
  echo -e "\n"
  
  # Add another comment for pagination
  curl -s -X POST http://localhost:3000/api/articles/$ARTICLE_ID/comments \
    -H "Content-Type: application/json" \
    -d '{"content": "Article Comment 2"}' > /dev/null

  # List Article Comments (Cursor)
  echo "2-5. List Article Comments (Cursor)"
  # First page
  RESP_PAGE1=$(curl -s -X GET "http://localhost:3000/api/articles/$ARTICLE_ID/comments?limit=1")
  echo "Page 1: $RESP_PAGE1"
  CURSOR=$(get_cursor "$RESP_PAGE1")
  
  if [ -n "$CURSOR" ]; then
    ENCODED_CURSOR=$(node -e "console.log(encodeURIComponent('$CURSOR'))")
    echo "Fetching Page 2 with cursor: $ENCODED_CURSOR"
    curl -s -X GET "http://localhost:3000/api/articles/$ARTICLE_ID/comments?limit=1&cursorId=$ENCODED_CURSOR"
    echo -e "\n"
  else
    echo "Failed to get cursor from Page 1"
  fi
fi


echo "==================================================="
echo "3. Product Scenarios"
echo "==================================================="

# Create Product
echo "3-1. Creating Product for tests..."
PRODUCT_RESP=$(curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"New Product", "description":"Best Description", "price":100, "tags":["new"]}')
echo "Created Product: $PRODUCT_RESP"
PRODUCT_ID=$(get_id "$PRODUCT_RESP")

if [ -n "$PRODUCT_ID" ]; then
  # Search Name
  echo "3-2. Search Product (Name)"
  curl -s -X GET "http://localhost:3000/api/products?search=Product"
  echo -e "\n"

  # Search Description
  echo "3-3. Search Product (Description)"
  curl -s -X GET "http://localhost:3000/api/products?search=Description"
  echo -e "\n"

  # Add Comment to Product
  echo "3-4. Add Comment to Product $PRODUCT_ID"
  COMMENT_RESP=$(curl -s -X POST http://localhost:3000/api/products/$PRODUCT_ID/comments \
    -H "Content-Type: application/json" \
    -d '{"content": "Product Comment 1"}')
  echo "Created Comment: $COMMENT_RESP"
  COMMENT_ID=$(get_id "$COMMENT_RESP")

  # Add another comment
  curl -s -X POST http://localhost:3000/api/products/$PRODUCT_ID/comments \
    -H "Content-Type: application/json" \
    -d '{"content": "Product Comment 2"}' > /dev/null

  # List Product Comments (Basic)
  echo "3-5. List Product Comments (Basic limit=5)"
  curl -s -X GET "http://localhost:3000/api/products/$PRODUCT_ID/comments?limit=5"
  echo -e "\n"

  # List Product Comments (Cursor)
  echo "3-6. List Product Comments (Cursor)"
  RESP_PROD_PAGE1=$(curl -s -X GET "http://localhost:3000/api/products/$PRODUCT_ID/comments?limit=1")
  echo "Page 1: $RESP_PROD_PAGE1"
  PROD_CURSOR=$(get_cursor "$RESP_PROD_PAGE1")
  
  if [ -n "$PROD_CURSOR" ]; then
    ENCODED_CURSOR=$(node -e "console.log(encodeURIComponent('$PROD_CURSOR'))")
    echo "Fetching Page 2 with cursor: $ENCODED_CURSOR"
    curl -s -X GET "http://localhost:3000/api/products/$PRODUCT_ID/comments?limit=1&cursorId=$ENCODED_CURSOR"
    echo -e "\n"
  fi

  echo "==================================================="
  echo "4. Comment Modification"
  echo "==================================================="
  
  if [ -n "$COMMENT_ID" ]; then
    # Patch Success
    echo "4-1. Patch Comment (Success) ID: $COMMENT_ID"
    curl -s -X PATCH "http://localhost:3000/api/comments/$COMMENT_ID" \
      -H "Content-Type: application/json" \
      -d '{"content": "Updated Content"}'
    echo -e "\n(Expected: Updated content in response)"
  fi

  # Patch Fail (404) - using a huge ID that likely doesn't exist
  echo "4-2. Patch Comment (404)"
  # BigInt in JS/Prisma often handles string inputs, but let's use a numeric ID that is very large
  curl -s -o /dev/null -w "%{http_code}" -X PATCH "http://localhost:3000/api/comments/99999999" \
    -H "Content-Type: application/json" \
    -d '{"content": "Should Fail"}'
  echo -e "\n(Expected: 404)"

  echo "==================================================="
  echo "5. Upload Scenarios"
  echo "==================================================="

  # Upload Image (Success)
  echo "5-1. Upload Image (Success)"
  # Creating a dummy jpg if not exists (simple text disguised as jpg is often enough for multer unless it checks magic numbers deeply, 
  # but let's use the existing test.jpg if valid, or just create a file)
  if [ ! -f test.jpg ]; then touch test.jpg; fi
  curl -s -X POST http://localhost:3000/api/upload/image \
    -F "image=@test.jpg"
  echo -e "\n"

  # Upload Text (Fail)
  echo "5-2. Upload Text (Fail)"
  if [ ! -f test.txt ]; then echo "text file" > test.txt; fi
  curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/upload/image \
    -F "image=@test.txt"
  echo -e "\n(Expected: 400 or error)"

  echo "==================================================="
  echo "6. Data Integrity (Cascade)"
  echo "==================================================="
  
  echo "6-1. Deleting Product $PRODUCT_ID"
  curl -s -X DELETE "http://localhost:3000/api/products/$PRODUCT_ID"
  echo -e "\n"
  
  echo "6-2. Verifying Comments for Product $PRODUCT_ID (Should be 404)"
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "http://localhost:3000/api/products/$PRODUCT_ID/comments")
  echo "HTTP Code: $HTTP_CODE"
  if [ "$HTTP_CODE" == "404" ]; then
    echo "SUCCESS: Product not found, comments inaccessible."
  else
    echo "FAILURE: Unexpected status code $HTTP_CODE"
  fi

fi

echo "---------------------------------------------------"
# Kill server
kill $SERVER_PID
echo "Server stopped."
