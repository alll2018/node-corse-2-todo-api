
const {MongoClient,ObjectID} = require('mongodb');

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
// db.collection('Todos').find({_id: new ObjectID('5aba5619894f0e0a5da20462') }).toArray().then((docs) => {
// console.log(JSON.stringify(docs,undefined,2));
// }, (err) => {
// console.log('Unable to fetch todos',err);
// } )

// db.collection('Todos').find().count().then((count) => {
//     console.log(`Todos count: ${count}`);
//     }, (err) => {
//     console.log('Unable to fetch todos',err);
//     } );

db.collection('Users').find({name: 'Alan'}).toArray().then( (docs) => {
    console.log(JSON.stringify(docs,undefined,2));
}, (err) => {
    console.log('Unable to fetch todos',err);
});


//client.close();
});