const app = require('./app')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const {
    getUser,
    getUsersInRoom,
    addUser,
    removeUser
} = require('./utils/users')


const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

io.on('connection', (socket)=>{
    console.log('New io connection');

    socket.on('join', ({username, room}, callback)=>{
        // socket.join allow you to send messages only to specific room
        const {error,user} = addUser({id: socket.id, username,room})
        if (error) {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('msg', generateMessage('Admin','Welcome to SocketIO'))
        socket.broadcast.to(user.room).emit('msg', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
    })

    socket.on('sendMessage', (msg,callback)=>{
        const filter = new Filter()
        if(filter.isProfane(msg)) {
            return callback('Profanity is not allowed!')
        }
        const user = getUser(socket.id)
        if(user) {
            io.to(user.room).emit('msg', generateMessage(user.username,msg))
            callback()
        }
    })

    socket.on('sendLocation', (location, callback)=>{
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,location.latitude,location.longitude))
        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('msg', generateMessage(user.username,`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, ()=>{
    console.log(`Server is up on ${port}`);
})