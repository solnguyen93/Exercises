// 'use strict'; // Not needed in ESModule

import { BadRequestError } from '../expressError.js';

/**
 * Generates SQL for a partial update of data in a SQL table.
 *
 * @param {object} dataToUpdate - The data to be updated.
 * @param {object} jsToSql - Mapping of JavaScript keys to SQL column names.
 * @returns {object} An object with SQL setCols and values.
 * @throws {BadRequestError} If no data is provided.
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
