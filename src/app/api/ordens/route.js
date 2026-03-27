import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT * FROM STJ010
    `;

    const pool = await getPool();

    const result = await pool.request().query(query);

    return NextResponse.json(result.recordset, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar ordens:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar ordens de serviço.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const { produto, descricao } = body

    const pool = await getPool()

    await pool.request()
      .input('produto', produto)
      .input('descricao', descricao)
      .query(`
        INSERT INTO PRODUTOS (PRODUTO, DESCRICAO) VALUES (@produto, @descricao)  
      `)

    return NextResponse.json(
      { message: 'Produto cadastrado com sucesso!' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erro ao cadastrar produto:', error)

    return NextResponse.json(
      { error: 'Erro interno ao cadastrar produto.' },
      { status: 500 }
    )
  }
}