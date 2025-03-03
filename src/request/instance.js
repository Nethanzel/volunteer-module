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
        newMember: async (data) => {
            let result = await Requester.post('api/creators/miembro', data, { headers: { Authorization: "*" } });
            return result
        },
        newStation: async (data) => {
            let result = await Requester.post('api/creators/escuela', data, { headers: { Authorization: "*" } });
            return result
        },
        newDepartment: async (data) => {
            let result = await Requester.post('api/creators/grado', data, { headers: { Authorization: "*" } });
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
        tipoMiembros: async () => {
            let tipos = await Requester.get('api/common/tipo-miembro', { headers: { Authorization: "*" } });
            return tipos;
        },
        Grados: async () => {
            let grados = await Requester.get('api/common/grados', { headers: { Authorization: "*" } });
            return grados;
        },
        Escuelas: async () => {
            let escuelas = await Requester.get('api/common/escuelas', { headers: { Authorization: "*" } });
            return escuelas;
        },
        tipoEntrenamientos: async () => {
            let tipos = await Requester.get('api/common/tipo-entrenamiento');
            return tipos;
        },
        Permisos: async () => {
            let permisos = await Requester.get('api/getters/permisos', { headers: { Authorization: "*" } });
            return permisos;
        },
        Miembros: async (page) => {
            let miembros = await Requester.get(`api/getters/miembros?page=${page}`, { headers: { Authorization: "*" } });
            return miembros;
        },
        Miembro: async (identity) => {
            let miembro = await Requester.get(`api/getters/miembro?id=${identity}`, { headers: { Authorization: "*" } });
            return miembro;
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
            let result = await Requester.get(`api/common/identification-existis?${identity ? `identity=${identity}` : ''}${email ? `&email=${email}` : ''}`);
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
        removeEscuela: async (id) => {
            let response = await Requester.delete(`api/erase/escuela?id=${id}`, { headers: { Authorization: '*' } });
            return response;
        },
        removeDepartment: async (id) => {
            let response = await Requester.delete(`api/erase/level?id=${id}`, { headers: { Authorization: '*' } });
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
        UpdateMiembro: async (field, status = false) => {
            let response = await Requester.patch(`api/setters/miembro${ status ? '/status' : '' }`, field, { headers: { Authorization: "*" } });
            return response;
        },
        UpdateDepartment: async (field) => {
            let response = await Requester.patch('api/setters/level', field, { headers: { Authorization: "*" } });
            return response;
        },
        UpdateStacion: async (field) => {
            let response = await Requester.patch('api/setters/escuela', field, { headers: { Authorization: "*" } });
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
        restoreEscuela: async (id) => {
            let response = await Requester.patch(`api/setters/restore/escuela?id=${id}`, null, { headers: { Authorization: '*' } });
            return response;
        },
        restoreDepartment: async (id) => {
            let response = await Requester.patch(`api/setters/restore/level?id=${id}`, null, { headers: { Authorization: '*' } });
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