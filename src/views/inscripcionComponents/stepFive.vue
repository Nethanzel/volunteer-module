<template>
   <div class="stepcontainer">
        <h2>Areas de desarrollo de la institución</h2>
        <FormulateForm 
            class="stepfive" 
            v-model="formResult"
        >
            <div class="min-container" :style="{width: '85%'}">
                <p>¿A que area te gustaria pertenecer?</p>

                <p
                    v-if="depRequired"
                    :style="{ color: '#ff3300', marginTop: '0px', fontSize: '13px', fontWeight:'bold',
                        marginLeft: '20px', fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
                    }"
                >Esta información es necesaria.</p>

                <div type="group" class="custom-radio" :style="{marginTop: '10px'}">
                    
                    <img v-if="loadingDepartments" :src="loadingIcon" class="_spinner rotating">

                    <p v-for="(type, index) in dictionaries.departamentos" :key="index">
                        <input :value="type.id" :id="'dep'+index" type="radio" name="departamento" :style="{display: 'inline-block', marginRight: '10px'}" @change="Catch($event)" />
                        <label :for="'dep'+index">{{type.departamento}}</label> 
                        <br>
                        <span>{{type.descripcion}}</span>
                    </p>

                </div>
            </div>

            <div class="min-container" :style="{marginTop: '20px', width: '85%'}">
                <p>Tipo de miembro de la institución</p>
                
                <p
                    v-if="tipoRequired"
                    :style="{ color: '#ff3300', marginTop: '0px', fontSize: '13px', fontWeight:'bold',
                        marginLeft: '20px', fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
                    }"
                >Esta información es necesaria.</p>

                <div type="group" class="custom-radio" :style="{ marginTop:'10px' }">

                    <img v-if="loadingTypes" :src="loadingIcon" class="_spinner rotating">

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
                <p
                    v-if="identificationRequired"
                    :style="{ color: '#ff3300', marginTop: '0px', fontSize: '13px', fontWeight:'bold',
                        marginLeft: '20px', fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
                    }"
                >Esta información es necesaria.</p>
                <div type="group" class="custom-radio">
                    <p>
                        <input type="radio" value="false" id="id1" name="identificacion" :style="{display: 'inline-block', marginRight: '10px'}" @change="Catch($event)" />
                        <label for="id1">No</label> 
                    </p>

                    <p>
                        <input type="radio" value="true" id="id2" name="identificacion" :style="{display: 'inline-block', marginRight: '10px'}" @change="Catch($event)" />
                        <label for="id2">Si</label> 
                    </p>
                </div>
                <FormulateInput 
                    v-if="formResult.identificacion == 'true'" 
                    type="textarea" 
                    name="identificacionDetails" 
                    label="Haga una lista de las identificaciones que tiene, cada una separada por coma (,)" 
                    validation="required"
                    validation-name="Identificaciones"
                    v-model="formResult.identificacionDetails"
                />
            </div>

            <button @click="validateForm"><i class="icofont-check" :style="{ marginLeft:'0px', marginRight:'5px' }"></i> Terminar registro</button>

        </FormulateForm>
    </div>
</template>

<script>
import Request from "../../request/instance.js";
import loadingIcon from "../../assets/spinner.png";

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
            identificationRequired: false,
            ready: false,
            dictionaries: {
                departamentos: [],
                tipoVoluntarios: []
            },
            loadingIcon,
            loadingTypes: true,
            loadingDepartments: true,
        }
    },
    methods: {
        validateForm() {
            this.depRequired = false;
            this.tipoRequired = false;
            this.identificationRequired = false;

            if(!this.formResult.tipoVoluntario || !this.formResult.departamento || !this.formResult.identificacion) {
                if(!this.formResult.departamento) {
                    this.depRequired = true;
                }

                if(!this.formResult.tipoVoluntario) {
                    this.tipoRequired = true;
                }

                if(!this.formResult.identificacion) {
                    this.identificationRequired = true;
                }
                return;
            }

            this.$emit("validation", {result: this.formResult, pos: 5});
        },
        Catch(e) {
            this.formResult[e.target.name] = e.target.value;
        },
    },
    async mounted() {
        let requests = [
            Request.Get.Departamentos(),
            Request.Get.tipoVoluntarios()
        ];

        let [departamentos, tipoVoluntarios] = await Promise.all(requests).catch(e => e).finally(() => {
            this.loadingDepartments = false;
            this.loadingTypes = false;
        });
        
        if(departamentos.status == 200 && tipoVoluntarios.status == 200) {
            departamentos.data.forEach(dep => {
                if (!dep.deleted) this.dictionaries.departamentos.push(dep);
            });

            tipoVoluntarios.data.forEach((tp) => {
                if (!tp.deleted) this.dictionaries.tipoVoluntarios.push(tp);
            });

            this.loadingDepartments = false;
            this.loadingTypes = false;
        }
    }
}
</script>

<style scoped lang="scss">

.stepcontainer {
    display: flex;
    flex-direction: column;
}

.stepfive{
    display: flex;
    align-items: center;
    flex-direction: column;
}

.custom-radio {
  display: flex;
  flex-wrap: wrap;
  p {
    border: 1px solid rgb(215, 215, 215);
    border-left: 4px solid rgb(105, 105, 105);

    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;

    margin: 5px 10px;
    padding: 5px 10px 10px 10px;
    text-align: justify;
    cursor: pointer;
    font-size: 15px;
    margin-bottom: 5px;
    line-height: 20px;
    width: 100%;

    background-color: #f7fffa;

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

@media only screen and (max-width: 900px) {
    .stepfive {
        max-width: 96vw;
        min-width: 95vw;
    }

    .custom-radio {
        p {
            max-width: 100%;
            min-width: 90%;
        }
    }
}
</style>