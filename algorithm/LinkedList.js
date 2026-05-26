class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  addNode(value) {
    const newNode = new Node(value);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

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

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);

    if (targetNode === null) {
      return null;
    }

    const newNode = new Node(newValue);
    newNode.next = targetNode.next;
    targetNode.next = newNode;

    if (targetNode === this.tail) {
      this.tail = newNode;
    }

    this.length++;
    return newNode;
  }

  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);

    if (targetNode === null || targetNode.next === null) {
      return null;
    }

    const removedNode = targetNode.next;
    targetNode.next = removedNode.next;

    if (removedNode === this.tail) {
      this.tail = targetNode;
    }

    removedNode.next = null;
    this.length--;
    return removedNode;
  }
}

module.exports = LinkedList;

if (require.main === module) {
  const list = new LinkedList();
  list.addNode(1);
  list.addNode(2);
  list.addNode(3);
  console.log("find 2:", list.findNode(2));
  list.insertAfter(2, 4);
  console.log("after insert:", JSON.stringify(list));
  console.log("removed:", list.removeAfter(2));
  console.log("after remove:", JSON.stringify(list));
}
