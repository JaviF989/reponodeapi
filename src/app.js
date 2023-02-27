import express from "express";
import morgan from "morgan";
import botRoutes from "./routes/bot.slack.routes.js";
import cors from 'cors';

const server = express();

//SETTINGS
server.set("port", 8080);

//MIDDLEWARES
server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

//Routes
server.use('/', botRoutes);


export default server;