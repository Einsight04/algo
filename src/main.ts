import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const fsPromises = fs.promises;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function clearDirectory(dir: string) {
    const files = await fsPromises.readdir(dir);
    for (const file of files) {
        await fsPromises.unlink(`${dir}/${file}`);
    }
}

await clearDirectory(path.join(__dirname, '..', 'builtInSorted'));
await clearDirectory(path.join(__dirname, '..', 'customSorted'));


const objectSizes: number[] = [5, 10, 100, 1000, 10000];

const algoData: any[] = [
    {
        type: 'custom sort',
        sortedData: [],
        sortTime: {},
        linearSearchTimeAfterSort: {},
        binarySearchTimeAfterSort: {}
    },
    {
        type: 'built in sort',
        sortedData: [],
        sortTime: {},
        linearSearchTimeBeforeSort: {},
        binarySearchTimeBeforeSort: {}
    },
]


function randomCoordinates(size: number): object[] {
    let array = [];

    for (let i = 0; i < size; i++) {
        array.push(
            {
                x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10)
            }
        )
    }
    return array;
}


function customSort(object: any, objectSize: number): void {
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


for (let i of objectSizes) {
    const coordinates = randomCoordinates(i);

    customSort(coordinates, i);
    builtInSort(coordinates, i);
}


for (let i of algoData) {
    for (let j of i.sortedData) {
        if (j.objectSize <= 20) {
            console.log(`Type: ${i.type} | Size: ${j.objectSize}`)
            console.log(j.object);
        } else {
            console.log(`Type: ${i.type} | Size: ${j.objectSize}`)
            console.log(j.object.slice(0, 20).concat(j.object.slice(j.object.length - 20, j.object.length)));
        }
    }
}


// linear search to find number 5 in x coordinate
function linearSearch(object: object, xCoordinate: number, yCoordinate: number): void {
    for (let i of algoData) {
        for (let j of i.sortedData) {
            const startTime = performance.now()
            for (let k of j.object) {
                if (k.x === xCoordinate && k.y === yCoordinate) {
                    const endTime = performance.now()
                    algoData[0].linearSearchTimeAfterSort[j.objectSize] = endTime - startTime;
                }
            }
            const endTime = performance.now()
            algoData[0].linearSearchTimeAfterSort[j.objectSize] = endTime - startTime;
        }
    }
}


linearSearch(algoData, 10, 10);
console.log(algoData);