import { ResultSetHeader } from "mysql2"
import { conn } from "../db"
import { DatabaseChanges } from "../models/databaseChanges"

export class DataBaseChangesRepository {

  getAll(): Promise<DatabaseChanges[]> {
    return new Promise((resolve, reject) => {
      conn.query<DatabaseChanges[]>("SELECT * FROM DATABASE_CHANGES", (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
  }
}