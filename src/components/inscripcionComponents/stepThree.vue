<template>
   <div>
        <h1>Formacion Academica</h1>
        <FormulateForm 
            name="step_3"
            class="stepthree"
            @submit="validateForm"
        >
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

            <div class="min-container" :style="{marginTop: '20px'}" id="languages">
                <h2 :style="{marginBottom: '15px'}">Idiomas</h2>
                <FormulateInput :style="{marginBottom: '5px', marginLeft: '30px'}" type="checkbox" :options="langOptions" v-model="languages" />

                <FormulateInput :style="{marginBottom: '5px', marginLeft: '30px'}" type="checkbox" label="Otros"  @change="otherLang = !otherLang" />
                <FormulateInput 
                    v-if="otherLang" 
                    type="text" 
                    label="Escriba su otro idioma (Si son varios, separemos por coma (,))" 
                    validation="required" 
                    class="textInput"
                    v-model="otherlgn"
                />
            </div>
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
            langOptions: {
                spanish: "Español",
                english: "Ingles",
                french: "Frances"
            },
            options: { 
                basica: 'Básica', 
                secundaria: 'Secundaria (Bachiller/Highschool)', 
                universidad: 'Universidad'
            },
            studies: [],
            languages: [],
            otherlgn: ''
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
        },
        validateForm(e = true) {
            if(!e) {
                return this.$emit("validation", false); 
            }

            let formResult = {
                study: undefined,
                languages: undefined,
                otherLanguage: undefined
            }

            if(this.studies.length > 0) {
                formResult.study = this.studies;
            }

            if(this.languages.length > 0) {
                formResult.languages = this.languages;
            }

            if(this.otherLang) {
                formResult.otherLanguage = this.otherlgn;
            }
            this.$emit("validation", {result: formResult, pos: 3});
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