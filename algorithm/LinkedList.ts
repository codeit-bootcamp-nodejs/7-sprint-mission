class ListNode<T> {
    public value : T;
    public next: ListNode<T> | null = null;

    constructor(value : T) {
        this.value = value;
    }
}

class LinkedList<T> {

    public head : ListNode<T> | null = null;

    addNode(value : T) : void {
        const newNode = new ListNode(value);
        if(this.head === null) {
            this.head = newNode;
            return;
        }
        let current = this.head;
        while(current.next !== null) {
            current = current.next;
        }
        current.next = newNode;
    }
    findNode(value : T) : ListNode<T> | null {
        let current = this.head;
        while(current !== null) {
            if(current.value === value) {
                return current;
            }
            current = current.next;
        }
        return null;
    }
    insertAfter(targetValue : T, newValue : T) : boolean {
        const targetNode = this.findNode(targetValue);

        if(targetNode === null) {
            return false;
        }

        const newNode = new ListNode(newValue);
        newNode.next = targetNode.next;
        targetNode.next = newNode;

        return true;
    }
    removeAfter(targetValue : T) : boolean {
        const targetNode = this.findNode(targetValue);

        if(targetNode === null || targetNode.next === null) {
            return false;
        }

        targetNode.next = targetNode.next.next;
        return true;
    }
    
}