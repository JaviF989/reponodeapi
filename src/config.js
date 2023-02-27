import {config} from "dotenv";

config();

export default {
    slack: process.env.SLACK_BOT_TOKEN || "INGRESAR TOKEN DE SLACK EN CONFIG.JS",
    host: process.env.HOST || "INGRESAR HOST EN CONFIG.JS",
    database: process.env.DATABASE || "INGRESAR DB EN CONFIG.JS",
    user: process.env.USER || "INGRESAR USUARIO EN CONFIG.JS",
    password: process.env.PASSWORD || "INGRESAR PASS EN CONFIG.JS",
    queryUserByID: process.env.SELECT_USUARIO_POR_ID,
    queryReaccionByID: process.env.SELECT_REACCION_POR_ID,
    queryAplaudidores: process.env.SELECT_APLAUDIDORES
}