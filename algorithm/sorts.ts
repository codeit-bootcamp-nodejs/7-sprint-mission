export function heapsort(arr: number[]): void {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    _heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    _swap(arr, 0, i);
    _heapify(arr, i, 0);
  }

  function _swap(array: number[], idx1: number, idx2: number): void {
    const temp = array[idx1];
    array[idx1] = array[idx2];
    array[idx2] = temp;
  }

  function _heapify(array: number[], size: number, rootIdx: number): void {
    let largest = rootIdx; 
    const leftChildIdx = 2 * rootIdx + 1; 
    const rightChildIdx = 2 * rootIdx + 2; 

    if (leftChildIdx < size && array[leftChildIdx] > array[largest]) {
      largest = leftChildIdx;
    }

    if (rightChildIdx < size && array[rightChildIdx] > array[largest]) {
      largest = rightChildIdx;
    }

    if (largest !== rootIdx) {
      _swap(array, rootIdx, largest);
      _heapify(array, size, largest);
    }
  }
}