<template>
   <div>
        <h1>Areas de desarrollo de la institución</h1>
        <FormulateForm 
            class="stepfive" 
            v-model="formResult"
            name="step_5"
            @failed-validation="validateForm(false)"
            @input="enableSend($event)"
        >
            <div class="min-container" :style="{width: '85%'}">
                <p :style="{marginBottom: '10px'}">¿A que area te gustaria pertenecer?</p>

                <p
                    v-if="depRequired"
                    :style="{
                        color: '#f00',
                        marginTop: '8px',
                        marginLeft: '20px',
                        marginBottom: '10px'
                    }"
                >Esta información es necesaria.</p>

                <div type="group" class="volTypes">

                    <p v-for="(type, index) in dictionaries.departamentos" :key="index">
                        <input :value="type.id" :id="'dep'+index" type="radio" name="departamento" :style="{display: 'inline-block', marginRight: '10px'}" @change="Catch($event)" />
                        <label :for="'dep'+index">{{type.departamento}}</label> 
                        <br>
                        <span>{{type.descripcion}}</span>
                    </p>

                </div>
            </div>

            <div class="min-container" :style="{marginTop: '20px', width: '85%'}">
                <p :style="{marginBottom: '10px'}">Tipo de miembro de la institución</p>
                
                <p
                    v-if="tipoRequired"
                    :style="{
                        color: '#f00',
                        marginTop: '8px',
                        marginLeft: '20px',
                        marginBottom: '10px'
                    }"
                >Esta información es necesaria.</p>

                <div type="group" class="volTypes">

                    <p v-for="(type, index) in dictionaries.tipoVoluntarios" :key="index">
                        <input type="radio" :value="type.id" :id="'tv'+index" name="tipoVoluntario" :style="{display: 'inline-block', marginRight: '10px'}" @change="Catch($event)" />
                        <label :for="'tv'+index">{{type.tipo}}</label> 
                        <br>
                        <span>{{type.descripcion}}</span>
                    </p>

                </div>
            </div>

            <div class="min-container" :style="{marginTop: '20px', width: '85%'}">
                <p :style="{marginBottom: '10px'}">¿Tienes alguna identificación de la institución? Ya sea gorra, chaleco, polo shirt, t-shit, etc.</p>
                
                <div type="group" class="volTypes">
                    <p>
                        <input type="radio" value="No" id="id1" name="identificacion" :style="{display: 'inline-block', marginRight: '10px'}" @change="Catch($event)" />
                        <label for="id1">No</label> 
                    </p>

                    <p>
                        <input type="radio" value="Si" id="id2" name="identificacion" :style="{display: 'inline-block', marginRight: '10px'}" @change="Catch($event)" />
                        <label for="id2">Si</label> 
                    </p>
                </div>
                <FormulateInput 
                    v-if="formResult.identificacion == 'Si'" 
                    type="textarea" 
                    name="identificacionDetails" 
                    label="Haga una lista de las identificaciones que tiene, cada una separada por coma (,)" 
                    validation="required"
                    validation-name="Identificaciones"
                    class="textInput" 
                    v-model="formResult.identificacionDetails"
                />
            </div>
        </FormulateForm>
        <div class="btnSend" @click="formFinish" v-if="ready" ><span>Enviar</span></div>
    </div>
</template>

<script>
import Request from "../../request/instance.js";

export default {
    data() {
        return {
            formResult: {
                tipoVoluntario: null,
                departamento: null,
                identificacion: null,
                identificacionDetails: null
            },
            depRequired: false,
            tipoRequired: false,
            ready: false,
            dictionaries: {
                departamentos: [],
                tipoVoluntarios: []
            }
        }
    },
    methods: {
        validateForm() {
            this.depRequired = false;
            this.tipoRequired = false;

            if(!this.formResult.tipoVoluntario || !this.formResult.departamento) {
                if(!this.formResult.departamento) {
                    this.depRequired = true;
                }

                if(!this.formResult.tipoVoluntario) {
                    this.tipoRequired = true;
                }

                return this.$emit("validation", false);
            }
        },
        formFinish() {
            this.$emit("send");
        },
        enableSend(e) {
            if(e.tipoVoluntario && e.departamento && e.identificacion) {
                if(e.identificacion == "Si") {
                    if(this.formResult.identificacionDetails?.length < 5) return this.ready = false;
                }

                this.ready = true;
                this.$emit("validation", {result: this.formResult, pos: 5});
            } else {
                this.ready = false;
            }
        },
        Catch(e) {
            this.formResult[e.target.name] = e.target.value;
            this.enableSend(this.formResult);
            //tipoVoluntario
        }
    },
    async mounted() {
        let requests = [
            Request.Get.Departamentos(),
            Request.Get.tipoVoluntarios()
        ];

        let [departamentos, tipoVoluntarios] = await Promise.all(requests);
        
        if(departamentos.status == 200 && tipoVoluntarios.status == 200) {
            this.dictionaries.departamentos = departamentos.data;
            this.dictionaries.tipoVoluntarios = tipoVoluntarios.data;
        } else {
            //throw error in this code block
        }
    }
}
</script>

<style scoped lang="scss">
.stepfive{
    border: 2px solid rgb(170, 170, 170);
    max-width: 40vw;
    min-width: 40vw;
    padding: 10px;
}

.volTypes {
  display: flex;
  flex-wrap: wrap;
  p {
    border: 1px solid rgb(187, 187, 187);
    border-left: 4px solid rgb(105, 105, 105);
    margin: 5px 10px;
    min-width: 200px;
    max-width: 200px;
    padding: 5px 5px 5px 10px;
    text-align: justify;
    cursor: pointer;
    font-size: 15px;
    margin-bottom: 5px;
    line-height: 20px;

        label  {
            margin-bottom: 10px;
            margin-top: 5px;
            font-weight: bold;
            font-size: 16px;
        }

        [type="radio"]:checked,
        [type="radio"]:not(:checked) {
            position: absolute;
            left: -9999px;
        }
        [type="radio"]:checked + label,
        [type="radio"]:not(:checked) + label
        {
            position: relative;
            padding-left: 25px;
            cursor: pointer;
            line-height: 18px;
            display: inline-block;
            color: rgb(0, 0, 0);
        }
        [type="radio"]:checked + label:before,
        [type="radio"]:not(:checked) + label:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 15px;
            height: 15px;
            border: 1px solid rgb(156, 156, 156);
            border-radius: 100%;
            background: #fff;
        }
        [type="radio"]:checked + label:after,
        [type="radio"]:not(:checked) + label:after {
            content: '';
            width: 11px;
            height: 11px;
            background: #ff0000;
            position: absolute;
            top: 3px;
            left: 3px;
            border-radius: 100%;
            -webkit-transition: all 0.2s ease;
            transition: all 0.2s ease;
        }
        [type="radio"]:not(:checked) + label:after {
            opacity: 0;
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        [type="radio"]:checked + label:after {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1);
        }
  }
}

.btnSend {
    border: 1px solid gray;
    text-align: center;
    margin:  30px 30%;
    height: 40px;
    display: flex;
    cursor: pointer;

    span {
        margin: auto;
    }

    &:hover {
      background: #00ff0025;  
    }
}
</style>