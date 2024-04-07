const {Schema, model} = require('mongoose');

const TodoListItemsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
    }
});

module.exports = model('TodoListItems', TodoListItemsSchema);