const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27018/TodoApp',(err,client) => {
if (err) {
    console.log(err);
    return console.log('Unable to connect to MongoDB sever dude');
    
}
console.log('connected to MongoDB server');
const db = client.db('TododApp');

// db.collection('Todos').findOneAndUpdate({ text: 'Eat Lunch'}, { 
//     $set:{
//     completed: false
// }
// }, {returnOriginal: false} ).then( (result) => {
//     console.log(result);
// });

db.collection('Users').findOneAndUpdate( {name: 'Bob'},
{ $set: { name: 'Alan'}, $inc: { age: 1}},
{returnOriginal: false} ).then( (result) => {
    console.log(result);
});


//client.close();
});