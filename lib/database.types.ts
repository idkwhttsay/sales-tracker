export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            sales: {
                Row: {
                    id: string
                    price: number
                    comment: string | null
                    date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    price: number
                    comment?: string | null
                    date: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    price?: number
                    comment?: string | null
                    date?: string
                    created_at?: string
                }
                Relationships: []
            }
        }
        Views: {}
        Functions: {}
        Enums: {}
        CompositeTypes: {}
    }
}