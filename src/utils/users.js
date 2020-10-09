const users = []

const addUser = ({id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find(user=>{
        return user.room === room && user.username === username
    })

    // Validate username

    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }
    // Store a user
    const user = { id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex(el => el.id == id)
    
    if (index != -1) {
        // use [0] to return an the object that is inside the array
        return users.splice(index, 1)[0]
    }
}

const getUser = id => users.find(user=>user.id ==id)

const getUsersInRoom = room => users.filter(el=>el.room==room)

const getActiveRooms = () => {
    const rooms = []
    users.forEach(user=>{
        const exist = rooms.findIndex(room=>room.room==user.room)  
        if (exist == -1) {
            rooms.push(user)
        }
    })
    return rooms
}

module.exports = {
    getUser,
    getUsersInRoom,
    addUser,
    removeUser,
    getActiveRooms
}