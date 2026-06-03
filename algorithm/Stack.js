class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
class Stack{
      constructor(){
        this.head = null;
        this.size = 0;
    } 
    push(value){
        const newNode = new ListNode(value);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }
    pop(){
        if(!this.head) return;
        const value = this.head.value;
        this.head = this.head.next;
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
        return this.size === 0;
    }
}



const stack = new Stack();
stack.push("A");
stack.push("B");
stack.push("C");
stack.push("D");
stack.push("E");
console.log(stack.pop()); 
console.log(stack.pop()); 
console.log(stack.pop()); 
console.log(stack.pop());
console.log(stack.peek()); 
console.log(stack.isEmpty()); 