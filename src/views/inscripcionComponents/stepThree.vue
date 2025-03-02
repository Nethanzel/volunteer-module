<template>
   <div class="stepcontainer">
        <h2>Formacion Academica</h2>
        <FormulateForm 
            class="stepthree"
        >
            <div class="min-container inputBreak">
                <h2 :style="{marginBottom: '20px'}">Estudios</h2>

                <div v-for="(study, index) in studies" :key="index" class="rowData" @click="removeStudy(index)">
                    <div class="head">
                        <i class="icofont-hat-alt" :style="{ fontSize:'40px' }"></i>
                    </div>
                    <div class="info">
                        <p><b>Nivel:</b> {{study.grade}}</p>
                        <p><b>Centro:</b> {{study.place}}</p>
                        <p><b>Año:</b> {{study.age}}</p>
                    </div>

                </div>

                <div :style="{ display:'flex', flexDirection:'column', marginTop:'20px' }">
                    <FormulateInput v-model="studyModel.grade" name="stdGrado" type="select" label="Estudio" :options="options" />
                    <FormulateInput v-model="studyModel.place" type="text" name="stdPlace" label="Centro de estudio" />
                    <FormulateInput v-model="studyModel.age" type="number" name="stdAge" label="Año de graduación"  />
                    <button @click="addStudy"><i class="icofont-plus-circle"></i> Agregar</button>
                </div>
            </div>

            <div class="min-container" :style="{marginTop: '20px'}" id="languages">
                <h2 :style="{marginBottom: '15px'}">Idiomas</h2>
                <FormulateInput :style="{marginBottom: '5px'}" type="checkbox" :options="langOptions" v-model="languages" :errors="langErr" />

                <FormulateInput :style="{marginBottom: '5px'}" type="checkbox" label="Otros"  @change="otherLang = !otherLang" />
                <FormulateInput 
                    v-if="otherLang" 
                    type="text" 
                    label="Escriba su(s) otro(s) idioma(s) (Si son varios, separemos por coma (,))" 
                    validation="required" 
                    v-model="otherlgn"
                />
            </div>

            <button @click="validateForm">Siguiente <i class="icofont-arrow-right"></i></button>
        </FormulateForm>
    </div>
</template>

<script>
import { studySchema } from '../../utils/modelValidate';

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
            otherlgn: '',
            langErr: []
        }
    },
    methods: {
        addStudy() {
            let study = {
                grade: this.studyModel.grade,
                place: this.studyModel.place,
                age: this.studyModel.age
            };

            let { error } = studySchema.validate(study);

            if (error) {
                this.$throwAppMessage({
                    message: error.details[0].message,
                    icon: "icofont-close-circled",
                    type: 'error',
                }); 
                return;
            }

            this.studies.push(study);

            this.studyModel.grade ='';
            this.studyModel.place ='';
            this.studyModel.age = '';
        },
        removeStudy(index) {
            this.studies.splice(index, 1);
        },
        validate(e) {
            this.validations[e.name] = e;
        },
        validateForm() {

            let formResult = {
                study: [],
                languages: "",
                otherLanguage: ""
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

            if(formResult.languages == undefined) {
                this.$throwAppMessage({ 
                    message: "Selecciona por lo menos un idioma",
                    icon: "icofont-close-circled",
                    type: 'error',
                }); 
                this.langErr = ['Selecciona por lo menos un idioma'];
                return;
            }

            this.$emit("validation", {result: formResult, pos: 3});
        }
    }
}
</script>

<style lang="scss" scoped>
    .stepthree {
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    @media only screen and (max-width: 900px) {
        .stepthree {
            max-width: 100vw;
            min-width: 95vw;
        }
    }
</style>