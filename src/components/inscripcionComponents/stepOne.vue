<template>
    <div class="container">
        <div>
            <div v-if="slides.pos == 1">
                <h1>Datos del Comité</h1>
                <form class="stepone">
                    <FormulateInput type="text" name="email" label="Provincia" validation="required|email" class="textInput"/>
                    <FormulateInput type="text" name="email" label="Municipio/Distrito Municipal" validation="required|email" class="textInput"/>
                    <FormulateInput type="text" name="email" label="Estación" validation="required|email" class="textInput"/>
                </form>
            </div>

            <div v-if="slides.pos == 2">
                <h1>Datos Personales</h1>
                <form class="steptwo">
                    <FormulateInput type="text" name="email" label="Cedula/Pasaporte" validation="required|email" class="textInput"/>
                    <FormulateInput type="text" name="email" label="Nombres" validation="required|email" class="textInput"/>
                    <FormulateInput type="text" name="email" label="Apellidos" validation="required|email" class="textInput"/>
                    <FormulateInput type="text" name="email" label="Lugar de nacimiento" validation="required|email" class="textInput"/>
                    <FormulateInput type="text" name="email" label="Fecha de nacimiento" validation="required|email" class="textInput"/>
                    <FormulateInput type="text" name="email" label="Nacionalidad" validation="required|email" class="textInput"/>
                    <FormulateInput type="text" name="email" label="Estado civil" validation="required|email" class="textInput"/>

                    <div>
                        <h2>Direccion</h2>
                        <FormulateInput type="text" name="email" label="Provincia" validation="required|email" class="textInput"/>
                        <FormulateInput type="text" name="email" label="Sector" validation="required|email" class="textInput"/>
                        <FormulateInput type="text" name="email" label="Calle" validation="required|email" class="textInput"/>
                        <FormulateInput type="text" name="email" label="No. de casa" validation="required|email" class="textInput"/>
                    </div>

                    <div>
                        <h2>Contacto</h2>
                        <FormulateInput type="text" name="email" label="Telefono fijo" validation="required|email" class="textInput"/>
                        <FormulateInput type="text" name="email" label="Celular" validation="required|email" class="textInput"/>
                        <FormulateInput type="text" name="email" label="Correo electronico" validation="required|email" class="textInput"/>
                    </div>

                </form>
            </div>

            <div v-if="slides.pos == 3">
                <h1>Formacion Academica</h1>
                <form class="stepthree">
                    <h2>Estudios</h2>
                    <div>
                        <p></p>

                        <div>
                            <FormulateInput name="flavor" type="select" label="Estudio" validation="required" :options="options" />
                            <FormulateInput type="text" name="email" label="Centro de estudio" validation="required|email" class="textInput"/>
                            <FormulateInput type="text" name="email" label="Año de graduación" validation="required|email" class="textInput"/>
                            <button>Agregar</button>
                        </div>
                    </div>

                    <h2>Idiomas</h2>
                    <FormulateInput name="terms" type="checkbox" label="Español" validation="accepted" />
                    <FormulateInput name="terms" type="checkbox" label="Ingles" validation="accepted" />
                    <FormulateInput name="terms" type="checkbox" label="Frances" validation="accepted" />
                    <FormulateInput name="terms" type="checkbox" label="Otros" validation="accepted" @change="otherLang = !otherLang"/>
                    <FormulateInput v-if="otherLang" type="text" name="email" label="Escriba su otro idioma" validation="required|email" class="textInput"/>

                </form>
            </div>

            <div v-if="slides.pos == 4">
                <h1>Datos de Salud</h1>
                <form class="stepfour">
                    <FormulateInput name="flavor" type="select" label="Tipo de sangre" validation="required" :options="bloodOptions" />
                    <FormulateInput name="terms" type="checkbox" label="¿Sufre alguna enfermedad?" validation="accepted" @change="desease = !desease"/>
                    <FormulateInput v-if="desease" type="textarea" name="email" label="Especifique sus padecimientos" validation="required|email" class="textInput"/>

                    <FormulateInput name="terms" type="checkbox" label="¿Es alergico a algun medicamento?" validation="accepted" @change="medicines = !medicines"/>
                    <FormulateInput v-if="medicines" type="textarea" name="email" label="Especifique los medicamentos" validation="required|email" class="textInput"/>

                    <div>
                        <p></p>

                        <div>
                            <p>En caso de emergencia, llamar a:</p>
                            <p>Agregue al menos dos (2) personas.</p>
                            <FormulateInput type="text" name="email" label="Nombre" validation="required|email" class="textInput"/>
                            <FormulateInput type="text" name="email" label="Parentezco" validation="required|email" class="textInput"/>
                            <FormulateInput type="text" name="email" label="Telefono de contacto" validation="required|email" class="textInput"/>
                            <button>Agregar</button>
                        </div>
                    </div>
                </form>
            </div>

            <div v-if="slides.pos == 5">
                <h1>Areas de desarrollo de la institución</h1>
                <form class="stepfive">
                    <p>¿A que area te gustaria pertenecer?</p>
                    <div>
                        <div>
                            <h3>Socorro y Gestion del Riesgo</h3>
                            <p>Descripcion del area.</p>
                        </div>
                        <div>
                            <h3>Juventud</h3>
                            <p>Descripcion del area.</p>
                        </div>

                        <div>
                            <h3>Salud Comunitaria</h3>
                            <p>Descripcion del area.</p>
                        </div>

                        <div>
                            <h3>Doctrina y Proteccion</h3>
                            <p>Descripcion del area.</p>
                        </div>
                    </div>

                    <p>Tipo de miembro de la institución</p>
                    <div>
                        <div>
                            <h3>Activo</h3>
                            <p>Descripcion del voluntario.</p>
                        </div>
                        <div>
                            <h3>Pasivo</h3>
                            <p>Descripcion del voluntario.</p>
                        </div>

                        <div>
                            <h3>Suspcritor</h3>
                            <p>Descripcion del voluntario.</p>
                        </div>

                    </div>
                </form>
            </div>
        </div>
        <div>
            <div class="controls">
                <div class="stepsView">
                    <p 
                        v-for="i in slides.count" 
                        :key="i" @click="slides.pos=i" 
                        :style="{
                            color: slides.pos == i ? '#0f0' : '#000',
                            fontWeight: slides.pos == i ? 'bold' : 'lighter',
                        }">
                            Paso {{i}}
                    </p>
                </div>
                <div class="toggle">
                    <p v-if="slides.pos != 1" @click="slides.pos--">Anterior</p>
                    <p v-if="slides.pos != slides.count" @click="slides.pos++">Siguiente</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    components: {
        
    },
    data() {
        return {
            studies: [],
            options: { 
                basica: 'Básica', 
                secundaria: 'Secundaria (Bachiller/Highschool)', 
                universidad: 'Universidad'
            },
            bloodOptions: {
                "O-": "O-",
                "O+": "O+",
                "A-": "A-",
                "A+": "A+",
                "B-": "B-",
                "B+": "B+",
                "AB-": "AB-",
                "AB+": "AB+",
            },
            otherLang: false,
            desease: false,
            medicines: false,
            slides: {
                count: 5,
                pos: 5
            }
        }
    }
}
</script>

<style scoped lang="scss">
.stepone {
    border: 2px solid red;
    max-width: 40vw;
    min-width: 40vw;
    padding: 10px;

}

.steptwo {
    border: 2px solid rgb(0, 162, 255);
    max-width: 40vw;
    min-width: 40vw;
    padding: 10px;

}

.stepthree{
    border: 2px solid rgb(21, 255, 0);
    max-width: 40vw;
    min-width: 40vw;

    padding: 10px;

}

.stepfour{
    border: 2px solid rgb(38, 0, 255);
    max-width: 40vw;
    min-width: 40vw;

    padding: 10px;

}

.stepfive{
    border: 2px solid rgb(255, 174, 0);
    max-width: 40vw;
    min-width: 40vw;

    padding: 10px;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.controls {
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
        margin: 10px 25px 10px 25px;
        cursor: pointer;
        user-select: none;
        display: inline-block;
    }

    .stepsView {
        display: flex;
    }

    .toggle {
        display: flex;
    }
}



</style>