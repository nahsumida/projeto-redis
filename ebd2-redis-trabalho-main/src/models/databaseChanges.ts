import { RowDataPacket } from "mysql2"

export interface DatabaseChanges extends RowDataPacket {
    id?: number
    key_to_delete: string
    change_date: number
}