/**
 * Script de cadastro de imóveis no Supabase
 * Faz upload das fotos locais para o Storage e insere os dados no banco.
 * 
 * Execução: node scripts/seed-imoveis.mjs
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = 'https://ycuhmjaaqsbojqyplbwe.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdWhtamFhcXNib2pxeXBsYndlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjEzODg4NCwiZXhwIjoyMDk3NzE0ODg0fQ.OkIg27GEGEd2WOjPbcz2uTZxUQQKxpH3gAUr339LfvU'
const STORAGE_BUCKET = 'imoveis'
const DADOS_DIR = path.join(__dirname, '..', 'dados')

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// ─── DADOS DOS IMÓVEIS ─────────────────────────────────────────────────────────
// Print do Instagram identificado como arquivo de menor tamanho ou fora do padrão.
// Esses arquivos serão IGNORADOS no upload (são prints de tela, não fotos do imóvel).
const PRINTS_INSTAGRAM = {
  imovel1: 'WhatsApp Image 2026-06-22 at 20.53.42 (1).jpeg',
  imovel2: 'WhatsApp Image 2026-06-22 at 20.54.09 (3).jpeg',
  imovel5: 'WhatsApp Image 2026-06-22 at 20.55.49 (3).jpeg',
}

const IMOVEIS = [
  {
    pasta: 'imovel1',
    slug: 'casa-parque-das-mansoes',
    titulo: 'Casa no Parque das Mansões',
    codigo: 'PA001',
    tipo: 'casa',
    finalidade: 'venda',
    preco: 1800000,
    bairro: 'Parque das Mansões',
    condominio: null,
    cidade: 'Sinop',
    area_total: null,
    area_construida: null,
    quartos: 3,
    suites: 3,
    banheiros: 2,
    vagas: 2,
    descricao: `Imóvel à Venda no Parque das Mansões ✨\n\nMóveis planejados e ar condicionado\n\n• 3 Suítes sendo 1 com Closet\n• Sala TV\n• Área gourmet ampla\n• Lavabo\n• Garagem para 2 carros`,
    destaque: true,
    ativo: true,
  },
  {
    pasta: 'imovel2',
    slug: 'casa-porteira-fechada-250m2',
    titulo: 'Casa Porteira Fechada – 250m²',
    codigo: 'PA002',
    tipo: 'casa',
    finalidade: 'venda',
    preco: 0, // Preço sob consulta (não divulgado no post)
    bairro: 'A consultar',
    condominio: null,
    cidade: 'Sinop',
    area_total: null,
    area_construida: 250,
    quartos: 3,
    suites: 1,
    banheiros: 3,
    vagas: 2,
    descricao: `Imóvel à Venda de Porteira Fechada ✨\n\nCom aproximadamente 250m² de área construída, esta casa foi planejada para oferecer ambientes modernos, elegantes e funcionais para toda a família.\n\n• 01 suíte planejada\n• 02 quartos\n• Banheiro social\n• Escritório\n• Roupeiro no corredor\n• Sala integrada\n• Cozinha gourmet com churrasqueira\n• Despensa\n• Lavabo + banheiro social\n• Piscina com hidromassagem e cascata\n• Garagem ampla\n\nUm imóvel imponente, pronto para morar e viver momentos inesquecíveis.`,
    destaque: true,
    ativo: true,
  },
  {
    pasta: 'imovel4',
    slug: 'casa-289m2-energia-solar',
    titulo: 'Casa 289m² com Energia Solar',
    codigo: 'PA004',
    tipo: 'casa',
    finalidade: 'venda',
    preco: 2200000,
    bairro: 'A consultar',
    condominio: null,
    cidade: 'Sinop',
    area_total: 490,
    area_construida: 289,
    quartos: 3,
    suites: 3,
    banheiros: 3,
    vagas: 2,
    descricao: `Casa à Venda – Alto Padrão ✨\n\nTerreno: 490m² | Construção: 289m²\n\n• 3 Suítes sendo 1 com Closet\n• Sala\n• Área gourmet\n• Lavanderia\n• Despensa\n• Lavabo\n• Energia solar\n\nR$ 2.200.000,00`,
    destaque: true,
    ativo: true,
  },
  {
    pasta: 'imovel5',
    slug: 'casa-buritis-i',
    titulo: 'Casa no Buritis I',
    codigo: 'PA005',
    tipo: 'casa',
    finalidade: 'venda',
    preco: 630000,
    bairro: 'Buritis I',
    condominio: null,
    cidade: 'Tangara da Serra',
    area_total: null,
    area_construida: null,
    quartos: 3,
    suites: 1,
    banheiros: 2,
    vagas: 2,
    descricao: `🏠 CASA À VENDA | BURITIS I 🏠\n\nSe você procura conforto, praticidade e economia no dia a dia, essa casa é perfeita para você! ✨\n\n📍 Localizada no Buritis I\n📐 Terreno: 11x25\n\nO imóvel conta com:\n• Sala de estar\n• Cozinha\n• Área gourmet\n• Lavanderia\n• 1 suíte + 2 quartos\n• Energia solar\n• Garagem para 2 carros\n\nAmbientes bem distribuídos, excelente aproveitamento de espaço e pronta para viver momentos especiais em família.\n\n💰 Valor: R$ 630.000,00`,
    destaque: false,
    ativo: true,
  },
]

// ─── FUNÇÕES AUXILIARES ────────────────────────────────────────────────────────

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const mimes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  }
  return mimes[ext] || 'image/jpeg'
}

function sanitizeFileName(filename) {
  return filename
    .replace(/\s+/g, '_')
    .replace(/[()]/g, '')
    .toLowerCase()
}

async function ensureBucketExists() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === STORAGE_BUCKET)
  if (!exists) {
    console.log(`📦 Criando bucket "${STORAGE_BUCKET}"...`)
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, { public: true })
    if (error) throw new Error(`Erro ao criar bucket: ${error.message}`)
    console.log('✅ Bucket criado!')
  } else {
    console.log(`📦 Bucket "${STORAGE_BUCKET}" já existe.`)
  }
}

async function uploadImagem(localPath, storagePath) {
  const buffer = fs.readFileSync(localPath)
  const mimeType = getMimeType(localPath)

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: true,
    })

  if (error) throw new Error(`Erro ao fazer upload de ${storagePath}: ${error.message}`)

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

async function limparBanco() {
  console.log('\n🗑️  Limpando imóveis existentes no banco...')
  // property_images é deletado em cascade automaticamente
  const { error } = await supabase.from('properties').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) throw new Error(`Erro ao limpar banco: ${error.message}`)
  console.log('✅ Banco limpo!')
}

async function limparStorage() {
  console.log('\n🗑️  Limpando storage existente...')
  const { data: files } = await supabase.storage.from(STORAGE_BUCKET).list('', { limit: 1000 })
  if (files && files.length > 0) {
    for (const file of files) {
      if (file.name) {
        // Lista subpastas
        const { data: subFiles } = await supabase.storage.from(STORAGE_BUCKET).list(file.name, { limit: 1000 })
        if (subFiles && subFiles.length > 0) {
          const paths = subFiles.map(f => `${file.name}/${f.name}`)
          await supabase.storage.from(STORAGE_BUCKET).remove(paths)
        }
      }
    }
  }
  console.log('✅ Storage limpo!')
}

// ─── EXECUÇÃO PRINCIPAL ────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Iniciando cadastro de imóveis...\n')

  await ensureBucketExists()
  await limparBanco()
  await limparStorage()

  for (const imovel of IMOVEIS) {
    console.log(`\n📁 Processando ${imovel.pasta} — "${imovel.titulo}"`)

    const pastaLocal = path.join(DADOS_DIR, imovel.pasta)
    const printParaIgnorar = PRINTS_INSTAGRAM[imovel.pasta]

    // 1. Inserir imóvel no banco
    const { data: propData, error: propError } = await supabase
      .from('properties')
      .insert({
        slug: imovel.slug,
        titulo: imovel.titulo,
        codigo: imovel.codigo,
        tipo: imovel.tipo,
        finalidade: imovel.finalidade,
        preco: imovel.preco,
        bairro: imovel.bairro,
        condominio: imovel.condominio,
        cidade: imovel.cidade,
        area_total: imovel.area_total,
        area_construida: imovel.area_construida,
        quartos: imovel.quartos,
        suites: imovel.suites,
        banheiros: imovel.banheiros,
        vagas: imovel.vagas,
        descricao: imovel.descricao,
        destaque: imovel.destaque,
        ativo: imovel.ativo,
      })
      .select('id')
      .single()

    if (propError) throw new Error(`Erro ao inserir ${imovel.pasta}: ${propError.message}`)
    const propertyId = propData.id
    console.log(`  ✅ Imóvel inserido. ID: ${propertyId}`)

    // 2. Listar e fazer upload das fotos
    const arquivos = fs.readdirSync(pastaLocal)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .filter(f => f !== printParaIgnorar) // ignora o print do instagram
      .sort()

    console.log(`  📸 ${arquivos.length} fotos para upload (ignorando print do Instagram)`)

    const imageUrls = []
    for (let i = 0; i < arquivos.length; i++) {
      const arquivo = arquivos[i]
      const localPath = path.join(pastaLocal, arquivo)
      const storagePath = `${imovel.pasta}/${sanitizeFileName(arquivo)}`

      process.stdout.write(`  ⬆️  [${i + 1}/${arquivos.length}] ${arquivo}... `)
      const url = await uploadImagem(localPath, storagePath)
      imageUrls.push({ url, ordem: i })
      console.log('✓')
    }

    // 3. Inserir registros de imagens
    if (imageUrls.length > 0) {
      const imagens = imageUrls.map(({ url, ordem }) => ({
        property_id: propertyId,
        url,
        ordem,
      }))

      const { error: imgError } = await supabase.from('property_images').insert(imagens)
      if (imgError) throw new Error(`Erro ao inserir imagens de ${imovel.pasta}: ${imgError.message}`)
      console.log(`  ✅ ${imageUrls.length} imagens cadastradas!`)
    }
  }

  console.log('\n\n🎉 Todos os imóveis foram cadastrados com sucesso!')
  console.log('📊 Resumo:')
  IMOVEIS.forEach(i => console.log(`  • ${i.codigo} — ${i.titulo} — R$ ${i.preco.toLocaleString('pt-BR')}`))
}

main().catch(err => {
  console.error('\n❌ ERRO:', err.message)
  process.exit(1)
})
