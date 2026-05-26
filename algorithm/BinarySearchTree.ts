
class TreeNode {
    public value : number;
    public left : TreeNode | null;
    public right : TreeNode | null;

    constructor(value : number) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}
class BinarySearchTree {
    
    private root : TreeNode | null;

    constructor() {
        this.root = null;
    }

    insert(value : number) : void {
        const newNode = new TreeNode(value);

        if (this.root === null) {
            this.root = newNode;
            return;
        }

        let current = this.root;
        while(true) {
            if(value === current.value) return;

            if(value < current.value) {
                if(current.left === null) {
                    current.left = newNode;
                    return;
                }
                current = current.left;
            } else {
                if(current.right === null) {
                    current.right = newNode;
                    return;
                }
                current = current.right;
            }
        }
    }
    find(value : number) : boolean {
        if(this.root === null) return false;
        let current: TreeNode | null = this.root;
        while (current !== null) {
            if(value < current.value) {
                current = current.left;
            } else if(value > current.value) {
                current = current.right;
            } else {
                return true;
            }
        }
        return false;
    }
    remove(value : number) : void  {
        this.root = this.removeNode(this.root, value);
    }
    private removeNode(node: TreeNode | null, value: number): TreeNode | null {
        if (node === null) return null;

        if (value < node.value) {
            node.left = this.removeNode(node.left, value);
            return node;
        } else if (value > node.value) {
            node.right = this.removeNode(node.right, value);
            return node;
        } else {
            if (node.left === null && node.right === null) {
                return null;
            }
            if (node.left === null) return node.right;
            if (node.right === null) return node.left;

            const minNode = this.findMinNode(node.right);
            node.value = minNode.value;

            node.right = this.removeNode(node.right, minNode.value);
            return node;
        }
    }

    private findMinNode(node: TreeNode): TreeNode {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }
}