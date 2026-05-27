class Queue<T> {
    private storage: T[] = [];

    public enqueue(value: T): void {
        this.storage.push(value);
    }

    public dequeue(): T | undefined {
        if (this.isEmpty()) {
            console.log("큐가 비어있습니다.");
            return undefined;
        }
        return this.storage.shift();
    }

    public peek(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.storage[0];
    }

    public isEmpty(): boolean {
        return this.storage.length === 0;
    }
}