import axios from "axios";
import { Article } from "./main.js";

// .then, catch 문으로 작성

/*function getQueryParameter(page, pageSize, keyword) {
   const paramList = [];
   if (page !== undefined) {
      paramList.push(`pageSize=${pageSize}`);
   }
   if (pageSize !== undefined) {
      paramList.push(`pageSize=${pageSize}`);
   }
   if (keyword !== undefined) {
      paramList.push(`pageSize=${keyword}`);
   }
   return paramList.join("&");
}*/

const articleList = ({ title, content, image }) => new Article(title, content, image);

const logAndThrow = (error) => {
   console.error("Error fetching article list:", error);
   throw error;
};

function getArticleList(page, pageSize, keyword) {
   //get 메소드 사용
   return axios
      .get("https://panda-market-api-crud.vercel.app/articles", { page, pageSize, keyword })
      .then((response) => response.data.list.map(articleList))
      .catch(logAndThrow);
}

function getArticle(articleId) {
   //get 메소드 사용
   return axios
      .get(`https://panda-market-api-crud.vercel.app/articles/${articleId}`)
      .then(articleList)
      .catch(logAndThrow);
   /* const getArticleResponse = await axios.get(`${base_url}/articles/${articleId}`);
      const { title, content, images } = getArticleResponse.data;
      const WantArticle = new Product(title, content, images);
      return WantArticle;
   } catch (error) {
      console.error(error.response ? error.response.data : error.message);
   }*/
}

function createArticle(article) {
   return axios.post("https://panda-market-api-crud.vercel.app/articles", article).catch(logAndThrow);
   /*try {
      const { title, content, images } = article;
      const createResponse = await axios.post(`${base_url}/articles/`, {
         title,
         content,
         images,
      });

      return createResponse.data;
   } catch (error) {
      console.error(error.response ? error.response.data : error.message);
   }
   //post 메소드 사용
   //request body에 title, content, image */
}

function patchArticle(articleId, article) {
   return axios.patch(`https://panda-market-api-crud.vercel.app/articles/${articleId}`, article).catch(logAndThrow);
   /*try {
      const patchArticleResponse = await axios.patch(`${base_url}/articles/${articleId}`, patchData);
      return patchArticleResponse.data;
   } catch (error) {
      console.error(error.response ? error.response.data : error.message);
   }
   //patch 메소드 사용*/
}

function deleteArticle(articleId) {
   return axios
      .delete(`https://panda-market-api-crud.vercel.app/articles/${articleId}`)
      .then(({ id }) => id)
      .catch(logAndThrow);
   /*try {
      await axios.delete(`${base_url}/articles/${articleId}`);
      console.log("Article 삭제 성공 :");
      console.log(`ID: ${articleId} 상품이 삭제되었습니다.`);

      return null;
   } catch (error) {
      console.error(error.response ? error.response.data : error.message);
   }
   //delete 메소드 사용
   //fetch or axios 사용
   //응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력해 주세요.
   //.then() 메소드를 이용하여 비동기 처리를 해주세요.
   //.catch() 를 이용하여 오류 처리를 해주세요.*/
}
/*try {
      const queryParam = getQueryParameter(page, pageSize, keyword);
      if (queryParam !== "") base_url += `?${queryParam}`;
      const articleListResponse = await axios.get(`${base_url}/articles`, { queryParam });

      //3. response를 처리해서 원하는 결과 얻기
      const articleList = articleListResponse.data.list.map(
         ({ title, content, writer }) => new Article(title, content, writer) //articleList를 보고, 새로운 객체 Article로 만들겠다.
      ); // response 밑에 data밑에 list 내에 정보들이 있다.
      console.log(articleList);
      return articleList;
   } catch (error) {
      console.error(error.response ? error.response.data : error.message);
   }*/
