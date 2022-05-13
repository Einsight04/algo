import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

// file pathing setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// fsPromises setup
const fsPromises = fs.promises;

// variables
let algoData: any[] = [];
const objectSizes: number[] = [5, 10, 100, 1000];
await clearDirectory(path.join(__dirname, '..', 'algoData'));


// clear all files in directory
async function clearDirectory(dir: string) {
    const files = await fsPromises.readdir(dir);
    for (const file of files) {
        await fsPromises.unlink(`${dir}/${file}`);
    }
}


// generate random number
function randomNumber(): number {
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
    ]
}


// generate random coordinate data
function randomCoordinates(size: number): object[] {
    let array = [];

    for (let i = 0; i < size; i++) {
        array.push(
            {
                x: randomNumber(), y: randomNumber()
            }
        )
    }
    return array;
}


function insertionSort(object: any, objectSize: number): void {
    const startTime = performance.now()

    for (let i = 0; i < object.length; i++) {
        let temp = object[i];
        let j = i;

        while (j > 0 && temp.x < object[j - 1].x) {
            object[j] = object[j - 1];
            j = j - 1;
        }
        object[j] = temp;
    }

    const endTime = performance.now()

    algoData[0].sortedData.push({
        objectSize,
        object: object
    })

    algoData[0].sortTime[objectSize] = endTime - startTime;
}


function builtInSort(object: any, objectSize: number): void {
    const startTime = performance.now()

    object = object.sort((a: { x: number; }, b: { x: number; }) => a.x - b.x);

    const endTime = performance.now()

    algoData[1].sortedData.push({
        objectSize,
        object: object
    })

    algoData[1].sortTime[objectSize] = endTime - startTime;
}


function linearSearch(xCoordinate: number, yCoordinate: number): void {
    function matches(sorted: boolean, j: { objectSize: string | number; }, i: any, startTime: number, match: string): void {
        const endTime = performance.now()
        if (sorted) {
            i.linearSearchTimeAfterSort[j.objectSize] = `${match} ${endTime - startTime}`;
        } else {
            i.linearSearchTimeBeforeSort[j.objectSize] = `${match} ${endTime - startTime}`;
        }

    }

    function linearSearchSplit(sorted: boolean, j: { object: any; objectSize: string | number; }, i: any, startTime: number): void {
        for (let k of j.object) {
            if (k.x === xCoordinate) {
                match = 'Match: ';
                matches(sorted, j, i, startTime, match);
                break;
            } else if (k === j.object[j.object.length - 1]) {
                match = 'No Match: ';
                matches(sorted, j, i, startTime, match);
                break;
            }
        }
    }

    let match: string = '';
    let startTime: number = 0;

    for (let i of algoData) {
        startTime = performance.now()
        for (let j of i.sortedData) {
            linearSearchSplit(true, j, i, startTime);
        }

        startTime = performance.now()
        for (let j of i.unSortedData) {
            linearSearchSplit(false, j, i, startTime);
        }
    }
}


function binarySearch(xCoordinate: number, yCoordinate: number): void {
    function matches(sorted: any, j: any, i: any, startTime: any, match: any): void {
        const endTime = performance.now()
        if (sorted) {
            i.binarySearchTimeAfterSort[j.objectSize] = `${match} ${endTime - startTime}`;
        } else {
            i.binarySearchTimeBeforeSort[j.objectSize] = `${match} ${endTime - startTime}`;
        }
    }

    function binarySearchSplit(sorted: any, j: any, i: any, startTime: any): void {
        let low = 0;
        let high = j.object.length - 1;

        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (j.object[mid].x === xCoordinate) {
                match = 'Match: ';
                matches(sorted, j, i, startTime, match);
                return;
            } else if (j.object[mid].x < xCoordinate) {
                low = mid + 1;
            } else if (j.object[mid].x > xCoordinate) {
                high = mid - 1;
            }
        }
        match = 'No Match: ';
        matches(sorted, j, i, startTime, match);
    }

    let match: string = '';
    let startTime: number;

    for (let i of algoData) {
        startTime = performance.now()
        for (let j of i.sortedData) {
            binarySearchSplit(true, j, i, startTime);
        }

        startTime = performance.now()
        for (let j of i.unSortedData) {
            console.log(j)
            binarySearchSplit(false, j, i, startTime);
        }
    }
}

function setup(): void {
    for (let i of objectSizes) {
        const coordinates = randomCoordinates(i);

        algoData[0].unSortedData.push({
            objectSize: i,
            object: coordinates.slice()
        })

        algoData[1].unSortedData.push({
            objectSize: i,
            object: coordinates.slice()
        })

        insertionSort(coordinates, i);
        builtInSort(coordinates, i);
    }
}


async function main(i: number): Promise<void> {
    algoData = algoDataSetup();
    let algoDataFormatted: any = [];

    const x: number = randomNumber();
    const y: number = randomNumber();

    setup()
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
        })
    }

    await fs.promises.writeFile(path.join(__dirname, '..', 'algoData', `AlgoData${i}.json`), JSON.stringify(algoDataFormatted, null, 4));
}


for (let i = 0; i < 1; i++) {
    await main(i);
}
