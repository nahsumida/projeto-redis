import { ResultSetHeader } from "mysql2"
import { conn } from "../db"
import { DatabaseChanges } from "../models/databaseChanges"

export class DataBaseChangesRepository {

  getAll(): Promise<DatabaseChanges[]> {
    return new Promise((resolve, reject) => {
      conn.query<DatabaseChanges[]>("SELECT * FROM databaseChanges", (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
  }

  delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        "DELETE FROM databaseChanges WHERE key_to_delete = ?",
        [id],
        (err, res) => {
          if (err) reject(err)
          else resolve(res.affectedRows)
        }
      )
    })
  }
}