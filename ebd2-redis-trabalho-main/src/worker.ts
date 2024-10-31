import Redis from 'ioredis';
import mysql from 'mysql2/promise';
import { conn } from "./db"
import {DataBaseChangesRepository} from "./repositories/DatabaseChangesRepository";

const databaseChangesRepo = new DataBaseChangesRepository();

// Configurações do Redis
const redis = new Redis();

// Função para processar a tabela de log
async function processDeletionLog() {

    try {
        const rows = await databaseChangesRepo.getAll();

        for (const row of rows) {
          const keyToDelete = row.key_to_delete;
    
          // Deleta a chave no Redis (substitua pelo seu código de deleção no Redis)

          console.log(`Chave ${keyToDelete} deletada do Redis`);
    
          // Remove a entrada do log após a deleção
          await conn.execute('DELETE FROM deletion_log WHERE id = ?', [row.id]);
        }
      } catch (error) {
        console.error('Erro ao processar a tabela de log:', error);
      } finally {
        await conn.end();
      }
}

// Função principal para monitorar a tabela de log periodicamente
async function main() {
  while (true) {
    await processDeletionLog();
    // Espera 5 segundos antes de verificar novamente
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

main().catch(console.error);