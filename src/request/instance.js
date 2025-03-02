import Vue from "vue";
import axios from "axios";
import store from "../store";
import router from "../router";

const Requester = axios.create({
    baseURL: "http://127.0.0.1:81/"
    //baseURL: "https://volunteer-module.herokuapp.com/"
});

Requester.interceptors.response.use((response) => response, (err) => {
    const requiresAuth = (router.currentRoute.meta?.requiresAuth && router.currentRoute.meta.requiresAuth == true);

    if (err.response.status == 400) {
        if (typeof Vue.prototype.$throwAppMessage === 'function') {
            Vue.prototype.$throwAppMessage({ 
                message: err.response.data?.message ?? "Error del cliente",
                icon: "icofont-close-circled",
                type: 'error',
            });
        }
    }
    else if (err.response.status == 401) {
        store.commit("endSession", requiresAuth);
        if (typeof Vue.prototype.$throwAppMessage === 'function' && requiresAuth) {
            Vue.prototype.$throwAppMessage({ 
                message: err.response.data?.message ?? "Autenticacion requerida",
                icon: "icofont-warning",
                type: 'warn',
            });
        }
    } 
    else if (err.response.status == 403) {
        //if (requiresAuth) router.back();
        if (typeof Vue.prototype.$throwAppMessage === 'function') {
            Vue.prototype.$throwAppMessage({ 
                message: err.response.data?.message ?? "Acceso limitado",
                icon: "icofont-warning",
                type: 'warn',
            });
        }
    }
    else if (err.response.status == 404) {
        if (typeof Vue.prototype.$throwAppMessage === 'function') {
            Vue.prototype.$throwAppMessage({ 
                message: err.response.data?.message ?? "Recurso no encontrado",
                icon: "icofont-warning",
                type: 'warn',
            });
        }
    }
    else if (err.response.status >= 500) {
        if (typeof Vue.prototype.$throwAppMessage === 'function') {
            Vue.prototype.$throwAppMessage({ 
                message: err.response.data?.message ?? err.message,
                icon: "icofont-close-circled",
                type: 'error',
            });
        }
    }
    else if (requiresAuth) {
        if (typeof Vue.prototype.$throwAppMessage === 'function') {
            Vue.prototype.$throwAppMessage({ 
                message: err.response.data?.message ?? err.message,
                icon: "icofont-close-circled",
                type: 'error',
            });
        }
    }
    else {
        if (typeof Vue.prototype.$throwAppMessage === 'function') {
            Vue.prototype.$throwAppMessage({ 
                message: err.response.data?.message ?? err.message,
                icon: "icofont-close-circled",
                type: 'error',
            });
        }
    }
    return Promise.reject(err);
});

Requester.interceptors.request.use((request) => {
    if (request.headers.Authorization == "*") request.headers.Authorization = store.getters["getAuthorization"]();
    return request;
});

