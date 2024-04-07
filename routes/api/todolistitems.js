const {Router} = require('express');
const router = Router();
const TodoListItems = require('../../models/TodoListitems')

router.get('/', async (req, res) => {
    try
    {
        const todolistitems = await TodoListItems.find();
        res.status(200).json(todolistitems);
    }
    catch(err)
    {
        res.status(500).json({message: err.message})
    }
});

router.post('/', async (req, res) => {
    const todolistitems = new TodoListItems({
        title: req.body.title,
        // completed: req.body.completed
    });
    try
    {
        const newTodoListItems = await todolistitems.save();
        res.status(201).json(newTodoListItems)
    }
    catch(err)
    {
        res.status(400).json({message: err.message});
    }
});

router.put('/:id', async (req, res) => {
    try
    {
        const updatedTodoListItems = await TodoListItems.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(200).json(updatedTodoListItems);
    }
    catch(err)
    {
        res.status(400).json({message: err.message});
    }
});

router.delete('/:id', async (req, res) => {
    try
    {
        const deletedTodoListItems = await TodoListItems.findByIdAndDelete(req.params.id);
        res.status(200).json("deleted succesfully");
    }
    catch(err)
    {
        res.status(400).json({message: err.message});
    }
});

module.exports = router;