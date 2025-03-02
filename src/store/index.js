import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router';
import { bufferToBase64 } from '../utils/image.js';
import { arraysAreEqual } from '../utils/modelValidate.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        validatingAccess: true,
        hasAuthorization: false,
        userData: null
    },
    getters: {
        isAuthorized: (state) => state.hasAuthorization,
        isValidatingAccess: (state) => state.validatingAccess,
        getAuthorization: () => () => localStorage.getItem("authorization") ?? "*",
        userImage: (state) => bufferToBase64(state.userData.userImg.data.data, state.userData.userImg.mime),
        isAllowedToPermission: (state) => (requiredKeys) => {
            let userHas = state.userData?.permissions?.filter((p) => requiredKeys.includes(p));
            if (!arraysAreEqual(userHas, requiredKeys)) return false;
            return true;
        }
    },
    mutations: {
        stopValidating: (state) => state.validatingAccess = false,
        setUserData: (state, data) => {
            state.userData = data;
            state.hasAuthorization = true;
        },
        startSession: (state, data) => {
            state.hasAuthorization = true;
            state.userData = data.user;
            localStorage.setItem("authorization", data.key);
            router.push({ name: "Opciones" });
        },
        endSession: (state, requiresAuth) => {
            localStorage.removeItem("authorization");
            if (requiresAuth) router.push({ name: 'Login' });
        }
    },
    actions: {
    },
    modules: {
    }  
});
