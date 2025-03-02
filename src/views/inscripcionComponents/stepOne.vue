<template>
    <div class="stepcontainer">
        <h2>Datos del Comité</h2>
        <FormulateForm 
            class="stepone"
            v-model="formResult"
            @validation="validate"
            invalid-message="Completa la informacion requerida"
        >
            <div class="min-container" :style="{ display: loadingOptions ? 'none' : 'block' }">
                <FormulateInput type="select" name="estacion" label="Estacion" validation="required" :options="estaciones" />
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
            validations: {},
            estaciones: [],
            provincias,
            municipios
        }
    },
    methods: {
        validate(e) {
            this.validations[e.name] = e;
        },
        async validateForm() {
            for (var input in this.validations) {
                if(this.validations[input].hasErrors) {
                    this.$throwAppMessage({ 
                        message: this.validations[input].errors[0],
                        icon: "icofont-close-circled",
                        type: 'error',
                    }); 
                    return;
                }
            }
           
            this.$emit("validation", {result: this.formResult, pos: 1});
        }
    },
    async mounted() {
        let result = await Request.Get.Estaciones().catch(err => err).finally(() => this.loadingOptions = false);
        if(result.status == 200) {
            result.data.forEach(es => {
                if (!es.deleted) {
                    let provincia = this.provincias.filter(p => p.provincia_id == es.provincia)[0];
                    let municipio = this.municipios.filter(p => p.municipio_id == es.municipio)[0];
                    this.estaciones.push({ value: es.id, label: `Estación ${es.numero} - ${provincia.provincia} (${municipio.municipio})` })
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

    @media only screen and (max-width: 900px) {
        .stepone {
            max-width: 100vw;
            min-width: 95vw;
        }
    }
</style>