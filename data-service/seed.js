import { createUser } from './data/users.js';
import { dbConnection, closeConnection } from './config/mongoConnection.js';

const db = await dbConnection();
// password: Test555
await createUser(
    "testName",
    "test555@test.com",
    "mjo3pGF7YFV7y3OCGBcB0kEJOBl2"
);

await closeConnection(); 