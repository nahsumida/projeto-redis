import Redis from 'ioredis';
import { Product } from "./models/product";

 // Cria uma instância do cliente Redis que se conecta ao servidor Redis local (por padrão, localhost:6379)
export const redis = new Redis();

// Função para definir um valor em uma chave
export async function setValue(key: string, value: Product): Promise<void> {
  const valueAsString = JSON.stringify(value);

    await redis.set(key, valueAsString);
    console.log(`Chave ${key} definida com valor ${value}`);
  }

// Função para obter um valor de uma chave
export async function getValue(key: string): Promise<string | null> {
  const value = await redis.get(key);
  console.log(`Valor da chave ${key}: ${value}`);
  return value;
}

// Função para excluir um valor de uma chave
export async function deleteValue(key: string): Promise<void> {
    await redis.del(key);
    console.log(`Chave ${key} excluida`);
}


// Função para obter um valor de uma chave
export async function getAllCache(): Promise<Product[] | null> {
  let products : Product[] = []
  const keys = await redis.keys('*');
  for (const key of keys){
    const value = await redis.get(key);
    const valueParsed : Product = JSON.parse(value!);

    products.push(valueParsed)
  }
  return products;
}