// // Maps and Sets Exercise
// //
// // Quick Question #1
// // What does the following code return?
// new Set([1,1,2,2,3,4])
// {1,2,3,4}

// // Quick Question #2
// // What does the following code return?
// [...new Set("referee")].join("")
// {'ref'}

// // Quick Questions #3
// // What does the Map m look like after running the following code?
// let m = new Map();
// m.set([1, 2, 3], true);
// m.set([1, 2, 3], false);
// //m(2) {[1, 2, 3] => true, [1, 2, 3] => false}
// //array is't a reference

// // hasDuplicate
// // Write a function called hasDuplicate which accepts an array and returns true or false if that array contains a duplicate
function hasDuplicate(arr) {
    if (arr.length === [...new Set(arr)].length) {
        return false;
    }
    return true;
}
const hasDuplicateShorten = (arr) => arr.length !== [...new Set(arr)].length;

// console.log(hasDuplicateShorten([1, 3, 2, 1])); // true
// console.log(hasDuplicateShorten([1, 5, -1, 4])); // false

// vowelCount
// Write a function called vowelCount which accepts a string and returns a map where the keys are numbers and the values are the count of the vowels in the string.
function vowelCount(str) {
    const vowels = 'aeiou';
    const myMap = new Map();
    for (let char of str) {
        if (vowels.includes(char)) {
            if (myMap.has(char)) {
                myMap.set(char, myMap.get(char) + 1);
            } else {
                myMap.set(char, 1);
            }
        }
    }
    return myMap;
}
console.log(vowelCount('awesome'));
console.log(vowelCount('Colt'));

// vowelCount('awesome') // Map { 'a' => 1, 'e' => 2, 'o' => 1 }
// vowelCount('Colt') // Map { 'o' => 1 }
