import express from "express"
import routes from "./src/routes/appRoutes"
import mongoose  from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"

const app = express()
const PORT = 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/APPdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// bodyparser
app.use(bodyParser.urlencoded( {extended: true }));
app.use(bodyParser.json())
app.use(cors())


routes(app)

app.get("/", (req, res) => {
    res.send(`node and express server running on port ${PORT}`)
})

app.listen(PORT,  () => {
    console.log(`your server is running on port ${PORT}`)
})