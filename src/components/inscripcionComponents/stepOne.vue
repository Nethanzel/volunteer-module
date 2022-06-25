<template>
    <div class="container">
        <div id="viewer">
            <FormulateForm v-model="formResult">
                <div v-if="slides.pos == 1" :class="{animateRight : animationToggle, animateLeft : !animationToggle}">
                    <h1>Datos del Comité</h1>
                    <div class="stepone">
                        <FormulateInput type="group" class="min-container" name="comite">
                            <FormulateInput type="text" name="provincia" label="Provincia" validation="required" class="textInput"/>
                            <FormulateInput type="text" name="municipio" label="Municipio" validation="required" class="textInput"/>
                            <FormulateInput type="text" name="estacion" label="Estacion" validation="required" class="textInput"/>
                        </FormulateInput>
                    </div>
                </div>

                <div v-if="slides.pos == 2" :class="{animateRight : animationToggle, animateLeft : !animationToggle}">
                    <h1>Datos Personales</h1>
                    <div class="steptwo">
                        <FormulateInput type="group" class="min-container">
                            <FormulateInput type="text" validation-name="Cedula/Pasaporte" name="identity" label="Cedula/Pasaporte" validation="required" class="textInput"/>
                            <FormulateInput type="text" name="Nombre" label="Nombres" validation="required" class="textInput"/>
                            <FormulateInput type="text" name="Apellido" label="Apellidos" validation="required" class="textInput"/>
                            
                            <FormulateInput type="text" validation-name="Lugar de nacimiento" name="nacimientolugar" label="Lugar de nacimiento" class="textInput"/>
                            <FormulateInput type="date" validation-name="Fecha de nacimiento" name="nacimientofecha" label="Fecha de nacimiento" class="textInput"/>
                            <FormulateInput type="text" name="Nacionalidad" label="Nacionalidad" validation="required" class="textInput"/>
                            <FormulateInput type="text" validation-name="Estado civil" name="ecivil" label="Estado civil" class="textInput"/>
                        </FormulateInput>
                        
                        <FormulateInput type="group" class="min-container">
                            <h2>Direccion</h2>
                            <FormulateInput type="text" name="provincia" label="Provincia" validation="required" class="textInput"/>
                            <FormulateInput type="text" name="sector" label="Sector" validation="required" class="textInput"/>
                            <FormulateInput type="text" name="calle" label="Calle" class="textInput"/>
                            <FormulateInput type="text" name="casa_no" label="No. de casa" class="textInput"/>
                        </FormulateInput>

                        <FormulateInput type="group" class="min-container">
                            <h2>Contacto</h2>
                            <FormulateInput type="text" name="telefono" label="Telefono fijo" class="textInput"/>
                            <FormulateInput type="text" name="celular" label="Celular" validation="required" class="textInput"/>
                            <FormulateInput type="text" name="email" label="Correo electronico" validation="required|email" class="textInput"/>
                        </FormulateInput>

                    </div>
                </div>

                <div v-if="slides.pos == 3" :class="{animateRight : animationToggle, animateLeft : !animationToggle}">
                    <h1>Formacion Academica</h1>
                    <div class="stepthree">
                        <div class="min-container">
                            <h2 :style="{marginBottom: '20px'}">Estudios</h2>

                            <div v-for="(study, index) in studies" :key="index" class="rowData" @click="removeStudy(index)">
                                <p><b>Nivel:</b> {{study.grade}}</p>
                                <p><b>Centro:</b> {{study.place}}</p>
                                <p><b>Año:</b> {{study.age}}</p>
                            </div>

                            <div :style="{marginTop: '20px'}">
                                <FormulateInput v-model="studyModel.grade" name="stdGrado" type="select" label="Estudio" :options="options" />
                                <FormulateInput v-model="studyModel.place" type="text" name="stdPlace" label="Centro de estudio" class="textInput" />
                                <FormulateInput v-model="studyModel.age" type="number" name="stdAge" label="Año de graduación"  class="textInput" />
                                <p class="stdAdd" @click="addStudy">Agregar</p>
                            </div>
                        </div>

                        <FormulateInput type="group" class="min-container" :style="{marginTop: '20px'}">
                            <h2 :style="{marginBottom: '15px'}">Idiomas</h2>
                            <FormulateInput :style="{marginBottom: '5px', marginLeft: '30px'}" name="lang" type="checkbox" label="Español" />
                            <FormulateInput :style="{marginBottom: '5px', marginLeft: '30px'}" name="lang" type="checkbox" label="Ingles" />
                            <FormulateInput :style="{marginBottom: '5px', marginLeft: '30px'}" name="lang" type="checkbox" label="Frances" />
                            <FormulateInput :style="{marginBottom: '5px', marginLeft: '30px'}" name="lang" type="checkbox" label="Otros"  @change="otherLang = !otherLang" />
                            <FormulateInput v-if="otherLang" type="text" validation-name="Otro idioma" name="otherlang" label="Escriba su otro idioma" validation="required" class="textInput"/>
                        </FormulateInput>
                    </div>
                </div>

                <div v-if="slides.pos == 4" :class="{animateRight : animationToggle, animateLeft : !animationToggle}">
                    <h1>Datos de Salud</h1>
                    <div class="stepfour">
                        <div class="min-container">
                            <FormulateInput name="blood" type="select" label="Tipo de sangre" :options="bloodOptions" />
                        </div>

                        <FormulateInput type="group" class="min-container">
                            <FormulateInput name="terms" type="checkbox" label="¿Sufre alguna enfermedad?" @change="desease = !desease"/>
                            <FormulateInput v-if="desease" type="textarea" name="desease" label="Especifique sus padecimientos" validation="required" class="textInput"/>
                        </FormulateInput>

                        <FormulateInput type="group" class="min-container">
                            <FormulateInput name="terms" type="checkbox" label="¿Es alergico a algun medicamento?" @change="medicines = !medicines"/>
                            <FormulateInput v-if="medicines" type="textarea" name="email" label="Especifique los medicamentos" validation="required" class="textInput"/>
                        </FormulateInput>

                        <div class="min-container">
                            <p></p>

                            <div>
                                <p>En caso de emergencia, llamar a:</p>
                                <p>Agregue al menos dos (2) personas.</p>

                                <div v-for="(member, index) in family" :key="index" class="rowData" @click="removeFamily(index)">
                                    <p><b>Nombre:</b> {{member.name}}</p>
                                    <p><b>Parentezco:</b> {{member.relation}}</p>
                                    <p><b>Telefono/Celular:</b> {{member.phone}}</p>
                                </div>

                                <FormulateInput v-model="familyModel.name" type="text" name="Nombre" label="Nombre" class="textInput"/>
                                <FormulateInput v-model="familyModel.relation" type="text" name="Parentezco" label="Parentezco" class="textInput"/>
                                <FormulateInput v-model="familyModel.phone" type="text" name="Telefono/Celular" label="Telefono de contacto" class="textInput"/>
                                <p class="stdAdd" @click="addFamily">Agregar</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="slides.pos == 5" :class="{animateRight : animationToggle, animateLeft : !animationToggle}">
                    <h1>Areas de desarrollo de la institución</h1>
                    <div class="stepfive">
                        
                        <div class="min-container" :style="{width: '85%'}">
                            <p :style="{marginBottom: '10px'}">¿A que area te gustaria pertenecer?</p>
                            <FormulateInput type="group" class="volTypes">

                                <p>
                                    <FormulateInput type="radio" id="dep1" name="departamento" />
                                    <label for="dep1">Socorro y Gestion del Riesgo</label> 
                                    <br>
                                    <span>Descripcion del area.</span>
                                </p>

                                <p>
                                    <FormulateInput type="radio" id="dep2" name="departamento" />
                                    <label for="dep2">Juventud</label>
                                    <br>
                                    <span>Descripcion del area.</span>
                                </p>

                                <p>
                                    <FormulateInput type="radio" id="dep3" name="departamento" />
                                    <label for="dep3">Salud Comunitaria</label>
                                    <br>
                                    <span>Descripcion del area.</span>
                                </p>

                                <p>
                                    <FormulateInput type="radio" id="dep4" name="departamento" />
                                    <label for="dep4">Doctrina y Proteccion</label>
                                    <br>
                                    <span>Descripcion del area.</span>
                                </p>

                            </FormulateInput>
                        </div>

                        <div class="min-container" :style="{marginTop: '20px', width: '85%'}">
                            <p :style="{marginBottom: '10px'}">Tipo de miembro de la institución</p>
                            <FormulateInput type="group" class="volTypes">

                                <p>
                                    <FormulateInput type="radio" id="vol1" name="tipoVoluntario" />
                                    <label for="vol1">Activo</label> 
                                    <br>
                                    <span>Descripcion del voluntario.</span>
                                </p>

                                <p>
                                    <FormulateInput type="radio" id="vol2" name="tipoVoluntario" />
                                    <label for="vol2">Pasivo</label> 
                                    <br>
                                    <span>Descripcion del voluntario.</span>
                                </p>
                                
                                <p>
                                    <FormulateInput type="radio" id="vol3" name="tipoVoluntario" />
                                    <label for="vol3">Suspcritor</label> 
                                    <br>
                                    <span>Descripcion del voluntario.</span>
                                </p>

                            </FormulateInput>
                        </div>
                    </div>
                </div>
            </FormulateForm>
        </div>
        <div>
            <div class="controls">
                <div class="stepsView">
                    <p 
                        v-for="i in slides.count" 
                        :key="i" 
                        @click="slides.pos=i" 
                        :style="{
                            color: slides.pos == i ? '#fff' : '#000',
                            fontWeight: slides.pos == i ? 'bold' : 'lighter',
                            backgroundColor: slides.pos == i ? 'red' : 'transparent',
                            fontSize: '12px',
                            border: '1px solid red',
                            height: '14px',
                            width: '14px',
                            textAlign: 'center',
                            borderRadius: '50%'
                        }">
                            {{i}}
                    </p>
                </div>
                <div class="toggle">
                    <p v-if="slides.pos != 1" @click="backStep">Anterior</p>
                    <p v-if="slides.pos != slides.count" @click="nextStep">Siguiente</p>
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
            family: [],
            studyModel: {
                grade: '',
                place: '',
                age: ''                
            },
            familyModel: {
                name: '',
                relation: '',
                phone: ''
            },
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
                pos: 1
            },
            animationToggle: false,
            formResult: {}
        }
    },
    methods: {
        nextStep() {
            this.slides.pos++; 
            this.animationToggle=true;
        },
        backStep() {
            this.slides.pos--;
            this.animationToggle=false;
        },
        addStudy() {
            let study = {
                grade: this.studyModel.grade,
                place: this.studyModel.place,
                age: this.studyModel.age
            };
            this.studies.push(study);

            this.studyModel.grade ='';
            this.studyModel.place ='';
            this.studyModel.age = '';
        },
        addFamily() {
            let familyMember = {
                name: this.familyModel.name,
                relation: this.familyModel.relation,
                phone: this.familyModel.phone
            };
            this.family.push(familyMember);

            this.familyModel.name = '';
            this.familyModel.relation = '';
            this.familyModel.phone = '';
        },
        removeStudy(index) {
            this.studies.splice(index, 1);
        },
        removeFamily(index) {
            this.family.splice(index, 1);
        },
        validityCatch(e) {
            console.log(e);
        }
    }
}
</script>

