const express = require('express');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const utilsRoutes = require('./routes/utils.routes');
const cookieParser = require('cookie-parser');
const ChatModel = require('./models/chat.model');
require('dotenv').config({path : './config/.env'})
require('./config/db');
const { checkUser, requireAuth } = require('./middleware/auth.middleware');
const cors = require('cors');

const app = express();

const port = process.env.PORT

const corsOptions = {
    origin : process.env.CLIENT_URL,
    credentials : true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId', 'Set-Cookie'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
}

app.use(cors(corsOptions));
app.use(express.json({ limit : '50mb' }));
app.use(express.urlencoded({ limit : '50mb', extended: true}));
app.use(cookieParser());


//jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    if(res.locals.user.id){
        res.status(200).send(res.locals.user.id)
    }
})

//route
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/utils', utilsRoutes);

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
      }
} );

//socket io 
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

io.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected`);
    
    // Join a conversation
    const { roomId } = socket.handshake.query;
    socket.join(roomId);
    
    // Listen for new messages
    socket.on(NEW_CHAT_MESSAGE_EVENT, async (data) => {
        io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
        try{
            return await ChatModel.findByIdAndUpdate(
                roomId,
                {
                    $addToSet : { 
                        messages : {
                            body : data.body,
                            senderId : data.senderId,
                            timestamp: new Date().getTime()
                        }
                    }
                },
                { new : true},
                (err, docs) => {
                    if(!err) {    
                        io.in('notification').emit(NEW_CHAT_MESSAGE_EVENT, data);
                    }
                    else return console.log(err);
                }
                )
            }catch(err){
      return console.log(err);;
  }
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`front ${socket.id} diconnected`);
    socket.leave(roomId);
  });
});


// server 
server.listen(port || 5000, () => {
        console.log(`Websocket listening on port ${port}`);
      });