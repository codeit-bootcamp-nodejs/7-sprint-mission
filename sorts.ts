// 선택정렬
function selectionSort(arr: number[]) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  }
  console.log(arr);
}

// 삽입정렬
function insertionSort(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (arr[i] < arr[j]) [arr[i], arr[j]] = [arr[j], arr[i]];
      else break;
    }
  }
  console.log(arr);
}

// 병합정렬
function mergeSort(arr: number[]): number[] {
  if (arr.length === 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  const sortleft = mergeSort(left);
  const sortright = mergeSort(right);

  return merge(sortleft, sortright);
}

function merge(left: number[], right: number[]) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}

// 퀵정렬
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[0];
  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i++) {
    if (pivot < arr[i]) right.push(arr[i]);
    else left.push(arr[i]);
  }

  const leftSort = quickSort(left);
  const rightSort = quickSort(right);

  return [...leftSort, pivot, ...rightSort];
}

let num = [5, 3, 8, 4, 2, 10, 6];
console.log(num);

selectionSort(num);
insertionSort(num);
console.log(mergeSort(num));
console.log(quickSort(num));
