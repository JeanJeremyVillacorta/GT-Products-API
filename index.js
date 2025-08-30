import express from 'express';

const app = express();
const port = 3000;

/* app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
}); */

app.get('/hello/:name', (req, res) => {
  const name = req.params.name;
  console.log(`Hello ${name}`);
  res.status(200).send(`Hello ${name}!`);
});

app.get('/:id', (req, res) => {
  const id = req.params.id;
  console.log(`Received ID: ${id}`);
  res.status(200).send(`Received ID: ${id}`);
});

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));