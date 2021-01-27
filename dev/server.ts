import { resolve } from 'path';
import * as express from 'express';
import * as Bundler from 'parcel-bundler';
import { v4 } from 'uuid';

const bundler = new Bundler(resolve(__dirname, './index.html'), {});
const app = express();

const todos = {
  [v4()]: {
    title: 'Foo',
    content: 'Bar',
  },
};

// List todos
app.get('/api/todo', (req, res) => {
  return res.json(Object.keys(todos).map((uuid) => ({ uuid, ...todos[uuid] })));
});

// Get specified todo
app.get('/api/todo/:uuid', (req, res) => {
  if (!req.params?.uuid) {
    return res.status(400).json(new Error('Bad request'));
  }
  if (!todos[req.params.uuid]) {
    return res.status(404).json(new Error('Not found'));
  }
  return res.json({ uuid: req.params.uuid, ...todos[req.params.uuid] });
});

// Create todo
app.post('/api/todo', express.json(), (req, res) => {
  if (!req.body?.title || !req.body?.content) {
    return res.status(400).json(new Error('Bad request'));
  }

  const uuid = v4();
  const { title, content } = req.body;
  todos[uuid] = { title, content };
  return res.json({ uuid, title, content });
});

// Update specified todo
app.post('/api/todo/:uuid', express.json(), (req, res) => {
  if (!req.params?.uuid) {
    return res.status(400).json(new Error('Bad request'));
  }
  if (!todos[req.params.uuid]) {
    return res.status(404).json(new Error('Not found'));
  }

  const uuid = req.params.uuid;
  const title = req.body?.title || todos[uuid].title;
  const content = req.body?.content || todos[uuid].content;
  todos[uuid] = { title, content };
  return res.json({ uuid, title, content });
});

// Delete specified todo
app.delete('/api/todo/:uuid', (req, res) => {
  if (!req.params?.uuid) {
    return res.status(400).json(new Error('Bad request'));
  }
  if (!todos[req.params.uuid]) {
    return res.status(404).json(new Error('Not found'));
  }

  const todo = todos[req.params.uuid];
  delete todos[req.params.uuid];
  return res.json({ uuid: req.params.uuid, ...todo });
});

app.use(bundler.middleware());
app.listen(process.env.PORT || 8080);
