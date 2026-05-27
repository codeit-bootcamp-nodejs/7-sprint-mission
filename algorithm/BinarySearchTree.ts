class BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;

  constructor(value: number) {
    this.value = value;
    this.left = null;  
    this.right = null; 
  }
}

// 이진 탐색 트리 메인 클래스
export class BinarySearchTree {
  root: BSTNode | null;

  constructor() {
    this.root = null; 
  }

  insert(value: number): void {
    const newNode = new BSTNode(value);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) return; 

      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  find(value: number): BSTNode | null {
    let current = this.root; 

    while (current !== null) {
      if (value === current.value) {
        return current; 
      }
      current = value < current.value ? current.left : current.right;
    }

    return null; 
  }

  remove(value: number): void {
    this.root = this._removeNode(this.root, value);
  }

  private _removeNode(node: BSTNode | null, key: number): BSTNode | null {
    if (node === null) return null;

    if (key < node.value) {
      node.left = this._removeNode(node.left, key);
      return node;
    } else if (key > node.value) {
      node.right = this._removeNode(node.right, key);
      return node;
    } else {
      if (node.left === null && node.right === null) {
        return null;
      }

      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      let successor = node.right;
      while (successor.left !== null) {
        successor = successor.left;
      }

      node.value = successor.value;
      node.right = this._removeNode(node.right, successor.value);
      return node;
    }
  }
}