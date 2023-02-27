import { RTMClient } from '@slack/rtm-api';
import slackbot from 'slackbots';
import config from "../config.js";
import { methods as botController } from "../controllers/bot.controller.js";

const token = config.slack;
const rtm = new RTMClient(token);
const bot = new slackbot ({
    token: token,
    name: 'arturito'
});

bot.on('message', async (data) => {
    if (data.type =='message' && data.user != undefined){
        botController.evaluarMensaje(data);
        console.log('new message', JSON.stringify(data, null, 2));
    } else if(data.type == "reaction_added" && data.user != undefined){
        botController.evaluarReaccion(data);
        console.log('new message', JSON.stringify(data, null, 2));
    } 
});

// TODO - BORRAR, FINES DE TESTING
bot.on('open', () => console.log('bot listooo'));
bot.on('start', () => {
    bot.postMessageToChannel('nodejs', 'temed enemigos del heredero :snake: :snake:');
})


export default function getRTMBot(){

}

