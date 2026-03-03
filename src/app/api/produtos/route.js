import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
    try {
        const pool = await getPool();
        const resultado = await pool.request().query('SELECT * FROM PRODUTOS');
        return NextResponse.json(resultado.recordset);
    } catch (erro) {
        return NextResponse.json({ error: erro.message }, { status: 500 });
    }
}
