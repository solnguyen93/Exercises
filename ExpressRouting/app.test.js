import { square, add } from './add';

test('3 square should 9', function () {
    const res = square(3);
    expect(res).toEqual(9);
});

describe('add function', function () {
    test('1 + 4 should be 5', function () {
        const res = add(1, 4);
        expect(res).toEqual(5);
    });

    test('-1 + 1 should be 0', function () {
        const res = add(-1, 1);
        expect(res).toEqual(0);
    });
});
