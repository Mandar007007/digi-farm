const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "config/config.env" });
const Auction = require("./models/Auction");
const path=require("path");
const user = require("./routes/User");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const server = http.createServer(app);

io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});

io.on('connection', (socket) => {
    
})


//router
app.use("/api/v1", user);


module.exports = server