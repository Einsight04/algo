import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// file pathing setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// fsPromises setup
const fsPromises = fs.promises;
// variables
let algoData = [];
const objectSizes = [5, 10, 100, 1000];
await clearDirectory(path.join(__dirname, '..', 'algoData'));
// clear all files in directory
async function clearDirectory(dir) {
    const files = await fsPromises.readdir(dir);
    for (const file of files) {
        await fsPromises.unlink(`${dir}/${file}`);
    }
}
// generate random number
function randomNumber() {
    return Math.floor(Math.random() * 1000);
}
// setup algoData format
function algoDataSetup() {
    return [
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
}
// generate random coordinate data
function randomCoordinates(size) {
    let array = [];
    for (let i = 0; i < size; i++) {
        array.push({
            x: randomNumber(), y: randomNumber()
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
    function matches(sorted, j, i, startTime, match) {
        const endTime = performance.now();
        if (sorted) {
            i.linearSearchTimeAfterSort[j.objectSize] = `${match} ${endTime - startTime}`;
        }
        else {
            i.linearSearchTimeBeforeSort[j.objectSize] = `${match} ${endTime - startTime}`;
        }
    }
    function linearSearchSplit(sorted, j, i, startTime) {
        for (let k of j.object) {
            if (k.x === xCoordinate) {
                match = 'Match: ';
                matches(sorted, j, i, startTime, match);
                break;
            }
            else if (k === j.object[j.object.length - 1]) {
                match = 'No Match: ';
                matches(sorted, j, i, startTime, match);
                break;
            }
        }
    }
    let match = '';
    let startTime = 0;
    for (let i of algoData) {
        startTime = performance.now();
        for (let j of i.sortedData) {
            linearSearchSplit(true, j, i, startTime);
        }
        startTime = performance.now();
        for (let j of i.unSortedData) {
            linearSearchSplit(false, j, i, startTime);
        }
    }
}
function binarySearch(xCoordinate, yCoordinate) {
    function matches(sorted, j, i, startTime, match) {
        const endTime = performance.now();
        if (sorted) {
            i.binarySearchTimeAfterSort[j.objectSize] = `${match} ${endTime - startTime}`;
        }
        else {
            i.binarySearchTimeBeforeSort[j.objectSize] = `${match} ${endTime - startTime}`;
        }
    }
    function binarySearchSplit(sorted, j, i, startTime) {
        let low = 0;
        let high = j.object.length - 1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (j.object[mid].x === xCoordinate) {
                match = 'Match: ';
                matches(sorted, j, i, startTime, match);
                return;
            }
            else if (j.object[mid].x < xCoordinate) {
                low = mid + 1;
            }
            else if (j.object[mid].x > xCoordinate) {
                high = mid - 1;
            }
        }
        match = 'No Match: ';
        matches(sorted, j, i, startTime, match);
    }
    let match = '';
    let startTime;
    for (let i of algoData) {
        startTime = performance.now();
        for (let j of i.sortedData) {
            binarySearchSplit(true, j, i, startTime);
        }
        startTime = performance.now();
        for (let j of i.unSortedData) {
            console.log(j);
            binarySearchSplit(false, j, i, startTime);
        }
    }
}
function setup() {
    for (let i of objectSizes) {
        const coordinates = randomCoordinates(i);
        algoData[0].unSortedData.push({
            objectSize: i,
            object: coordinates.slice()
        });
        algoData[1].unSortedData.push({
            objectSize: i,
            object: coordinates.slice()
        });
        insertionSort(coordinates, i);
        builtInSort(coordinates, i);
    }
}
async function main(i) {
    algoData = algoDataSetup();
    let algoDataFormatted = [];
    const x = randomNumber();
    const y = randomNumber();
    setup();
    linearSearch(x, y);
    binarySearch(x, y);
    // for (let i of algoData) {
    //     for (let j of i.sortedData) {
    //         console.log(`${i.type} | size: ${j.objectSize}`)
    //         console.log(j.object.slice(0, 20).concat(j.object.slice(-20)));
    //     }
    // }
    for (let i of algoData) {
        algoDataFormatted.push({
            type: i.type,
            sortTime: i.sortTime,
            linearSearchTimeAfterSort: i.linearSearchTimeAfterSort,
            linearSearchTimeBeforeSort: i.linearSearchTimeBeforeSort,
            binarySearchTimeAfterSort: i.binarySearchTimeAfterSort,
            binarySearchTimeBeforeSort: i.binarySearchTimeBeforeSort
        });
    }
    await fs.promises.writeFile(path.join(__dirname, '..', 'algoData', `AlgoData${i}.json`), JSON.stringify(algoDataFormatted, null, 4));
}
for (let i = 0; i < 1; i++) {
    await main(i);
}
