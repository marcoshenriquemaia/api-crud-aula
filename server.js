const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 3333;

const app = express()

app.use(cors());
app.use(express.json());

const generateID = (limit) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

  let id = ''

  for(let i = 0; i < limit; i++){
    const randomNumber = Math.floor(Math.random() * 35)

    id += characters[randomNumber]
  }

  return id
}

const todo = {
  data: [],
  create: (task) => {
    const taskList = todo.read();
    const _id = generateID(40);

    taskList.push({ done: false, ...task, _id });

    todo.data = taskList;

    return todo.read()
  },
  read: () => {
    return [...todo.data];
  },
  update: (id, newData) => {
    const taskList = todo.read()
    const newTaskList = taskList.map(task => {
      if (task._id !== id){
        return task
      } else {
        return { ...task, ...newData }
      }
    })

    todo.data = newTaskList

    return todo.read()
  },

  toggleTask: (id) => {
    const taskList = todo.read()
    const newTaskList = taskList.map(task => {
      if (task._id !== id){
        return task
      } else {
        const done = task.done
        
        return { ...task, done: !done }
      }
    })

    todo.data = newTaskList

    return todo.read()
  },
  delete: (id) => {
    const taskList = todo.read()
    const newTaskList = taskList.filter(task => {
      return task._id !== id
    })

    todo.data = newTaskList

    return todo.read()
  },
};

app.get('/list', (req, res) => {
  const todoList = todo.read()

  return res.status(200).json(todoList)
})

app.post('/create', (req, res) => {
  const data = req.body

  const todoList = todo.create(data)

  return res.status(200).json(todoList)
})

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params

  const todoList = todo.delete(id)

  return res.status(200).json(todoList)
})

app.put('/update/:id', (req, res) => {
  const { id } = req.params
  const data = req.body

  const todoList = todo.update(id, data)

  return res.status(200).json(todoList)
})

app.put('/toggleTask/:id', (req, res) => {
  const { id } = req.params

  const todoList = todo.toggleTask(id)

  return res.status(200).json(todoList)
})

app.listen(PORT, () => {
  console.log("server on")
})