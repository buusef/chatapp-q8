const express = require('express')
const path = require('path')
const publicDirectory = path.join(__dirname, '../public')
const app = express()
const {getActiveRooms} = require('./utils/users')
app.use(express.static(publicDirectory))
app.use(express.json())
app.get('/getRooms', (req,res)=>{
    res.send({rooms: getActiveRooms()})
})
module.exports = app