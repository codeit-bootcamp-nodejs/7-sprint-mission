class Node{
    constructor(data){
        this.data = data;
        this.next = null;
    }
}
class LinkedList{
    
    constructor(){
        this.head = null;
        this.tail = null;
    }


    addNode(value){
        const newNode = new Node(value);

        if(this.head === null){
            this.head = newNode;
            this.tail = newNode;
        }else{
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }

    findNode(value){
        let interator = this.head;
        while (interator !== null){
            if(interator.data === value){
                return interator;
            }
            interator = interator.next;
        }
        return null;
    }

    insertAfter(targetValue, newValue){
        const newNode = new Node(newValue);

        const targetNode = this.findNode(targetValue);
        if (!targetNode) return;

        if(targetNode === this.tail) {
            this.tail.next = newNode;
            this.tail = newNode;
        } else {
            newNode.next = targetNode.next;
            targetNode.next = newNode;      
        }
    }

    removeAfter(targetValue){
        const targetNode = this.findNode(targetValue);
        if (!targetNode) return;

        const data = targetNode.next.data;
        targetNode.next = targetNode.next.next;

        if(targetNode.next === null){
            this.tail = targetNode;
        }
        return data;
    }
}

const linkedList = new LinkedList();
linkedList.addNode(1);
linkedList.addNode(2);
linkedList.addNode(3);
linkedList.addNode(4);

console.log(linkedList.findNode(2));
linkedList.insertAfter(2,4);
linkedList.removeAfter(2);
