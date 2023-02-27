import getMiConeccion from "../database/database.js";
import config from "../config.js";


const getUserById = async (req, res) => {
    try{
        const connection = await getMiConeccion();
        const {idusuario} = req.params;
        console.log(idusuario);
        const result = await connection.query(config.queryUserByID, idusuario);
        res.json(result);
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
};

const getReacionesById = async (req, res) => {
    try{
        const connection = await getMiConeccion();
        const {idreaccion} = req.params;
        const result = await connection.query(config.queryReaccionByID, idreaccion);
        res.json(result);
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
};

const getAplaudidores = async (req, res) => {
    try{
        const connection = await getMiConeccion();
        const result = await connection.query(config.queryAplaudidores);
        res.json(result);
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
};



export const methods = {
    getUserById,
    getReacionesById,
    getAplaudidores
};