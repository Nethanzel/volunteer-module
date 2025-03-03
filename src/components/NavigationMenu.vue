<template>
    <div class="navigation" @click="clickCatch($event)">
        <span class="_close" @click="ShowHideManu()"><i class="icofont-close-squared-alt"></i></span>
        
        <div class="float_menu_icon" @click="ShowHideManu()" v-if="!showMenu && $store.getters.isAuthorized"><i class="icofont-navigation-menu"></i></div>

        <div class="routes">
            <router-link :to="{ name: 'Registrar'}"><i class="icofont-duotone icofont-add-users"></i> Registro</router-link>
            <router-link :to="{ name: 'Miembros'}" v-if="_allowViewAllUserPermission"><i class="icofont-duotone icofont-groups"></i> Listado de miembros</router-link>
            <router-link :to="{ name: 'Escuelas'}"><i class="icofont-duotone icofont-cogs"></i> Escuelas</router-link>
            <router-link :to="{ name: 'Grados'}"><i class="icofont-duotone icofont-cogs"></i> Grados</router-link>
            <router-link :to="{ name: 'TiposMiembro'}"><i class="icofont-duotone icofont-cogs"></i> Tipos de miembro</router-link>
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
        top: 10px;
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
        padding: 20px;
        a {
            margin: 10px 0;
            text-decoration: none;
            display: inline-flex;
            align-items: center;

            i {
                font-size: 25px;
                margin-right: 10px;
            }
        }
    }
}
</style>