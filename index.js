const express = require('express');
const shortid = require('shortid');
const server = express();

server.use(express.json());

let users = [
  {
    id: shortid.generate(),
    name: 'Barbara Moore',
    bio: 'A back-end developer',
  },
  {
    id: shortid.generate(),
    name: 'Joe Garcia',
    bio: 'A front-end engineer',
  },
  {
    id: shortid.generate(),
    name: 'Benjamin Ransom',
    bio: 'A graphic designer',
  },
];

server.get('/', (req, res) => {
  res.status(200).send('<h1>The Server is Working!</h1>');
});

server.get('/api/users', (req, res) => {
  try {
    res.json(users);
  } catch {
    res
      .status(500)
      .json({ message: 'The users information could not be retrieved' });
  }
});

server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const selected = users.find((user) => user.id === id);
  try {
    if (selected) {
      users = users.filter((user) => user.id !== id);
      res.json(selected);
    } else {
      res.status(404).json({ message: 'There is no user with that ID.' });
    }
  } catch {
    res
      .status(500)
      .json({ message: 'The user information could not be retrieved' });
  }
});

server.post('/api/users', (req, res) => {
  const newUser = req.body;
  try {
    if (!newUser.bio || !newUser.name) {
      res
        .status(400)
        .json({ message: 'Please provide a name and bio for the user.' });
    } else {
      newUser.id = shortid.generate();
      users.push(newUser);
      res.status(201).json(newUser);
    }
  } catch {
    res.status(500).json({
      message: 'There was an error while saving the user to the database.',
    });
  }
});

server.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  try {
    if (!changes.bio || !changes.name) {
      res
        .status(400)
        .json({ message: 'Please provide a name and bio for the user.' });
    } else {
      let found = users.find((user) => user.id === id);
      if (found) {
        Object.assign(found, changes);
        res.status(200).json(found);
      } else {
        res.status(404).json({ message: 'There is no user with that ID.' });
      }
    }
  } catch {
    res
      .status(500)
      .json({ message: 'The user information could not be modified.' });
  }
});

server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const deleted = users.find((user) => user.id === id);
  try {
    if (deleted) {
      users = users.filter((user) => user.id !== id);
      res.json(deleted);
    } else {
      res.status(404).json({ message: 'There is no user with that ID.' });
    }
  } catch {
    res.status(500).json({ message: 'The user could not be removed.' });
  }
});

const PORT = 8000; // we visit http://localhost:8000/ to see the api
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
