<template>
   <div>
        <h1>Formacion Academica</h1>
        <FormulateForm class="stepthree" v-model="formResult">
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
        </FormulateForm>
    </div>
</template>

<script>
export default {
    data() {
        return {
            studyModel: {
                grade: '',
                place: '',
                age: ''                
            },
            otherLang: false,
            options: { 
                basica: 'Básica', 
                secundaria: 'Secundaria (Bachiller/Highschool)', 
                universidad: 'Universidad'
            },
            studies: [],
            formResult: {}
        }
    },
    methods: {
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
        removeStudy(index) {
            this.studies.splice(index, 1);
        },
        validate(e) {
            this.validations[e.name] = { validity: !(e.hasErrors) }
        }
    }
}
</script>

<style scoped>
.stepthree{
    border: 2px solid rgb(170, 170, 170);
    max-width: 40vw;
    min-width: 40vw;
    padding: 5px 0px 25px 0px;
   
}
</style>