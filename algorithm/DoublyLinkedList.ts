class LinkedListNode<T> {
    public value: T;
    public next: LinkedListNode<T> | null = null;
    public prev: LinkedListNode<T> | null = null;

    constructor(value: T) {
        this.value = value;
    }
}

class DoublyLinkedList<T> {
    private head: LinkedListNode<T> | null = null;
    private tail: LinkedListNode<T> | null = null;

    public addToHead(value: T): void {
        const newNode = new LinkedListNode(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.head.prev = newNode;
            newNode.next = this.head;
            this.head = newNode;
        }
    }

    public addToTail(value: T): void {
        const newNode = new LinkedListNode(value);

        if (!this.tail) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    }

    public findNode(value: T): LinkedListNode<T> | null {
        let current = this.head;

        while (current) {
            if (current.value === value) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    public insertAfter(targetValue: T, newValue: T): boolean {
        const targetNode = this.findNode(targetValue);

        if (!targetNode) {
            console.log(`값 ${targetValue}을(를) 가진 노드를 찾을 수 없습니다.`);
            return false;
        }

        const newNode = new LinkedListNode(newValue);
        newNode.next = targetNode.next;
        newNode.prev = targetNode;

        if (targetNode === this.tail) {
            this.tail = newNode;
        } else {
            if (targetNode.next) {
                targetNode.next.prev = newNode;
            }
        }

        targetNode.next = newNode;
        return true;
    }

    public removeNode(value: T): LinkedListNode<T> | null {
        const targetNode = this.findNode(value);

        if (!targetNode) {
            console.log(`삭제할 값 ${value}을(를) 가진 노드가 없습니다.`);
            return null;
        }

        if (targetNode === this.head) {
            this.head = targetNode.next;
            if (this.head) {
                this.head.prev = null;
            } else {
                this.tail = null;
            }
        }

        else if (targetNode === this.tail) {
            this.tail = targetNode.prev;
            if (this.tail) {
                this.tail.next = null;
            } else {
                this.head = null;
            }
        }
        else {
            if(targetNode.prev) targetNode.prev.next = targetNode.next;
            if (targetNode.next) targetNode.next.prev = targetNode.prev;
        }

        targetNode.next = null;
        targetNode.prev = null;
        return targetNode;
    }

    public print(): void {
        let current = this.head;
        const result: T[] = [];
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        console.log(result.join(" <-> "));
    }
}