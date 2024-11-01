import Redis from 'ioredis';
import { conn } from "./db"
import {DataBaseChangesRepository} from "./repositories/DatabaseChangesRepository";

const databaseChangesRepo = new DataBaseChangesRepository();

// Configurações do Redis
const redis = new Redis();

// Função para processar a tabela de log
async function processDeletionLog() {
    try {
        const rows = await databaseChangesRepo.getAll();
        console.log(rows)

        for (const row of rows) {
          console.log(row)

          const keyToDelete = row.KEY_TO_DELETE
    
          // Deleta a chave no Redis (substitua pelo seu código de deleção no Redis)

          console.log(`Chave ${keyToDelete} deletada do Redis`);
    
          // Remove a entrada do log após a deleção
          //await conn.execute('DELETE FROM databaseChanges WHERE id = ?', [row.id]);
          await databaseChangesRepo.delete(keyToDelete)
        }
      } catch (error) {
        console.error('Erro ao processar a tabela de log:', error);
      } finally {
        await conn.end();
      }
}

// Função principal para monitorar a tabela de log periodicamente
export async function main() {
  while (true) {
    await processDeletionLog();
    // Espera 5 segundos antes de verificar novamente
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

main().catch(console.error);