<template>
    <div class="viewHead">

        <div class="logo">
            <router-link :to="{ name: 'Home'}">
                <img 
                    :src="logoToShow" 
                    alt="logo"
                >
            </router-link>
        </div>

        <div class="options">
            <router-link v-if="!$store.getters.isAuthorized && $route.name != 'Registrar'" :to="{ name:'Registrar' }">
                <i class="icofont-duotone icofont-add-users" :style="{ paddingBottom:'5px' }"></i> Inscribirme
            </router-link>
                
            <p v-if="$route.name != 'Login'" @click="userIconAction()" :style="{ cursor:'pointer', marginLeft:'25px' }">
                <template v-if="!$store.getters.isValidatingAccess">
                    <span v-if="!$store.getters.isAuthorized"><i class="icofont-duotone icofont-user"></i></span>
                    <img v-else :src="$store.getters.userImage" class="user-image" alt="user image">
                </template>
                <img v-else class="rotating" src="../assets/spinner.png" alt="loadin" :style="{ pointerEvents: 'none' }">
            </p>
        </div>
    </div>
</template>

<script>
    import logo from "../assets/logo.png";
    import textLogo from "../assets/text-logo.png";

    export default {
        data() {
            return {
            }
        },
        mounted() {
            
        },
        methods: {
            userIconAction() {
                if (this.$store.getters.isValidatingAccess) return;
                if (this.$route.name != 'Opciones') this.$router.push({ name: 'Opciones'});
            }
        },
        computed: {
            logoToShow() {
                if (this.$route.name == 'Home') return textLogo;
                if (this.$route.name == 'Login') return textLogo;
                return logo;
            }
        },
    }
</script>

<style scoped lang="scss">
    .viewHead {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow: hidden;
        .logo {
            height: 100%;
            img {
                object-fit: scale-down;
                height: 100%;
                width: 100%;
                width: auto;
                height: 100%;
                max-height: 60px;
            }
            a {
                text-decoration: none;
                background-color: transparent;
                padding: 0px 0px;
            }
        }

        .options {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin: 0 15px 0 auto;
            height: 100%;

            span {
                padding: 5px;
                i {
                    font-size: 30px;
                    color: #2c3e50;
                }
            }
            img {
                height: 25px;
                width: 25px;
                object-fit: contain;
            }
            a {
                text-decoration: none;
                background-color: transparent;
                display: flex;
                align-items: center;
                i {
                    font-size: 23px;
                    margin-right: 5px;
                }
            }
            .user-image {
                height: 35px;
                width: 35px;
                object-fit: contain;
                border-radius: 50%;
            }
        }
    }
</style>