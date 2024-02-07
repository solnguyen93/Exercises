import { sqlForPartialUpdate } from './sql.js';
import { BadRequestError } from '../expressError.js';

describe('sqlForPartialUpdate', () => {
    test('should generate SQL query for a partial update operation', () => {
        const dataToUpdate = {
            firstName: 'Aliya',
            lastName: 'Smith',
            age: 32,
        };
        const jsToSql = {
            firstName: 'first_name',
            lastName: 'last_name',
        };
        const expectedResult = {
            setCols: '"first_name"=$1, "last_name"=$2, "age"=$3',
            values: ['Aliya', 'Smith', 32],
        };
        expect(sqlForPartialUpdate(dataToUpdate, jsToSql)).toEqual(expectedResult);
    });

    test('should throw BadRequestError if no data is provided for update', () => {
        const dataToUpdate = {};
        const jsToSql = {};
        expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql)).toThrow(BadRequestError);
    });
});
