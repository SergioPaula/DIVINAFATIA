// generate-data.js - Execute este script com Node.js para gerar o arquivo dados.js

const fs = require('fs');
const { google } = require('googleapis');

// Configuração
const SPREADSHEET_ID = '1RBKycoagGO8rVjkBzfhnQKSIdStCgW7_YpErNvLNgns';
const SHEET_NAME = 'base-dados';
const API_KEY = 'SUA_API_KEY'; // Sua chave de API do Google
const OUTPUT_FILE = './js/dados.js';

// Inicializar a API do Google Sheets
const sheets = google.sheets({ version: 'v4', auth: API_KEY });

async function generateDataFile() {
  try {
    // Obter dados da planilha
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:AE100`, // Ajuste conforme necessário
    });

    const rows = response.data.values || [];
    
    // Transformar dados em formato estruturado
    const products = rows
      .filter(row => row.length > 1 && row[1] === 'TRUE') // Filtra por status = TRUE
      .map(row => {
        return {
          id: parseInt(row[0]) || 0,
          status: row[1] === 'TRUE',
          category: row[2] || '',
          name: row[4] || '',
          currentPrice: parseFloat(row[8]) || 0,
          oldPrice: parseFloat(row[9]) || null,
          tags: {
            promo: row[10] === 'TRUE',
            news: row[11] === 'TRUE',
            hot: row[12] === 'TRUE'
          },
          rating: parseFloat(row[13]) || 0,
          reviewCount: parseInt(row[14]) || 0,
          metaDescription: row[15] || '',
          cardImage: row[16] || '',
          modalImage: row[17] || '',
          icons: [
            {
              firstText: row[18] || '',
              firstIcon: row[19] || ''
            },
            {
              secondText: row[20] || '',
              secondIcon: row[21] || ''
            },
            {
              thirdText: row[22] || '',
              thirdIcon: row[23] || ''
            }
          ],
          weight: row[24] || '',
          servings: parseInt(row[25]) || 0,
          details: {
            fullDescription: row[26] || '',
            ingredients: row[27] || '',
            allergens: row[28] || '',
            validity: row[29] || ''
          }
        };
      });

    // Criar estrutura final de dados
    const productData = {
      bolos: products
    };

    // Gerar conteúdo do arquivo dados.js
    const fileContent = `// Arquivo gerado automaticamente em ${new Date().toLocaleString()}\n\nvar MENU = ${JSON.stringify(productData, null, 2)};`;

    // Salvar arquivo
    fs.writeFileSync(OUTPUT_FILE, fileContent);
    
    console.log(`Arquivo ${OUTPUT_FILE} gerado com sucesso!`);
    console.log(`Total de produtos: ${products.length}`);
    
  } catch (error) {
    console.error('Erro ao gerar arquivo de dados:', error);
  }
}

// Executar o script
generateDataFile();