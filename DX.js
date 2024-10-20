const puppeteer = require('puppeteer');
const axios = require('axios'); // Instale o Axios se ainda não tiver: npm install axios

(async () => {
  try {
    // Lançar o navegador
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
  
    // Navegar para o URL alvo
    await page.goto('https://br.investing.com/currencies/us-dollar-index', {
      waitUntil: 'domcontentloaded',
    });

    // Capturar o valor da porcentagem usando XPath
    const percentage = await page.evaluate(() => {
      const xpath = '/html/body/div[1]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div[1]/div[1]/div[2]/span[2]';
      const xpathResult = document.evaluate(xpath, document, null, XPathResult.STRING_TYPE, null);
      return xpathResult.stringValue.trim(); // Remove espaços em branco
    });

    // Log para verificar se o valor foi capturado corretamente
    console.log('Valor capturado:', percentage);

    if (!percentage) {
      console.error('Nenhum valor foi capturado. Verifique o XPath ou o conteúdo da página.');
      await browser.close();
      return;
    }

    // Remover parênteses e o símbolo %, se presente
    const formattedValue = percentage.replace('(', '').replace(')', '').trim().replace('%', '').replace(',', '.').replace('.', ',') + '%';
    console.log('Taxa de rendimento (valor formatado):', formattedValue);

    // Fechar o navegador
    await browser.close();

    // Enviar o valor para o Google Sheets através do Google Apps Script
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyab9W2OduVuVgi4gdHSQ8erBjYDG1y9u23yItFxXxXsQTRNC_ZFXa7FC1-OhXFv6Bd/exec'; // Insira o URL do seu Apps Script aqui

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
