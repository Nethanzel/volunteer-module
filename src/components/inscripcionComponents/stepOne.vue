<template>
    <div>
        <h1>Datos del Comité</h1>
        <FormulateForm class="stepone" v-model="formResult">
            <div class="min-container">
                <FormulateInput @validation="validate($event)" type="select" name="provincia" label="Provincia" validation="required" class="textInput" :options="Prov" @change="provinciaSelection($event)" />
                <FormulateInput @validation="validate($event)" type="select" name="municipio" label="Municipio" validation="required" class="textInput" :options="Mun" />
                <FormulateInput @validation="validate($event)" type="text" name="estacion" label="Estacion" validation="required" class="textInput" />
            </div>
        </FormulateForm>
    </div>
</template>

<script>

const provincias = require("../../assets/data/provincias.json");
const municipios = require("../../assets/data/municipios.json");

export default {
    data() {
        return {
            formResult: {},
            Prov: [],
            Mun: [],
            validations: {}
        }
    },
    methods: {
        loadSelectors() {
            provincias.forEach(pro => {
                this.Prov.push({ value: pro.provincia_id, label: pro.provincia })
            });
        },
        provinciaSelection(value) {
            let result = municipios.filter(mun => mun.provincia_id == value.target.value);
            this.Mun.length = 0;
            result.forEach(mun => this.Mun.push({ value: mun.minicipio_id, label: mun.minicipio }))
        },
        validate(e) {
            this.validations[e.name] = { validity: !(e.hasErrors) }
        }
    },
    mounted() {
        this.loadSelectors();
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
</style>