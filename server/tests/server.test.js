const expect = require('expect');
const request = require('supertest');


const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

const todos = [{
    _id:   new ObjectID(),
    text: 'First test todo',
},
{
    _id:  new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt:  44400
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

describe('GET/todos/:id',() => {
    it('should return  todo doc',(done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        }).end(done);
    });

  it('Should return 404 when doc not found', (done) => {
      var id = new ObjectID();
      request(app)
      .get(`/todos/${id.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 when doc not found', (done) => {
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
    });   
});

describe('DELETE/todos/:id', () => {
it("should remove a todo", (done) => {
var hexId = todos[1]._id.toHexString();

request(app)
.delete(`/todos/${hexId}`)
.expect(200)
.expect( (res) => {
 expect(res.body.todo._id).toBe(hexId);
}).end((err,res) => {
if (err) {
    return done(err);
}
Todo.findById(hexId).then( (todo) => {
expect(todo).toBeNull();
done();
}).catch( (e) =>  done(e));
});
});

it('should return 404 if todo not found', (done) => {
var hexId = new ObjectID().toHexString;
request(app)
.delete(`/todos/${hexId}`)
.expect(404)
.end(done)
});
it('should return 404 if ID not valid ', (done) => {
    var Id = '123';
    request(app)
    .delete(`/todos/${Id}`)
    .expect(404)
    .end(done)
});
});

describe('PATCH/todos/:id',() => {
    it('should update the todo',(done)=> {
        HexId = todos[0]._id.toHexString();
        var updatedText = 'Updated Text';
        request(app)
        .patch(`/todos/${HexId}`)
        .send({
            'text': updatedText,
            'completed': true,
          })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.text).toBe(updatedText);
            expect(res.body.todo.completedAt).toEqual(expect.any(Number));
            
        }).end(done);
    });
it('should clear completeAt when todo is not completed',(done)=>{
    HexId = todos[1]._id.toHexString();
    request(app)
    .patch(`/todos/${HexId}`)
    .send({
        'completed': false,
      })
    .expect(200)
    .expect( (res) =>{
        expect(res.body.todo.completedAt).toBeNull();
        console.log(res.body.todo.completedAt);
        done();
    }).catch((e) => done(e));
});
});