//IMPORTANDO MODULOS
const fs = require('fs');
const readline = require('readline');
const { EventEmitter } = require('events');

//CONFIGURAÇÃO PARA ENTRADA E SAIDA
const leitor = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//OBJ EE PARA GERENCIAMENTO DE EVENTOS ASYNC
const eventEmitter = new EventEmitter();

//FUNÇÃO QUE PEDE O CAMINHO DO ARQUIVO
function pegarArquivo() {
  leitor.question('Digite o caminho do arquivo txt: ', (caminhoArquivo) => {
    setTimeout(() => { //AGENDAMENTO DE EXECUÇÃO DO CODIGO
      eventEmitter.emit('lerArquivo', caminhoArquivo);
    }, 100);
  });
}

//LENDO E PROCESSANDO DADOS
function lerArquivo(caminhoArquivo) {
  
  fs.readFile(caminhoArquivo, 'utf8', (erro, dados) => {
    if (erro) {
      console.error('Erro ao ler o arquivo:', erro);
      leitor.close();
    } else {
      const inicioDoCodigo = new Date(); //INICIO DO DURAÇÃO DE EXECUÇÃO DO CODIGO
      setTimeout(() => { //AGENDAMENTO DE EXECUÇÃO DO CODIGO
        eventEmitter.emit('execucao', dados, inicioDoCodigo);
      }, 0);
    }
  });
}

//SEPARANDO AS LINHAS 
function processar(dados, inicioDoCodigo) {
  const linhas = dados.split('\n');
  const numerosArray = [];
  const linhasTextoArray = [];

  linhas.forEach((linha) => {
    const linhasNum = linha.trim(); //REMOVENDO ESPAÇOS EM BRANCO

//VERIFICAÇÃO SE CONTÉM APENAS NUMEROS

    if (/^\d+$/.test(linhasNum)) { 
      numerosArray.push(parseInt(linhasNum, 10)); //CONVERTENDO NÚMEROS PARA INTEIRO E ADD A ARRAY
    } else {
      linhasTextoArray.push(linhasNum); //RETIRANDO LINHAS QUE CONTÉM TEXTO PARA SEGUNDA CONTAGEM
    }
  });

//CALCULANDO A SOMA DOS NUMEROS E LINHAS COM TEXTO DAS ARRAYS

  const somaDosNumeros = numerosArray.reduce((acumulador, num) => acumulador + num, 0);
  const numLinhasTexto = linhasTextoArray.length;

 //FIM DA DURAÇÃO DE EXECUÇÃO DO CODIGO
  const fimDoCodigo = new Date(); 

  //RESUMO DAS SOMAS DA API

  console.log('Resumo da aplicação:');
  console.log('Soma dos números:', somaDosNumeros);
  console.log('Soma da quantidade de linhas com texto:', numLinhasTexto);
  console.log('Tempo de execução da aplicação:', fimDoCodigo - inicioDoCodigo, 'ms');

//PERGUNTA SE DESEJA EXECUTAR 

  setTimeout(() => { //AGENDAMENTO DE EXECUÇÃO DO CODIGO
    leitor.question('Quer executar novamente? (S/N): ', (resposta) => {
      if (resposta.toUpperCase() === 'S') {
        eventEmitter.emit('pegarArquivo');
      }  else if (resposta.toUpperCase() === 'N') {
        leitor.close();
      }  else {
         console.error('Resposta errada. Digite "S" se quiser executar novamente ou "N" para parar.');
         processar(dados, inicioDoCodigo);
      } 
    });
   }, 0);
 }

//TODOS OS EVENTOS QUE SÃO EMITIDOS QUANDO CHAMADOS
eventEmitter.on('pegarArquivo', () => {
    pegarArquivo();
  });
  
  eventEmitter.on('lerArquivo', (caminhoArquivo) => {
    lerArquivo(caminhoArquivo);
  });
  
  eventEmitter.on('execucao', (dados, inicioDoCodigo) => {
    processar(dados, inicioDoCodigo);
  });
  
  eventEmitter.emit('pegarArquivo');