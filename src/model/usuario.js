import getMiConeccion from "../database/database.js";
import config from "../config.js";

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
        console.log('MUCHOS +1');
        return 'Todo que si';
    }
    return 'Solo una persona';

}

const updateEtiquetaFromReaction = async (queryUsuario) => {
    try{
        const connection = await getMiConeccion();
        let etiqueta = updateEtiqueta(queryUsuario, 0, 0);
        let resultset=JSON.parse(JSON.stringify(queryUsuario));
        const update = await connection.query(`UPDATE usuarios SET etiqueta='${etiqueta}'where idusuario = '${resultset[0].idusuario}'`);
    }catch(error){
        console.log(error.message);
    }
}

const isPlusOne = async (idusuario) => {
    console.log('id de usuario: '+ idusuario);
    try{
        const connection = await getMiConeccion();
        const result = await connection.query(`SELECT cantidad FROM reacciones where idusuario='${idusuario}' and idreaccion = '+1'`);
        var queryResult=JSON.parse(JSON.stringify(result));
        console.log('Cantidad de +1: ', queryResult[0].cantidad);
        return queryResult[0].cantidad;
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
    const nuevoUsuario = await getUserById(idusuario);
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

const getUserById = async (idusuario ) => {
    try{
        const connection = await getMiConeccion();
        const result = await connection.query(config.queryUserByID, idusuario);
        console.log(result);
        return result;
    }catch (error) {
        console.log(error.message);
    }
    
};


export const methods = {
    updateEtiqueta,
    updateEtiquetaFromReaction,
    addUser,
    isNuevoUsuario,
    getUserById,
    updateUser
};