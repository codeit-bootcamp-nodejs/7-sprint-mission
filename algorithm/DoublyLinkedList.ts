class DoublyLinkedNode<T> {
    public next : DoublyLinkedNode<T> | null = null;
    public prev : DoublyLinkedNode<T> | null = null;
    public value : T;

    constructor(value : T) {
        this.value = value;
    }
}

class DoublyLinkedList<T> {
    public head : DoublyLinkedNode<T> | null = null;
    public tail : DoublyLinkedNode<T> | null = null;

    addToHead(value : T) : void {
        const newNode = new DoublyLinkedNode(value);

        if(this.head === null) {
            this.head = newNode;
            this.tail = newNode;
            return;
        }
        newNode.next = this.head;
        this.head.prev = newNode;
        this.head = newNode;
    }
    addToTail(value : T) : void {
        const newNode = new DoublyLinkedNode(value);

        if(this.tail === null) {
            this.head = newNode;
            this.tail = newNode;
            return;
        }
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
    }
    insertAfter(targetValue : T, newValue : T) : boolean {
        const targetNode = this.findNode(targetValue);
        if(targetNode === null) return false;

        const newNode = new DoublyLinkedNode(newValue);
        newNode.next = targetNode.next;
        newNode.prev = targetNode;

        if(targetNode === this.tail) {
            this.tail = newNode;
        } else {
            if(targetNode.next) targetNode.next.prev = newNode;
        }
        targetNode.next = newNode;
        return true;
    }
    findNode(value : T) : DoublyLinkedNode<T> | null {
        let current = this.head;

        while(current !== null) {
            if(current.value === value) {
                return current;
            }
            current = current.next;
        }

        return null;
    }
    removeNode(value : T) : boolean {
        const targetNode = this.findNode(value);
        if(targetNode === null) return false;

        if(targetNode === this.head) {
            this.head = targetNode.next;
            if(this.head) {
                this.head.prev = null;
            } else {
                this.tail = null;
            }
        } else if(targetNode === this.tail) {
            this.tail = targetNode.prev;
            if(this.tail) { 
                this.tail.next = null;
            } else { 
                this.head = null;
            }
        } else {
            if(targetNode.prev) {
                targetNode.prev.next = targetNode.next;
            }
            if(targetNode.next) {
                targetNode.next.prev = targetNode.prev;
            }
        }
        return true;
    }
}