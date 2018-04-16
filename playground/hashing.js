const jwt = require('jsonwebtoken');

var data = {
id: 10
}

token = jwt.sign(data,'123abc');
console.log(token);

decoded = jwt.verify(token,'123abc');
console.log('Decoded: ',decoded);