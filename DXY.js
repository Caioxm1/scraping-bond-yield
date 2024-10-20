const puppeteer = require('puppeteer');
const axios = require('axios'); // Instale o Axios se ainda não tiver: npm install axios

(async () => {
  try {
    // Lançar o navegador
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
  
    // Navegar para o URL alvo
    await page.goto('https://br.investing.com/indices/usdollar-chart', {
      waitUntil: 'domcontentloaded',
    });

    // Capturar o valor da porcentagem usando XPath
    const percentage = await page.evaluate(() => {
      const xpath = '/html/body/div[1]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div[1]/div[1]/div[2]/span[2]';
      const xpathResult = document.evaluate(xpath, document, null, XPathResult.STRING_TYPE, null);
      return xpathResult.stringValue.trim(); // Remove espaços em branco
    });

    // Log para verificar se o valor foi capturado corretamente
    console.log('Valor final capturado:', percentage);

    if (!percentage) {
      console.error('Nenhum valor válido foi capturado. Verifique o XPath ou o conteúdo da página.');
      await browser.close();
      return;
    }

    // Remover parênteses e formatar o valor
    const formattedValue = percentage.replace('(', '').replace(')', '').trim(); // Remove parênteses

    // Adicionar o símbolo % ao valor formatado, garantindo que haja apenas um
    const percentageWithSymbol = formattedValue.endsWith('%') ? formattedValue : formattedValue + '%';
    console.log('Taxa de rendimento (em %):', percentageWithSymbol);

    // Fechar o navegador
    await browser.close();

    // Enviar o valor para o Google Sheets através do Google Apps Script
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxXj_-m089qu-yQ1U1XOlz2Nr4eEgKPy-9BuwdQ_AJB9VAMfgmmSS660NSQ4UPM1kHP/exec'; // Insira o URL do seu Apps Script aqui

    // Log da URL e do valor enviado
    console.log('Enviando valor para:', scriptUrl);
    console.log('Valor a ser enviado:', percentageWithSymbol);

    try {
      const response = await axios.get(scriptUrl, { params: { value: percentageWithSymbol } });
      console.log('Valor enviado para o Google Sheets com sucesso!', response.data);
    } catch (error) {
      console.error('Erro ao enviar para o Google Sheets:', error.response ? error.response.data : error.message);
    }

  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
})();
