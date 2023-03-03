import getRTMBot from '../slackconnector/slackConnector.js';
import { methods as usuarioDAO } from "../model/usuario.js";
import { methods as reaccionDAO } from "../model/reaccion.js";

//const slack = getRTMBot();

//REVISA SI ES EL PRIMER MENSAJE DEL USUARIO. SI LO ES, SETEA UN USUARIO NUEVO CON SUS DATOS
//SI NO LO ES, HACE UN UPDATE AL USUARIO DE SUS WALL OF TEXT Y @CANAL
const evaluarMensaje = async (data) => {
    try{
        let idusuario = data.user;
        const result = await usuarioDAO.getUserById(idusuario);
        if (result.length === 0) {
            usuarioDAO.addUser(data);
        } else {
            usuarioDAO.updateUser(data, result);
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
            reaccionDAO.addReaccion(data);
        } else {
            const { reaction } = data;
            reaccionDAO.updateReaccion(data,result);
            if(reaction == '+1'){
                const queryUsuario = await usuarioDAO.getUserById(data.user);
                usuarioDAO.updateEtiquetaFromReaction(queryUsuario);
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