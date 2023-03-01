import getRTMBot from '../slackconnector/slackConnector.js';
import getMiConeccion from "../database/database.js";
import { methods as usuario } from "../model/usuario.js";
import { methods as reaccion } from "../model/reaccion.js";

//REVISA SI ES EL PRIMER MENSAJE DEL USUARIO. SI LO ES, SETEA UN USUARIO NUEVO CON SUS DATOS
//SI NO LO ES, HACE UN UPDATE AL USUARIO DE SUS WALL OF TEXT Y @CANAL
const evaluarMensaje = async (data) => {
    try{
        const connection = await getMiConeccion();
        let idusuario = data.user;
        const result = await connection.query("SELECT * FROM usuarios where idusuario= ?", idusuario);
        if (result.length === 0) {
            usuario.addUser(data);
        } else {
            usuario.updateUser(data, result);
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
            reaccion.addReaccion(data);
        } else {
            const { user, reaction } = data;
            reaccion.updateReaccion(data,result);if(reaction == '+1'){
                const queryUsuario = await connection.query("SELECT * FROM usuarios where idusuario= ?", data.user);
                usuario.updateEtiquetaFromReaction(queryUsuario);
            }
        }
        
    }catch (error){
        console.log("ERROR: " + error.message);
    }
};

export const methods = {
    evaluarMensaje,
    evaluarReaccion
};