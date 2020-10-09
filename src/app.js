const express = require('express')
const path = require('path')
const publicDirectory = path.join(__dirname, '../public')
const app = express()
app.use(express.static(publicDirectory))
app.use(express.json())

module.exports = app