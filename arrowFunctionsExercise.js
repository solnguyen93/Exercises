//Arrow Functions Exercise
//
// function double(arr) {
//     return arr.map(function(val) {
//       return val * 2;
//     });
//   }
const double = (arr) => arr.map((val) => val * 2);
//
//
//
//
// function squareAndFindEvens(numbers) {
//     var squares = numbers.map(function (num) {
//         return num ** 2;
//     });
//     var evens = squares.filter(function (square) {
//         return square % 2 === 0;
//     });
//     return evens;
// }
//
const squareAndFindEvens = (numbers) => numbers.map((num) => num ** 2).filter((square) => square % 2 === 0);

console.log(squareAndFindEvens([4, 5, 1])); //16
console.log(squareAndFindEvens([2, 6, 7])); // 4,36
