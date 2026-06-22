import { NextResponse } from 'next/server';
import { supabase, getSettings } from '@/lib/supabase';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { nome, email, telefone, mensagem, propertyId } = await request.json();

    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios ausentes.' },
        { status: 400 }
      );
    }

    // 1. Salvar o lead no banco de dados Supabase
    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert([
        {
          nome,
          email,
          telefone,
          mensagem,
          property_id: propertyId || null,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao salvar lead no Supabase:', dbError);
      return NextResponse.json(
        { success: false, error: `Erro no banco de dados: ${dbError.message}` },
        { status: 500 }
      );
    }

    // 2. Buscar e-mail do corretor configurado nas configurações globais
    const settings = await getSettings();
    const destinationEmail = settings.email_destino;

    // 3. Enviar e-mail de notificação usando o Resend (caso a chave API esteja configurada)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && destinationEmail) {
      try {
        const resend = new Resend(resendApiKey);
        
        let propertyInfoHtml = '';
        if (propertyId) {
          // Opcional: Buscar informações do imóvel para enriquecer o e-mail
          const { data: prop } = await supabase
            .from('properties')
            .select('titulo, codigo')
            .eq('id', propertyId)
            .single();

          if (prop) {
            propertyInfoHtml = `
              <p><strong>Imóvel de Interesse:</strong> ${prop.titulo} (Código: ${prop.codigo})</p>
            `;
          }
        }

        const emailHtml = `
          <div style="font-family: sans-serif; color: #1c1917; max-width: 600px; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px;">
            <h2 style="font-family: serif; color: #c5a880; border-bottom: 1px solid #e7e5e4; padding-bottom: 12px;">Novo Lead Captado!</h2>
            <p>Você recebeu um novo contato pelo formulário do seu site:</p>
            <div style="background-color: #faf8f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 4px 0;"><strong>Nome:</strong> ${nome}</p>
              <p style="margin: 4px 0;"><strong>E-mail:</strong> ${email}</p>
              <p style="margin: 4px 0;"><strong>Telefone:</strong> ${telefone || 'Não informado'}</p>
              ${propertyInfoHtml}
              <p style="margin: 12px 0 4px 0;"><strong>Mensagem:</strong></p>
              <p style="margin: 0; white-space: pre-wrap; font-style: italic; color: #44403c;">${mensagem}</p>
            </div>
            <p style="font-size: 11px; color: #a8a29e; text-align: center; margin-top: 24px; border-top: 1px solid #e7e5e4; padding-top: 12px;">
              Este e-mail foi enviado automaticamente pelo formulário de contato do seu site imobiliário.
            </p>
          </div>
        `;

        await resend.emails.send({
          from: 'onboarding@resend.dev', // Remetente sandbox padrão do Resend
          to: destinationEmail,
          subject: `[Novo Lead] Contato de ${nome}`,
          html: emailHtml,
        });

        console.log('E-mail enviado com sucesso para:', destinationEmail);
      } catch (emailErr) {
        // Loga o erro mas não falha a requisição do usuário (o lead já está salvo no Supabase!)
        console.error('Falha ao enviar e-mail via Resend:', emailErr);
      }
    } else {
      console.warn(
        'Envio de e-mail pulado: RESEND_API_KEY ou e-mail de destino ausente.'
      );
    }

    return NextResponse.json({ success: true, lead });
  } catch (err: any) {
    console.error('Erro na API de Leads:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}
