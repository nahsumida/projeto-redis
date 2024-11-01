import express from "express";
import { Request, Response, Router } from "express";
import {ProductsRepository} from "./repositories/ProductsRepository";
import {main} from "./worker";
import {setValue, getValue, deleteValue, getAllCache} from './cache';
import axios from 'axios';
import {Product} from "./models/product";
import * as crypto from 'crypto';

const app = express();
const port = 3000;
const routes = express.Router();

const productsRepo = new ProductsRepository();

routes.get('/', (req: Request, res: Response)=>{
    res.statusCode = 200;
    res.send("Funcionando...");
});

// obter todos os produtos.
routes.get('/getAllProducts', async(req: Request, res: Response)=>{    
    const products = await getAllCache();

    res.statusCode = 200; 
    res.type('application/json')
    res.send(products);
});

// syncar produtos na base.
routes.get('/syncProducts', async(req: Request, res: Response)=>{
    const dbProducts = await productsRepo.getAll();
    const cacheProducts = await getAllCache();

    if (cacheProducts != null){
        const results = compareArrays(dbProducts, cacheProducts!);
        if (results.length > 0){
            for(const result of results){
                setValue(result.ID!.toString(), result)
            }

            res.statusCode = 200; 
            res.type('application/json')
            res.send("Cache syncado com sucesso");
        } else{
            res.statusCode = 200; 
            res.type('application/json')
            res.send("Não foi necessário atualizar o cache");
        }
    }

});

// obter produto pelo id
routes.post('/getProductByID', async(req: Request, res: Response)=>{
    const id = req.body.ID as string

    if (id != undefined){
        var product = null;

        const cachedProduct = await getValue(id)
        if (cachedProduct != null){
            const prodParsed : Product = JSON.parse(cachedProduct);
            product = prodParsed
        } else {
            //fallback
            const dbProduct = await productsRepo.getById(Number(id));
    
            if (dbProduct != undefined){
                product = dbProduct
    
                var prodID = dbProduct.ID!.toString()
                await setValue(prodID,dbProduct)
            }
        }
            
        res.statusCode = 200;
        res.type('application/json')
        res.send(product);
    } else{
        res.statusCode = 500; 
        res.type('application/json')
        res.send("deu erro");
    }
});

routes.put('/insertProduct', async(req: Request, res: Response)=>{
    const prod : Product = req.body
    
    if(prod.DESCRIPTION == null || prod.NAME == null || prod.PRICE == null){
        res.statusCode = 400; 
        res.type('application/json')
        res.send("Preencha com valores de description name e price validos");   
    }

    const product = await productsRepo.create(prod);

    if (product != null && product != undefined){
        // salva o hash apenas no cache
        product!.HASH = calculateHash(prod)
        await setValue(product!.ID!.toString(), product!)
    }
    res.statusCode = 200; 
    res.type('application/json')
    res.send(product);
});

routes.post('/updateProduct', async(req: Request, res: Response)=>{
    const prod : Product = req.body

    if (prod.ID == null){
        res.statusCode = 400; 
        res.type('application/json')
        res.send("Digite um id valido")
    } else if(prod.DESCRIPTION == null || prod.NAME == null || prod.PRICE == null){
        res.statusCode = 400; 
        res.type('application/json')
        res.send("Preencha com valores de description name e price validos");
    }

    const product = await productsRepo.update(prod);

        // salva o hash apenas no cache
        prod!.HASH = calculateHash(prod)
        await setValue(prod!.ID!.toString(), prod!)

    res.statusCode = 200; 
    res.type('application/json')
    res.send(product);
});

routes.delete('/deleteProduct', async(req: Request, res: Response)=>{
    const id = req.body.ID as string

    if (id != undefined){
        await deleteValue(id)
        await productsRepo.delete(Number(id))

        res.statusCode = 200;
        res.type('application/json')
        res.send(`Produto ${id} deletado com sucesso`);
    } else{
        res.statusCode = 500; 
        res.type('application/json')
        res.send("deu erro");
    }
});

// aplicar as rotas na aplicação web backend. 
app.use(express.json());
app.use(routes);

app.listen(port, async ()=>{
    console.log("Server is running on 3000");

    //chama a funcao para atualizar o cache com a ultima versão do banco
    await callSyncProducts();
});

const callSyncProducts = async () => {
    try {
      const dbResponse = await axios.get("http://localhost:3000/syncProducts");
    } catch (error) {
      console.error('Error calling /syncProducts:', error);
    }
};

function calculateHash(product: Product): string {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(product));
    return hash.digest('hex');
}

function compareArrays(array1: Product[], array2: Product[]): Product[] {
    const result: Product[] = [];
  
    // Calcular o hash dos itens do array1
    const array1WithHash = array1.map(item => ({
      ...item,
      HASH: calculateHash(item)
    }));
  
    // Verificar os critérios
    array1WithHash.forEach(item1 => {
      const item2 = array2.find(item => item.ID === item1.ID);
  
      // Incluir no resultado se o item não existir no array2 ou se os hashes forem diferentes
      if (!item2 || item1.HASH !== item2.HASH) {
        result.push(item1);
      }
    });
  
    return result;
  }

/*
O worker havia sido criado para resolver o problema de alterações feitas diretamente no banco sem passar pelo 
sistema, como o requisito foi removido o trecho foi comentado. 

const worker = async () => {
    console.log('Função chamada:', new Date().toLocaleTimeString());

    // Adicione aqui a lógica que você deseja executar
    await main();
};

// Configurar o intervalo para chamar a função a cada 30 segundos (30000 milissegundos)
setInterval(worker, 30000);
// Manter o processo rodando
console.log('Worker iniciado. A função será chamada a cada 30 segundos.');
*/