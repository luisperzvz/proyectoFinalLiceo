const jwt = require("jsonwebtoken");
const { generateError } = require("../helpers");

const authUser = (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if(!authorization) {
            throw generateError("Falta la autorizacion", 401);
        }

        //COMPROBAMOS QUE EL TOKEN SEA EL CORRECTO
        let token;

        try {
            token = jwt.verify(authorization, process.env.SECRET)
        } catch {
            throw generateError("Token incorrecto", 401);
        }


        //INTRODUCIMOS LA INFORMACION DEL TOKEN EN LA REQUEST PARA USARLA EN EL CONTROLADOR
        req.userId = token.id;


        //SALTAMOS AL CONTROLADOR
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authUser,
};