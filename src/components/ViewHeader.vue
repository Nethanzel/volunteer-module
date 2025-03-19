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

        <div class="options" :style="{ marginRight: `${optionsRightMargin}px` }">
            <p
                @click="whereToPracticeAction()"
                v-if="showWhereToPractice" 
                :style="{ 
                    marginRight: `${(optionsRightMargin == 0 && $route.name == 'Login') ? 15 : 0}px`,
                    cursor:'pointer'
                }"
            >
                <!-- <i class="icofont-location-pin" :style="{ paddingBottom:'5px' }"></i> --> ¿Dónde practicar?
            </p>
                
            <p v-if="$route.name != 'Login'" @click="userIconAction()" :style="{ cursor:'pointer', marginLeft:'15px' }">
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
                logoToShow: null,
                optionsRightMargin: 0,
            }
        },
        mounted() {
            const screenQuery = window.matchMedia("(max-width: 475px)");
            screenQuery.addEventListener('change', e => this.updateLogo(e.matches));
            this.updateLogo(screenQuery.matches);
        },
        methods: {
            userIconAction() {
                if (this.$store.getters.isValidatingAccess) return;
                if (this.$route.name != 'Opciones') this.$router.push({ name: 'Opciones'});
            },
            whereToPracticeAction() {
                if (this.$route.name != 'Home') {
                    this.$router.push({ name:'Home', params: { showSchools: true } });
                }
                else {
                    document.getElementById('sec-2').scrollIntoView({ behavior: 'smooth' });
                }
            },
            updateLogo(matches) {
                let routeName = this.$route.name;

                if (routeName == 'Home' && !matches) {
                    return this.logoToShow = textLogo;
                }
                if (routeName == 'Login' && !matches) {
                    return this.logoToShow = textLogo;
                }

                this.optionsRightMargin = matches ? (routeName == 'Login' || routeName == 'Home' ? 0 : 15) : 15;
                this.logoToShow = logo;
            }
        },
        watch: {
            $route() {
                const screenQuery = window.matchMedia("(max-width: 475px)");
                this.updateLogo(screenQuery.matches);
            }
        },
        computed: {
            showWhereToPractice() {
                return !this.$store.getters.isValidatingAccess 
                && !this.$store.getters.isAuthorized 
                && this.$route.name != 'Registrar'
                //&& this.$route.name != 'Login'
            }
        }
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
            margin: 0 0 0 auto;
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
                object-fit: cover;
                border-radius: 50%;
            }
        }
    }
</style>