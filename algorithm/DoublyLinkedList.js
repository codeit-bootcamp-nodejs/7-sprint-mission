class Node{
    constructor(data){
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}
class DoublyLinkedList{
    constructor(){
        this.head = null;
        this.tail = null;
    }
    addToHead(value){
        const newNode = new Node(value);
        if(!this.head){
            this.head = newNode;
            this.tail = newNode;
            return;
        }

        newNode.next = this.head;
        this.head.prev = newNode;
        this.head = newNode;
    }
    addToTail(value){
        const newNode = new Node(value);
                if(!this.tail){
            this.head = newNode;
            this.tail = newNode;
            return;
        }
        newNode.prev = this.tail;
        this.tail.next = newNode;
        this.tail = newNode;

    }
    insertAfter(targetValue, newValue){
        const targetNode = this.findNode(targetValue);
        if(!targetNode) return false;

        const newNode = new Node(newValue);
        newNode.next = targetNode.next;
        newNode.prev = targetNode;

        if(targetNode.next){
            targetNode.next.prev = newNode;
        }else{
            this.tail = newNode;
        }
        targetNode.next = newNode;
        return true;
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
    removeNode(value){
       const targetNode = this.findNode(value);
        if(!targetNode) return false;  

      if(targetNode === this.head && targetNode === this.tail){
        this.head = null;
        this.tail = null;
      }else if(targetNode === this.head){
        this.head = this.head.next;
        if(this.head) this.head.prev =null;
      }else if(value === this.tail){
        this.tail = this.tail.prev;
        if(this.tail) this.tail.next =null;
      }else{
        targetNode.prev.next = targetNode.next;
        targetNode.next.prev = targetNode.prev;
      }
      return targetNode.data;
    }
}

const doublyLinkList = new DoublyLinkedList();
doublyLinkList.addToHead(1);
doublyLinkList.addToTail(2);
doublyLinkList.addToTail(3);
doublyLinkList.addToTail(4);
doublyLinkList.addToHead(0);
doublyLinkList.addToTail(5);

console.log(doublyLinkList.findNode(2));
doublyLinkList.insertAfter(2,4);
doublyLinkList.removeNode(2);
