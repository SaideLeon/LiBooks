'use server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    // Encaminha o arquivo para o serviço de upload externo
    const externalUploaderFormData = new FormData();
    externalUploaderFormData.append('file', file);
    
    const uploadResponse = await fetch('https://uploader.nativespeak.app/upload', {
      method: 'POST',
      body: externalUploaderFormData,
    });

    if (!uploadResponse.ok) {
      const errorBody = await uploadResponse.text();
      console.error('Erro do serviço de upload externo:', errorBody);
      return NextResponse.json({ error: 'Falha ao fazer upload do arquivo para o serviço externo.' }, { status: uploadResponse.status });
    }

    const uploadResult = await uploadResponse.json();

    return NextResponse.json(uploadResult, { status: 200 });

  } catch (error) {
    console.error('Erro no proxy de upload:', error);
    return NextResponse.json({ error: 'Ocorreu um erro interno no servidor.' }, { status: 500 });
  }
}
