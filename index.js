// monitoramento do mercado
require('dotenv').config();
const axios = require('axios')
const WebSocket = require ('ws');


let accessToken = ""; //  guarda o token que vou gerar de tempos em tempos

login()
  // .then(result => getAccountId()) // .then garante que o getAccountId seja chamado depois do login, so utiliza uma vez para pegar token 

const ws = new WebSocket("wss://ws.mercadobitcoin.net/ws");

// evento 
ws.onopen = () => {
    ws.send (JSON.stringify({
        "type":"subscribe",
        "subscription":{
            "name":"ticker",
            "id":"BRLBTC"
        }

    }))

}
// recebimento das informações
ws.onmessage =(evt) =>{
 console.clear();
 //melhorando a visualizacao no console
 const obj = JSON.parse(evt.data)
 //console.log(evt.data);
 console.log(obj);
 
}
//Autenticacao 

async function login(){
    const url =`https://api.mercadobitcoin.net/api/v4/authorize`
    const body ={login: process.env.API_KEY, passsword: process.env.API_SECRET};
    // enviar essas informacoes para o servidor 
    const{data}= await axios.post(url, body);
    acessToken = data.acess_token;
    console.log('Acesso Autorizado');
    setTimeout(login, (data.expiration *1000) - Date.now()) // atualizar o token 
    // o data  vem com duas informações o access_token e a epiration
}
//obtendo o account_id
// essa rota ja precisa estar autenticado
// so executa uma vez essa funcao, para o o AccountID
async function getAccountId(){
    const url = `https://api.mercadobitcoin.net/api/v4/authorize`;
    const headers = {Authorization:" Bearer"+ accessToken};
    const {data} = await axios.get(url, {headers})
    console.log(data);
    process.exit(0)
}

// envio de ordem
// side = buy ou cell
async function newOrder(side){
   // const url = `https://api.mercadobitcoin.net/api/v4/accounts/{accountId}/{symbol}/orders`;
   const url = `https://api.mercadobitcoin.net/api/v4/accounts/${process.env.ACCOUNT_ID}/${process.env.SYMBOL}/orders`;
   const body ={
   qty : precess.env.BUY_QTY,
   side,
   type: "market"
 }
 const headers = {Authorization:" Bearer"+ accessToken};
 try {
    const {data} = await axios.post(url,body,{headers});
    return data;
}
 catch(err){
    console.error(err.response ? err.response.data:err.message)
    process.exit(0)
 }
} 