<template>
    <div class="stepcontainer">
        <h2>Escuelas</h2>
        <FormulateForm 
            class="stepseven" 
            invalid-message="Completa la informacion requerida"
        >
            <div class="min-container">
                <p>¿Está ofreciendo sus conocimientos en alguna escuela?</p>

                <div type="group" class="custom-radio" :style="{marginTop: '10px'}">
                    
                    <div 
                        class="option"
                        :style="{}"
                        @click="selectOption($event, 'hs-1', 'hasSchool', true)"
                    >
                        <input :value="true" :id="'hs-1'" type="radio" name="hasSchool" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label>Si</label> 
                    </div>

                    <div 
                        class="option"
                        :style="{}"
                        @click="selectOption($event, 'hs-2', 'hasSchool', false)"
                    >
                        <input :value="false" :id="'hs-2'" type="radio" name="hasSchool" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label>No</label> 
                    </div>
                </div>

            </div>

            <div class="min-container inputBreak" v-if="hasSchool">
                <div :style="{ display:'flex', flexDirection:'column' }">
                    <h2>Detalles de las escuelas</h2>
                    <p :style="{  }">Agregue la(s) escuela(s) donde da clases:</p>

                    <p
                        v-if="schoolsRequired"
                        :style="{ color: '#ff3300', marginTop: '8px', fontSize: '13px', fontWeight:'bold',
                            marginLeft: '20px', fontFamily: 'Avenir, Helvetica, Arial, sans-serif', marginBottom: '10px'
                        }"
                    >Esta información es necesaria.</p>

                    <div v-for="(school, index) in schools" :key="index" class="rowData" @click="removeSchool(index)">
                        <div class="head">
                            <i class="icofont-university"></i>
                        </div>
                        <div class="info">
                            <p><b>Nombre:</b> {{school.nombre}}</p>
                            <p><b>Provincia:</b> {{getProvince(school.provincia)}}</p>
                            <p><b>Municipio:</b> {{getMunicipio(school.municipio)}}</p>
                        </div>
                    </div>

                    <FormulateInput v-model="schoolModel.nombre" type="text" name="Nombre de la escuela" label="Nombre de la escuela" />
                    <FormulateInput v-model="selectedProv" type="select" :options="_provincias" name="Provincia" label="Provincia" />
                    <FormulateInput v-model="schoolModel.municipio" type="select" :options="_municipios" name="Municipio" label="Municipio" />

                    <button @click="addSchool"><i class="icofont-duotone icofont-plus-circle"></i> Agregar</button>
                </div>
            </div>

            <button @click="validateForm">Siguiente <i class="icofont-arrow-right"></i></button>
        </FormulateForm>
    </div>
</template>

<script>
    import { titleCase } from "../../utils/inforFormat";
    import { schoolSchema } from "../../utils/modelValidate";
    const provincias = require("../../assets/data/provincias.json");
    const municipios = require("../../assets/data/municipios.json");

    export default {
        data() {
            return {
                hasSchool: false,
                schoolsRequired: false,
                schoolModel: {
                    nombre: '',
                    provincia: '',
                    municipio: ''
                },
                selectedProv: null,
                schools: [],
            }
        },
        methods: {
            validateForm() {
                if (this.hasSchool && !this.schools.length) {
                    this.$throwAppMessage({
                        message: "Debe agregar al menos una escuela",
                        icon: "icofont-close-circled",
                        type: 'error',
                    }); 
                    this.schoolsRequired = true;
                    return;
                }

                this.$emit("validation", { result: { hasSchool: this.hasSchool, schools: this.schools }, pos: 7 });
            },
            highlightSelected(element, child) {
                const siblings = element.parentElement.getElementsByTagName("div");
                for (let e of siblings) {
                    if (e.children[child]) e.children[child].checked = !e.children[child].checked;
                    e.style.backgroundColor = '#fff';
                    e.style.opacity = '.3';
                }
                element.style.backgroundColor = '#f7fffa';
                element.style.opacity = '1';
            },
            selectOption(e, i, name, value) {
                e.stopPropagation();
                this.hasSchool = value;
                this.highlightSelected(e.target, i);
            },
            removeSchool(i) {
                this.schools.splice(i, 1);
            },
            addSchool() {
                let newSchool = {
                    provincia: this.selectedProv,
                    municipio: this.schoolModel.municipio,
                    nombre: this.schoolModel.nombre,
                }

                let { error } = schoolSchema.validate(newSchool);

                if (error) {
                    this.$throwAppMessage({
                        message: error.details[0].message,
                        icon: "icofont-close-circled",
                        type: 'error',
                    }); 
                    return;
                }

                this.schools.push(newSchool);

                this.schoolsRequired = false;
                
                this.schoolModel.nombre = '';
                this.schoolModel.provincia = '';
                this.schoolModel.municipio = '';
                this.selectedProv = '';
            },
            getProvince(id) {
                return provincias.find(x => x.provincia_id == id).provincia;
            },
            getMunicipio(id) {
                let nombre = municipios.find(x => x.municipio_id == id).municipio;
                return titleCase(nombre)
            }
        },
        computed: {
            _municipios() {
                if (!this.selectedProv) return [];
                let result = [];
                let selected = municipios.filter(x => x.provincia_id == this.selectedProv);
                selected.forEach(m => result.push({ value: m.municipio_id, label: titleCase(m.municipio) }));
                return result;
            },
            _provincias() {
                let result = [];
                provincias.forEach(pro => result.push({ value: pro.provincia_id, label: pro.provincia }));
                return result;
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>