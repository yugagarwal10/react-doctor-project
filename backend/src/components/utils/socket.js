const io = require("socket.io")(4000,{
    cors: {
        origin: "http://localhost:3000"
    }
})

module.exports={io};