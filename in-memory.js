//part 1//
import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

let products = [
  {"id": 1, "name": "Laptop", "price": 10000},
  {"id": 2, "name": "Headphones", "price": 2000},
  {"id": 3, "name": "Smartphone", "price": 30000}
];

app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const searchProduct = products.find(product => product.id === id);
  console.log(searchProduct);
  
  if (!searchProduct) {
    return res.status(404).json({message: "Product not found"});
  } else {
    return res.status(200).json(searchProduct);
  }
});

//part 2//

app.post('/products', (req, res) => {
  const newID = Math.max(...products.map(p => p.id)) + 1;

  const newProduct = {
    id: newID,
    name: req.body.name,
    price: req.body.price
  };

  products.push(newProduct);
  res.status(201).json(newProduct);

});

//part 3//
app.put('/products/:id', (req,res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({message: "Product not found"});
  }

  products[productIndex].name = req.body.name;
  products[productIndex].price = req.body.price;

  res.status(200).json(products[productIndex]);

});

//part 4//
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products.splice(productIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});