# Jobly

Jobly is a job searching API.

## Technologies Used

-   **Backend**: Node.js, Express.js
-   **Database**: PostgreSQL
-   **Authentication**: JSON Web Tokens (JWT)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/solnguyen93/Exercises/tree/main/express-jobly
```

2. Install dependencies:

```bash
cd jobly
npm install
```

3. Set up the database:

```bash
psql -f jobly.sql
```

4. Configure the Database Connection:

In the db.js file located in the src directory, replace the placeholder values 'your_username' and 'your_password' with your PostgreSQL username and password respectively.

## Usage

-   Start the server:

```bash
npm start
```

-   Run tests:

```bash
npm test
```

### Test User

-   **Username**: testuser
-   **Password**: password

### Test Admin

-   **Username**: testadmin
-   **Password**: password

## API Endpoints

### Authentication

-   **POST /auth/login**: Log in with username and password to receive an authentication token.

### Users

-   **GET /users**: Retrieve a list of all users.
-   **GET /users/:username**: Retrieve a specific user's profile.
-   **PATCH /users/:username**: Update a user's profile.
-   **DELETE /users/:username**: Delete a user's profile.
-   **POST /users**: Create a new user.
-   **POST /users/:username/jobs/:id**: Apply for a job with the specified ID for the given user.

### Companies

-   **GET /companies**: Retrieve a list of all companies.
-   **GET /companies?name=companyName&minEmployees=num&maxEmployees=num**: Retrieve companies by name, minimum and/or maximum number of employees (optional filters).
-   **GET /companies/:handle**: Retrieve a specific company's profile.
-   **POST /companies**: Create a new company profile.
-   **PATCH /companies/:handle**: Update a company's profile.
-   **DELETE /companies/:handle**: Delete a company's profile.

### Jobs

-   **GET /jobs**: Retrieve a list of all job listings.
    **GET /jobs?title=jobTitle&minSalary=num&hasEquity**: Retrieve jobs by title, minimum salary, and if it has equity (optional filters).
-   **GET /jobs/:id**: Retrieve a specific job listing.
-   **POST /jobs**: Create a new job listing.
-   **PATCH /jobs/:id**: Update a job listing.
-   **DELETE /jobs/:id**: Delete a job listing.
