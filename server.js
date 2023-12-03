require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cors = require('cors');


//AQUI IMPORTAMOS LOS CONTROLADORES DE LOS USUARIOS
const {
    newUserController,
    getUserController,
    loginController,
    getUserTweetsController,
    getMeController,
} = require("./controllers/users");



//AQUI IMPORTAMOS LOS CONTROLADORES DE LOS TWEETS
const {
    newTweetController,
    getSingleTweetController,
    getTweetsController,
    deleteTweetController,
} = require("./controllers/tweets");

const {authUser} = require("./middlewares/auth");

const app = express();
app.use(fileUpload());
app.use(cors());
app.use(express.json());


//POR AQUI PASAN TODAS LAS PETICIONES
app.use(morgan("dev"));
app.use('/uploads', express.static('./uploads'));


//ASOCIAMOS LOS CONTROLADORES A LAS RUTAS RESPECTIVAS
//AQUI DEFINIMOS LAS RUTAS DE LOS USUARIOS
app.post("/user", newUserController );
app.get("/user/:id", getUserController);
app.post("/login", loginController);
app.get('/user/:id/tweets', getUserTweetsController);
app.get('/user', authUser, getMeController);


//ASOCIAMOS LOS CONTROLADORES A LAS RUTAS RESPECTIVAS
//AQUI DEFINIMOS LAS RUTAS DE LOS TWEETS
//AUTHUSER COMPRUEBA SI EL TOKEN DEL USUARIO ES CORRECTO PARA PODER PUBLICAR UN TWEET
app.post("/", authUser, newTweetController );
app.get("/", getTweetsController);
app.get("/tweet/:id", getSingleTweetController);
app.delete("/tweet/:id", authUser, deleteTweetController);


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
      status: 'error',
      message: error.message,
    });
  });

  

//Lanzamos el servidor
app.listen(4000, () => {
    console.log("Servidor funcionando");
});