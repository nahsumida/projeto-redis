import Redis from 'ioredis';
import { conn } from "./db"
import {DataBaseChangesRepository} from "./repositories/DatabaseChangesRepository";
import {deleteValue} from './cache';

const databaseChangesRepo = new DataBaseChangesRepository();

// Função para processar a tabela de log
async function processDatabaseChanges() {
    try {
        const rows = await databaseChangesRepo.getAll();

        for (const row of rows) {
          const keyToDelete = row.KEY_TO_DELETE

          // Deleta a chave no Redis 
          await deleteValue(keyToDelete.toString())
          console.log(`Chave ${keyToDelete} deletada do Redis`);
    
          // Remove a entrada do log após a deleção
          await databaseChangesRepo.delete(keyToDelete)
        }
      } catch (error) {
        console.error('Erro ao processar a tabela de log:', error);
      }
}

// Função principal para monitorar a tabela de log periodicamente
export async function main() {
  while (true) {
    await processDatabaseChanges();
  }
}

main().catch(console.error);