import getRTMBot from '../slackconnector/slackConnector.js';
import { methods as usuario } from "../model/usuario.js";
import { methods as reaccion } from "../model/reaccion.js";

//REVISA SI ES EL PRIMER MENSAJE DEL USUARIO. SI LO ES, SETEA UN USUARIO NUEVO CON SUS DATOS
//SI NO LO ES, HACE UN UPDATE AL USUARIO DE SUS WALL OF TEXT Y @CANAL
const evaluarMensaje = async (data) => {
    try{
        let idusuario = data.user;
        const result = await usuario.getUserById(idusuario);
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
        const result = await reaccion.getReaccionesPorUsuario(data.user, data.reaction);
        if (result.length === 0) {
            console.log("No encontre reacciones");
            reaccion.addReaccion(data);
        } else {
            const { reaction } = data;
            reaccion.updateReaccion(data,result);
            if(reaction == '+1'){
                const queryUsuario = await usuario.getUserById(data.user);
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