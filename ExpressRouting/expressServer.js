import express from 'express';
import { ExpressError } from './expressError.js';

// Creating an Express application
const app = express();
app.use(express.json()); // Parsing JSON in request Body
app.use(express.urlencoded({ extended: true })); //parse URL-encoded form data

// Define a route
// request: information about request - query string, url parameters, form data, etc.
// response: methods for sending a response - html, text, json, etc.
app.get('/', (request, response) => {
    return response.send('Hello, Express!');
});

// Access route parameters (directly embedded in the URL)
const greetings = {
    en: 'Hello',
    fr: 'bonjour',
    ja: 'konnichiwa',
};
app.get('/greet/:language', (req, res, next) => {
    try {
        const lng = req.params.language;
        if (!(lng in greetings)) {
            throw new ExpressError('Language unavailable', 400);
        }
        const greeting = greetings[lng];
        return res.send(greeting);
    } catch (err) {
        next(err);
    }
});

// Access query parameter (key=value pair, starts after '?' and separted by '&')
app.get('/search', (req, res) => {
    // Url = .../search?term="chickens"&sort="new"
    const { term, sort = 'recent' } = req.query; //set sort default value to 'recent'
    return res.send(`Search Page. Term is ${term}, sort by ${sort}.`);
});

// Access headers (key=value pair, additional information attached separately)
app.get('/show-language', (req, res) => {
    const lang = req.headers['accept-language'];
    return res.send(`Your language preference is: ${lang}`);
});

// Access body
app.post('/register', (req, res, next) => {
    try {
        const user = USERS.find((u) => u.username === req.body.username);
        if (user) throw new ExpressError('Username already exists', 400); // throw error (custom Error Class)
        return res.send(`Welcome, ${req.body.username}`);
    } catch (err) {
        next(err);
        // If user already exists in USERS, throws a custom error using the ExpressError class.
        // The catch block catches the error and passes it to the next function
        // 'Next' allows continuation to the next middleware function or route handler
        // If 'next' has an argument, Express seeks the next middleware with an error parameter
    }
});
// Responding with JSON data for candies (simulated database)
const CANDIES = [
    { name: 'kitkat', qty: 2, price: 1.5 },
    { name: 'hichew', qty: 12, price: 0.07 },
];
app.get('/candies', (req, res) => {
    // Returning JSON data for all candies
    return res.json(CANDIES);
    // To explicitly set status code 200: return res.status(200).json(CANDIES);
});

// Middleware for handling requests that don't match any defined routes
app.use((req, res, next) => {
    // Creating a custom error for "Page Not Found" and passing it to the next function
    const e = new ExpressError('Page Not Found', 404);
    next(e);
});

// Error handler middleware
app.use((error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message || 'Internal Server Error';
    return res.status(status).json({
        error: { message, status },
    });
});

// Start the server (port=3000)
app.listen(3000, function () {
    console.log(`Server listening at http://localhost:3000`);
});
debugger;
