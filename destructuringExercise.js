// //Destructuring Exercise
// //
// //Object Destructuring 1
// let facts = { numPlanets: 8, yearNeptuneDiscovered: 1846 };
// let { numPlanets, yearNeptuneDiscovered } = facts;
// //make a variable called numPlanets and set equal to 'numPlanets' in facts{}
// console.log(numPlanets); // 8
// console.log(yearNeptuneDiscovered); // 1846
// //
// //Object Destructuring 2
// //
// let planetFacts = {
//     numPlanets2: 8,
//     yearNeptuneDiscovered: 1846,
//     yearMarsDiscovered: 1659,
// };
// let { numPlanets2, ...discoveryYears } = planetFacts;
// //numPlanets2 = 8, the rest = discoveryYears
// console.log(discoveryYears); // {yearNeptuneDiscovered: 1846, yearMarsDiscovered:1659}
// //
// //Object Destructuring 3
// //
// function getUserData({ firstName, favoriteColor = 'green' }) {
//     console.log(`Your name is ${firstName} and you like ${favoriteColor}`);
//     return `Your name is ${firstName} and you like ${favoriteColor}`;
// }
// getUserData({ firstName: 'Alejandro', favoriteColor: 'purple' });
// //Your name is Alejandro and you like purple
// getUserData({ firstName: 'Melissa' }); // ?
// //Your name is Melissa and you like green
// getUserData({}); // ?
// //Your name is undefined and you like green
// //
// //Array Destructuring 1
// //
// let [first, second, third] = ['Maya', 'Marisa', 'Chi'];
// console.log(first); // Maya
// console.log(second); // Marisa
// console.log(third); // Chi
// //
// //Array Destructuring 2
// //
// let [raindrops, whiskers, ...aFewOfMyFavoriteThings] = [
//     'Raindrops on roses',
//     'whiskers on kittens',
//     'Bright copper kettles',
//     'warm woolen mittens',
//     'Brown paper packages tied up with strings',
// ];
// console.log(raindrops); // Raindrops on roses
// console.log(whiskers); // whiskers on kittens
// console.log(aFewOfMyFavoriteThings); // ['Bright copper kettles', 'w'arm woolen mittens', 'Brown paper packages tied up with strings']
// //
// //Array Destructuring 3
// //
// let numbers = [10, 20, 30];
// [numbers[1], numbers[2]] = [numbers[2], numbers[1]];
// console.log(numbers); // [10,30,20]
// //
// //ES5 Assigning Variables to Object Properties
// //
// // var obj = {
// //     numbers: {
// //         a: 1,
// //         b: 2,
// //     },
// // };
// // var a = obj.numbers.a;
// // var b = obj.numbers.b;
// /* Write an ES2015 Version */
// const obj = {
//     numbers: {
//         a: 1,
//         b: 2,
//     },
// };
// const {
//     numbers: { a, b },
// } = obj;

// console.log(a, b);
// //
// //ES5 Array Swap
// //
// var arr = [1, 2];
// // var temp = arr[0];
// // arr[0] = arr[1];
// // arr[1] = temp;
// /* Write an ES2015 Version */
// [arr[0], arr[1]] = [arr[1], arr[0]];
//
//raceResults()
//
function raceResults(arra) {
    const [first, second, third, ...rest] = arra;
    return { first, second, third, rest };
}

//const raceResults = ([first, second, third, ...allOther]) => ({ first, second, third, ...allOther });

console.log(raceResults(['Tom', 'Margaret', 'Allison', 'David', 'Pierre']));
/*
  {
    first: "Tom",
    second: "Margaret",
    third: "Allison",
    rest: ["David", "Pierre"]
  }
*/
