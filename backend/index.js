const express = require('express')
const app = express()
require('dotenv').config()
const connectDB = require('./db')
const bodyParser = require('body-parser')
const cors = require('cors')
const AuthRouter = require('./Routes/AuthRouter.js')
const EmployeesRouter = require('./Routes/EmployeesRouter.js')
const PORT = process.env.PORT || 8080



app.get('/ping', (req, res) => {
  res.send('pong')
})

app.use(bodyParser.json()) 


const corsOptions = {
    origin: ['https://mern-app-kappa-tan.vercel.app'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true,
};

app.use(cors(corsOptions));


app.use('/auth', AuthRouter)
app.use('/admin', EmployeesRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

connectDB()
