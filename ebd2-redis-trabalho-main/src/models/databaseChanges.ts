import { RowDataPacket } from "mysql2"

export interface DatabaseChanges extends RowDataPacket {
    ID: number
    KEY_TO_DELETE: number
    CHANGE_DATE: Date
    STATUS:string
}