import getRTMBot from '../slackconnector/slackConnector.js';
import getMiConeccion from "../database/database.js";

//REVISA SI ES EL PRIMER MENSAJE DEL USUARIO. SI LO ES, SETEA UN USUARIO NUEVO CON SUS DATOS
//SI NO LO ES, HACE UN UPDATE AL USUARIO DE SUS WALL OF TEXT Y @CANAL
const evaluarMensaje = async (data) => {
    try{
        const connection = await getMiConeccion();
        let idusuario = data.user;
        const result = await connection.query("SELECT * FROM usuarios where idusuario= ?", idusuario);
        if (result.length === 0) {
            addUser(data);
        } else {
            updateUser(data, result);
        }
    }catch (error){
        console.log("ERROR: " + error.message);
    }
};

//REVISA SI ES EL PRIMER REACCION DEL USUARIO DE ESE TIPO. SI LO ES, SETEA UNA RELACION USUARIO REACCION NUEVA
//SI NO LO ES, HACE UN UPDATE A LA CANTIDAD DE REACCIONES DE ESTE TIPO QUE TIENE EL USUARIO
const evaluarReaccion = async (data) => {
    try{
        const connection = await getMiConeccion();
        let queryString = `idusuario = '${data.user}' and idreaccion = '${data.reaction}'`;
        const result = await connection.query("SELECT * FROM reacciones where " + queryString);
        if (result.length === 0) {
            console.log("No encontre reacciones");
            addReaccion(data);
        } else {
            updateReaccion(data,result);
        }
        const { user, reaction } = data;
        if(reaction == '+1'){
            updateEtiquetaFromReaction(user);
        }
        
    }catch (error){
        console.log("ERROR: " + error.message);
    }
};

function isWallOfText (text) {
    return (text.split(' ').length >= 15);
}

function isChannelMessage(text) {
    let channel = text.split(' ');
    return (channel.indexOf('<!channel>') != -1);
}

function updateEtiqueta(result, walloftext, channel) {
    var resultset=JSON.parse(JSON.stringify(result));
    if ((resultset[0].channel + channel) >= 10){
        return 'Portavoz del pueblo';
    }
    if ((resultset[0].walloftext + walloftext) > 3){
        return 'Te va a tratar de convencer';
    }
    if (isPlusOne(resultset[0].idusuario)){
        return 'Todo que si';
    }
    return 'Solo una persona';

}

const updateEtiquetaFromReaction = async (idusuario) => {
    console.log('primer condicion: ' + (isPlusOne(idusuario)));
    console.log('segunda condicion: ' + isOnlyAPerson(idusuario));
    if (isPlusOne(idusuario) && isOnlyAPerson(idusuario)){
        const connection = await getMiConeccion();
        const update = await connection.query(`UPDATE usuarios SET etiqueta='Todo que si' where idusuario = '${idusuario}'`);

    }
}

const isOnlyAPerson = async (idusuario) => {
    const connection = await getMiConeccion();
    const result = await connection.query(`SELECT etiqueta FROM usuarios where idusuario='${idusuario}'`);
    var queryResult=JSON.parse(JSON.stringify(result));
    return (queryResult.etiqueta === 'Solo una persona');
}

const isPlusOne = async (idusuario) => {
    console.log('id de usuario: '+ idusuario);
    try{
        const connection = await getMiConeccion();
        const result = await connection.query(`SELECT cantidad FROM reacciones where idusuario='${idusuario}' and idreaccion = '+1'`);
        var queryResult=JSON.parse(JSON.stringify(result));
        console.log('Cantidad de +1: ', queryResult[0].cantidad);
        var isPlus = await (queryResult[0].cantidad >=21);
        return isPlus;
    }catch (error){
         console.log(error.message);
    }
}

const addReaccion = async (data) => {
    try{
    const connection = await getMiConeccion();
    const { user, reaction } = data;
    let idusuario = user;
    let idreaccion = reaction;
    let cantidad =  1;
    const nuevaReaccion = {
        idusuario,
        idreaccion,
        cantidad
    }
    const result = await connection.query("INSERT INTO  reacciones SET ?", nuevaReaccion);
    isNuevoUsuario(idusuario);

    }catch (error){
         console.log(error.message);
    }
}

const updateReaccion = async (data, result) => {
    try{
        console.log("ENTRE AL UPDATE REACCIONES");
    const connection = await getMiConeccion();
    const { user, reaction } = data;
    let idusuario = user;
    let idreaccion = reaction;
    let cantidad = 1;
    let reaccion = {
        idusuario,
        idreaccion,
        cantidad
    }
    var resultset=JSON.parse(JSON.stringify(result));
    console.log(resultset);
    reaccion.cantidad += resultset[0].cantidad;
    const update = await connection.query("UPDATE reacciones SET ? where idusuario = ? and idreaccion = ?", [reaccion, idusuario, idreaccion]);
    console.log("UPDATE COMPLETO");
    }catch (error){
         console.log(error.message);
    }
}

const addUser = async (data) => {
    try{
    const connection = await getMiConeccion();
    const { user, text } = data;
    let idusuario = user;
    let name = idusuario;
    let walloftext =  0;
    let channel = 0;
    let etiqueta = 'Solo una persona';
    if (isWallOfText(text)) walloftext =1;
    if (isChannelMessage(text)) channel =1;
    const usuario = {
        idusuario,
        name,
        walloftext,
        channel,
        etiqueta
    }
    const result = await connection.query("INSERT INTO usuarios SET ?", usuario);

    }catch (error){
         console.log(error.message);
    }
}

const isNuevoUsuario = async (idusuario) => {
    try{
    const connection = await getMiConeccion();
    const nuevoUsuario = await connection.query("SELECT * FROM usuarios where idusuario= ?", idusuario);
    if (nuevoUsuario.length === 0) {
        let walloftext =  0;
        let channel = 0;
        let etiqueta = 'Solo una persona';
        const usuario = {
            idusuario: idusuario,
            name: idusuario,
            walloftext: walloftext,
            channel: channel,
            etiqueta: etiqueta
        }
        const result = await connection.query("INSERT INTO usuarios SET ?", usuario);
    }

    }catch (error){
         console.log(error.message);
    }
}

const updateUser = async (data, result) => {
    try{
    const connection = await getMiConeccion();
    console.log('ENTRE A UPDATEAR USUARIO');
    const { user, text } = data;
    let idusuario = user;
    let name = idusuario;
    let walloftext =  0;
    let channel = 0;
    if (isWallOfText(text)) walloftext =1;
    if (isChannelMessage(text)) channel =1;
    let etiqueta = updateEtiqueta(result, walloftext, channel);
    let usuario = {
        idusuario,
        name,
        walloftext,
        channel, 
        etiqueta
    }
    var resultset=JSON.parse(JSON.stringify(result));
    console.log(resultset);
    usuario.walloftext += resultset[0].walloftext;
    usuario.channel += resultset[0].channel;
    const update = await connection.query("UPDATE usuarios SET ? where idusuario = ?", [usuario, idusuario]);
    console.log("UPDATE COMPLETO");
    }catch (error){
         console.log(error.message);
    }
}


export const methods = {
    evaluarMensaje,
    evaluarReaccion
};