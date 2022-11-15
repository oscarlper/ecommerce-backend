let userName = 'NN'
const messages = [] 
import mdb_mensaje from '../models/schemaMongodbChat.js'

import { Server } from 'socket.io';

function chat(expressServer) {
    
    const io = new Server(expressServer);
    
    io.on('connection', async (socket) => {
        console.log('Se conecto un usuario nuevo')
        socket.emit('server:chat', messages)
    
        socket.emit('server:username', userName)
        
            socket.emit('server:chat', messages)
    
        socket.on('server:chat', async inputMessage => {
            messages.push(
                    { author:{
                        timestamp: inputMessage.dateMark,
                        id: inputMessage.id,
                        nombre: inputMessage.nombre,
                        apellido: inputMessage.apellido,
                        edad: inputMessage.edad,
                        alias: inputMessage.alias,
                        avatar: inputMessage.avatar,
                    },
                    targetMsg: inputMessage.targetMsg,
                    text: inputMessage.message
                    }
            )
    
            // Guardo mensajes en mongoDB
            await saveMessageMDB(inputMessage)
            io.emit('server:chat', messages)
        })
    })
    
    async function saveMessageMDB(inputMessage) {
        mdb_mensaje.create(
                { author:{
                    timestamp: inputMessage.dateMark,
                    id: inputMessage.id,
                    nombre: inputMessage.nombre,
                    apellido: inputMessage.apellido,
                    edad: inputMessage.edad,
                    alias: inputMessage.alias,
                    avatar: inputMessage.avatar,
                },
                targetMsg: inputMessage.targetMsg,
                text: inputMessage.message
                })
    }
    
    ( async () => {
        try {
            // historial chat mongodb
            let mensajes = await mdb_mensaje.find({},{__v:0})
            mensajes = JSON.parse(JSON.stringify(mensajes))
            mensajes.forEach(element => {
                messages.push(element)
            });
        } catch(e) {
            logger.error(`timestamp: ${Date.now()} - Read error - ${e}`);
            console.log('error al leer mensajes historicos: ',e) 
        }
    })();
    }

    export default chat;