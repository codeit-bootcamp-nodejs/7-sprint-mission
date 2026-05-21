class Node{
    constructor(data){
        this.data = data;
        this.parent = null;
        this.rightChildren = null;
        this.leftChildren = null;
    }
}

function printInorder(node) {
  /** 주어진 노드를 in-order로 출력해주는 함수 */
  if (node !== null) {
    printInorder(node.leftChildren);
    console.log(node.data);
    printInorder(node.rightChildren);
  }
}


class BinarySearchTree{
    constructor(){
        this.root = null;
    }
    insert(value){
        const newNode = new Node(value);
        if(this.root === null){
            this.root = newNode;
            return;
        }

        let temp = this.root;

        while(temp !== null){
            if(value > temp.data){
                if(temp.rightChildren===null){
                    newNode.parent = temp;
                    temp.rightChildren = newNode;
                    return;
                }else{
                    temp = temp.rightChildren;
                }
            }else{
                    if(temp.leftChildren===null){
                    newNode.parent = temp;
                    temp.leftChildren = newNode;
                    return;
                }else{
                    temp = temp.leftChildren;
                }
            }
        }
    }
    findMin(node){
        let temp = node;

        while(temp.leftChildren !=null){
            temp = temp.leftChildren;
        }
        return temp;
    }

    find(value){
        let temp = this.root;
        while(temp !== null){
            if(value=== temp.data){
                return temp;
            }
            if(value > temp.data){
                temp = temp.rightChildren;
            }else{
                temp = temp.leftChildren;
            }
        }
        return null;
    }
    remove(value){
        const nodeToRemove = this.find(value);
        if(!nodeToRemove) return;

        const parentNode = nodeToRemove.parent;

        if(nodeToRemove.leftChildren === null && nodeToRemove.rightChildren===null){
            if(this.root === nodeToRemove){
                this.root =null;
            }else{
                if(nodeToRemove === parentNode.leftChildren){
                    parentNode.leftChildren = null;
                }else{
                    parentNode.rightChildren = null;     
                }
            }
        }else if(nodeToRemove.leftChildren===null){
            if(nodeToRemove===this.root){
                this.root = nodeToRemove.rightChildren;
                this.root.parent = null;
            }else if (nodeToRemove === parentNode.leftChildren){
                parentNode.leftChildren = nodeToRemove.rightChildren;
                nodeToRemove.rightChildren.parent =parentNode;
            }else{
                parentNode.root = nodeToRemove.rightChildren;
                nodeToRemove.rightChildren.parent = parentNode;
            }
        }else if(nodeToRemove.rightChildren===null){
            if(nodeToRemove===this.root){
                this.root = nodeToRemove.leftChildren;
                this.root.parent = null;
            }else if (nodeToRemove === parentNode.leftChildren){
                parentNode.leftChildren = nodeToRemove.leftChildren;
                nodeToRemove.leftChildren.parent =parentNode;
            }else{
                parentNode.rightChildren = nodeToRemove.rightChildren;
                nodeToRemove.leftChildren.parent = parentNode;
            }
        }else{
           const successor = this.findMin(nodeToRemove.rightChildren);
           nodeToRemove.data = successor.data;
           
           if(successor=== successor.parent.leftChildren){
            successor.parent.leftChildren = successor.rightChildren;
           }else{
            successor.parent.rightChildren = successor.rightChildren;
           }

           if(successor.rightChildren !==null){
            successor.rightChildren.parent = successor.parent;
           }
        }

    }
    printSortedTree() {
    printInorder(this.root);
  }
}

const bst = new BinarySearchTree();

bst.insert(7);
bst.insert(11);
bst.insert(9);
bst.insert(17);
bst.insert(8);
bst.insert(5);
bst.insert(19);
bst.insert(3);
bst.insert(2);
bst.insert(4);
bst.insert(14);

bst.remove(7);
bst.remove(11);

bst.printSortedTree();
