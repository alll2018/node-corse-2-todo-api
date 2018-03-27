
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27018/TodoApp',(err,client) => {
if (err) {
    console.log(err);
    return console.log('Unable to connect to MongoDB sever dude');
    
}
console.log('connected to MongoDB server');
const db = client.db('TododApp');

// db.collection('Todos').insertOne({
//   text: 'Something to do',
//   completed: false  
// }, (err,result) => {
//    if(err) {
//        return console.log('Unable to insert todo',err);
//    }
//    console.log(JSON.stringify(result.ops,undefined,2));
// }
// );

db.collection('Users').insertOne({
    name: 'Alan',
    age: 53,
    location: 'Houston Texas'
},(err,result) =>{
    if(err) {
        return console.log('unable to insert user',err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
})
client.close();
});