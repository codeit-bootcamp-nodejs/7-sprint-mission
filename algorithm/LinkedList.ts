interface INode<T> {
    value: T;
    next: INode<T> | null;
}

class ListNode<T> implements INode<T> {
    public value: T;
    public next: INode<T> | null;

    constructor(value: T) {
        this.value = value;
        this.next = null;
    }
}

export class LinkedList<T> {
    private head: INode<T> | null = null;

    public addNode(value: T): void {
        const newNode = new ListNode(value);

        if (!this.head) {
            this.head = newNode;
            return;
        }

        let current = this.head;
        while (current.next !== null) {
            current = current.next;
        }
        current.next = newNode;
    }

    public findNode(value: T): INode<T> | null {
        let current = this.head;

        while (current !== null) {
            if ( current.value === value) {
                return current;
            }
            current = current.next;
        }

        return null;
    }

    public insertAfter(targetValue: T, newValue: T): void {
        const targetNode = this.findNode(targetValue);

        if (!targetNode) {
            console.log(`값 ${targetValue}을 가진 노드를 찾을 수 없습니다.`);
            return;
        }

        const newNode = new ListNode(newValue);
        newNode.next = targetNode.next;
        targetNode.next = newNode;
    }

    public removeAfter(targetValue: T): void {
        const targetNode = this.findNode(targetValue);

        if (!targetNode || !targetNode.next) {
            console.log(`삭제할 뒤쪽 노드가 존재하지 않습니다.`);
            return;
        }

        const deletedNode = targetNode.next;
        targetNode.next = deletedNode.next;
    }

    public printAll(): void {
        const values: T[] = [];
        let current = this.head;
        while (current !== null) {
            values.push(current.value);
            current = current.next;
        }
        console.log(values.join(" -> "));
    }
}