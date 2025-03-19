<template>
    <div class="navigation" @click="clickCatch($event)">
        <span class="_close" @click="ShowHideManu()"><i class="icofont-close-squared-alt"></i></span>
        <div class="float_menu_icon" @click="ShowHideManu()" v-if="!showMenu && $store.getters.isAuthorized"><i class="icofont-navigation-menu"></i></div>
        <div class="routes">
            <h3>Hola {{ $store.getters.userFirstName }}</h3>
            <router-link :to="{ name: 'Registrar'}"><i class="icofont-duotone icofont-add-users"></i> Registro</router-link>
            <router-link :to="{ name: 'Miembros'}" v-if="_allowViewAllUserPermission"><i class="icofont-people"></i> Listado de miembros</router-link>
            <router-link :to="{ name: 'Escuelas'}"><i class="icofont-university"></i> Escuelas</router-link>
            <router-link :to="{ name: 'Grados'}"><i class="icofont-duotone icofont-cogs"></i> Grados</router-link>
            <router-link :to="{ name: 'TiposMiembro'}"><i class="icofont-duotone icofont-groups"></i> Tipos de miembro</router-link>
            <router-link :to="{ name: 'Highlights'}" v-if="_allowViewAllHighlightPermission"><i class="icofont-star"></i> Highlights</router-link>
            <router-link :to="{ name: 'Schedule'}" v-if="_allowViewAllPracticeSchedulePermission"><i class="icofont-tasks-alt"></i> Horarios de práctica</router-link>
            <router-link :to="{ name: 'Practicas'}" v-if="_allowViewAllPracticePermission"><i class="icofont-tasks"></i> Prácticas y asistencia</router-link>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            showMenu: false
        }
    },
    methods: {
        ShowHideManu(updated = false) {
            if (!updated) this.showMenu = !this.showMenu;

            if (this.showMenu) {
                this.$parent.$refs.nav_cnt.classList.add("aside-show");
                this.$parent.$refs.nav_cnt.classList.remove("aside-hide");
            }
            else {
                this.$parent.$refs.nav_cnt.classList.add("aside-hide");
                this.$parent.$refs.nav_cnt.classList.remove("aside-show");
            }
        },
        clickCatch(e) {
            e.stopPropagation();
        },
        parentHideMenu() {
            if (this.showMenu) this.ShowHideManu();
        }
    },
    mounted() {
        this.$emit("ready", this.parentHideMenu)
    },
    watch: {
        $route() {
            this.showMenu = false;
            this.ShowHideManu(true);
        }
    },
    computed: {
        _allowViewAllUserPermission() {
            return this.$store.getters.isAllowedToPermission(['QVL'])
        },
        _allowViewAllHighlightPermission() {
            return this.$store.getters.isAllowedToPermission(['QH'])
        },
        _allowViewAllPracticeSchedulePermission() {
            return this.$store.getters.isAllowedToPermission(['QPS']) 
        },
        _allowViewAllPracticePermission() {
            return this.$store.getters.isAllowedToPermission(['QPR']) 
        }
    }
}
</script>

<style lang="scss" scoped>
.navigation {
    display: flex;
    flex-direction: column;
    background-color: #e6e6e6;
    max-width: 320px;
    min-width: 300px;
    height: 100%;

    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    
    .float_menu_icon {
        position: fixed;
        top: 5px;
        left: calc(100% + 80px);
        z-index: 500;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        cursor: pointer;

        i {

            scale: 1.5;
            color: #e6e6e6;
        }
        background-color: rgb(0, 0, 0);
    }

    ._close {
        color: #f00;
        padding: 5px;
        font-size: 27px;
        cursor: pointer;
        margin: 0 0 0 auto;
    }

    .routes {
        display: flex;
        flex-direction: column;
        padding: 10px 15px 20px 15px;
        a {
            margin: 5px 0;
            padding: 10px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            i {
                font-size: 25px;
                margin-right: 10px;
            }
            &:hover {
                background-color: #777777;
                color: #e6e6e6;
            }
        }
        h3 {
            margin-bottom: 15px;
            margin-left: 10px;
            cursor: default;
        }
    }
}

@media only screen and (max-width: 470px) {
    .navigation {
        .float_menu_icon {
            left: calc(100% + 70px);
        }
    }
}
</style>