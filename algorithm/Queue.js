class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(value) {
    this.items.push(value);
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }

    return this.items.shift();
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }

    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

module.exports = Queue;

if (require.main === module) {
  const queue = new Queue();
  console.log(queue.isEmpty());
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);
  console.log(queue.peek());
  console.log(queue.dequeue());
  console.log(queue.dequeue());
  console.log(queue.isEmpty());
}
