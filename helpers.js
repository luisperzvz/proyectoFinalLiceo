const fs = require("fs/promises");
const generateError = (message, status) => {
    const error = new Error(message);
    error.httpStatus = status;
    return error;
};

const createPathIfNotExists = async (path) => {
    try {
        await fs.access(path);
    } catch {
        await fs.mkdir(path);
    }
};


module.exports = {
    generateError,
    createPathIfNotExists,
};

//FUNCION PARA NO TENER QUE ESCRIBIR QUE TIPO DE ERROR ES EN USERS.JS Y TWEETS.JS SINO QUE LO HACE AUTOMATICAMENTE