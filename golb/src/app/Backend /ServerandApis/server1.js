require('dotenv').config()

const express = require('express')
const app = express()

app.get('/login', (req, res) => {

})

app.listen(process.env.PORT || 3000)