<template>
  <div>
        <h1>Datos de Salud</h1>
        <FormulateForm 
            class="stepfour" 
            name="step_4"
            @submit="validateForm"
            @input="validateForm"
            @failed-validation="validateForm(false)"
            invalid-message="Completa la informacion requerida"
        >
            <div class="min-container">
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
            </div>

            <FormulateInput type="group" class="min-container" name="deseases">
                <FormulateInput name="sickness" type="checkbox" label="¿Sufre alguna enfermedad?" @change="desease.state = !desease.state"/>
                <FormulateInput 
                    v-if="desease.state" 
                    type="textarea" 
                    name="sicknessDetails" 
                    label="Especifique sus padecimientos" 
                    validation="required"
                    validation-name="Padecimientos"
                    class="textInput" 
                    @validation="validate($event)"
                    v-model="desease.contents"
                />
            </FormulateInput>

            <FormulateInput type="group" class="min-container" name="medicines" >
                <FormulateInput name="terms" type="checkbox" label="¿Es alergico a algun medicamento?" @change="medicines.state = !medicines.state"/>
                <FormulateInput 
                    v-if="medicines.state" 
                    type="textarea" 
                    name="allergies" 
                    label="Especifique los medicamentos"
                    validation-name="Medicamentos"
                    validation="required" 
                    class="textInput" 
                    @validation="validate($event)" 
                    v-model="medicines.contents"
                />
            </FormulateInput>

            <div class="min-container">
                <p></p>

                <div>
                    <p>En caso de emergencia, llamar a:</p>
                    <p>Agregua al menos dos (2) personas.</p>
                    <p
                        v-if="familyRequired"
                        :style="{
                            color: '#f00',
                            marginTop: '8px',
                            marginLeft: '20px'
                        }"
                    >Esta información es necesaria.</p>


                    <div v-for="(member, index) in family" :key="index" class="rowData" @click="removeFamily(index)">
                        <p><b>Nombre:</b> {{member.name}}</p>
                        <p><b>Parentezco:</b> {{member.relation}}</p>
                        <p><b>Telefono/Celular:</b> {{member.phone}}</p>
                    </div>

                    <FormulateInput v-model="familyModel.name" type="text" name="Nombre" label="Nombre" class="textInput"/>
                    <FormulateInput v-model="familyModel.relation" type="text" name="Parentezco" label="Parentezco" class="textInput"/>
                    <FormulateInput v-model="familyModel.phone" type="text" name="Telefono/Celular" label="Telefono de contacto" class="textInput"/>
                    <p class="stdAdd" @click="addFamily">Agregar</p>
                </div>
            </div>
        </FormulateForm>
    </div>
</template>

<script>
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
            bloodOptions: {
                "O-": "O-",
                "O+": "O+",
                "A-": "A-",
                "A+": "A+",
                "B-": "B-",
                "B+": "B+",
                "AB-": "AB-",
                "AB+": "AB+",
            },
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
            this.family.push(familyMember);

            this.familyModel.name = '';
            this.familyModel.relation = '';
            this.familyModel.phone = '';
        },
        removeFamily(index) {
            this.family.splice(index, 1);
        },
        validate(e) {
            this.validations[e.name] = { validity: !(e.hasErrors) }
        },
        validateForm(e = true) {
            if(!e) {
                if(this.family.length < 1) {
                    this.familyRequired = true;
                }
                return this.$emit("validation", false); 
            }

            for (var input in this.validations) {
                if(!this.validations[input].validity) {
                    return this.$emit("validation", false); 
                }
            }

            let formResult = {
                bloodType: this.bloodInput,
                desease: {
                    state : false
                },
                medicine: {
                    state : false
                },
                emergencyContacts: []
            }

            if(this.family.length > 1) {
                this.familyRequired = false;
                formResult.emergencyContacts = this.family;
            } else {
                this.familyRequired = true;
                return this.$emit("validation", false); 
            }

            if(this.desease.state) {
                formResult.desease.state = true;
                formResult.desease.contents = this.desease.contents;
            }

            if(this.medicines.state) {
                formResult.medicine.state = true;
                formResult.medicine.contents = this.medicines.contents;
            }
            this.$emit("validation", {result: formResult, pos: 4});
        }
    }

}
</script>

<style scoped>

.stepfour{
    border: 2px solid rgb(170, 170, 170);
    max-width: 45vw;
    min-width: 45vw;
    padding: 5px 0px 25px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

</style>