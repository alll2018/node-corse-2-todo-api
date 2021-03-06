const expect = require('expect');
const request = require('supertest');


const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers}  = require('./seed/seed');

beforeEach(populateUsers)
beforeEach(populateTodos);

 describe('POST /todos',() => {
     it('should create a new todo',(done) => {

     var text = 'Do Laundry';
     request(app)
     .post('/todos') 
     .set('x-auth', users[0].tokens[0].token) 
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
    .set('x-auth',users[0].tokens[0].token) 
    .send({text: ''}) 
    .expect(400) 
    .end( (err,res) => {
       if (err) {
         return done(err)  
       }
       Todo.find({}).then( (todos) => {
           expect(todos.length).toBe(2);
           done();
       }).catch((e) => done(e));    
    });
});
})




describe('GET/Todos',() =>{
    it('Should return all todos', (done) => {
        request(app)
        .get('/todos')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect( (res) => {
            expect(res.body.todos.length).toBe(1)
        }).end(done);
    });
});

describe('GET/todos/:id',() => {
    it('should return  todo doc',(done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        }).end(done);
    });

    it('should not return a todo doc created by other user',(done) => {
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

  it('Should return 404 when doc not found', (done) => {
      var id = new ObjectID();
      request(app)
      .get(`/todos/${id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 when doc not found', (done) => {
    request(app)
    .get('/todos/123')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
    });   
});

describe('DELETE/todos/:id', () => {
it("should remove a todo", (done) => {
var hexId = todos[1]._id.toHexString();

request(app)
.delete(`/todos/${hexId}`)
.set('x-auth', users[1].tokens[0].token)
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

it("should  not remove a todo created by another user", (done) => {
    var hexId = todos[0]._id.toHexString();
    
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth',users[1].tokens[0].token)
    .expect(404)
    .end((err,res) => {
    if (err) {
        return done(err);
    }
    Todo.findById(hexId).then( (todo) => {
    expect(todo).toBeTruthy();
    done();
    }).catch( (e) =>  done(e));
    });
    });
    

it('should return 404 if todo not found', (done) => {
var hexId = new ObjectID().toHexString;
request(app)
.delete(`/todos/${hexId}`)
.set('x-auth',users[1].tokens[0].token)
.expect(404)
.end(done)
});
it('should return 404 if ID not valid ', (done) => {
    var Id = '123';
    request(app)
    .delete(`/todos/${Id}`)
    .set('x-auth',users[1].tokens[0].token)
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
        .set('x-auth',users[0].tokens[0].token)
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

    it('should not update a todo created by another user',(done)=> {
        HexId = todos[0]._id.toHexString();
        var updatedText = 'Updated Text';
        request(app)
        .patch(`/todos/${HexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
            'text': updatedText,
            'completed': true,
          })
        .expect(404)
        .end(done);
    });

it('should clear completeAt when todo is not completed',(done)=>{
    HexId = todos[1]._id.toHexString();
    request(app)
    .patch(`/todos/${HexId}`)
    .set('x-auth',users[1].tokens[0].token)
    .send({
        'completed': false,
      })
    .expect(200)
    .expect( (res) =>{
        expect(res.body.todo.completedAt).toBeNull();
        
        done();
    }).catch((e) => done(e));
});
});

describe('GET/users/me',() => {
    it('should return user if authenticated',(done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect( (res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());  
            expect(res.body.email).toBe(users[0].email);
        }).end(done);

    });
    it('should return 401 if not authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({})
        }).end(done);

    });
});
describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123mnb!';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect( (res) => {   
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        }).end( (err) => {
            if (err) {
                return done(err);
            }
           User.findOne({email}).then( (user) => {
               expect(user).toBeTruthy();
               expect(user.password).not.toBe(password);
               done();
           }).catch ((e) => done(e));
        });
    
});
it('should return validaton errors if request invalid', (done) => {
    var email = 'TOM';
    var password = '123mnb!';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
});
it('should not save user if email already used', (done) => {
    var email = users[0].email;
    var password = '123mnb!';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
});
});

describe('POST/users/login', () =>{
    it('It should login user and return with Auth token', (done) =>{
        request(app)
        .post('/users/login')
        .send( {
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
         
        }).end((err, res) => {
            if (err) {
                return done(err);
            }
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[1]).toMatchObject({
                    access: 'auth',
                    token:   res.headers['x-auth']
                });
                done();
            }).catch ((e) => done(e));
        });
    });
    it('should reject invalid login',(done) => {
        request(app)
        .post('/users/login')
        .send( {
            email: users[1].email,
            password: users[1].password + 'a'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy();
         
        }).end((err, res) => {
            if (err) {
                return done(err);
            }
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch ((e) => done(e));
        });
    });
});

describe('DELETE/users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err,res) => {
         if (err){
             return done(err);
         }   
        User.findById(users[0]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
        }).catch ((e) => done(e)); 
    });
});
});
