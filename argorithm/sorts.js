// 선택 정렬 (Selection Sort)
function selectSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            let temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }              
    return arr;
}

console.log(selectSort([5, 4, 3, 2, 1]))

// 삽입 정렬 (Insertion Sort)
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let currentValue = arr[i]; 
        let j;

        for (j = i - 1; j >= 0 && arr[j] > currentValue; j--) {
            arr[j + 1] = arr[j];
        }
        arr[j + 1] = currentValue;
    }
    return arr;
}

console.log(insertionSort([5, 4, 3, 2, 1]))
 
// 병합 정렬 (Merge Sort)
function mergeSort(arr) {
    if (arr.length <= 1) return arr; // 배열의 길이가 1 이하면 나눌 필요가 없음

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    // 재귀적으로 배열을 계속 반으로 나누고 합치는 과정을 반복
    return merge(mergeSort(left), mergeSort(right));
}

// 두 정렬된 배열을 합치는 함수
function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    // 어느 한쪽 배열이 먼저 끝났을 경우, 남은 배열의 원소들을 뒤에 이어 붙입니다.
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

console.log(mergeSort([5, 4, 3, 2, 1]));

// 퀵 정렬 (Quick Sort)
function quickSort(arr) {
    if (arr.length <= 1) return arr; // 배열의 원소가 1개 이하면 정렬 완료

    const pivot = arr[0]; // 첫 번째 요소를 기준점으로 선정
    const left = [];
    const right = [];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < pivot) left.push(arr[i]); // 피벗보다 작으면 왼쪽 배열로
        else right.push(arr[i]); // 피벗보다 크거나 같으면 오른쪽 배열로
    }

    return quickSort(left).concat(pivot, quickSort(right));
}

console.log(quickSort([5, 4, 3, 2, 1]));

// 힙 정렬 (Heap Sort)
function heapsort(arr) {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    const swap = arr[i];
    arr[i] = arr[largest];
    arr[largest] = swap;
    heapify(arr, n, largest);
  }
}

export { heapsort };