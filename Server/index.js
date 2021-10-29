const express = require("express");

const app = express();


const server = app.listen(4001, ()=>{
    console.log("server is running at localhost:4001");
})

require("./socket")(server);