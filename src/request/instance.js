import axios from "axios";

const Requester = axios.create({
    baseURL: "http://localhost:81/"
});

const axiosRequest = {
    Post: {
        newVolunteer: async (data) => {
            let result = await Requester.post('api/creators/voluntario', {data});
            return result
        }
    },
    Get: {
        tipoVoluntarios: async () => {
            let tipos = await Requester.get('api/common/tipovoluntarios');
            return tipos;
        },
        Departamentos: async () => {
            let departamentos = await Requester.get('api/common/departamentos');
            return departamentos;
        },
        Estaciones: async () => {
            let estaciones = await Requester.get('api/common/estaciones');
            return estaciones;
        },
        Voluntarios: async (page) => {
            let voluntarios = await Requester.get(`api/getters/voluntarios?page=${page}`);
            return voluntarios;
        },
        Voluntario: async (identity) => {
            let voluntario = await Requester.get(`api/getters/voluntario?id=${identity}`);
            return voluntario;
        }
    },
    Delete: {

    },
    Put: {

    }
};

export default axiosRequest;