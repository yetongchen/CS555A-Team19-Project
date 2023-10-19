const data = require('../data/');
const users = data.users;


const main = async() => {
    try {
        
        const user1 = await users.addUser('user1_id', 'Jon', 'Snow', '123@gmail.com', [], []);
        const user2 = await users.addUser('user2_id', 'Bob', 'Ross', 'bobross@gmail.com', [], []);
        const user3 = await users.addUser('user3_id', 'Nicolas', 'Cage', 'nickcage@gmail.com', [], []);
        const u1 = await users.getUserByEmail('123@gmail.com');
        const u2 = await users.getUserByEmail('bobross@gmail.com');
        const u3 = await users.getUserByEmail('nickcage@gmail.com');

        console.log('User collection successfully seeded!');
    } catch (error) {
        console.error(error);
    }
};

main().catch(console.error);
