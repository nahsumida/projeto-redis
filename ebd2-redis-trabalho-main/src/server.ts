import express from "express";
import { Request, Response, Router } from "express";
import {ProductsRepository} from "./repositories/ProductsRepository";
import {main} from "./worker";
import {setValue, getValue} from './cache';


const app = express();
const port = 3000;
const routes = Router();

const productsRepo = new ProductsRepository();
/*
const callGetAllProducts = async () => {
  try {
    const response = await axios.get("http://localhost:3000/getAllProducts");
    console.log('Response from /getAllProducts:', response.data);
  } catch (error) {
    console.error('Error calling /getAllProducts:', error);
  }
};*/

routes.get('/', (req: Request, res: Response)=>{
    res.statusCode = 200;
    res.send("Funcionando...");
});

routes.get('/getAllProducts', async(req: Request, res: Response)=>{
    // obter todos os produtos.

    const products = await productsRepo.getAll();
    console.log(products)
    for (const product of products) {
        if (product.ID !== undefined) {
            const productIdAsString = product.ID.toString();
            await setValue(productIdAsString, product); // Passa o ID convertido para string de forma explícita
        } else {
            console.error("Produto sem ID encontrado:", product);
        }
    }
    res.statusCode = 200; 
    res.type('application/json')
    res.send(products);
});


routes.post('/getProductByID', async(req: Request, res: Response)=>{
    // obter todos os produtos.
    const id = req.body.id

    //const products = await productsRepo.getById(id);
        const product =await getValue(id)
        
    res.statusCode = 200; 
    res.type('application/json')
    res.send(product);
});


routes.put('/insertProduct', async(req: Request, res: Response)=>{
    // obter todos os produtos.
    const products = await productsRepo.getAll();
    res.statusCode = 200; 
    res.type('application/json')
    res.send(products);
});

routes.post('/updateProduct', async(req: Request, res: Response)=>{
    // obter todos os produtos.
    const products = await productsRepo.getAll();
    res.statusCode = 200; 
    res.type('application/json')
    res.send(products);
});


routes.delete('/deleteProduct', async(req: Request, res: Response)=>{
    // obter todos os produtos.
    const products = await productsRepo.getAll();
    res.statusCode = 200; 
    res.type('application/json')
    res.send(products);
});

// aplicar as rotas na aplicação web backend. 
app.use(routes);

app.listen(port, async ()=>{
    console.log("Server is running on 3000");
    //await main();
    //await callGetAllProducts();
});
