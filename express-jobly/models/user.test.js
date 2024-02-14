import { NotFoundError, BadRequestError, UnauthorizedError } from '../expressError.js';
import db from '../db.js';
import User from './user.js';
import { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } from './_testCommon.js';

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe('authenticate', function () {
    test('works', async function () {
        const user = await User.authenticate('u1', 'password1');
        expect(user).toEqual({
            username: 'u1',
            firstName: 'U1F',
            lastName: 'U1L',
            email: 'u1@email.com',
            isAdmin: false,
        });
    });

    test('unauth if no such user', async function () {
        try {
            await User.authenticate('nope', 'password');
            fail();
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });

    test('unauth if wrong password', async function () {
        try {
            await User.authenticate('c1', 'wrong');
            fail();
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });
});

/************************************** register */

describe('register', function () {
    const newUser = {
        username: 'new',
        firstName: 'Test',
        lastName: 'Tester',
        email: 'test@test.com',
        isAdmin: false,
    };

    test('works', async function () {
        let user = await User.register({
            ...newUser,
            password: 'password',
        });
        expect(user).toEqual(newUser);
        const found = await db.query("SELECT * FROM users WHERE username = 'new'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].is_admin).toEqual(false);
        expect(found.rows[0].password.startsWith('$2b$')).toEqual(true);
    });

    test('works: adds admin', async function () {
        let user = await User.register({
            ...newUser,
            password: 'password',
            isAdmin: true,
        });
        expect(user).toEqual({ ...newUser, isAdmin: true });
        const found = await db.query("SELECT * FROM users WHERE username = 'new'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].is_admin).toEqual(true);
        expect(found.rows[0].password.startsWith('$2b$')).toEqual(true);
    });

    test('bad request with dup data', async function () {
        try {
            await User.register({
                ...newUser,
                password: 'password',
            });
            await User.register({
                ...newUser,
                password: 'password',
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** findAll */

describe('findAll', function () {
    test('works', async function () {
        const users = await User.findAll();
        expect(users).toEqual([
            {
                username: 'u1',
                firstName: 'U1F',
                lastName: 'U1L',
                email: 'u1@email.com',
                isAdmin: false,
                jobs: 0,
            },
            {
                username: 'u2',
                firstName: 'U2F',
                lastName: 'U2L',
                email: 'u2@email.com',
                isAdmin: false,
                jobs: 0,
            },
        ]);
    });
});

/************************************** get */

describe('get', function () {
    test('works', async function () {
        let user = await User.get('u1');
        expect(user).toEqual({
            username: 'u1',
            firstName: 'U1F',
            lastName: 'U1L',
            email: 'u1@email.com',
            isAdmin: false,
            jobs: 0,
        });
    });

    test('works', async function () {
        await User.applyForJob('u1', 1); // Apply user u1 to job id 1 before running this test
        const user = await User.get('u1');
        expect(user).toEqual({
            username: 'u1',
            firstName: 'U1F',
            lastName: 'U1L',
            email: 'u1@email.com',
            isAdmin: false,
            jobs: [{ id: 1, title: 'Job1', salary: 10, equity: 0.01, companyHandle: 'c1' }],
        });
    });

    test('not found if no such user', async function () {
        try {
            await User.get('nope');
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** update */

describe('update', function () {
    const updateData = {
        firstName: 'NewF',
        lastName: 'NewF',
        email: 'new@email.com',
        isAdmin: true,
    };

    test('works', async function () {
        let job = await User.update('u1', updateData);
        expect(job).toEqual({
            username: 'u1',
            ...updateData,
        });
    });

    test('works: set password', async function () {
        let job = await User.update('u1', {
            password: 'new',
        });
        expect(job).toEqual({
            username: 'u1',
            firstName: 'U1F',
            lastName: 'U1L',
            email: 'u1@email.com',
            isAdmin: false,
        });
        const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].password.startsWith('$2b$')).toEqual(true);
    });

    test('not found if no such user', async function () {
        try {
            await User.update('nope', {
                firstName: 'test',
            });
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test('bad request if no data', async function () {
        expect.assertions(1);
        try {
            await User.update('c1', {});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** remove */

describe('remove', function () {
    test('works', async function () {
        await User.remove('u1');
        const res = await db.query("SELECT * FROM users WHERE username='u1'");
        expect(res.rows.length).toEqual(0);
    });

    test('not found if no such user', async function () {
        try {
            await User.remove('nope');
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

describe('applyForJob', function () {
    test('works', async function () {
        await User.applyForJob('u1', 1);
        const res = await db.query(
            `SELECT username, job_id
            FROM applications
            WHERE username = 'u1' AND job_id = 1`
        );
        expect(res.rows).toEqual([{ username: 'u1', job_id: 1 }]);
    });

    test('throws NotFoundError if user not found', async function () {
        try {
            await User.applyForJob('nope', 1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test('throws NotFoundError if job not found', async function () {
        try {
            await User.applyForJob('u1', 999);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test('throws BadRequestError if user has already applied for job', async function () {
        await User.applyForJob('u1', 1);
        try {
            await User.applyForJob('u1', 1);
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});
