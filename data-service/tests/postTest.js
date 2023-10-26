import postData from '../data/postData.js';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';

const db = await dbConnection();
await db.dropDatabase();

let post1 = null;
let post2 = null;
let post3 = null;
let post4 = null;

//createPost
try {
    post1 = await postData.createPost(
        "643477cd9042a9c9256c5ac5",
        "643190719757",
        'Yetong',
        "Chen",
        "Nice dinner at Saka sushi",
        "Nice food and environment.");
    console.log("create post1 successfully", post1);
} catch(e) {
    console.log(e);
}

try {
    post2 = await postData.createPost(
        "63ddcbc4b3ffe78cebcbb5a1",
        "692750504407",
        'Xu',
        "Zhou",
        "Hiking on weekend",
        "Beautiful maples.");
    console.log("create post2 successfully", post2);
} catch(e) {
    console.log(e);
}

try {
    post3 = await postData.createPost(
        "63ddcbc4b3ffe78cebcbb5a4",
        "735668072007",
        'Cong',
        "Guo",
        "art museum travel",
        "This museum tour was very interesting. I saw many paintings by artists and the explanations were very detailed. I will recommend this experience to friends and family and look forward to having such an opportunity next time.");
    console.log("create post3 successfully", post3);
} catch(e) {
    console.log(e);
}

try {
    post4 = await postData.createPost(
        "63ddcbc4b3ffe78cebcbb5a8",
        "735668072007",
        'Amy',
        "Wang",
        "museum tour",
        "Amaing experience!");
    console.log("create post4 successfully", post3);
} catch(e) {
    console.log(e);
}

//getPostByEventId
try {
    const postsEvent1 = await postData.getPostByEventId(post1.event_id);
    console.log(postsEvent1);
}catch(e){
    console.log(e);
}

//getPostByUserId
try {
    const postUser2 = await postData.getPostByUserId(post2.user_id);
    console.log(postUser2);
}catch(e) {
    console.log(e);
}

//removePostByPostId
try {
    const deleteInfo1 = await postData.removePostByPostId(post1._id.toString());
    console.log(deleteInfo1);
} catch(e) {
    console.log(e);
}

//getPostByPostId
try {
    const newPost1 = await postData.getPostByPostId(post1._id.toString());
    console.log(newPost1);
}catch(e) {
    console.log(e);//should throw not found error
}

try {
    const newPost2 = await postData.getPostByPostId(post2._id.toString());
    console.log(newPost2);
}catch(e) {
    console.log(e);
}

console.log('Done seeding database');
await closeConnection();