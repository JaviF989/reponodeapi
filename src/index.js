import server from './app.js';

const main=() =>{
    server.listen(server.get("port"));
    console.log(`Server corriendo en puerto ${server.get("port")}`);
};

main();