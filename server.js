require("dotenv").config();

const express = require("express");
const morgan = require("morgan");


//AQUI IMPORTAMOS LOS CONTROLADORES DE LOS USUARIOS
const {
    newUserController,
    getUserController,
    loginController,
} = require("./controllers/users");



//AQUI IMPORTAMOS LOS CONTROLADORES DE LOS TWEETS
const {
    newTweetController,
    getSingleTweetController,
    getTweetsController,
    deleteTweetController,
} = require("./controllers/tweets");

const app = express();


//POR AQUI PASAN TODAS LAS PETICIONES
app.use(morgan("dev"));


//ASOCIAMOS LOS CONTROLADORES A LAS RUTAS RESPECTIVAS
//AQUI DEFINIMOS LAS RUTAS DE LOS USUARIOS
app.post("/user", newUserController );
app.get("user/:id", getUserController);
app.post("/login", loginController)


//ASOCIAMOS LOS CONTROLADORES A LAS RUTAS RESPECTIVAS
//AQUI DEFINIMOS LAS RUTAS DE LOS TWEETS
app.post("/", newTweetController );
app.get("/", getTweetsController);
app.get("/tweet/:id", getSingleTweetController);
app.delete("/tweet/:id", deleteTweetController)


//Para error de 404
app.use((req, res) => {
    res.status(404).send({
        status: "error",
        message: "Not found",
    });
});


//Para gestion de errores de nuestro servidor
app.use((error, req, res, next) => {
    console.error(error);

    res.status(error.httpStatus || 500).send({
        status: "error",
        message: error.message,
    })
})

//Lanzamos el servidor
app.listen(3000, () => {
    console.log("Servidor funcionando");
})