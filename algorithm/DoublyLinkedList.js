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
    this.length = 0;
  }

  addToHead(value) {
    const newNode = new Node(value);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }

    this.length++;
    return newNode;
  }

  addToTail(value) {
    const newNode = new Node(value);

    if (this.tail === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    this.length++;
    return newNode;
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);

    if (targetNode === null) {
      return null;
    }

    const newNode = new Node(newValue);
    newNode.prev = targetNode;
    newNode.next = targetNode.next;

    if (targetNode.next !== null) {
      targetNode.next.prev = newNode;
    } else {
      this.tail = newNode;
    }

    targetNode.next = newNode;
    this.length++;
    return newNode;
  }

  findNode(value) {
    let currentNode = this.head;

    while (currentNode !== null) {
      if (currentNode.value === value) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  removeNode(value) {
    const removedNode = this.findNode(value);

    if (removedNode === null) {
      return null;
    }

    if (removedNode.prev !== null) {
      removedNode.prev.next = removedNode.next;
    } else {
      this.head = removedNode.next;
    }

    if (removedNode.next !== null) {
      removedNode.next.prev = removedNode.prev;
    } else {
      this.tail = removedNode.prev;
    }

    removedNode.prev = null;
    removedNode.next = null;
    this.length--;
    return removedNode;
  }
}

module.exports = DoublyLinkedList;

if (require.main === module) {
  const list = new DoublyLinkedList();
  list.addToHead(2);
  list.addToHead(1);
  list.addToTail(3);
  list.insertAfter(2, 4);
  console.log("find 4:", list.findNode(4));
  console.log("remove 1:", list.removeNode(1));
  console.log("remove 3:", list.removeNode(3));
  console.log("head:", list.head);
  console.log("tail:", list.tail);
}
