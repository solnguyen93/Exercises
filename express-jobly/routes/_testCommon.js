import db from '../db.js';
import User from '../models/user.js';
import Company from '../models/company.js';
import Job from '../models/job.js';
import { createToken } from '../helpers/tokens.js';

const testJobIds = [];

async function commonBeforeAll() {
    // noinspection SqlWithoutWhere
    await db.query('DELETE FROM users');
    // noinspection SqlWithoutWhere
    await db.query('DELETE FROM companies');
    // noinspection SqlWithoutWhere
    await db.query('DELETE FROM jobs');

    await Company.create({
        handle: 'c1',
        name: 'C1',
        numEmployees: 1,
        description: 'Desc1',
        logoUrl: 'http://c1.img',
    });
    await Company.create({
        handle: 'c2',
        name: 'C2',
        numEmployees: 2,
        description: 'Desc2',
        logoUrl: 'http://c2.img',
    });
    await Company.create({
        handle: 'c3',
        name: 'C3',
        numEmployees: 3,
        description: 'Desc3',
        logoUrl: 'http://c3.img',
    });
    await Company.create({
        handle: 'c4',
        name: 'C4',
        numEmployees: 4,
        description: 'Desc4',
        logoUrl: 'http://c4.img',
    });

    const job1 = await Job.create({ title: 'C1Job', salary: 125000, equity: '0.10', companyHandle: 'c1' });
    testJobIds.push(job1.id);

    const job2 = await Job.create({ title: 'C2Job', salary: 234, equity: '0.09', companyHandle: 'c2' });
    testJobIds.push(job2.id);

    const job3 = await Job.create({ title: 'C3Job', salary: 59000, equity: '0.54', companyHandle: 'c3' });
    testJobIds.push(job3.id);

    await User.register({
        username: 'u1',
        firstName: 'U1F',
        lastName: 'U1L',
        email: 'user1@user.com',
        password: 'password1',
        isAdmin: false,
    });
    await User.register({
        username: 'u2',
        firstName: 'U2F',
        lastName: 'U2L',
        email: 'user2@user.com',
        password: 'password2',
        isAdmin: false,
    });
    await User.register({
        username: 'u3',
        firstName: 'U3F',
        lastName: 'U3L',
        email: 'user3@user.com',
        password: 'password3',
        isAdmin: false,
    });
}

async function commonBeforeEach() {
    await db.query('BEGIN');
}

async function commonAfterEach() {
    await db.query('ROLLBACK');
}

async function commonAfterAll() {
    await db.end();
}

const u1Token = createToken({ username: 'u1', isAdmin: false });

const adminToken = createToken({ username: 'a1', isAdmin: true });

export { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u1Token, adminToken, testJobIds };
