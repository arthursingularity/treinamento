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

    const { filial, setor, codBem, descBem, status, tipoMan, obs } = body

    const pool = await getPool()

    await pool.request()
      .input('filial', filial)
      .input('setor', setor)
      .input('codBem', codBem)
      .input('descBem', descBem)
      .input('status', status)
      .input('tipoMan', tipoMan)
      .input('obs', obs)
      .query(`
        INSERT INTO STJ010
          (TJ_FILIAL, TJ_SETOR, TJ_CODBEM, TJ_DESCBEM, TJ_STATUS, TJ_TIPOMAN, TJ_OBS, TJ_PRIOR)
        VALUES
          (@filial, @setor, @codBem, @descBem, @status, @tipoMan, @obs, '999')
    `)

    return NextResponse.json(
      { message: 'OS gerada com sucesso!' }
    )
  } catch (error) {
    console.error('Erro interno no servidor:', error)

    return NextResponse.json(
      { message: 'Erro interno no servidor.' },
      { status: 500 }
    )
  }
}