<template>
  <div class="stepcontainer">
        <h2>Datos Importantes</h2>
        <FormulateForm 
            class="stepthree"
            @validation="validate"
            invalid-message="Completa la informacion requerida"
        >
            <!-- <div class="min-container">
                <FormulateInput 
                    v-model="bloodInput"
                    validation="required"
                    name="blood"
                    type="select"
                    label="Tipo de sangre"
                    validation-name="Tipo de sangre"
                    :options="bloodOptions" 
                    @validation="validate($event)" 
                />
            </div> -->

            <div class="min-container inputBreak">
                <p></p>
                <div :style="{ display:'flex', flexDirection:'column' }">
                    <h2>En caso de emergencia, llamar a:</h2>
                    <p :style="{ marginLeft: '20px', fontWeight:'bold', color:'#7f7f7f' }">Agregar al menos una persona</p>

                    <p
                        v-if="familyRequired"
                        :style="{ color: '#ff3300', marginTop: '8px', fontSize: '13px', fontWeight:'bold',
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
                        </div>

                    </div>

                    <FormulateInput v-model="familyModel.name" type="text" name="Nombre" label="Nombre" />
                    <FormulateInput v-model="familyModel.relation" type="text" name="Parentezco" label="Parentezco" />
                    <FormulateInput v-model="familyModel.phone" type="text" name="Telefono/Celular" label="Telefono de contacto" />

                    <button @click="addFamily"><i class="icofont-plus-circle"></i> Agregar</button>
                </div>
            </div>

            <div class="min-container inputBreak">
                <FormulateInput type="group" name="deseases">
                    <FormulateInput name="sickness" type="checkbox" label="¿Sufre alguna enfermedad/condición?" @change="desease.state = !desease.state" :style="{ marginBottom:'10px' }" />
                    <FormulateInput 
                        v-if="desease.state" 
                        type="textarea" 
                        name="sicknessDetails" 
                        label="Especifique su enfermedad/condición (seperados por coma (,)" 
                        validation-name="Detalle enfermedad/condición"
                        @validation="validate($event)"
                        v-model="desease.contents"
                    />
                </FormulateInput>

                <FormulateInput type="group" name="medicines" >
                    <FormulateInput name="terms" type="checkbox" label="¿Es alergico a algun medicamento?" @change="medicines.state = !medicines.state" :style="{ marginBottom:'10px' }" />
                    <FormulateInput 
                        v-if="medicines.state" 
                        type="textarea" 
                        name="alergies" 
                        label="Especifique los medicamentos que requiere (seperados por coma (,))"
                        @validation="validate($event)" 
                        v-model="medicines.contents"
                    />
                </FormulateInput>

                <FormulateInput type="group" name="healthAsurance">
                    <FormulateInput name="assurance" type="checkbox" label="¿Tiene seguro de salud?" @change="assurance.state = !assurance.state" :style="{ marginBottom:'10px' }" />
                    <FormulateInput 
                        v-if="assurance.state" 
                        type="text" 
                        name="assuranceCompany" 
                        label="Proveedor (compañia)" 
                        validation-name="Proveedor"
                        @validation="validate($event)"
                        v-model="assurance.company"
                    />
                    <FormulateInput 
                        v-if="assurance.state"
                        type="text" 
                        name="assuranceCode" 
                        label="Código afiliado" 
                        validation-name="Código afiliado"
                        @validation="validate($event)"
                        v-model="assurance.code"
                    />
                </FormulateInput>
            </div>

            <button @click="validateForm">Siguiente <i class="icofont-arrow-right"></i></button>

        </FormulateForm>
    </div>
</template>

<script>
import { contactSchema } from '../../utils/modelValidate';

export default {
    data() {
        return {
            familyModel: {
                name: '',
                relation: '',
                phone: ''
            },
            medicines: {
                state: false,
                contents: ''
            },
            desease: {
                state: false,
                contents: ''
            },
            assurance: {
                state: false,
                company: '',
                code: ''
            },
            /* bloodOptions: {
                "O-": "O-",
                "O+": "O+",
                "A-": "A-",
                "A+": "A+",
                "B-": "B-",
                "B+": "B+",
                "AB-": "AB-",
                "AB+": "AB+",
            }, */
            family: [],
            validations: {},
            familyRequired: false,
            bloodInput: ''
        }
    },
    methods: {
        addFamily() {
            let familyMember = {
                name: this.familyModel.name,
                relation: this.familyModel.relation,
                phone: this.familyModel.phone
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
        },
        removeFamily(index) {
            this.family.splice(index, 1);
        },
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

            if(this.family.length < 1) {
                this.familyRequired = true;
            }

            let formResult = {
                desease: {
                    state : false
                },
                medicine: {
                    state : false
                },
                assurance: {
                    state: false
                },
                emergencyContacts: []
            }

            if(this.family.length > 0) {
                this.familyRequired = false;
                formResult.emergencyContacts = this.family;
            } else {
                this.familyRequired = true;
                this.$throwAppMessage({
                    message: "Debe agregar al menos un contacto",
                    icon: "icofont-close-circled",
                    type: 'error',
                }); 
                return;
            }

            if(this.desease.state) {
                formResult.desease.state = true;
                if(!this.desease.contents) {
                    this.$throwAppMessage({
                        message: "Debe especificar las condicones de salud que tiene",
                        icon: "icofont-close-circled",
                        type: 'error',
                    }); 
                    return;
                }
                formResult.desease.contents = this.desease.contents;
            }

            if(this.medicines.state) {
                formResult.medicine.state = true;
                if(!this.medicines.contents) {
                    this.$throwAppMessage({
                        message: "Debe especificar los medicamentos que le causan alergia",
                        icon: "icofont-close-circled",
                        type: 'error',
                    }); 
                    return;
                }
                formResult.medicine.contents = this.medicines.contents;
            }

            if(this.assurance.state) {
                formResult.assurance.state = true;
                if (!this.assurance.company || !this.assurance.code) {
                    this.$throwAppMessage({
                        message: "Debe completar la información de se seguro de salud",
                        icon: "icofont-close-circled",
                        type: 'error',
                    });
                    return;
                }
                formResult.assurance.company = this.assurance.company;
                formResult.assurance.code = this.assurance.code;
            }

            this.$emit("validation", {result: formResult, pos: 3});
        }
    }

}
</script>

<style lang="scss" scoped>

    .stepthree{
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    /* @media only screen and (max-width: 900px) {
        .stepthree {
            max-width: 100vw;
            min-width: 95vw;
        }
    } */

</style>