import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

let products = [
  { "id": 1, "name": "Laptop", "price": 10000 },
  { "id": 2, "name": "Headphones", "price": 2000 },
  { "id": 3, "name": "Smartphone", "price": 30000 }
];

app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const searchProduct = products.find(product => product.id === id);
  console.log(searchProduct);

  if (!searchProduct) {
    return res.status(404).json({ message: "Product not found" });
  } else {
    return res.status(200).json(searchProduct);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

//Part 2: Creating a Product (POST method)
app.post('/products', (req, res) => {
  const newId = Math.max(...products.map(p => p.id)) + 1;

  const newProduct = {
    id: newId,
    name: req.body.name,
    price: req.body.price
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

//Part 3: Updating a Product (PUT method)
app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products[productIndex].name = req.body.name;
  products[productIndex].price = req.body.price;

  res.status(200).json(products[productIndex]);
});

//Part 4: Deleting a Product (DELETE method)
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products.splice(productIndex, 1);
  res.status(204).send();
});
