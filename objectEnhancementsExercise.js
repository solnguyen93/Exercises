//Object Enhancements Exercises
//
// function createInstructor(firstName, lastName){
//   return {
//     firstName: firstName,
//     lastName: lastName
//   }
// }
//
///* Write an ES2015 Version */
function createInstructor(firstName, lastName) {
    return {
        firstName,
        lastName,
    };
}
//
//
//
//
// var favoriteNumber = 42;

// var instructor = {
//   firstName: "Colt"
// }

// instructor[favoriteNumber] = "That is my favorite!"
//
///* Write an ES2015 Version */
var favoriteNumber = 42;

var instructor = {
    firstName: 'Colt',
    [favoriteNumber]: 'That is my favorite!',
};
console.log(instructor);
//
//
//
//
// var instructor = {
//     firstName: "Colt",
//     sayHi: function(){
//       return "Hi!";
//     },
//     sayBye: function(){
//       return this.firstName + " says bye!";
//     }
//   }
//
///* Write an ES2015 Version */
var instructor = {
    firstName: 'Colt',
    sayHi() {
        return 'Hi!';
    },
    sayBye() {
        return this.firstName + ' says bye!';
    },
};
//
//
//
//
// const d = createAnimal('dog', 'bark', 'Woooof!');
// // {species: "dog", bark: ƒ}
// d.bark(); //"Woooof!"

// const s = createAnimal('sheep', 'bleet', 'BAAAAaaaa');
// // {species: "sheep", bleet: ƒ}
// s.bleet(); //"BAAAAaaaa"
//
//
const d = createAnimal('dog', 'bark', 'Woooof!');
const s = createAnimal('sheep', 'bleet', 'BAAAAaaaa');
const c = createAnimal('cow', 'moo', 'MooooOOoo');
function createAnimal(species, verb, noise) {
    return {
        species,
        [verb](a) {
            //function name is [verb] dynamic, whatever the 2nd input is
            return noise; // return 3rd input
        },
    };
}
console.log(createAnimal('dog', 'bark', 'Woooof!'));
console.log(d.bark());
console.log(s.bleet());
console.log(c['moo']());
