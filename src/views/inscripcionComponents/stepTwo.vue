<template>
    <div class="stepcontainer">
        <h2>Datos Personales</h2>
        <FormulateForm 
            class="steptwo" 
            v-model="formResult"
            @validation="validate"
            invalid-message="Completa la informacion requerida"
        >
            <div class="min-container inputBreak">
                <FormulateInput type="text" validation-name="Cedula/Pasaporte" name="identity" label="Cedula/Pasaporte" validation="required" :errors="identityErr" />
                <FormulateInput type="text" name="nombre" label="Nombres" validation="required"/>
                <FormulateInput type="text" name="apellido" label="Apellidos" validation="required"/>
                <FormulateInput name="nacimientolugar" label="Lugar de nacimiento" type="select" :options="Prov"/>
                <FormulateInput type="date" validation-name="Fecha de nacimiento" validation="required" name="nacimientofecha" label="Fecha de nacimiento"/>
                <FormulateInput type="text" name="nacionalidad" label="Nacionalidad" validation="required"/>
                <FormulateInput type="select" :options="eCivil" name="ecivil" label="Estado civil"/>
            </div>
            
            <div class="min-container inputBreak">
                <h2>Direccion</h2>
                <FormulateInput type="select" :options="Prov" name="provincia" label="Provincia" validation="required" />
                <FormulateInput type="text" name="sector" label="Sector" validation="required" />
                <FormulateInput type="text" name="calle" label="Calle" />
                <FormulateInput type="text" name="casa_no" label="No. de casa" />
            </div>

            <div class="min-container inputBreak">
                <h2>Contacto</h2>
                <FormulateInput type="text" name="telefono" label="Telefono fijo" :errors="telefonoErr" />
                <FormulateInput type="text" name="celular" label="Celular" validation="required" :errors="celularErr" />
                <FormulateInput type="text" name="email"  validation-name="Correo electronico" label="Correo electronico" validation="required|email" :errors="emailErr" />
            </div>

            <button v-if="!valitinId" @click="validateForm">Siguiente <i class="icofont-arrow-right"></i></button>
            <img v-else src="../../assets/spinner.png" class="rotating">
        </FormulateForm>
    </div>
</template>

<script>
const provincias = require("../../assets/data/provincias.json");
import axiosRequest from "../../request/instance";
import { userContactSchema } from "../../utils/modelValidate";

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
            ],
            identityErr: [],
            emailErr: [],
            valitinId: false,
            celularErr: [],
            telefonoErr: []
        }
    },
    methods: {
        validate(e) {
            this.validations[e.name] = e;
        },
        validateForm() {
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

            let { error } = userContactSchema.validate({ telefono:this.formResult.telefono, celular:this.formResult.celular });

            if (error) {
                this[`${error.details[0].path[0]}Err`] = [error.details[0].message]
                this.$throwAppMessage({
                    message: error.details[0].message,
                    icon: "icofont-close-circled",
                    type: 'error',
                }); 
                return;
            }

            this.valitinId = true;

            this.validateIdentity(this.formResult.identity, this.formResult.email)
            .then((validation) => {
                let stopEmit = false;
                if (validation.identityExists) {
                    this.identityErr = ['Ya hay un registro con esta cédula/pasaporte'];
                    this.$throwAppMessage({ 
                        message: 'Ya hay un registro con esta cédula/pasaporte',
                        icon: "icofont-close-circled",
                        type: 'error',
                    }); 
                    stopEmit = true;
                }
                if (!validation.isValidEmail) {
                    this.emailErr = ['Direccion de correo inválida'];
                    this.$throwAppMessage({ 
                        message: 'Direccion de correo inválida',
                        icon: "icofont-close-circled",
                        type: 'error',
                    }); 
                    stopEmit = true;
                }
                if (!stopEmit) this.$emit("validation", {result: this.formResult, pos: 2});
            })
            .catch(() => null)
            .finally(() => this.valitinId = false);
        },
        validateIdentity(identity, email) {
            return new Promise((resolve, reject) => {
                axiosRequest.Get.validateIdentityExists(identity, email)
                .then((rs) => rs.status == 200 ? resolve(rs.data) : reject(null))
                .catch(() => reject(null))
            });
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
        display: flex;
        align-items: center;
        flex-direction: column;

        .rotating {
            margin-left: auto;
            margin-right: 60px;
            margin-top: 16px;
            height: 30px;
            width: 30px;
        }
    }

    @media only screen and (max-width: 900px) {
        .steptwo {
            max-width: 100vw;
            min-width: 95vw;
        }
    }
</style>