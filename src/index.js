const app = require('express')();
const mongoose = require('mongoose');

const Todo = require('./db/models/Todo');

const { json, urlencoded } = require('body-parser');

(async () => {
  app.use(json());
  app.use(urlencoded({ extended: true }));

  mongoose
    .connect('mongodb://localhost:27017/todos-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => console.log('Database is connect'))
    .catch(e => console.error(e));

  app.get('/api', (req, res) => res.send('Hello World!!'));

  // Todo Crud
  app.post('/api/todo', async (req, res) => {
    const { descricao, status } = req.body;

    try {
      let todo = await Todo.findOne({ descricao });

      if (todo) {
        res.status(409).json({ error: 'Todo already exists', data: null });
      } else {
        todo = await (await Todo.create({ descricao, status })).save();

        res.status(200).json({ error: null, data: todo });
      }
    } catch (error) {
      res.status(500).json({ error, data: null });
    }
  });

  app.get('/api/todo', async (_req, res) => {
    try {
      const todos = await Todo.find();
      res.status(200).json({ error: null, data: todos });
    } catch (error) {
      res.status(500).json({ error, data: null });
    }
  });

  app.get('/api/todo/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const todo = await Todo.findById(id);
      res.status(200).json({ error: null, data: todo });
    } catch (error) {
      res.status(500).json({ error, data: null });
    }
  });

  app.put('/api/todo/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, status } = req.body;

    try {
      let todo = await Todo.findById(id);

      if (!todo) {
        res.status(404).json({ error: 'Todo not exists', data: null });
      } else {
        await Todo.findOneAndUpdate({ _id: id }, { descricao, status })
          .then(() => res.status(200).json({ error: null, data: { modified: true } }))
          .catch(e => console.error(e));
      }
    } catch (error) {
      res.status(500).json({ error, data: null });
    }
  });

  app.delete('/api/todo/:id', async (req, res) => {
    const { id } = req.params;

    try {
      let todo = await Todo.findById(id);

      if (!todo) {
        res.status(404).json({ error: 'Todo not exists', data: null });
      } else {
        await Todo.findOneAndDelete({ _id: id })
          .then(() => res.status(200).json({ error: null, data: null }))
          .catch(e => console.error(e));
      }
    } catch (error) {
      res.status(500).json({ error, data: null });
    }
  });

  app.listen(9000, () => console.log('Server running no port 9000!'));
})();
