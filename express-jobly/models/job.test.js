import db from '../db.js';
import { BadRequestError, NotFoundError } from '../expressError.js';
import Job from './job.js';
import { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } from './_testCommon.js';

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe('create', function () {
    const newJob = {
        title: 'New Job',
        salary: 12,
        equity: '0.1',
        companyHandle: 'c1',
    };

    test('works', async function () {
        let job = await Job.create(newJob);
        expect(job).toEqual({
            id: expect.any(Number),
            ...newJob,
        });

        const result = await db.query(
            `SELECT title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'New Job'`
        );
        expect(result.rows).toEqual([
            {
                title: 'New Job',
                salary: 12,
                equity: '0.1',
                company_handle: 'c1',
            },
        ]);
    });

    test('bad request with dupe', async function () {
        try {
            await Job.create(newJob);
            await Job.create(newJob);
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** findAll */

describe('findAll', function () {
    test('works: no filter', async function () {
        let jobs = await Job.findAll();
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: 'Job1',
                salary: 10,
                equity: '0.01',
                companyHandle: 'c1',
            },
            {
                id: expect.any(Number),
                title: 'Job2',
                salary: 245123,
                equity: '0',
                companyHandle: 'c2',
            },
            {
                id: expect.any(Number),
                title: 'Job3',
                salary: 9987,
                equity: '0.98',
                companyHandle: 'c3',
            },
        ]);
    });

    test('works: filter by title', async function () {
        let jobs = await Job.findAll({ title: 'job2' });
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: 'Job2',
                salary: 245123,
                equity: '0',
                companyHandle: 'c2',
            },
        ]);
    });

    test('works: filter by title case-insensitive', async function () {
        let jobs = await Job.findAll({ title: 'jOB2' });
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: 'Job2',
                salary: 245123,
                equity: '0',
                companyHandle: 'c2',
            },
        ]);
    });

    test('works: filter by salary', async function () {
        let jobs = await Job.findAll({ minSalary: 20123 });
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: 'Job2',
                salary: 245123,
                equity: '0',
                companyHandle: 'c2',
            },
        ]);
    });

    test('works: filter by equity', async function () {
        let jobs = await Job.findAll({ hasEquity: true });
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: 'Job1',
                salary: 10,
                equity: '0.01',
                companyHandle: 'c1',
            },
            {
                id: expect.any(Number),
                title: 'Job3',
                salary: 9987,
                equity: '0.98',
                companyHandle: 'c3',
            },
        ]);
    });
});

// /************************************** get */

describe('get', function () {
    test('works', async function () {
        let job = await Job.get(1);
        expect(job).toEqual({
            id: 1,
            title: 'Job1',
            salary: 10,
            equity: '0.01',
            company: {
                handle: 'c1',
                name: 'C1',
            },
        });
    });

    test('not found if no such job', async function () {
        try {
            await Job.get(12345678);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

// /************************************** update */

describe('update', function () {
    const updateData = {
        title: 'New',
        salary: 1000123,
        equity: '0.11',
    };

    test('works', async function () {
        let job = await Job.update(1, updateData);
        expect(job).toEqual({
            id: 1,
            title: 'New',
            salary: 1000123,
            equity: '0.11',
            companyHandle: 'c1',
        });

        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE id = 1`
        );
        expect(result.rows).toEqual([
            {
                id: 1,
                title: 'New',
                salary: 1000123,
                equity: '0.11',
                company_handle: 'c1',
            },
        ]);
    });

    test('works: missing fields', async function () {
        const updateDataSetMissing = {
            title: 'NewMissingFields',
            salary: 23,
        };

        let job = await Job.update(1, updateDataSetMissing);
        expect(job).toEqual({
            id: 1,
            title: 'NewMissingFields',
            salary: 23,
            equity: '0.01',
            companyHandle: 'c1',
        });

        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
               FROM jobs
               WHERE id = 1`
        );
        expect(result.rows).toEqual([
            {
                id: 1,
                title: 'NewMissingFields',
                salary: 23,
                equity: '0.01',
                company_handle: 'c1',
            },
        ]);
    });

    test('not found if no such job', async function () {
        try {
            await Job.update(12345678, updateData);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test('bad request with no data', async function () {
        try {
            await Job.update(1, {});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

// /************************************** remove */

describe('remove', function () {
    test('works', async function () {
        await Job.remove(1);
        const res = await db.query('SELECT id FROM jobs WHERE id=1');
        expect(res.rows.length).toEqual(0);
    });

    test('not found if no such job', async function () {
        try {
            await Job.remove(12345678);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
