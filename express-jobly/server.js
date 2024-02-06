// 'use strict'; // Not needed in ESModule

import app from './app.js';
import { PORT } from './config.js';

app.listen(PORT, () => {
    console.log(`Started on http://localhost:${PORT}`);
});
