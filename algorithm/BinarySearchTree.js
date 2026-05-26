class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      return newNode;
    }

    let currentNode = this.root;

    while (currentNode !== null) {
      if (value === currentNode.value) {
        return null;
      }

      if (value < currentNode.value) {
        if (currentNode.left === null) {
          currentNode.left = newNode;
          return newNode;
        }

        currentNode = currentNode.left;
      } else {
        if (currentNode.right === null) {
          currentNode.right = newNode;
          return newNode;
        }

        currentNode = currentNode.right;
      }
    }

    return null;
  }

  find(value) {
    let currentNode = this.root;

    while (currentNode !== null) {
      if (value === currentNode.value) {
        return currentNode;
      }

      if (value < currentNode.value) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    return null;
  }

  remove(value) {
    const removeNode = (node, targetValue) => {
      if (node === null) {
        return null;
      }

      if (targetValue < node.value) {
        node.left = removeNode(node.left, targetValue);
        return node;
      }

      if (targetValue > node.value) {
        node.right = removeNode(node.right, targetValue);
        return node;
      }

      if (node.left === null) {
        return node.right;
      }

      if (node.right === null) {
        return node.left;
      }

      let minimumNode = node.right;

      while (minimumNode.left !== null) {
        minimumNode = minimumNode.left;
      }

      node.value = minimumNode.value;
      node.right = removeNode(node.right, minimumNode.value);
      return node;
    };

    this.root = removeNode(this.root, value);
  }
}

module.exports = BinarySearchTree;

if (require.main === module) {
  const bst = new BinarySearchTree();
  bst.insert(10);
  bst.insert(5);
  bst.insert(15);
  bst.insert(3);
  bst.insert(7);
  bst.insert(12);
  bst.insert(18);

  console.log("find 7:", bst.find(7));
  console.log("find 100:", bst.find(100));

  bst.remove(3);
  console.log("after remove leaf 3:", JSON.stringify(bst));

  bst.remove(15);
  console.log("after remove 15:", JSON.stringify(bst));

  bst.remove(10);
  console.log("after remove root 10:", JSON.stringify(bst));
}
