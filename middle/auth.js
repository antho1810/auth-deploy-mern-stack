const jwt = require("jsonwebtoken")

// Authentication middle
exports.requireLogin = (req, res, next )=>{
    try{
        if(req.headers.authorization){
            const token = req.headers.authorization.split(' ')[1]
            // Verificacion token
            const decode =  jwt.verify(token, process.env.JWT_SECRET)
            // Adjuntar token al request
            req.user = decode;
            next();
        } else{
            return res.status(400).json({message: "No Autorizado"})
        }
    } catch (err) {
        console.log("Something went wrong")
    }
}