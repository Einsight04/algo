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


/**
 * Delete all files in directory
 * @param {string} dir - The directory to clear
 */
async function clearDirectory(dir: string) {
    const files = await fsPromises.readdir(dir);
    for (const file of files) {
        await fsPromises.unlink(`${dir}/${file}`);
    }
}


/**
 * Generates random number
 * @returns {number} - A random number between 0 and 1000
 */
function randomNumber(): number {
    return Math.floor(Math.random() * 1000);
}


/**
 * Algo data formatting to follow
 * @returns {object} - An object used to store data.
 */
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


/**
 * Generates random coordinate data
 * @param {number} size - Number of coordinates to generate
 * @return {array} coordinateData - An array of coordinate objects
 */
function randomCoordinates(size: number): object[] {
    let coordinateData = [];

    for (let i = 0; i < size; i++) {
        coordinateData.push(
            {
                x: randomNumber(), y: randomNumber()
            }
        )
    }
    return coordinateData;
}


/**
 * Sort coordinate data using insertion sort
 * @param {object} object - Object containing coordinate data
 * @param {number} objectSize - Coordinate count within object
 */
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


/**
 * Sort coordinate data using binary sort
 * @param {object} object - Object containing coordinate data
 * @param {number} objectSize - Coordinate count within object
 */
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


/**
 * Find coordinate match using linear search and evaluate time taken
 * @param {number} xCoordinate - Object containing coordinate data
 * @param {number} yCoordinate - Coordinate count within object
 */
function linearSearch(xCoordinate: number, yCoordinate: number): void {
    /**
     * Update AlgoData with linear search time
     * @param {boolean} sorted - Whether the data is sorted
     * @param {number} j - size of object
     * @param {object} i - insertionSort / builtInSort object data
     * @param {number} startTime - recorded start time
     * @param {string} match - if match is found
     */
    function matches(sorted: boolean, j: { objectSize: number; }, i: any, startTime: number, match: string): void {
        const endTime = performance.now()
        if (sorted) {
            i.linearSearchTimeAfterSort[j.objectSize] = `${match} ${endTime - startTime}`;
        } else {
            i.linearSearchTimeBeforeSort[j.objectSize] = `${match} ${endTime - startTime}`;
        }

    }


    /**
     * Find coordinate match using linear search
     * @param {boolean} sorted - Whether the data is sorted
     * @param {number} j - size of object
     * @param {object} i - insertionSort / builtInSort object data
     * @param {number} startTime - recorded start time
     */
    function linearSearchSplit(sorted: boolean, j: { object: any; objectSize: number; }, i: any, startTime: number): void {
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


/**
 * Find coordinate match using binary search and evaluate time taken
 * @param {number} xCoordinate - Object containing coordinate data
 * @param {number} yCoordinate - Coordinate count within object
 */
function binarySearch(xCoordinate: number, yCoordinate: number): void {
    /**
     * Update AlgoData with binary search time
     * @param {boolean} sorted - Whether the data is sorted
     * @param {number} j - size of object
     * @param {object} i - insertionSort / builtInSort object data
     * @param {number} startTime - recorded start time
     * @param {string} match - if match is found
     */
    function matches(sorted: any, j: { objectSize:  number; }, i: { binarySearchTimeAfterSort: { [x: string]: string; }; binarySearchTimeBeforeSort: { [x: string]: string; }; }, startTime: number, match: string): void {
        const endTime = performance.now()
        if (sorted) {
            i.binarySearchTimeAfterSort[j.objectSize] = `${match} ${endTime - startTime}`;
        } else {
            i.binarySearchTimeBeforeSort[j.objectSize] = `${match} ${endTime - startTime}`;
        }
    }


    /**
     * Find coordinate match using binary search
     * @param {boolean} sorted - Whether the data is sorted
     * @param {number} j - size of object
     * @param {object} i - insertionSort / builtInSort object data
     * @param {number} startTime - recorded start time
     */
    function binarySearchSplit(sorted: boolean, j: { object: any[]; objectSize: number; }, i: { binarySearchTimeAfterSort: { [x: string]: string; }; binarySearchTimeBeforeSort: { [x: string]: string; }; }, startTime: number): void {
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
            binarySearchSplit(false, j, i, startTime);
        }
    }
}


/**
 * populate algoData with data
 */
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


/**
 * Generate random coordinates
 * @param {number} i - run count
 */
async function main(i: number): Promise<void> {
    algoData = algoDataSetup();
    let algoDataFormatted: any = [];

    const x: number = randomNumber();
    const y: number = randomNumber();

    setup()
    linearSearch(x, y);
    binarySearch(x, y);

    for (let i of algoData) {
        for (let j of i.sortedData) {
            if (j.objectSize > 40) {
                console.log(`${i.type} | size: ${j.objectSize}`)
                console.log(j.object.slice(0, 20).concat(j.object.slice(-20)));
            } else {
                console.log(`${i.type} | size: ${j.objectSize}`)
                console.log(j.object);
            }
        }
    }

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
