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
                <FormulateInput type="text" name="nombre" label="Nombres" validation="required"/>
                <FormulateInput type="text" name="apellido" label="Apellidos" validation="required"/>
                <FormulateInput name="nacimientolugar" label="Lugar de nacimiento" type="select" :options="Prov"/>
                <FormulateInput type="date" validation-name="Fecha de nacimiento" validation="required" name="nacimientofecha" label="Fecha de nacimiento" @change="birthDateChanged"/>
                <FormulateInput type="text" validation-name="Cédula" name="identity" label="Cédula" :errors="identityErr" />
                <!-- <FormulateInput type="text" name="nacionalidad" label="Nacionalidad" validation="required"/> 
                <FormulateInput type="select" :options="eCivil" name="ecivil" label="Estado civil"/>-->
                <FormulateInput type="text" name="ocupacion" label="Ocupación" />
                <FormulateInput type="text" name="peso" label="Peso (en libras)" placeholder="Ejemplo: 125" />
                <FormulateInput type="text" name="estatura" label="Estatura (en pies)" placeholder="Ejemplo 5.8" />
            </div>

            <div class="min-container inputBreak">
                <h2>¿Donde vives?</h2>
                <FormulateInput type="select" :options="Mun" name="municipio" label="Municipio" validation="required" />
                <FormulateInput type="text" name="sector" label="Sector" validation="required" />
                <FormulateInput type="text" name="calle" label="Calle" validation="required" />
                <FormulateInput type="text" name="casa_no" label="Casa/Edificio" />
                <FormulateInput type="text" name="apartamento" label="Apartamento" />
            </div>
            
            <div class="min-container inputBreak">
                <h2>Contacto</h2>
                <FormulateInput type="text" name="celular" label="Celular" :errors="celularErr" />
                <FormulateInput type="text" name="telefono" label="Otro celular" :errors="telefonoErr" />
                <FormulateInput type="email" name="email"  validation-name="Correo electronico" label="Correo electronico" :errors="emailErr" />
            </div>

            <div class="min-container inputBreak" v-if="isMinor">
                <h2>Consentimiento del padre/madre o tutor</h2>

                <div class="info-message warn">

                    <div class="icon">
                        <i class="icofont-warning"></i>
                    </div>

                    <div class="content">
                        <p class="title">
                            Según tu fecha de nacimiento, eres menor de edad! Por este motivo es necesaria 
                            la información de tu(s) tutor(es)
                        </p>

                        <p>
                            Al entregar su información, autoriza y acepta la inscripción de su representado para las prácticas
                            de esta institución marcial, apoyando a profesores e instructores en cualquiera de sus actividades.
                        </p>
                    </div>

                </div>

                <div :style="{ display:'flex', flexDirection:'column' }">
                    <p :style="{ marginLeft: '20px', fontWeight:'bold', color:'#7f7f7f' }">Agregar al menos una persona</p>

                    <p
                        v-if="familyRequired"
                        :style="{ color: '#ff3300', marginTop: '3px', fontSize: '13px', fontWeight:'bold',
                            marginLeft: '20px', fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
                        }"
                    >Esta información es necesaria.</p>


                    <div v-for="(member, index) in family" :key="index" class="rowData" @click="removeFamily(index)">
                        <div class="head">
                            <i class="icofont-ui-user"></i>
                        </div>
                        <div class="info">

                            <p><b>Nombre:</b> {{member.name}}</p>
                            <p><b>Parentezco:</b> {{member.relation}}</p>
                            <p><b>Telefono/Celular:</b> {{member.phone}}</p>
                            <p v-if="member.otherPhone"><b>Telefono/Celular:</b> {{member.otherPhone}}</p>

                        </div>

                    </div>

                    <FormulateInput v-model="familyModel.name" type="text" name="Nombre" label="Nombre" />
                    <FormulateInput v-model="familyModel.relation" type="text" name="Parentezco" label="Parentezco" />
                    <FormulateInput v-model="familyModel.phone" type="text" name="Telefono/Celular" label="Telefono de contacto" />
                    <FormulateInput v-model="familyModel.otherPhone" type="text" name="Telefono" label="Otro telefono" />

                    <button @click="addFamily" :disabled="family.length > 1"><i class="icofont-plus-circle"></i> Agregar</button>
                </div>
            </div>

            <button v-if="!valitinId" @click="validateForm">Siguiente <i class="icofont-arrow-right"></i></button>
            <img v-else src="../../assets/spinner.png" class="rotating">
        </FormulateForm>
    </div>
</template>

<script>
const provincias = require("../../assets/data/provincias.json");
const municipios = require("../../assets/data/municipios.json");
import { contactSchema, userContactSchema } from "../../utils/modelValidate";
import axiosRequest from "../../request/instance";

export default {
    data() {
        return {
            formResult: {},
            validations: {},
            Prov: [],
            Mun: [],
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
            telefonoErr: [],
            isMinor: false,
            familyModel: {
                name: '',
                relation: '',
                phone: '',
                otherPhone: ''
            },
            family: [],
            familyRequired: false
        }
    },
    methods: {
        validate(e) {
            this.validations[e.name] = e;
        },
        validateForm() {
            delete this.formResult.Nombre;
            delete this.formResult.Telefono;
            delete this.formResult.Parentezco;
            delete this.formResult['Telefono/Celular'];

            this.emailErr = [];
            this.celularErr = [];
            this.telefonoErr = [];
            this.identityErr = [];

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

            this.formResult.tutorInfo = null;

            if (this.isMinor) {
                if (this.family.length == 0) {
                    this.$throwAppMessage({
                        message: 'Los datos del tutor son obligatorios!',
                        icon: "icofont-close-circled",
                        type: 'error',
                    });
                    this.familyRequired = true;
                    return;
                }
                this.formResult.tutorInfo = this.family;
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
        },
        birthDateChanged(e) {
            let edad = this.calcularEdad(e.target.value);
            this.isMinor = edad > 17 ? false : true;
        },
        calcularEdad(fechaNacimiento) {
            const fechaNac = new Date(fechaNacimiento);
            const hoy = new Date();

            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            const dia = hoy.getDate() - fechaNac.getDate();

            if (mes < 0 || (mes === 0 && dia < 0)) edad--;

            return edad;
        },
        addFamily() {
            let familyMember = {
                name: this.familyModel.name,
                relation: this.familyModel.relation,
                phone: this.familyModel.phone,
                otherPhone: this.familyModel.otherPhone
            };

            let { error } = contactSchema.validate(familyMember);

            if (error) {
                this.$throwAppMessage({
                    message: error.details[0].message,
                    icon: "icofont-close-circled",
                    type: 'error',
                }); 
                return;
            }

            this.family.push(familyMember);
            this.familyRequired = false;
            
            this.familyModel.name = '';
            this.familyModel.relation = '';
            this.familyModel.phone = '';
            this.familyModel.otherPhone = '';
        },
        removeFamily(index) {
            this.family.splice(index, 1);
        },
    },
    mounted() {
        provincias.forEach(pro => {
            this.Prov.push({ value: pro.provincia_id, label: pro.provincia })
        });
        municipios.forEach(m => {
            this.Mun.push({ value: m.municipio_id, label: m.municipio })
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

   /*  @media only screen and (max-width: 900px) {
        .steptwo {
            max-width: 100vw;
            min-width: 95vw;
        }
    } */
</style>