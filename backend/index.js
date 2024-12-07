const express = require('express')
const app = express()
require('dotenv').config()
const connectDB = require('./db')
const bodyParser = require('body-parser')
const cors = require('cors')
const AuthRouter = require('./Routes/AuthRouter.js')
const AdminRouter = require('./Routes/AdminRouter.js')
const PORT = process.env.PORT || 8080
const path = require('path')




app.get('/ping', (req, res) => {
  res.send('pong')
})

app.use(bodyParser.json()) 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const corsOptions = {
    origin: ['https://mern-app-kappa-tan.vercel.app'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true,
};

app.use(cors(corsOptions));


app.use('/auth', AuthRouter)
app.use('/admin', AdminRouter)


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

connectDB()


