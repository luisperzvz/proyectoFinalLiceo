//DEFINIMOS LOS CONTROLADORES DE LOS TWEETS

const { generateError } = require("../helpers");
const {createTweet} = require('../db/tweets');

const getTweetsController = async (req, res, next) => {
    //CUALQUIER ERROR QUE SE ENCUENTRE EN EL TRY, PASARÁ AL CATCH, EL CUAL LO REDIGIRÁ A SERVER.JS DONDE SE ENCUENTRAN EL GESTOR DE ERRORES
    try {
        res.send({
            status: "error",
            message: "No implementado"
        });

    } catch(error) {
        next(error);
    }
};


const newTweetController = async (req, res, next) => {
    //CUALQUIER ERROR QUE SE ENCUENTRE EN EL TRY, PASARÁ AL CATCH, EL CUAL LO REDIGIRÁ A SERVER.JS DONDE SE ENCUENTRAN EL GESTOR DE ERRORES
    

    try {

        const {text} = req.body;

    if(!text || text.length > 280) {
        throw generateError(`Debes existir un Tweet y tener menos de 280 caracteres`, 400);
    }

    const id = await createTweet(req.userId, text);
        res.send({
            status: "Ok",
            message: `Tweet con id: ${id} creado correctamente`,
        });

    } catch(error) {
        next(error);
    }
};



const getSingleTweetController = async (req, res, next) => {
    //CUALQUIER ERROR QUE SE ENCUENTRE EN EL TRY, PASARÁ AL CATCH, EL CUAL LO REDIGIRÁ A SERVER.JS DONDE SE ENCUENTRAN EL GESTOR DE ERRORES
    try {
        res.send({
            status: "error",
            message: "No implementado"
        });

    } catch(error) {
        next(error);
    }
};



const deleteTweetController = async (req, res, next) => {
    //CUALQUIER ERROR QUE SE ENCUENTRE EN EL TRY, PASARÁ AL CATCH, EL CUAL LO REDIGIRÁ A SERVER.JS DONDE SE ENCUENTRAN EL GESTOR DE ERRORES
    try {
        res.send({
            status: "error",
            message: "No implementado"
        });

    } catch(error) {
        next(error);
    }
};

//AQUI LOS EXPORTAMOS
module.exports = {
    newTweetController,
    getSingleTweetController,
    getTweetsController,
    deleteTweetController,
};