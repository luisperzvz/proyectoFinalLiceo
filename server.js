require("dotenv").config();
// require("./db/initDB.js")

const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cors = require('cors');
const http = require('http');
const { initSocket } = require('./sockets/socketManager');

// const corsOptions = {
//     origin: '*', // Origen permitido, puede ser un array de URLs también
//     // methods: 'GET, POST, PUT, DELETE', // Métodos HTTP permitidos
//     // allowedHeaders: 'Content-Type,Authorization', // Encabezados permitidos
//     // credentials: true // Habilita el intercambio de cookies a través de las solicitudes de origen cruzado
// };


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
    reTweetController
} = require("./controllers/tweets");

const {
    newCommentController,
    getCommentsByTweetIdController,
    deleteCommentByIdController
} = require("./controllers/comments");

const {
    newLikesController,
    deleteLikeByIdController,
    getLikesByTweetIdController
} = require("./controllers/likes");

const {
    newFollowController,
    deleteFollowByIdController,
    getFollowByFollowedIdController
} = require("./controllers/follows");

const {
    getNotificationsController,
    deleteNotificationController
} = require("./controllers/notifications");

const {authUser} = require("./middlewares/auth");

const app = express();
const server = http.createServer(app);

app.use(cors());
// Inicializa el socket
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*'); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});
app.use(fileUpload());
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
app.post("/tweets/retweet", authUser, reTweetController);
app.get("/", getTweetsController);
app.get("/tweet/:id", getSingleTweetController);
app.delete("/tweet/:id", authUser, deleteTweetController);

// comentarios
app.post("/comments", authUser, newCommentController)
app.get("/comments/:tweetId", getCommentsByTweetIdController)
app.delete("/comments/:id", authUser, deleteCommentByIdController)

// likes
app.post("/likes", authUser, newLikesController)
app.get("/likes/:tweetId", getLikesByTweetIdController)
app.delete("/likes/:id", authUser, deleteLikeByIdController)

// follows
app.post("/follows", authUser, newFollowController)
app.get("/follows/:id", authUser,getFollowByFollowedIdController)
app.delete("/follows/:id", authUser, deleteFollowByIdController)

app.get("/notifications", authUser, getNotificationsController)
app.delete("/notifications/:id", authUser, deleteNotificationController)

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

initSocket(server);

//Lanzamos el servidor
server.listen(4000, () => {
    console.log("Servidor funcionando");
});