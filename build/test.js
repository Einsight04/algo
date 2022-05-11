"use strict";
// function insertionSort(array: number[]) {
//     for (let i = 0; i < array.length; i++) {
//         /*storing current element whose left side is checked for its
//                  correct position .*/
//
//         let temp: number = array[i];
//         let j: number = i;
//
//         /* check whether the adjacent element in left side is greater or
//              less than the current element. */
//
//         while (j > 0 && temp < array[j - 1]) {
//
//             // moving the left side element to one position forward.
//             array[j] = array[j - 1];
//             j = j - 1;
//
//         }
//         // moving current element to its  correct position.
//         array[j] = temp;
//     }
//     return array;
// }
//
// console.log(insertionSort([1, 2, 3, 5, 3, 2, 6, 3]));
