import { methods as usuarioDAO} from "../model/usuario.js";
import { methods as reaccionDAO} from "../model/reaccion.js";



const getUserById = async (req, res) => {
    try{
        const {idusuario} = req.params;
        const result = await usuarioDAO.getUserById(idusuario);
        res.json(result);
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
};

const getReacionesById = async (req, res) => {
    try{
        const {idreaccion} = req.params;
        const result = await reaccionDAO.getReacionesById(idreaccion);
        res.json(result);
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
};

const getAplaudidores = async (req, res) => {
    try{
        const result = await reaccionDAO.getAplaudidores();
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