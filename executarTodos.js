const exec = require('child_process').exec;

// Lista de scripts para serem executados
const scripts = [
    'node usy2.js',
    'node DI.js',
    'node DI26.js',
    'node DI27.js',
    'node DI29.js',
    'node DI31.js',
    'node DI33.js',
    'node DOLFUT.js',
    'node dollarValue.js',
    'node DOWJONES.js',
    'node DX.js',
    'node DXY.js',
    'node INDFUT.js',
    'node NASDAQ.js',
    'node SEP500.js',
    'node SPFUT.js',
    'node USDMXN.js',
    'node usy5.js',
    'node usy10.js',
    'node VIXFUT.js'
];

// Função para executar cada script
const executarScripts = () => {
    scripts.forEach(script => {
        exec(script, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar ${script}: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    });
};

// Executar todos os scripts a cada 30 segundos, se desejar
setInterval(executarScripts, 5000); // 30 segundos entre execuções
