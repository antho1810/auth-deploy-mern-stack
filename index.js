const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors")

dotenv.config()
// Conexion DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log("mongoDB is Connected")).catch((err) => console.log(err))

app.use(express.json());
app.use(cors())

app.use("/auth", require("./routes/user"))

// Server build
if(process.env.NODE_ENV === production){
    app.use(express.static("front-auth/build"))
    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'front-auth', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=> console.log(`Server is running in the port ${PORT}`))