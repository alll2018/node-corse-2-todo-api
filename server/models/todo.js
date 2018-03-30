var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        minlength: 1,
        required: true
    },
    completed: {
        type: Boolean,
        default: true
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {Todo};