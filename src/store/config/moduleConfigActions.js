import UnidadEjecutoraService from '../../http/configuracion/unidad-ejecutora-service.js';
import utils from '../../helpers/utils.js';

export default {
    fetchAll(context){
        return new Promise( (resolve, reject) => {
            UnidadEjecutoraService.fecthAll()
            .then( response => {
                if(response.status === 200){
                    resolve(response.data);
                }
                reject({ status: response.status, message: 'Verifique la información procesada.' });
            })
            .catch( error => {
                if(error.message === 'Network Error'){
                    const status = 401;
                    const message = 'Ocurrio algún error en el sistema. Comunicarse con el Administrador'
                    reject({ status, message });
                }
                const status = error.response.status;
                const message = utils.customMessage(status, error.response.data.message);
                reject({ status, message });
            });
        });
    },

    create(context, params){
        return new Promise( (resolve, reject) => {
            UnidadEjecutoraService.create(params)
            .then( response => {
                if(response.status === 201){
                    resolve(response.data);
                }
                reject({ status: response.status, message: 'Verifique la información procesada.' });
            })
            .catch( error => {
                if(error.message === 'Network Error'){
                    const status = 401;
                    const message = 'Ocurrio algún error en el sistema. Comunicarse con el Administrador'
                    reject({ status, message });
                }
                const status = error.response.status;
                const message = utils.customMessage(status, error.response.data.message);
                reject({ status, message });
            });
        });
    },

    find(context, id){
        return new Promise( (resolve, reject) => {
            UnidadEjecutoraService.findById(id)
            .then( response => {
                if(response.status === 200){
                    resolve(response.data);
                }
                reject( {status: response.status, message: 'Verifique la busqueda de la Unidad Ejec.'} );
            })
            .catch( error => {
                if(error.message === 'Network Error'){
                    const status = 401;
                    const message = 'Ocurrio algún error en el sistema. Comunicarse con el Administrador'
                    reject({ status, message });
                }
                const status = error.response.status;
                const message = utils.customMessage(status, error.response.data.message);
                reject({ status, message });
            });
        });
    },

    update(context, paylod){
        return new Promise( (resolve, reject) => {
            UnidadEjecutoraService.update(paylod)
            .then( response => {
                if(response.status === 200){
                    resolve(response.data);
                }
                reject( {status: response.status, message: 'Verifique los datos para actualizar.'} );
            })
            .catch( error => {
                if(error.message === 'Network Error'){
                    const status = 401;
                    const message = 'Ocurrio algún error en el sistema. Comunicarse con el Administrador'
                    reject({ status, message });
                }
                const status = error.response.status;
                const message = utils.customMessage(status, error.response.data.message);
                reject({ status, message });
            });
        });
    },

    disabled(context, id){
        return new Promise( (resolve, reject) => {
            UnidadEjecutoraService.disabled(id)
            .then( response => {
                if(response.status === 204){
                    resolve(response);
                }
                reject( {status: response.status, message: 'Verifique los datos para actualizar.'} );
            })
            .catch( error => {
                if(error.message === 'Network Error'){
                    const status = 401;
                    const message = 'Ocurrio algún error en el sistema. Comunicarse con el Administrador'
                    reject({ status, message });
                }
                const status = error.response.status;
                const message = utils.customMessage(status, error.response.data.message);
                reject({ status, message });
            });
        });
    },

    enabled(context, id){
        return new Promise( (resolve, reject) => {
            UnidadEjecutoraService.enabled(id)
            .then( response => {
                if(response.status === 204){
                    resolve(response);
                }
                reject( {status: response.status, message: 'Verifique los datos para actualizar.'} );
            })
            .catch( error => {
                if(error.message === 'Network Error'){
                    const status = 401;
                    const message = 'Ocurrio algún error en el sistema. Comunicarse con el Administrador'
                    reject({ status, message });
                }
                const status = error.response.status;
                const message = utils.customMessage(status, error.response.data.message);
                reject({ status, message });
            });
        });
    }

}