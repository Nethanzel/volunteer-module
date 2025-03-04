<template>
    <div class="stepcontainer">
        <h2>Datos de la Escuela</h2>
        <FormulateForm 
            class="stepone"
            v-model="formResult"
            invalid-message="Completa la informacion requerida"
        >
            <div class="min-container" :style="{width: '85%', display: loadingOptions ? 'none' : 'block'}">
                <p>Seleccione la escuela donde práctica:</p>

                <p
                    v-if="schRequired"
                    :style="{ color: '#ff3300', marginTop: '0px', fontSize: '13px', fontWeight:'bold',
                        marginLeft: '20px', fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
                    }"
                >Esta información es necesaria.</p>

                <div type="group" class="custom-radio" :style="{marginTop: '10px'}">
                    
                    <div class="option-wrapper">
                        <div 
                            class="option"
                            v-for="(school, i) in escuelas" 
                            :key="i"
                            :style="{}"
                            @click="selectOption($event, 'sch'+i, 'escuela', school.id)"
                        >
                            <input :value="school.id" :id="'sch'+i" type="radio" name="escuela" :style="{display: 'inline-block', marginRight: '10px'}" />
                            <label>{{school.nombre}}</label> 
                            <br>
                            <span :style="{ display:'block', marginLeft:'20px' }"><i class="icofont-location-pin" :style="{ marginRight:'2px' }"></i> {{school.municipio}}</span>
                            <span :style="{ display:'block', marginLeft:'20px' }">
                                <i class="icofont-star" :style="{ marginRight:'2px' }"></i> 
                                Profesor {{`${school.lider.nombre} ${school.lider.apellido}`}}
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            <img v-if="loadingOptions" src="../../assets/spinner.png" class="_spinner rotating">
            <button v-else @click="validateForm">Siguiente <i class="icofont-arrow-right"></i></button>
        </FormulateForm>
    </div>
</template>

<script>

import Request from "../../request/instance.js";
const provincias = require("../../assets/data/provincias.json");
const municipios = require("../../assets/data/municipios.json");

export default {
    data() {
        return {
            loadingOptions: true,
            formResult: {},
            escuelas: [],
            provincias,
            municipios,
            schRequired: false
        }
    },
    methods: {
        async validateForm() {
            if (!this.formResult.escuela) {
                this.$throwAppMessage({ 
                    message: "Debe seleccionar una escuela!",
                    icon: "icofont-close-circled",
                    type: 'error',
                });
                this.schRequired = true;
                return;
            }
           
            this.$emit("validation", {result: this.formResult, pos: 1});
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
            this.formResult[name] = value;
            this.highlightSelected(e.target, i);
        }
    },
    async mounted() {
        let result = await Request.Get.Escuelas().catch(err => err).finally(() => this.loadingOptions = false);
        if(result.status == 200) {
            result.data.forEach(es => {
                if (!es.deleted) {
                    let provincia = this.provincias.filter(p => p.provincia_id == es.provincia)[0];
                    let municipio = this.municipios.filter(p => p.municipio_id == es.municipio)[0];

                    es.municipio = municipio.municipio;
                    es.provincia = provincia.provincia;

                    this.escuelas.push(es)
                    //this.escuelas.push({ value: es.id, label: `${es.nombre} - ${municipio.municipio}` })
                }
            });

            if (this.data) this.formResult = this.data;
        }
    },
}
</script>

<style scoped lang="scss">
    .stepone {
        display: flex;
        align-items: center;
        flex-direction: column;
    }

/*     @media only screen and (max-width: 900px) {
        .stepone {
            max-width: 100vw;
            min-width: 95vw;
        }
    } */
</style>