const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');


//middleware
app.use(cors());
app.use(express.json());

//ROUTES

//create a todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query("Insert Into todo (description) values($1) RETURNING *", [description]);
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});
//get all todos
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * from todo");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});
//get a todo
app.get("/todo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query('SELECT * from todo where todo_id = $1', [id]);
        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});
//update a todo
app.put("/todo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updatedTodo = await pool.query("UPDATE todo SET description = $1 where todo_id = $2", [description, id]);
        res.json({
            message: "Todo updated successfully",
            data: updatedTodo.rows
        });
    } catch (err) {
        console.error(err.message);
    }
});
//delete a todo
app.delete("/todo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE from todo where todo_id = $1", [id]);
        res.json("Todo deleted successfully");
    } catch (err) {
        console.error(err.message);
    }
});

// app.use(express.static(path.join(__dirname, "./client/build")));

// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "./client/build/index.html"));
// });

app.listen((4000), () => {
    console.log('server has started on port 4000')
});