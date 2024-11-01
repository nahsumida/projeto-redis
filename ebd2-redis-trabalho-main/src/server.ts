import express from "express";
import { Request, Response, Router } from "express";
import { ProductsRepository } from "./repositories/ProductsRepository";
import { main } from "./worker";
import { setValue, getValue, deleteValue, getAllCache } from './cache';
import axios from 'axios';
import { Product } from "./models/product";
import * as crypto from 'crypto';

const app = express();
const port = 3000;
const routes = express.Router();

const productsRepo = new ProductsRepository();

routes.get('/', (req: Request, res: Response) => {
    res.status(200).send("Funcionando...");
});

// Obter todos os produtos.
routes.get('/getAllProducts', async (req: Request, res: Response) => {
    try {
        const products = await getAllCache();
        res.status(200).json(products);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: "Erro ao obter todos os produtos", details: err.message });
    }
});

// Sincronizar produtos na base.
routes.get('/syncProducts', async (req: Request, res: Response) => {
    try {
        const dbProducts = await productsRepo.getAll();
        const cacheProducts = await getAllCache();
        if (cacheProducts != null) {
            const results = compareArrays(dbProducts, cacheProducts!);
            if (results.length > 0) {
                for (const result of results) {
                    setValue(result);
                }
                res.status(200).json("Cache sincronizado com sucesso");
            } else {
                res.status(200).json("Não foi necessário atualizar o cache");
            }
        } else {
            res.status(500).json({ error: "Cache não encontrado" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: "Erro ao sincronizar produtos", details: err.message });
    }
});

// Obter produto pelo ID
routes.post('/getProductByID', async (req: Request, res: Response) => {
    const id = req.body.ID as string;
    if (id) {
        try {
            let product = null;
            const cachedProduct = await getValue(id);
            if (cachedProduct != null) {
                const prodParsed: Product = JSON.parse(cachedProduct);
                product = prodParsed;
            } else {
                // Fallback
                const dbProduct = await productsRepo.getById(Number(id));
                if (dbProduct != undefined) {
                    product = dbProduct;
                    await setValue(dbProduct);
                }
            }
            res.status(200).json(product);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: "Erro ao obter produto pelo ID", details: err.message });
        }
    } else {
        res.status(400).json({ error: "ID não fornecido ou inválido" });
    }
});

// Inserir produto
routes.put('/insertProduct', async (req: Request, res: Response) => {
    const prod: Product = req.body;
    console.log(prod)
    if (prod.DESCRIPTION == "" || prod.NAME == "") {
        res.status(400).json({ error: "Preencha com valores válidos para description, name e price" });
        return;
    }
    try {
        const product = await productsRepo.create(prod);
        if (product) {
            // Salva o hash apenas no cache
            product.HASH = calculateHash(product);
            await setValue(product);
            res.status(200).json(product);
        } else {
            res.status(500).json({ error: "Erro ao inserir produto" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: "Erro ao inserir produto aqui", details: err.message });
    }
});

// Atualizar produto
routes.post('/updateProduct', async (req: Request, res: Response) => {
    const prod: Product = req.body;
    console.log(prod)

    if (prod.ID == null) {
        res.status(400).json({ error: "Digite um ID válido" });
        return;
    } else if (prod.DESCRIPTION == "" || prod.NAME == "" || prod.PRICE == null ) {
        res.status(400).json({ error: "Preencha com valores válidos para os campos description, name e/ou price" });
        return;
    }
    try {
        const product = await productsRepo.update(prod);
        if (product) {
            // Salva o hash apenas no cache
            product.HASH = calculateHash(product);
            await setValue(product);
            res.status(200).json(product);
        } else {
            res.status(500).json({ error: "Erro ao atualizar produto - Produto não encontrado" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: "Erro ao atualizar produto", details: err.message });
    }
});

// Deletar produto
routes.delete('/deleteProduct', async (req: Request, res: Response) => {
    const id = req.body.ID as string;
    if (id) {
        try {
            await deleteValue(id);
            await productsRepo.delete(Number(id));
            res.status(200).json(`Produto ${id} deletado com sucesso`);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: "Erro ao deletar produto", details: err.message });
        }
    } else {
        res.status(400).json({ error: "ID não fornecido ou inválido" });
    }
});

app.use(express.json());

app.use(routes);

app.listen(port, async () => {
    console.log("Server is running on 3000");

    // Chama a função para atualizar o cache com a última versão do banco
    await callSyncProducts();
});

const callSyncProducts = async () => {
    try {
        await axios.get("http://localhost:3000/syncProducts");
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
