const puppeteer = require('puppeteer');
const axios = require('axios'); // Instale o Axios se ainda não tiver: npm install axios

(async () => {
  // Lançar o navegador
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Navegar para o URL alvo
  await page.goto('https://br.advfn.com/investimentos/futuros/di-depositos-interfinanceiros/cotacoes', {
    waitUntil: 'domcontentloaded',
  });

  // Capturar o valor da Taxa DI1X24 usando XPath
  const diValue = await page.evaluate(() => {
    const xpathResult = document.evaluate('/html/body/div[8]/div[3]/div[3]/div[1]/table/tbody/tr[1]/td[3]', document, null, XPathResult.STRING_TYPE, null);
    return xpathResult.stringValue;
  });

  console.log('Valor da Taxa DI1X24:', diValue.trim());

  // Fechar o navegador
  await browser.close();

  // Enviar o valor para o Google Sheets através do Google Apps Script
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbyb25ygTBwpK-ZQg4qnn9JDmCQcIFkn7fiLkCGvIoBKwAFQfSmSb0CQWK7K_ogAgOjz/exec'; // Insira o URL do seu Apps Script aqui

  // Log da URL e do valor enviado
  console.log('Enviando valor para:', scriptUrl);
  console.log('Valor a ser enviado:', diValue.trim());

  try {
    const response = await axios.get(scriptUrl, { params: { value: diValue.trim() } });
    console.log('Valor enviado para o Google Sheets com sucesso!', response.data);
  } catch (error) {
    console.error('Erro ao enviar para o Google Sheets:', error.response ? error.response.data : error.message);
  }
})();
