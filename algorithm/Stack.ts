class Stack<T> {
    private storage: T[] = [];

    public push(value: T): void {
        this.storage.push(value);
    }

    public pop(): T | undefined {
        if (this.isEmpty()) {
            console.log("스택이 비어있습니다.");
            return undefined;
        }
        return this.storage.pop();
    }

    public peek(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.storage[this.storage.length - 1];
    }

    public isEmpty(): boolean {
        return this.storage.length === 0;
    }
}