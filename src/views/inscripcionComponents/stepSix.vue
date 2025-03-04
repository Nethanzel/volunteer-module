<template>
    <div class="stepcontainer">
        <h2>Términos y Condiciones</h2>
        <FormulateForm 
            class="stepsix"
        >
            <div class="min-container">
                <p>
                    Al inscribirte como alumno en una de nuestras escuelas, te unes a una familia que valora la disciplina, el compromiso y el 
                    crecimiento personal. Antes de terminar tu inscripción, <b>es importante que estés de acuerdo con algunos puntos básicos:</b>
                </p>

                <p class="point">
                    <i class="icofont-check"></i><b>Asistencia a las prácticas:</b> Se espera que asistas y cumplas con los horarios de entrenamiento de la escuela. La constancia es clave para 
                    tu progreso, así que te animamos a participar activamente en cada sesión.
                </p>

                <p class="point point-last">
                    <i class="icofont-check"></i><b>Pago de la cuota mensual:</b> Al formar parte de la escuela, también aceptas el compromiso de contribuir con la cuota mensual establecida. Este pago representa 
                    el acceso continuo a las clases, entrenamientos y todos los beneficios que ofrece la escuela para tu desarrollo y aprendizaje.
                </p>

                <p>
                    Si alguna vez surge algún imprevisto que afecte tu asistencia o pago, no dudes en comunicarlo para encontrar una solución. 
                    ¡Estamos para apoyarte en tu aprendizaje y desarrollo!
                </p>

                <div class="check">
                    <input type="checkbox" name="agreed" id="agreed" @change="handleAgreed">
                    <label for="agreed">Estoy de acuerdo y acepto cumplir mis compromisos como prácticante.</label>
                </div>
            </div>

            <button @click="validateForm" :disabled="!allowEndRegister"><i class="icofont-check" :style="{ marginLeft:'0px', marginRight:'5px' }"></i> Terminar registro</button>
        </FormulateForm>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                allowEndRegister: false
            }
        },
        methods: {
            validateForm() {
                this.$emit("accepted", { pos: 6 });
            },
            handleAgreed(e) {
                this.allowEndRegister = (e.target.checked);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .min-container {
        display: flex;
        flex-direction: column;
        p {
            width: calc(100% - 40px);
            text-align: justify;
        }
        .point {
            margin: 15px 0;
            padding: 5px 10px;
            border-left: 5px solid #000000;
            outline: 1px solid #6161618e;
            background-color: #00000017;

            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            
            i {
                font-size: 20px;
                margin-right: 5px;
            }
        }
        .point-last {
            margin-top: 5px;
        }
        .check {
            margin-top: 35px;
            padding: 5px 25px;

            input {
                margin-right: 10px;
            }
            label {
                font-weight: bold;
            }
        }
    }

    @media only screen and (max-width: 600px) {
        .min-container {
            .point {
                width: calc(100% - 80px);
            }
        }
    }

    @media only screen and (max-width: 450px) {
        .min-container {
            .point {
                width: calc(100% - 40px);
            }
        }
    }

</style>