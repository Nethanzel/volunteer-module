<template>
    <div>
        <div v-if="Action2Show" class="view">
            <img :src="Action2Show.icono" alt="icono de resultado">
            <h1>{{Action2Show.titulo}}</h1>
            <p>{{Action2Show.mensaje}}</p>
        </div>
        <router-link :to="{ name: 'Registrarse'}">Volver a registro</router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            Actions: {
                registro: {
                    200: {
                        titulo: "El registro ya habia sido realizado.",
                        mensaje: "El número de cedula/pasaporte que intentaste registrar, ya está registrado.",
                        icon: "https://static.thenounproject.com/png/2008263-200.png"
                    },
                    201: {
                        titulo: "Su información fue guardada!",
                        mensaje: "Tu información fue enviada para ser revisada por el encargado de voluntariado. Recibiras un correo electronico con la confirmación.",
                        icon: "https://static.thenounproject.com/png/2008265-200.png"
                    },
                    503: {
                        titulo: "Algo acaba de salir mal!",
                        mensaje: "Tu información no pudo ser guardada debido a un error. Por favor, intentalo luego.",
                        icon: "https://static.thenounproject.com/png/2008264-200.png"
                    }
                }
            },
            Action2Show: null
        }
    },
    mounted() {
        this.showResult(this.$route.params.status, this.$route.params.from);
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
    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .view {
        margin-bottom: 20px;
        img {
            height: 200px;
            width: 200px;
            object-fit: scale-down;
        }

        p {
            font-size: 18px;
        }
    }
</style>