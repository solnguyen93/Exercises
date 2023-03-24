//Rest And Spread Exercises
//
// function filterOutOdds() {
//   var nums = Array.prototype.slice.call(arguments);
//   return nums.filter(function(num) {
//     return num % 2 === 0
//   });
// }
//
function filterOutOdds(...nums) {
    return nums.filter((num) => num % 2 === 0);
}
console.log(filterOutOdds(4, 6, 8, 1, 2, 3)); //[4,6,8,2]
//
//
//findMin
//
const findMin = (...nums) => nums.reduce((min, el) => (min < el ? min : el));
console.log(findMin(4, 6, -8, 1, 2, 3)); //-8
//
//
//mergeObjects
//
const mergeObjects = (obj1, obj2) => {
    return (obj3 = { ...obj1, ...obj2 });
};
console.log(mergeObjects({ a: 1, b: 2 }, { c: 3, d: 4 })); //{a:1, b:2, c:3, d:4}
//
//
//doubleAndReturnArgs
//
const doubleAndReturnArgs = (arr, ...args) => {
    return [...arr, ...args.map((v) => v * 2)];
};
console.log(doubleAndReturnArgs([1, 2, 3], 4, 4)); //[1,2,3,8,8]
//
//
//Slice and Dice!
//
function removeRandom(items) {
    let randomIdx = Math.floor(Math.random() * items.length);
    const itemsCopy = [...items.slice(0, randomIdx), ...items.slice(randomIdx + 1)];
    return itemsCopy;
}
console.log(removeRandom([1, 2, 3]));
//
//
function extend(array1, array2) {
    return [...array1, ...array2];
}
console.log(extend([1, 2, 3], [4, 5, 6]));
//
//
const addKeyVal = (obj, k, val) => {
    return { ...obj, [k]: val };
};
console.log(addKeyVal({ a: 1, b: 2 }, 'c', 3));
//
//
function removeKey(obj, key) {
    let newObj = { ...obj };
    delete newObj[key];
    return newObj;
}
//
//
function combine(obj1, obj2) {
    return { ...obj1, ...obj2 };
}
//
//
const update = (obj, k, v) => {
    let newObj = { ...obj };
    newObj[k] = v;
    return newObj;
};
//add and update same same - add if doesn't exist else update
