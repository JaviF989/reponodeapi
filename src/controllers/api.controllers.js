import { methods as usuario} from "../model/usuario.js";
import { methods as reaccion} from "../model/reaccion.js";



const getUserById = async (req, res) => {
    try{
        const {idusuario} = req.params;
        const result = await usuario.getUserById(idusuario);
        res.json(result);
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
};

const getReacionesById = async (req, res) => {
    try{
        const {idreaccion} = req.params;
        const result = await reaccion.getReacionesById(idreaccion);
        res.json(result);
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
};

const getAplaudidores = async (req, res) => {
    try{
        const result = await reaccion.getAplaudidores();
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