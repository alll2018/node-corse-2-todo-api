const expect = require('expect')
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');
beforeEach((done) => {
    Todo.remove({}).then(() =>  done());
    });

 describe('POST /todos',() => {
     it('should create a new todo',(done) => {

     var text = 'Test todo text';
     request(app)
     .post('/todos')  
     .send({text: 123}) 
     .expect(200)
     .expect( (res) => {
         expect(res.body.text).toBe(text)
     }).end( (err,res) => {
         if (err) {
         return done(err);
         }
         Todo.find().then((todos) => {
         expect(todos.length).toBe(1);
         expect(todos[0].text).toBe(text);
        done();
     });
    });
     });
    });
it('should not create a todo if the body details are invalid', (done) => {
    request(app)
    .post('/todos')  
    .send({text: ''}) 
    .expect(400) 
    .end( (err,res) => {
       if (err) {
         return done(err)  
       }
       Todo.find({}).then( (todos) => {
           expect(todos.length).toBe(0);
           done();
       }
    , (e) => {
        console.log(e);
    }).catch((e) => {
        console.log('caught error');
        done(e);
});
});
});