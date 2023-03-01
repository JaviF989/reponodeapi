import getMiConeccion from "../database/database.js";
import { methods as usuario } from "../model/usuario.js";

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
    usuario.isNuevoUsuario(idusuario);

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


export const methods = {
    addReaccion,
    updateReaccion
};