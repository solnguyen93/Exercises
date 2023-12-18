import app from './app.js';
const port = 3000;

const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
