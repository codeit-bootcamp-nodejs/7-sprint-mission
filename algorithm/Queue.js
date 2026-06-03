class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}


class Queue{
   constructor(){
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    enqueue(value){
        const node = new ListNode(value);
        if(this.tail){
            this.tail.next = node;
        }else{
            this.head = node;
        }
        this.tail = node;
        this.size++;
    }
    dequeue(){
        if(!this.head) return;
        const value = this.head.value;
        this.head = this.head.next;
        if(!this.head) this.tail = null;
        this.size--;
        return value;
    }
    peek(){
        if(!this.head) return;
        const value = this.head.value;
        this.head = this.head.next;
        return value;
    }
    isEmpty(){
        return this.size ===0;
    }
}


const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log(queue.dequeue()); 
console.log(queue.dequeue()); 
console.log(queue.peek()); 
console.log(queue.isEmpty()); 