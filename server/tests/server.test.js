const expect = require('expect')
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');

const todos = [{
    text: 'First test todo'
},
{
    text: 'Second test todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
         Todo.insertMany(todos);
     }).then( () => done());
    });

 describe('POST /todos',() => {
     it('should create a new todo',(done) => {

     var text = 'Do Laundry';
     request(app)
     .post('/todos')  
     .send({text: text}) 
     .expect(200)
     .expect( (res) => {
         expect(res.body.text).toBe(text)
     }).end( (err,res) => {
         if (err) {
         return done(err);
         }
         Todo.find({text}).then((todos) => {
         expect(todos.length).toBe(1);
         expect(todos[0].text).toBe(text);
        done();
     }).catch( (e) => done(e));
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
           expect(todos.length).toBe(2);
           done();
       }
    , (e) => {
        console.log(e);
    }).catch((e) => {
        console.log('caught error');
        done(e);
});
})
})
});

describe('GET/Todos',() =>{
    it('Should return all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect( (res) => {
            expect(res.body.todos.length).toBe(2)
        }).end(done);
    });
});