
//DEFINIMOS LOS CONTROLADORES DE USUARIOS

const newUserController = async (req, res, next) => {

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

const getUserController = async (req, res, next) => {
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


const loginController = async (req, res, next) => {
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
    newUserController,
    getUserController,
    loginController,
};

