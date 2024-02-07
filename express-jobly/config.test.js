import dotenv from 'dotenv';
import * as config from './config.js';

dotenv.config();

describe('config can come from env', function () {
    test('works', async function () {
        expect(config.SECRET_KEY).toEqual('secret-dev');
        expect(config.PORT).toEqual(3001);
        expect(config.getDatabaseUri()).toEqual('jobly_test');
        expect(config.BCRYPT_WORK_FACTOR).toEqual(1);

        jest.resetModules();

        process.env.NODE_ENV = 'other';
        process.env.SECRET_KEY = 'abc';
        process.env.PORT = '5000';
        process.env.DATABASE_URL = 'other';

        const updatedConfig = await import('./config.js');

        expect(updatedConfig.SECRET_KEY).toEqual('abc');
        expect(updatedConfig.PORT).toEqual(5000);
        expect(updatedConfig.getDatabaseUri()).toEqual('other');

        delete process.env.SECRET_KEY;
        delete process.env.PORT;
        delete process.env.BCRYPT_WORK_FACTOR;
        delete process.env.DATABASE_URL;

        expect(updatedConfig.getDatabaseUri()).toEqual('jobly');
    });
});

// "use strict";

// describe("config can come from env", function () {
//   test("works", function() {
//     process.env.SECRET_KEY = "abc";
//     process.env.PORT = "5000";
//     process.env.DATABASE_URL = "other";
//     process.env.NODE_ENV = "other";

//     const config = require("./config");
//     expect(config.SECRET_KEY).toEqual("abc");
//     expect(config.PORT).toEqual(5000);
//     expect(config.getDatabaseUri()).toEqual("other");
//     expect(config.BCRYPT_WORK_FACTOR).toEqual(12);

//     delete process.env.SECRET_KEY;
//     delete process.env.PORT;
//     delete process.env.BCRYPT_WORK_FACTOR;
//     delete process.env.DATABASE_URL;

//     expect(config.getDatabaseUri()).toEqual("jobly");
//     process.env.NODE_ENV = "test";

//     expect(config.getDatabaseUri()).toEqual("jobly_test");
//   });
// })
