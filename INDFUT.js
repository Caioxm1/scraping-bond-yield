const puppeteer = require('puppeteer');
const axios = require('axios'); // Instale o Axios se ainda não tiver: npm install axios

(async () => {
  // Lançar o navegador
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Navegar para o URL alvo do dólar comercial
  await page.goto('https://br.investing.com/indices/ibovespa-futures', {
    waitUntil: 'domcontentloaded',
  });

  // Capturar o valor do dólar usando XPath
  const dollarValue = await page.evaluate(() => {
    const xpathResult = document.evaluate('/html/body/div[1]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div[1]/div[1]/div[1]', document, null, XPathResult.STRING_TYPE, null);
    return xpathResult.stringValue;
  });

  console.log('Valor do Dólar Comercial (BRL):', dollarValue.trim());

  // Fechar o navegador
  await browser.close();

  // Enviar o valor para o Google Sheets através do Google Apps Script
  const scriptUrl = 'https://script.google.com/macros/s/AKfycby6wwaONWBMHdQAmF6Z2uPWdw38u9sgOJCx332a8V09zzfqArZitbRzrAyoKgbUkwtJ/exec'; // Insira o URL do seu Apps Script aqui

  // Log da URL e do valor enviado
  console.log('Enviando valor para:', scriptUrl);
  console.log('Valor a ser enviado:', dollarValue.trim());

  try {
    const response = await axios.get(scriptUrl, { params: { value: dollarValue.trim() } });
    console.log('Valor enviado para o Google Sheets com sucesso!', response.data);
  } catch (error) {
    console.error('Erro ao enviar para o Google Sheets:', error.response ? error.response.data : error.message);
  }
})();
