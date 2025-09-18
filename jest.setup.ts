const dotenv = require('dotenv');
const path = require('path');

// Load the test environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

