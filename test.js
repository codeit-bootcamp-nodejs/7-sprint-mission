//  작성한 모듈들 불러오기
import LinkedList from './argorithm/LinkedList.js';
import Queue from './argorithm/Queue.js';
import Stack from './argorithm/Stack.js';
import { heapsort } from './argorithm/sorts.js';

// --- [ 링크드 리스트 테스트 ] ---
console.log('=== Linked List ===');
const list = new LinkedList();
list.addNode(10);
list.addNode(20);
list.addNode(30);
console.log('20 찾기:', list.findNode(20).value); // 20
list.insertAfter(20, 25);
console.log('20 다음 노드:', list.findNode(20).next.value); // 25

// --- [ 큐(Queue) 테스트 ] ---
console.log('\n=== Queue ===');
const queue = new Queue();
queue.enqueue('첫번째');
queue.enqueue('두번째');
console.log('빠져나온 값:', queue.dequeue()); // '첫번째'
console.log('현재 맨 앞의 값:', queue.peek()); // '두번째'

// --- [ 스택(Stack) 테스트 ] ---
console.log('\n=== Stack ===');
const stack = new Stack();
stack.push('A');
stack.push('B');
console.log('빠져나온 값:', stack.pop()); // 'B' (가장 나중에 들어간 것이 먼저 나옴)

// --- [ 힙 정렬(Heap Sort) 테스트 ] ---
console.log('\n=== Heap Sort ===');
const unsortedArray = [5, 1, 9, 3, 7, 2];
console.log('정렬 전:', unsortedArray);
const sortedArray = heapsort(unsortedArray);
console.log('정렬 후:', sortedArray); // [1, 2, 3, 5, 7, 9]
