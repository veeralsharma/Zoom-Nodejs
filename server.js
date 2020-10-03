const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const {v4:uuidv4} = require('uuid')
const cors = require('cors')
const socketio = require('socket.io');
const io = socketio(server);
app.use(cors());
app.set('view engine' , 'ejs')
app.use(express.static('public'))
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug:true
})
app.use('/peerjs', peerServer);

app.get('/' , (req,res) => {
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room/' , (req,res) => {
    res.render('room', {roomId : req.params.room})
})

io.on('connect', (socket) => {

    socket.on('join-room', (roomId,userId) => {
      socket.join(roomId);
      socket.to(roomId).broadcast.emit('user-connected',userId);
      socket.on('message' , message => {
        io.to(roomId).emit('createMessage' , message)
      })
    });


  
  });

server.listen(process.env.PORT || 3000, () => console.log(`Server has started.`));