function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    const temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }

  return arr;
}

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const currentValue = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > currentValue) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = currentValue;
  }

  return arr;
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}

function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr.slice();
  }

  const middle = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, middle));
  const right = mergeSort(arr.slice(middle));

  return merge(left, right);
}

function swap(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let pivotIndex = left;

  for (let i = left; i < right; i++) {
    if (arr[i] < pivot) {
      swap(arr, i, pivotIndex);
      pivotIndex++;
    }
  }

  swap(arr, pivotIndex, right);
  return pivotIndex;
}

function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);

    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }

  return arr;
}

function heapify(arr, index, heapSize) {
  let largestIndex = index;
  const leftChildIndex = 2 * index + 1;
  const rightChildIndex = 2 * index + 2;

  if (leftChildIndex < heapSize && arr[leftChildIndex] > arr[largestIndex]) {
    largestIndex = leftChildIndex;
  }

  if (rightChildIndex < heapSize && arr[rightChildIndex] > arr[largestIndex]) {
    largestIndex = rightChildIndex;
  }

  if (largestIndex !== index) {
    swap(arr, index, largestIndex);
    heapify(arr, largestIndex, heapSize);
  }
}

function heapsort(arr) {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, i, n);
  }

  for (let i = n - 1; i >= 1; i--) {
    swap(arr, 0, i);
    heapify(arr, 0, i);
  }

  return arr;
}

module.exports = {
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapsort,
};

if (require.main === module) {
  const arr1 = [5, 3, 8, 1, 2];
  selectionSort(arr1);
  console.log("selectionSort:", arr1);

  const arr2 = [5, 3, 8, 1, 2];
  insertionSort(arr2);
  console.log("insertionSort:", arr2);

  const arr3 = [5, 3, 8, 1, 2];
  const sortedArr3 = mergeSort(arr3);
  console.log("mergeSort original:", arr3);
  console.log("mergeSort result:", sortedArr3);

  const arr4 = [5, 3, 8, 1, 2];
  quickSort(arr4);
  console.log("quickSort:", arr4);

  const arr5 = [6, 1, 4, 7, 10, 3, 8, 5, 1, 5, 7, 4, 2, 1];
  heapsort(arr5);
  console.log("heapsort:", arr5);
}
