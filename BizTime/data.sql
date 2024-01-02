\c biztime

DROP TABLE IF EXISTS company_industries;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL UNIQUE
);

CREATE TABLE company_industries (
    id serial PRIMARY KEY,
    comp_code text REFERENCES companies ON DELETE CASCADE,
    industry_code text REFERENCES industries ON DELETE CASCADE
);

INSERT INTO companies VALUES
    ('apple', 'Apple Computer', 'Maker of OSX.'),
    ('ibm', 'IBM', 'Big blue.')
ON CONFLICT DO NOTHING;

INSERT INTO invoices (comp_code, amt, paid, paid_date) VALUES
    ('apple', 100, false, null),
    ('apple', 200, false, null),
    ('apple', 300, true, '2018-01-01'),
    ('ibm', 400, false, null)
ON CONFLICT DO NOTHING;

INSERT INTO industries VALUES
    ('tech', 'Technology'),
    ('acc', 'Accounting'),
    ('finance', 'Finance')
ON CONFLICT DO NOTHING;

INSERT INTO company_industries(comp_code, industry_code) VALUES
    ('apple', 'tech'),
    ('ibm', 'tech'),
    ('ibm', 'finance')
ON CONFLICT DO NOTHING;


/* Seed biztime test database */

-- \c biztime_test

-- DROP TABLE IF EXISTS invoices;
-- DROP TABLE IF EXISTS companies;

-- CREATE TABLE companies (
--     code text PRIMARY KEY,
--     name text NOT NULL UNIQUE,
--     description text
-- );

-- CREATE TABLE invoices (
--     id serial PRIMARY KEY,
--     comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
--     amt float NOT NULL,
--     paid boolean DEFAULT false NOT NULL,
--     add_date date DEFAULT CURRENT_DATE NOT NULL,
--     paid_date date,
--     CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
-- );

-- INSERT INTO companies
--   VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
--          ('ibm', 'IBM', 'Big blue.');

-- INSERT INTO invoices (comp_code, amt, paid, paid_date)
--   VALUES ('apple', 100, false, null),
--          ('apple', 200, false, null),
--          ('apple', 300, true, '2018-01-01'),
--          ('ibm', 400, false, null);

