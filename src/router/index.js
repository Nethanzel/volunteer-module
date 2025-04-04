import Vue from 'vue'
import store from '../store';
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/register',
    name: 'Registrar',
    component: () => import('../views/RegisterForm.vue'),
    meta: {}
  },
  {
    path: '/member-list',
    name: 'Miembros',
    component: () => import('../views/Members.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: ['QVL']
    }
  },
  {
    path: '/options',
    name: 'Opciones',
    component: () => import('../views/Options.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/schools',
    name: 'Escuelas',
    component: () => import('../views/Schools.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: ['VE']
    }
  },
  {
    path: '/levels',
    name: 'Grados',
    component: () => import('../views/Levels.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: ['VD']
    }
  },
  {
    path: '/user-types',
    name: 'TiposMiembro',
    component: () => import('../views/UserTypes.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: ['VVT']
    }
  },
  {
    path: '/highlights',
    name: 'Highlights',
    component: () => import('../views/Highlights.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: ['QH']
    }
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('../views/Schedule.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: ['QPS']
    }
  },
  {
    path: '/practice',
    name: 'Practicas',
    component: () => import('../views/Practicas.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: ['QPR']
    }
  },
  {
    path: '/confirm-member',
    name: 'ExternalMemberQuery',
    component: () => import('../views/ExternalMemberQuery.vue'),
    meta: {}
  },
  {
    path: '*',
    name: 'No encontrado',
    component: () => import('../views/NotFound.vue'),
    meta: {}
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0);

    let authorized = store.state.hasAuthorization;

    if (to.matched.some(x => x.meta.requiresAuth)) {
        if (!authorized) {
            if (to.name != 'Opciones' && typeof Vue.prototype.$throwAppMessage === 'function') {
                Vue.prototype.$throwAppMessage({ 
                message: "Autenticacion requerida",
                icon: "icofont-warning",
                type: 'warn',
                });
            }
            next({ name:"Login" });
            return;
        }
        if (to.meta?.requiredPermission?.length > 0) {
            if (!store.getters.isAllowedToPermission(to.meta.requiredPermission)) {
                if (typeof Vue.prototype.$throwAppMessage === 'function') {
                    Vue.prototype.$throwAppMessage({ 
                    message: "No tiene los permisos requeridos",
                    icon: "icofont-warning",
                    type: 'warn',
                    });
                }
                next({ name:'Opciones' });
                return;
            }
        }
        next();
    }
    else {
        if (to.name != from.name) next();
    }
});

export default router
