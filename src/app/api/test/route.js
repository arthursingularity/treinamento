import { NextResponse } from 'next/server';
import { connectToDatabase } from '../dbConnect';

export async function GET() {
    try {
        const pool = await connectToDatabase();

        const result = await pool.request().query('SELECT 1 + 1 AS resultado');
        
        return NextResponse.json({ 
            status: 'Conectado com sucesso!', 
            data: result.recordset 
        });
    } catch (error) {
        return NextResponse.json({ 
            status: 'Erro na conexão', 
            error: error.message 
        }, { status: 500 });
    }
}