<style scoped lang="scss">

.textInput {
    margin-top: 15px;
    min-width: 75%;
}

.stdAdd {
    margin-top: 15px;
    border: 1px solid black;
    border-radius: 5px;
    width: 75px;
    text-align: center;
    padding: 2px 3px;
    cursor: pointer;
}

.stepone {
    border: 2px solid rgb(170, 170, 170);
    max-width: 40vw;
    min-width: 40vw;
    padding: 5px 0px 25px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.steptwo {
    div {
        width: 75%;
    }
    border: 2px solid rgb(170, 170, 170);
    max-width: 40vw;
    min-width: 40vw;
    padding: 5px 0px 25px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;

}

.stepthree{
    border: 2px solid rgb(170, 170, 170);
    max-width: 40vw;
    min-width: 40vw;
    padding: 5px 0px 25px 0px;
   
}
.stepfour{
    border: 2px solid rgb(170, 170, 170);
    max-width: 45vw;
    min-width: 45vw;
    padding: 5px 0px 25px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stepfive{
    border: 2px solid rgb(170, 170, 170);
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

.volTypes {
    display: flex;
    flex-wrap: wrap;
    
    p {
        border: 1px solid rgb(187, 187, 187);
        border-left: 4px solid red;
        margin: 5px 10px;
        min-width: 200px;
        max-width: 200px;
        padding: 5px 5px 5px 10px;

        cursor: pointer;
        font-size: 15px;
        margin-bottom: 5px;

        label  {
            margin-bottom: 10px;
            margin-top: 5px;
            font-weight: bold;
            font-size: 16px;
        }

        [type="radio"]:checked,
        [type="radio"]:not(:checked) {
            position: absolute;
            left: -9999px;
        }
        [type="radio"]:checked + label,
        [type="radio"]:not(:checked) + label
        {
            position: relative;
            padding-left: 25px;
            cursor: pointer;
            line-height: 18px;
            display: inline-block;
            color: rgb(0, 0, 0);
        }
        [type="radio"]:checked + label:before,
        [type="radio"]:not(:checked) + label:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 15px;
            height: 15px;
            border: 1px solid rgb(156, 156, 156);
            border-radius: 100%;
            background: #fff;
        }
        [type="radio"]:checked + label:after,
        [type="radio"]:not(:checked) + label:after {
            content: '';
            width: 11px;
            height: 11px;
            background: #ff0000;
            position: absolute;
            top: 3px;
            left: 3px;
            border-radius: 100%;
            -webkit-transition: all 0.2s ease;
            transition: all 0.2s ease;
        }
        [type="radio"]:not(:checked) + label:after {
            opacity: 0;
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        [type="radio"]:checked + label:after {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1);
        }
    }
}

.min-container {
    padding: 10px 5px 15px 35px;
    margin: 10px 35px;
    border-left: black 3px solid;
    width: 70%;

    h2 {
        margin-top: 0;
    }
    align-self: flex-start;
}

.rowData {
    border: 1px solid gray;
    padding: 5px 10px;
    margin: 10px 0;
    border-left: 4px solid gray;
    transition: .4s;
    cursor: pointer;
    p {
        margin: 4px;
    }
}

.rowData:hover {
    background: rgb(238, 198, 198);
}

//slide animations
.animateLeft {
    position:relative;
    animation:animateleft 0.3s
}

.animateRight {
    position:relative;
    animation:animateright 0.3s
}

@keyframes animateright {
    from {
        right:-300px;
        opacity:0
    }
    to {
        right:0;
        opacity:1
    }
}

@-o-keyframes animateright {
    from {
        right:-300px;
        opacity:0
    }
    to {
        right:0;
        opacity:1
    }
}

@keyframes animateleft {
    from {
        left:-300px;
        opacity:0
    }
    to {
        left:0px;
        opacity:1
    }
}

@-o-keyframes animateleft {
    from {
        left:-300px;
        opacity:0
    }
    to {
        left:0px;
        opacity:1
    }
}

#viewer {
    max-height: 80vh;
    min-height: 80vh;
    width: 100%;
    padding-bottom: 50px;
    overflow: hidden;
    overflow-y: auto;
    display: flex;
    justify-content: center;
}

</style>