class Queue {
    
    private items : number[];

    constructor() {
        this.items = [];
    }

    enqueue(value : number) : void {
        this.items.push(value);
    }
    dequeue() : number | undefined {
        if(this.isEmpty()) {
            return undefined;
        }
        return this.items.shift();
    }
    peek() : number | undefined {
        if(this.isEmpty()) {
            return undefined;
        }
        return this.items[0];
    }
    isEmpty() : boolean {
        return this.items.length === 0;
    }
}