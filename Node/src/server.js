const express = require("express");
const cors = require("cors");
const path = require("path");
const opn = require("opn");
const app = express();
const userRoutes = require("./routes/userRoutes");
require("dotenv").config({ path: './.env'});
const ConnectMongoDB = require('./config/database');

ConnectMongoDB();

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use(express.static(path.join(__dirname, './public')));
app.get("/", (req, res) => {
    const loginPagePath = path.join(__dirname, "./views/login.html");
    res.sendFile(loginPagePath);
});

const server = app.listen(process.env.PORT || 3000, () => {
    const { address, port } = server.address();
    const hostname = address === "::" ? "localhost" : address;
    const url = `http://${hostname}:${port}/`; 
    console.log("\x1b[34mConexão com MongoDB estabelecida com sucesso!\x1b[0m");
    setTimeout(() => {
        console.log("\x1b[34mServidor rodando no endereço local: \x1b[31m", url);
        setTimeout(() => {
            console.log("\x1b[34mRedirecionando...\x1b[0m");
            setTimeout(() => {
                opn(url);
            }, 2000);
        }, 2000);
    }, 2000);
});