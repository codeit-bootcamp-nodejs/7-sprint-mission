function selectionSort(arr: number[]): number[] {
    for (let index = 0; index < arr.length; index++) {
        let minIndex = index;
        for (let j = index + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== index) {
            [arr[index], arr[minIndex]] = [arr[minIndex], arr[index]];
        }
    }
    return arr;
}

function insertionSort(arr: number[]): number[] {

}

function mergeSort(arr: number[]): number[] {

}

function quickSort(arr: number[]): number[] {

}

console.log(selectionSort([64, 25, 12, 22, 11])); // [11, 12, 22, 25, 64]
console.log(insertionSort([12, 11, 13, 5, 6])); // [5, 6, 11, 12, 13]
//console.log(mergeSort([12, 11, 13, 5, 6])); // [5, 6, 11, 12, 13]
//console.log(quickSort([12, 11, 13, 5, 6])); // [5, 6, 11, 12, 13]