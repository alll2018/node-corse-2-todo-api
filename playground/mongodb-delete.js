const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27018/TodoApp',(err,client) => {
if (err) {
    console.log(err);
    return console.log('Unable to connect to MongoDB sever dude');
    
}
console.log('connected to MongoDB server');
const db = client.db('TododApp');

// db.collection('Users').deleteMany({name: 'Alan'}).then((result) => {
// console.log(result);
// });
db.collection('Users').findOneAndDelete({_id:  new ObjectID('5aba8dbffe3cbbd6a75f1ee8')}).then((result) => {
    console.log(result);
    })


//client.close();
});