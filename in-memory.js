// //part 1//
// import express from 'express';

// const app = express();
// const port = 3000;

// app.use(express.json());

// let products = [
//   {"id": 1, "name": "Laptop", "price": 10000},
//   {"id": 2, "name": "Headphones", "price": 2000},
//   {"id": 3, "name": "Smartphone", "price": 30000}
// ];

// app.get('/products/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const searchProduct = products.find(product => product.id === id);
//   console.log(searchProduct);
  
//   if (!searchProduct) {
//     return res.status(404).json({message: "Product not found"});
//   } else {
//     return res.status(200).json(searchProduct);
//   }
// });

// //part 2//

// app.post('/products', (req, res) => {
//   const newID = Math.max(...products.map(p => p.id)) + 1;

//   const newProduct = {
//     id: newID,
//     name: req.body.name,
//     price: req.body.price
//   };

//   products.push(newProduct);
//   res.status(201).json(newProduct);

// });

// //part 3//
// app.put('/products/:id', (req,res) => {
//   const id = parseInt(req.params.id);
//   const productIndex = products.findIndex(p => p.id === id);

//   if (productIndex === -1) {
//     return res.status(404).json({message: "Product not found"});
//   }

//   products[productIndex].name = req.body.name;
//   products[productIndex].price = req.body.price;

//   res.status(200).json(products[productIndex]);

// });

// //part 4//
// app.delete('/products/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const productIndex = products.findIndex(p => p.id === id);

//     if (productIndex === -1) {
//         return res.status(404).json({ message: "Product not found" });
//     }

//     products.splice(productIndex, 1);
//     res.status(204).send();
// });



//For Post//

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/posts', postRoutes);

// In-memory "database"
let posts = [
    { id: 1, title: 'First Post', content: 'This is the first post.' },
    { id: 2, title: 'Second Post', content: 'This is the second post.' }
];
let nextId = 3;

// POST /posts (adds a new post to the array)
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }
    const newPost = { id: nextId++, title, content };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// GET /posts (returns the full array)
app.get('/posts', (req, res) => {
    res.json(posts);
});

// GET /posts/:id (finds and returns a single post)
app.patch('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    posts[postIndex] = { ...posts[postIndex], ...req.body };
    res.json(posts[postIndex]);
});

// PUT /posts/:id (finds and updates a post)
app.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    const { title, content } = req.body;
    posts[postIndex] = { ...posts[postIndex], title: title || posts[postIndex].title, content: content || posts[postIndex].content };
    res.json(posts[postIndex]);
});

// DELETE /posts/:id (removes a post from the array)
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    posts.splice(postIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});