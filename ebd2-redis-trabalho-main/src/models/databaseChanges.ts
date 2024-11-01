import { RowDataPacket } from "mysql2"

export interface DatabaseChanges extends RowDataPacket {
    ID: number
    KEY_TO_DELETE: number
    change_date: Date
    status:string
}