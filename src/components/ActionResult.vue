<template>
    <div class="cnt">
        <div v-if="Action2Show" class="view">
            <i :class="Action2Show.icono"></i>
            <h1>{{Action2Show.titulo}}</h1>
            <p>{{Action2Show.mensaje}}</p>

            <h3 
                v-if="from.toLowerCase() == 'registro' && status == 201 && userCode" 
                class="registerCode"
            >
                <i class="icofont-star"></i> Código de registro: {{ userCode }}
            </h3>

            <div class="actions" v-if="from.toLowerCase() == 'registro'" :style="{ display:'flex', flexDirection:'column', alignItems:'flex-start' }">
                <p v-if="status == 503 || status == 400" @click="$emit('retry')" ><span :style="{ marginLeft:'6px' }">Reintentar registro</span> <i class="icofont-refresh" :style="{ fontSize:'20px' }"></i></p>
                <p @click="$emit('return')" >Volver a registro <i class="icofont-arrow-right"></i></p>
                <router-link :to="{ name: 'Home'}" >Ir a inicio <i class="icofont-arrow-right"></i></router-link>
            </div>

            <div class="actions" v-if="from.toLowerCase() == 'notfound'">
                <router-link :to="{ name: 'Home'}" >Ir a inicio <i class="icofont-arrow-right"></i></router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        status: Number,
        from: String,
        userCode: String
    },
    data() {
        return {
            Actions: {
                registro: {
                    208: {
                        titulo: "El registro ya habia sido realizado.",
                        mensaje: "El número de cedula/pasaporte que intentaste registrar, ya está registrado.",
                        icon: "icofont-confused"
                    },
                    201: {
                        titulo: "Registro completado!",
                        mensaje: "Tu información fue enviada para ser revisada.",
                        icon: "icofont-smirk"
                    },
                    400: {
                        titulo: "Algo acaba de salir mal!",
                        mensaje: "Tu información no pudo ser guardada debido a un error. Por favor, intentalo luego.",
                        icon: "icofont-crying"
                    },
                    503: {
                        titulo: "Algo acaba de salir mal!",
                        mensaje: "Tu información no pudo ser guardada debido a un error. Por favor, intentalo luego.",
                        icon: "icofont-crying"
                    }
                },
                notFound: {
                    404: {
                        titulo: "Destino equivocado!",
                        mensaje: "El recurso que tratas de acceder no existe.",
                        icon: "icofont-confused"
                    }
                }
            },
            Action2Show: null
        }
    },
    mounted() {
        this.showResult(this.status, this.from);
    },
    methods: {
        showResult(status, from) {
            if(!status || !from) return this.Action2Show = null;

            let action = this.Actions[`${from}`][`${status}`];
            this.Action2Show = {
                mensaje: action.mensaje,
                icono: action.icon,
                titulo: action.titulo
            }
        }
    }
}
</script>

<style scoped lang="scss">
    .cnt {
        display: flex;
        height: 100%;
        margin: auto;
    }
    .view {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: 600px;
        i {
            font-size: 105px;
            margin-bottom: 15px;
        }
        p {
            font-size: 18px;
            margin: 0 0px 15px 5px;
            text-align: center;
        }
        h1 {
            margin: 0 0;
            margin-bottom: 5px;
        }
        .actions {
            a, p {
                display: flex;
                flex-direction: row-reverse;
                text-decoration: none;
                align-items: center;
                cursor: pointer;
                i {
                    font-size: 25px;
                    margin: 0 0;
                    margin-right: 10px;
                }
            }
            p {
                margin: 0 0px 8px 0px;
            }
        }
        .registerCode {
            padding: 5px 15px;
            margin: 10px 0 25px 0;
            background-color: #00ff224e;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;

            cursor: default;

            border-left: 5px solid #008000;
            display: flex;
            align-items: center;
            i {
                font-size: 27px;
                margin-bottom: 0;
                margin-right: 10px;
            }
        }
    }
</style>