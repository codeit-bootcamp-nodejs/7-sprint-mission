class Stack {

    private items : number[];    

    constructor() {
        this.items = [];
    }

    push(value : number) : void {
        this.items.push(value);
    }
    pop() : number | undefined {
        if(this.isEmpty()) {
            return undefined;
        }
        return this.items.pop();
    }
    peek() : number | undefined { 
        if(this.isEmpty()) {
           return undefined; 
        }
        return this.items[this.items.length - 1];
    }
    isEmpty() : boolean {
        return this.items.length === 0;
    }
}
