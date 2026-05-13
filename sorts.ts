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

}

function quickSort(arr: number[]): number[] {

}

console.log(selectionSort([64, 25, 12, 22, 11])); // [11, 12, 22, 25, 64]
console.log(insertionSort([12, 11, 13, 5, 6])); // [5, 6, 11, 12, 13]
console.log(mergeSort([12, 11, 13, 5, 6])); // [5, 6, 11, 12, 13]
console.log(quickSort([12, 11, 13, 5, 6])); // [5, 6, 11, 12, 13]