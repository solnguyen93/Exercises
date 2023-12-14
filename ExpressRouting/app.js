export function add(x, y) {
    return x + y;
}

export function square(x) {
    return x * x;
}

for (let x of [1, 2, 3, 4, 5]) {
    console.log(square(x));
}
