export interface WatermarkSettings {
  marca_agua_url: string | null;
  marca_agua_posicao: 'centro' | 'canto-inferior-direito' | 'canto-inferior-esquerdo' | 'canto-superior-direito' | 'canto-superior-esquerdo';
  marca_agua_opacidade: number;
  marca_agua_tamanho: number;
  marca_agua_ativa: boolean;
}

/**
 * Carrega um arquivo File ou URL em um elemento HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Falha ao carregar imagem: ' + err));
    img.src = src;
  });
}

/**
 * Carrega um File (do upload) como DataURL
 */
function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Aplica a marca d'água em um arquivo de imagem usando a API Canvas
 */
export async function applyWatermark(file: File, settings: WatermarkSettings): Promise<File> {
  // Se não estiver ativa ou não tiver URL da marca d'água, retornar o próprio arquivo sem modificação
  if (!settings.marca_agua_ativa || !settings.marca_agua_url) {
    return file;
  }

  try {
    // 1. Carregar imagem original e marca d'água
    const originalDataUrl = await fileToDataURL(file);
    const [originalImg, watermarkImg] = await Promise.all([
      loadImage(originalDataUrl),
      loadImage(settings.marca_agua_url)
    ]);

    // 2. Criar canvas com tamanho idêntico ao original
    const canvas = document.createElement('canvas');
    canvas.width = originalImg.width;
    canvas.height = originalImg.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Não foi possível obter contexto 2D do Canvas.');
    }

    // 3. Desenhar imagem original
    ctx.drawImage(originalImg, 0, 0);

    // 4. Calcular tamanho proporcional da marca d'água
    // O tamanho é relativo à largura da imagem original (ex: 20% da largura)
    const wWidth = originalImg.width * settings.marca_agua_tamanho;
    const wHeight = (watermarkImg.height / watermarkImg.width) * wWidth;

    // Margem dinâmica (5% do tamanho da marca ou 24px fixos)
    const padding = Math.max(24, originalImg.width * 0.02);

    // 5. Calcular posição X e Y
    let x = 0;
    let y = 0;

    switch (settings.marca_agua_posicao) {
      case 'centro':
        x = (originalImg.width - wWidth) / 2;
        y = (originalImg.height - wHeight) / 2;
        break;
      case 'canto-inferior-direito':
        x = originalImg.width - wWidth - padding;
        y = originalImg.height - wHeight - padding;
        break;
      case 'canto-inferior-esquerdo':
        x = padding;
        y = originalImg.height - wHeight - padding;
        break;
      case 'canto-superior-direito':
        x = originalImg.width - wWidth - padding;
        y = padding;
        break;
      case 'canto-superior-esquerdo':
        x = padding;
        y = padding;
        break;
      default:
        // Canto inferior direito por padrão
        x = originalImg.width - wWidth - padding;
        y = originalImg.height - wHeight - padding;
    }

    // 6. Aplicar opacidade e desenhar marca d'água
    ctx.globalAlpha = settings.marca_agua_opacidade;
    ctx.drawImage(watermarkImg, x, y, wWidth, wHeight);

    // Restaurar opacidade original
    ctx.globalAlpha = 1.0;

    // 7. Converter canvas de volta para arquivo File
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Falha ao processar canvas para Blob.'));
            return;
          }
          // Criar novo arquivo preservando nome e tipo original
          const newFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(newFile);
        },
        file.type,
        0.95 // Alta qualidade
      );
    });
  } catch (err) {
    console.error('Erro ao aplicar marca d\'água:', err);
    // Se falhar por qualquer motivo (ex: erro CORS no logo), retorna o arquivo original
    // para não travar o upload do corretor
    return file;
  }
}
