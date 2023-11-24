const {generateError} = require("../helpers");
const {createUser, getUserById}  = require("../db/users");

//DEFINIMOS LOS CONTROLADORES DE USUARIOS

const newUserController = async (req, res, next) => {

//CUALQUIER ERROR QUE SE ENCUENTRE EN EL TRY, PASARÁ AL CATCH, EL CUAL LO REDIGIRÁ A SERVER.JS DONDE SE ENCUENTRAN EL GESTOR DE ERRORES
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            throw generateError("Debes enviar un email y una contraseña", 400);
        }

        const id = await createUser(email, password);


        res.send({
            status: 'Ok',
            message: `Usuario creado con id: ${id}`,
        });

    } catch (error) {
        next(error);
    }
};

const getUserController = async (req, res, next) => {
    //CUALQUIER ERROR QUE SE ENCUENTRE EN EL TRY, PASARÁ AL CATCH, EL CUAL LO REDIGIRÁ A SERVER.JS DONDE SE ENCUENTRAN EL GESTOR DE ERRORES
    try {
  
        const { id } = req.params;
    
        const user = await getUserById(id);
    
        res.send({
          status: 'Ok',
          data: user,
        });
      } catch (error) {
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