const axiosRequest = {
    Post: {
        newVolunteer: async (data) => {
            let result = await Requester.post('api/creators/voluntario', data, { headers: { Authorization: "*" } });
            return result
        },
        newStation: async (data) => {
            let result = await Requester.post('api/creators/estacion', data, { headers: { Authorization: "*" } });
            return result
        },
        newDepartment: async (data) => {
            let result = await Requester.post('api/creators/departamento', data, { headers: { Authorization: "*" } });
            return result
        },
        newUserType: async (data) => {
            let result = await Requester.post('api/creators/user-type', data, { headers: { Authorization: "*" } });
            return result
        },
        uploadFile: async (formData, pcb) => {
            let res = await Requester.post(`/api/files/upload`, formData, { headers: { Authorization: '*' }, onUploadProgress: pcb });
            return res;
        },
        login: async (credentials) => {
            let result = await Requester.post('api/authorize/login', credentials);
            return result
        }
    },
    Get: {
        tipoVoluntarios: async () => {
            let tipos = await Requester.get('api/common/user-types', { headers: { Authorization: "*" } });
            return tipos;
        },
        Departamentos: async () => {
            let departamentos = await Requester.get('api/common/departamentos', { headers: { Authorization: "*" } });
            return departamentos;
        },
        Estaciones: async () => {
            let estaciones = await Requester.get('api/common/estaciones', { headers: { Authorization: "*" } });
            return estaciones;
        },
        Permisos: async () => {
            let permisos = await Requester.get('api/getters/permisos', { headers: { Authorization: "*" } });
            return permisos;
        },
        Voluntarios: async (page) => {
            let voluntarios = await Requester.get(`api/getters/voluntarios?page=${page}`, { headers: { Authorization: "*" } });
            return voluntarios;
        },
        Voluntario: async (identity) => {
            let voluntario = await Requester.get(`api/getters/voluntario?id=${identity}`, { headers: { Authorization: "*" } });
            return voluntario;
        },
        Files: async (identity) => {
            let files = await Requester.get(`api/files?id=${identity}`, { headers: { Authorization: "*" } });
            return files;
        },
        DownloadFile: async (identity, pcb) => {
            let files = await Requester.get(`api/files/download?id=${identity}`, { responseType: 'blob' , headers: { Authorization: "*" }, onDownloadProgress: pcb });
            return files;
        },
        validateAccess: async () => {
            let result = await Requester.get('api/authorize', { headers: { Authorization: "*" } });
            return result
        },
        validateIdentityExists: async (identity, email) => {
            let result = await Requester.get(`api/common/identification-existis?identity=${identity}&email=${email}`);
            return result
        }
    },
    Delete: {
        removeContact: async (data) => {
            let response = await Requester.delete('api/erase/remove-contact', { headers: { Authorization: '*' }, data });
            return response;
        },
        removeAcademicPrep: async (data) => {
            let response = await Requester.delete('api/erase/remove-academic', { headers: { Authorization: '*' }, data });
            return response;
        },
        removeUserType: async (id) => {
            let response = await Requester.delete(`api/erase/user-type?id=${id}`, { headers: { Authorization: '*' } });
            return response;
        },
        removeEstacion: async (id) => {
            let response = await Requester.delete(`api/erase/estacion?id=${id}`, { headers: { Authorization: '*' } });
            return response;
        },
        removeDepartment: async (id) => {
            let response = await Requester.delete(`api/erase/department?id=${id}`, { headers: { Authorization: '*' } });
            return response;
        },
        removeFile: async (data) => {
            let response = await Requester.delete(`api/files/status`, { headers: { Authorization: '*' }, data });
            return response;
        }
    },
    Put: {
       
    },
    Patch: {
        UpdateVoluntario: async (field, status = false) => {
            let response = await Requester.patch(`api/setters/voluntario${ status ? '/status' : '' }`, field, { headers: { Authorization: "*" } });
            return response;
        },
        UpdateDepartment: async (field) => {
            let response = await Requester.patch('api/setters/department', field, { headers: { Authorization: "*" } });
            return response;
        },
        UpdateStacion: async (field) => {
            let response = await Requester.patch('api/setters/estacion', field, { headers: { Authorization: "*" } });
            return response;
        },
        UpdateUserType: async (field) => {
            let response = await Requester.patch('api/setters/user-type', field, { headers: { Authorization: "*" } });
            return response;
        },
        allowAccess: async (field) => {
            let response = await Requester.patch('api/setters/allow-access', field, { headers: { Authorization: "*" } });
            return response;
        },
        addPermission: async (data) => {
            let response = await Requester.patch('api/setters/add-permission', data, { headers: { Authorization: "*" } });
            return response;
        },
        removePermission: async (data) => {
            let response = await Requester.patch('api/setters/remove-permission', data, { headers: { Authorization: "*" } });
            return response;
        },
        addContact: async (data) => {
            let response = await Requester.patch('api/setters/add-contact', data, { headers: { Authorization: "*" } });
            return response;
        },
        addAcademicPrep: async (data) => {
            let response = await Requester.patch('api/setters/add-academic', data, { headers: { Authorization: "*" } });
            return response;
        },
        restoreUserType: async (id) => {
            let response = await Requester.patch(`api/setters/restore/user-type?id=${id}`, null, { headers: { Authorization: '*' } });
            return response;
        },
        restoreEstacion: async (id) => {
            let response = await Requester.patch(`api/setters/restore/estacion?id=${id}`, null, { headers: { Authorization: '*' } });
            return response;
        },
        restoreDepartment: async (id) => {
            let response = await Requester.patch(`api/setters/restore/department?id=${id}`, null, { headers: { Authorization: '*' } });
            return response;
        },
        restoreFile: async (data) => {
            let response = await Requester.patch(`api/files/status`, data, { headers: { Authorization: '*' } });
            return response;
        },
        setFilename: async (data) => {
            let response = await Requester.patch(`api/files`, data, { headers: { Authorization: '*' } });
            return response;
        },
    },
    Instance: Requester
};

export default axiosRequest;