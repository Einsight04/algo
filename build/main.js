import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const fsPromises = fs.promises;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// async function clearDirectory(dir: string) {
//     const files = await fsPromises.readdir(dir);
//     for (const file of files) {
//         await fsPromises.unlink(`${dir}/${file}`);
//     }
// }
//
// await clearDirectory(path.join(__dirname, '..', 'builtInSorted'));
// await clearDirectory(path.join(__dirname, '..', 'insertionSorted'));
// const objectSizes: number[] = [5, 10, 100, 1000, 10000, 30000, 50000, 75000];
const objectSizes = [5, 10, 100, 1000];
const algoData = [
    {
        type: 'custom sort',
        unSortedData: [],
        sortedData: [],
        sortTime: {},
        linearSearchTimeAfterSort: {},
        binarySearchTimeAfterSort: {},
        linearSearchTimeBeforeSort: {},
        binarySearchTimeBeforeSort: {}
    },
    {
        type: 'built in sort',
        unSortedData: [],
        sortedData: [],
        sortTime: {},
        linearSearchTimeAfterSort: {},
        binarySearchTimeAfterSort: {},
        linearSearchTimeBeforeSort: {},
        binarySearchTimeBeforeSort: {}
    },
];
function randomCoordinates(size) {
    let array = [];
    for (let i = 0; i < size; i++) {
        array.push({
            x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10)
        });
    }
    return array;
}
function insertionSort(object, objectSize) {
    const startTime = performance.now();
    for (let i = 0; i < object.length; i++) {
        let temp = object[i];
        let j = i;
        while (j > 0 && temp.x < object[j - 1].x) {
            object[j] = object[j - 1];
            j = j - 1;
        }
        object[j] = temp;
    }
    const endTime = performance.now();
    algoData[0].sortedData.push({
        objectSize,
        object: object
    });
    algoData[0].sortTime[objectSize] = endTime - startTime;
}
function builtInSort(object, objectSize) {
    const startTime = performance.now();
    object = object.sort((a, b) => a.x - b.x);
    const endTime = performance.now();
    algoData[1].sortedData.push({
        objectSize,
        object: object
    });
    algoData[1].sortTime[objectSize] = endTime - startTime;
}
function linearSearch(xCoordinate, yCoordinate) {
    function matches(j, i, startTime, match) {
        const endTime = performance.now();
        i.linearSearchTimeAfterSort[j.objectSize] = `${match} ${endTime - startTime}`;
    }
    function linearSearchSplit(j, i, startTime) {
        for (let k of j.object) {
            if (k.x === xCoordinate && k.y === yCoordinate) {
                match = 'Match: ';
                matches(j, i, startTime, match);
                break;
            }
            else if (k === j.object[j.object.length - 1]) {
                match = 'No Match: ';
                matches(j, i, startTime, match);
                break;
            }
        }
    }
    let match = '';
    for (let i of algoData) {
        console.log("test" + i);
        const startTime = performance.now();
        for (let j of i.sortedData) {
            linearSearchSplit(j, i, startTime);
        }
    }
}
function binarySearch(xCoordinate, yCoordinate) {
    function matches(j, i, startTime, match) {
        const endTime = performance.now();
        i.binarySearchTimeAfterSort[j.objectSize] = `${match} ${endTime - startTime}`;
    }
    function binarySearchSplit(j, i, startTime) {
        let low = 0;
        let high = j.object.length - 1;
        for (let k of j.object) {
            let mid = Math.floor((low + high) / 2);
            if (k.x === xCoordinate && k.y === yCoordinate) {
                match = 'Match: ';
                matches(j, i, startTime, match);
                break;
            }
            else if (k === j.object[j.object.length - 1]) {
                match = 'No Match: ';
                matches(j, i, startTime, match);
                break;
            }
            else if (k.x > xCoordinate) {
                high = mid - 1;
            }
            else if (k.x < xCoordinate) {
                low = mid + 1;
            }
        }
    }
    let match = '';
    for (let i of algoData) {
        const startTime = performance.now();
        for (let j of i.sortedData) {
            binarySearchSplit(j, i, startTime);
        }
    }
}
for (let i of objectSizes) {
    const coordinates = randomCoordinates(i);
    algoData[0].unSortedData.push({
        objectSize: i,
        object: coordinates
    });
    algoData[1].unSortedData.push({
        i,
        object: coordinates
    });
    insertionSort(coordinates, i);
    builtInSort(coordinates, i);
}
for (let i of algoData) {
    for (let j of i.sortedData) {
        if (j.objectSize <= 20) {
            console.log(`Type: ${i.type} | Size: ${j.objectSize}`);
            console.log(j.object);
        }
        else {
            console.log(`Type: ${i.type} | Size: ${j.objectSize}`);
            console.log(j.object.slice(0, 20).concat(j.object.slice(j.object.length - 20, j.object.length)));
        }
    }
}
linearSearch(0, 9);
binarySearch(0, 9);
console.log(algoData);
