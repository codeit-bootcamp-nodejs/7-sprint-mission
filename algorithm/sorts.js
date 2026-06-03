function selectionSort(arr){
    const result = arr;
    const n = arr.length;
    for(let i=0;i<n-1;i++){
        let minIndex = i;
        for(let j=i+1;j<n;j++){
            if(result[minIndex]>result[j]){
                minIndex = j;
            }
        }
     if(minIndex !== i){
        let temp = result[i];
        result[i] = result[minIndex];
        result[minIndex] = temp;
     }
    }
    return result;
}
function insertionSort(arr){
    for(let i=1;i<arr.length;i++){
        let current  = arr[i];
        let j=0;
        for(j=i-1;j>=0 && arr[j]>current;j--){
            arr[j+1] = arr[j];
        }
        arr[j+1]=current;
    }
}
function mergeSort(arr){
    if(arr.length<=1){
        return arr;
    }

    const mid = Math.floor(arr.length/2);
    const left = arr.slice(0,mid);
    const right= arr.slice(mid);

    const sortedLeft = mergeSort(left);
    const sortedRight = mergeSort(right);

    return merge(sortedLeft,sortedRight);
}

function merge(left,right){
    const result = [];
    let i=0;
    let j=0;

    while(i<left.length && j<right.length){
        if(left[i] <= right[j]){
            result.push(left[i]);
            i++;
        }else{
            result.push(right[j]);
            j++;
        }
    }

    result.push(...left.slice(i));
    result.push(...right.slice(j));
    return result;
}

function quickSort(arr,start=0,end=null){
    if(end === null){
        end = arr.length -1;
    }

    if(start <end){
        const pivot = partition(arr,start,end);
        quickSort(arr,start,pivot -1);
        quickSort(arr,pivot+1,end);
    }
}
function partition(arr,start,end){
    const pivot = arr[end];
    let i = start -1;

    for(let j=start;j<end;j++){
        if(arr[j]<=pivot){
            i++;
            [arr[i],arr[j]]=[arr[j],arr[i]];
        }
    }
    [arr[i+1],arr[end]] = [arr[end],arr[i+1]];
    return i+1;
}


function swap(tree,index1,index2){
    const temp = tree[index1];
    tree[index1] = tree[index2];
    tree[index2] = temp;

}

function heapify(tree,index,treeSize){
    const leftIndex = 2*index;
    const rightIndex = leftIndex +1;

    let largest = index;

    if(leftIndex <treeSize && tree[largest] < tree[leftIndex]){
        largest = leftIndex;
    }

    if(rightIndex <tree && tree[largest] < tree[rightIndex]){
        largest = rightIndex;
    }
    if(largest !== index){
        swap(tree,index,largest);
        heapify(tree,largest,treeSize);
    }
}

function heapsort(tree){
    const treeSize = tree.length;

    for(let index=Math.floor(treeSize/2)-1;index >=0;index--){
        heapify(tree,index,treeSize);
    }

    for(let i= treeSize-1;i>0;i--){
        swap(tree,0,i);
        heapify(tree,0,1);
    }
}

const nums = [8,4,6,2,5];
console.log(nums); 
// selectionSort(nums);
// console.log(nums); 


// insertionSort(nums);
// console.log(nums); 

// console.log(mergeSort(nums));

// quickSort(nums);
// console.log(nums); 

heapsort(nums);
console.log(nums); 




