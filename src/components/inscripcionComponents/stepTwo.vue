<template>
    <div>
        <h1>Datos Personales</h1>
        <FormulateForm 
            class="steptwo" 
            name="step_2"
            v-model="formResult"
            @validation="validateForm"
            @failed-validation="validateForm(false)"
            invalid-message="Completa la informacion requerida"
        >
            <div class="min-container">
                <FormulateInput @validation="validate($event)" type="text" validation-name="Cedula/Pasaporte" name="identity" label="Cedula/Pasaporte" validation="required" class="textInput"/>
                <FormulateInput @validation="validate($event)" type="text" name="nombre" label="Nombres" validation="required" class="textInput"/>
                <FormulateInput @validation="validate($event)" type="text" name="apellido" label="Apellidos" validation="required" class="textInput"/>
                <FormulateInput name="nacimientolugar" label="Lugar de nacimiento" class="textInput" type="select" :options="Prov"/>
                <FormulateInput @validation="validate($event)" type="date" validation-name="Fecha de nacimiento" validation="required" name="nacimientofecha" label="Fecha de nacimiento" class="textInput"/>
                <FormulateInput @validation="validate($event)" type="text" name="nacionalidad" label="Nacionalidad" validation="required" class="textInput"/>
                <FormulateInput type="select" :options="eCivil" name="ecivil" label="Estado civil" class="textInput"/>
            </div>
            
            <div class="min-container">
                <h2>Direccion</h2>
                <FormulateInput @validation="validate($event)" type="select" :options="Prov" name="provincia" label="Provincia" validation="required" class="textInput"/>
                <FormulateInput @validation="validate($event)" type="text" name="sector" label="Sector" validation="required" class="textInput"/>
                <FormulateInput type="text" name="calle" label="Calle" class="textInput"/>
                <FormulateInput type="text" name="casa_no" label="No. de casa" class="textInput"/>
            </div>

            <div class="min-container">
                <h2>Contacto</h2>
                <FormulateInput type="text" name="telefono" label="Telefono fijo" class="textInput"/>
                <FormulateInput @validation="validate($event)" type="text" name="celular" label="Celular" validation="required" class="textInput"/>
                <FormulateInput @validation="validate($event)" type="text" name="email" label="Correo electronico" validation="required|email" class="textInput"/>
            </div>
        </FormulateForm>
    </div>
</template>

<script>
const provincias = require("../../assets/data/provincias.json");

export default {
    data() {
        return {
            formResult: {},
            validations: {},
            Prov: [],
            eCivil: [
                { 
                    value: "Solter@",
                    label: "Solter@" 
                },
                { 
                    value: "Casad@",
                    label: "Casad@" 
                },
                { 
                    value: "Unión libre",
                    label: "Unión libre" 
                }
            ]
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
            this.$emit("validation", {result: this.formResult, pos: 2});
        }
    },
    mounted() {
        provincias.forEach(pro => {
            this.Prov.push({ value: pro.provincia_id, label: pro.provincia })
        });
    }
}
</script>

<style lang="scss" scoped>
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
</style>