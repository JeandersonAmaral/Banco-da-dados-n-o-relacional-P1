const mongoose = require("mongoose");

function ConnectMongoDB(){
    mongoose.connect(process.env.MONGODB_URI).then(() => {
    }).catch(error => {
        console.log("Erro ao conectar com o servidor", error);
    });
}

module.exports = ConnectMongoDB;
