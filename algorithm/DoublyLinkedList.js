class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToHead(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
  }

  addToTail(value) {
    const newNode = new Node(value);
    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  findNode(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode) return false;

    const newNode = new Node(newValue);
    newNode.next = targetNode.next;
    newNode.prev = targetNode;

    if (targetNode.next) {
      targetNode.next.prev = newNode;
    } else {
      this.tail = newNode;
    }
    targetNode.next = newNode;
    return true;
  }

  removeNode(value) {
    const targetNode = this.findNode(value);
    if (!targetNode) return false;

    if (targetNode === this.head) {
      this.head = targetNode.next;
      if (this.head) this.head.prev = null;
      else this.tail = null;
    } else if (targetNode === this.tail) {
      this.tail = targetNode.prev;
      if (this.tail) this.tail.next = null;
      else this.head = null;
    } else {
      targetNode.prev.next = targetNode.next;
      targetNode.next.prev = targetNode.prev;
    }
    return true;
  }
}

module.exports = DoublyLinkedList;
