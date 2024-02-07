// 'use strict'; // Not needed in ESModule

import { BadRequestError } from '../expressError.js';

/**
 * Generates SQL for a partial update operation by mapping JavaScript keys to SQL column names and constructing the SQL set clause and values array.
 *
 * @param {object} dataToUpdate - The data to be updated.
 * @param {object} jsToSql - Mapping of JavaScript keys to SQL column names. For example, if you have a key named 'firstName' in JavaScript, it should be represented as 'first_name' in SQL.
 * @returns {object} An object containing SQL setCols and values.
 * @throws {BadRequestError} If no data is provided.
 *
 * @example
 * const dataToUpdate = {
 *   firstName: 'Aliya',
 *   lastName: 'Smith',
 *   age: 32
 * };
 *
 * const jsToSql = {
 *   firstName: 'first_name',
 *   lastName: 'last_name'
 * };
 *
 * const sql = sqlForPartialUpdate(dataToUpdate, jsToSql);
 * // sql.setCols = '"first_name"=$1, "last_name"=$1, "age"=$2'
 * // sql.values = ['Aliya', 'Smith', 32]
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
    const keys = Object.keys(dataToUpdate);
    if (keys.length === 0) throw new BadRequestError('No data');

    // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
    const cols = keys.map((colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`);

    return {
        setCols: cols.join(', '),
        values: Object.values(dataToUpdate),
    };
}

export { sqlForPartialUpdate };
