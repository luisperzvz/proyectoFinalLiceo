//DEFINIMOS LOS CONTROLADORES DE LOS TWEETS

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
        res.send({
            status: "error",
            message: "No implementado"
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