const puppeteer = require('puppeteer');
const axios = require('axios'); // Instale o Axios se ainda não tiver: npm install axios

(async () => {
  try {
    // Lançar o navegador
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
  
    // Navegar para o URL alvo
    await page.goto('https://br.investing.com/rates-bonds/u.s.-2-year-bond-yield', {
      waitUntil: 'domcontentloaded',
    });

    // Capturar o valor da porcentagem usando o XPath
    const percentage = await page.evaluate(() => {
      const xpath = '/html/body/div[1]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div[1]/div[1]/div[2]/span[2]';
      const xpathResult = document.evaluate(xpath, document, null, XPathResult.STRING_TYPE, null).stringValue;
      return xpathResult.trim(); // Remove espaços em branco
    });

    // Log para verificar se o valor foi capturado corretamente
    console.log('Valor final capturado:', percentage);

    if (!percentage) {
      console.error('Nenhum valor válido foi capturado. Verifique o XPath ou o conteúdo da página.');
      await browser.close();
      return;
    }

    // Remover parênteses e formatação adicional
    const formattedValue = percentage.replace('(', '').replace(')', '').replace(' ', '').trim(); // Remove parênteses e espaços em branco

    // Log do valor formatado
    console.log('Taxa de rendimento (valor formatado):', formattedValue);

    // Fechar o navegador
    await browser.close();

    // Enviar o valor para o Google Sheets através do Google Apps Script
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwgIO3IAQpvNs1kNxpz_--1Z2HuzuHRzTZI6cx8SDFsVKclhcFD9teHwMgbg3N7H9wY/exec'; // Insira o URL do seu Apps Script aqui

    // Log da URL e do valor enviado
    console.log('Enviando valor para:', scriptUrl);
    console.log('Valor a ser enviado:', formattedValue);

    try {
      const response = await axios.get(scriptUrl, { params: { value: formattedValue } });
      console.log('Valor enviado para o Google Sheets com sucesso!', response.data);
    } catch (error) {
      console.error('Erro ao enviar para o Google Sheets:', error.response ? error.response.data : error.message);
    }

  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
})();
