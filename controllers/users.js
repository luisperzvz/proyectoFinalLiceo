const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateError} = require("../helpers");
const {createUser, getUserById, getUserByEmail}  = require("../db/users");
const { getTweetsByUserId } = require('../db/tweets');


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
        const {email, password} = req.body;

        if (!email || !password) {
            throw generateError("Debes enviar un email y una contraseña", 400);
        }
//RECOJO LOS DATOS DE LA BBDD DEL USUARIO CON ESE EMAIL
        const user = await getUserByEmail(email);

    //COMPRUEBO SI LAS CONTRASEÑAS COINCIDEN
    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword) {
        throw generateError("La contraseña no coincide", 401);
    }
    //CREO EL PLAYLOAD DEL TOKEN
    const payload = { id: user.id };


    //FIRMO EL TOKEN
    const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "30d"
    });

    //ENVIO EL TOKEN



        res.send({
            status: "Ok",
            data: token,
        });

    } catch(error) {
        next(error);
    }
};


const getMeController = async (req, res, next) => {
  try {
    const user = await getUserById(req.userId, false);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


const getUserTweetsController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getTweetsByUserId(id);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//AQUI LOS EXPORTAMOS
module.exports = {
    newUserController,
    getUserController,
    loginController,
    getMeController,
    getUserTweetsController,
};

