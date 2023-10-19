const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;

const main = async() => {
    const user1 = await users.addUser('123@gmail.com', '123-123-1234', 'jonsnowspassword1',  'Jon', 'Snow', 0);
    const user2 = await users.addUser('bobross@gmail.com', '234-234-2345', 'bobrosspassword1', 'Bob', 'Ross', 1);
    const user3 = await users.addUser('nickcage@gmail.com', '345-345-3456', 'nickcagespassword1', 'Nicolas', 'Cage', 0)
    const u1 = await users.getUserByEmail('kinginthenorth@gmail.com');
    const u2 = await users.getUserByEmail('bobross@gmail.com');
    const u3 = await users.getUserByEmail('nickcage@gmail.com');
    console.log('User collection successfully seeded!');
    return;
};

main().catch(console.log);