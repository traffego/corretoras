import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Cliente Supabase público (pode ser usado no cliente ou servidor)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SystemSettings {
  id: number;
  whatsapp: string;
  email_destino: string;
  cor_primaria: string;
  cor_secundaria: string;
  nome_corretora: string;
  creci: string;
  biografia_curta: string;
  biografia_longa: string;
  foto_perfil_url: string;
  logo_url: string;
}

export const FALLBACK_SETTINGS: SystemSettings = {
  id: 1,
  whatsapp: '5566999999999',
  email_destino: 'corretora@exemplo.com',
  cor_primaria: '#c5a880', // Champanhe/Dourado Terroso
  cor_secundaria: '#1c1917', // Cinza Escuro/Preto pedra
  nome_corretora: 'Gabriela Mateos',
  creci: 'CRECI 12345-F',
  biografia_curta: 'Especialista em imóveis de alto padrão e condomínios fechados em Sinop e região.',
  biografia_longa: 'Com mais de 10 anos de atuação especializada no mercado de alto padrão, Gabriela Mateos oferece um serviço de consultoria imobiliária personalizado e sob medida. Focada em identificar as melhores oportunidades em condomínios fechados e áreas nobres, Gabriela acompanha seus clientes em todas as etapas da aquisição, garantindo discrição, segurança jurídica e satisfação total.',
  foto_perfil_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  logo_url: '',
};

/**
 * Busca as configurações globais do banco de dados (tabela settings).
 * Retorna as configurações mescladas com os fallbacks caso ocorra erro ou o banco esteja vazio.
 */
export async function getSettings(): Promise<SystemSettings> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.warn('Erro ao buscar configurações no Supabase, usando valores padrão:', error?.message);
      return FALLBACK_SETTINGS;
    }

    // Mesclar valores retornados com fallback para evitar campos vazios indesejados
    return {
      id: data.id || FALLBACK_SETTINGS.id,
      whatsapp: data.whatsapp || FALLBACK_SETTINGS.whatsapp,
      email_destino: data.email_destino || FALLBACK_SETTINGS.email_destino,
      cor_primaria: data.cor_primaria || FALLBACK_SETTINGS.cor_primaria,
      cor_secundaria: data.cor_secundaria || FALLBACK_SETTINGS.cor_secundaria,
      nome_corretora: data.nome_corretora || FALLBACK_SETTINGS.nome_corretora,
      creci: data.creci || FALLBACK_SETTINGS.creci,
      biografia_curta: data.biografia_curta || FALLBACK_SETTINGS.biografia_curta,
      biografia_longa: data.biografia_longa || FALLBACK_SETTINGS.biografia_longa,
      foto_perfil_url: data.foto_perfil_url || FALLBACK_SETTINGS.foto_perfil_url,
      logo_url: data.logo_url || FALLBACK_SETTINGS.logo_url,
    };
  } catch (err) {
    console.error('Exceção ao buscar configurações:', err);
    return FALLBACK_SETTINGS;
  }
}
