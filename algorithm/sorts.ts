function selectionSort(arr: number[]): number[] {
    for (let i = 0; i < arr.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    return arr;
}

function insertionSort(arr: number[]): number[] {
    for (let i = 1; i < arr.length; i++) {
        const currentValue = arr[i];
        let j = i - 1;
        while(j >= 0 && arr[j] > currentValue) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j+1] = currentValue;
    }
    return arr;
}

function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
}
function merge(left : number[], right: number[]) : number[] {
    const result : number[] = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    return [...result, ...left.slice(i), ...right.slice(j)];
}
function quickSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;

    const pivot = arr[arr.length - 1];
    const left : number[] = [];
    const right: number[] = [];

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return [...quickSort(left), pivot, ...quickSort(right)];
}

// console.log(selectionSort([64, 25, 12, 22, 11])); // [11, 12, 22, 25, 64]
// console.log(insertionSort([12, 11, 13, 5, 6])); // [5, 6, 11, 12, 13]
// console.log(mergeSort([12, 11, 13, 5, 6])); // [5, 6, 11, 12, 13]
// console.log(quickSort([12, 11, 13, 5, 6])); // [5, 6, 11, 12, 13]

function heapsort(arr : number[]) : number[] {
    const n = arr.length;

    for(let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
  
    for(let i = n - 1; i > 0; i--) {
        swap(arr, 0, i);
        heapify(arr, i, 0);
    }
    return arr;
}

function heapify(arr : number[], size : number, rootIndex : number) : void {
    let largest = rootIndex;
    const leftChild = 2 * rootIndex + 1;
    const rightChild = 2 * rootIndex + 2;

    if(leftChild < size && arr[leftChild] > arr[largest]) {
        largest = leftChild;
    }

    if(rightChild < size && arr[rightChild] > arr[largest]) {
        largest = rightChild;
    }

    if(largest !== rootIndex) {
        swap(arr, rootIndex, largest);
        heapify(arr, size, largest);
    }
}

function swap(arr : number[], i : number, j : number) : void {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
