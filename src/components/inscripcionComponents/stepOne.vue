<template>
    <div class="stepcontainer">
        <h1>Datos del Comité</h1>
        <FormulateForm 
            name="step_1"
            class="stepone" 
            v-model="formResult" 
            @validation="validateForm"
            @failed-validation="validateForm(false)"
            invalid-message="Completa la informacion requerida"
        >
            <div class="min-container">
<!--                 <FormulateInput @validation="validate($event)" type="select" name="provincia" label="Provincia" validation="required" class="textInput" :options="Prov" @change="provinciaSelection($event)" />
                <FormulateInput @validation="validate($event)" type="select" name="municipio" label="Municipio" validation="required" class="textInput" :options="Mun" /> -->
                <FormulateInput @validation="validate($event)" type="select" name="estacion" label="Estacion" validation="required" class="textInput" :options="estaciones" />
            </div>
        </FormulateForm>
    </div>
</template>

<script>

/* const provincias = require("../../assets/data/provincias.json");
const municipios = require("../../assets/data/municipios.json"); */
import Request from "../../request/instance.js";

export default {
    data() {
        return {
            formResult: {},
            validations: {},
            estaciones: []
        }
    },
    methods: {
        validate(e) {
            this.validations[e.name] = { validity: !(e.hasErrors) }
        },
        validateForm(e = true) {
            if(!e) {
                return this.$emit("validation", false); 
            }
    
            for (var input in this.validations) {
                if(!this.validations[input].validity) {
                    return this.$emit("validation", false); 
                }
            }
            this.$emit("validation", {result: this.formResult, pos: 1});
        }
    },
    async mounted() {
        let result = await Request.Get.Estaciones();
        if(result.status == 200) {
            result.data.forEach(es => this.estaciones.push({ value: es.numero, label: `Estación ${es.numero} - ${es.municipio}` }) );
        } else {
            //Show error in this code block
        }
    }
}
</script>

<style scoped lang="scss">
    .stepone {
        border: 2px solid rgb(170, 170, 170);
        max-width: 40vw;
        min-width: 40vw;
        padding: 5px 0px 25px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media only screen and (max-width: 900px) {
        .stepone {
            max-width: 100vw;
            min-width: 95vw;
        }
    }
</style>