const generateError = (message, status) => {
    const error = new Error(message);
    error.httpStatus = status;
    return error;
}

module.exports = {
    generateError,
}

//FUNCION PARA NO TENER QUE ESCRIBIR QUE TIPO DE ERROR ES EN USERS.JS Y TWEETS.JS SINO QUE LO HACE AUTOMATICAMENTE