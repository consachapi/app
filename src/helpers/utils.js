export default {
    customMessage(status, msg){
        let message = "Ups!!!. Ocurrio un error.";
        if(status === 401){
            message = "Ud. no tiene autorización para este proceso."
        }
        if(status === 403){
            message = "No tienes permisos para este proceso.";
        }
        if(status === 400 || status === 404 || status === 409 || status === 417){
            message = msg;
        }
        if(status === 500){
            message = "Ups!!!. Ocurrio un error. Vuelve a intentarlo.";
        }
        return message;
    }
}