<template>
   <div class="stepcontainer">
        <h2>Areas de desarrollo de la institución</h2>
        <FormulateForm 
            class="stepfour" 
            v-model="formResult"
        >
            <div class="min-container" :style="{marginTop: '0px'}">
                <p :style="{marginBottom: '10px'}">¿Ha prácticado artes marciales anteriormente?</p>
                <p
                    v-if="otherMartialArtRequired"
                    :style="{ color: '#ff3300', marginTop: '0px', fontSize: '13px', fontWeight:'bold',
                        marginLeft: '20px', fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
                    }"
                >Esta información es necesaria.</p>
                <div type="group" class="custom-radio">
                    <div class="option" @click="selectOption($event, 'oma1', 'otherMartialArt', 'false')">
                        <input type="radio" value="false" id="oma1" name="otherMartialArt" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label>No</label> 
                    </div>

                    <div class="option" @click="selectOption($event, 'oma2', 'otherMartialArt', 'true')">
                        <input type="radio" value="true" id="oma2" name="otherMartialArt" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label>Si</label> 
                    </div>
                </div>
                <FormulateInput 
                    v-if="formResult.otherMartialArt == 'true'" 
                    type="textarea" 
                    name="otherMartialArtDetails" 
                    label="Especifique qué otros estilos ha prácticado, cada uno separada por coma (,)" 
                    validation="required"
                    validation-name="Otros estilos"
                    placeholder="Ejemplo: Nombre estilo (grado/nivel obtenido)"
                    v-model="formResult.otherMartialArtDetails"
                />
            </div>

            <div class="min-container" :style="{marginTop: '0px'}">
                <p :style="{marginBottom: '10px'}">¿Qué está más interesado en prácticar?</p>
                <p
                    v-if="interestRequired"
                    :style="{ color: '#ff3300', marginTop: '0px', fontSize: '13px', fontWeight:'bold',
                        marginLeft: '20px', fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
                    }"
                >Esta información es necesaria.</p>
                <div type="group" class="custom-radio">
                    <img v-if="loadingTrainingTypes" :src="loadingIcon" class="_spinner rotating">
                    <div v-for="(option, i) in dictionaries.interestTrain" class="option" :key="`int-${i}`" @click="selectOption($event, `int${i}`, 'interested', option.id)">
                        <input type="radio" value="false" :id="`int${i}`" name="interested" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label>{{ option.name }}</label> 
                    </div>
                </div>
            </div>

            <div class="min-container" :style="{marginTop: '0px'}">
                <p :style="{marginBottom: '10px'}">¿Por qué desea prácticar?</p>
                <FormulateInput 
                    name="desire"
                    type="textarea"
                    validation-name="Por qué desea prácticar"
                    v-model="formResult.desire"
                />
            </div>

            <div class="min-container" :style="{marginTop: '0px'}">
                <p>¿Cual es su grado actualmente? (en nuestro estilo)</p>

                <p
                    v-if="depRequired"
                    :style="{ color: '#ff3300', marginTop: '0px', fontSize: '13px', fontWeight:'bold',
                        marginLeft: '20px', fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
                    }"
                >Esta información es necesaria.</p>

                <div type="group" class="custom-radio" :style="{marginTop: '10px'}">
                    <img v-if="loadingDepartments" :src="loadingIcon" class="_spinner rotating">
                    <div class="option-wrapper">
                        <div 
                            class="option"
                            v-for="(type, index) in dictionaries.grados" 
                            :key="index"
                            :style="{
                                borderLeft: type.color ? `10px solid #${type.color}` : `10px solid transparent`
                            }"
                            @click="selectOption($event, 'dep'+index, 'grado', type.id)"
                        >
                            <input :value="type.id" :id="'dep'+index" type="radio" name="grado" :style="{display: 'inline-block', marginRight: '10px'}" />
                            <label>{{type.grado}}</label> 
                            <br>
                            <span>{{type.descripcion}}</span>
                        </div>
                    </div>

                </div>
            </div>

            <div class="min-container" :style="{marginTop: '0px'}">
                <p>Tipo de miembro de la institución</p>
                
                <p
                    v-if="tipoRequired"
                    :style="{ color: '#ff3300', marginTop: '0px', fontSize: '13px', fontWeight:'bold',
                        marginLeft: '20px', fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
                    }"
                >Esta información es necesaria.</p>

                <div type="group" class="custom-radio" :style="{ marginTop:'10px' }">

                    <img v-if="loadingTypes" :src="loadingIcon" class="_spinner rotating">

                    <div class="option" v-for="(type, index) in dictionaries.tipoMiembros" :key="index" @click="selectOption($event, 'tv'+index, 'tipoMiembro', type.id)">
                        <input type="radio" :value="type.id" :id="'tv'+index" name="tipoMiembro" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label>{{type.tipo}}</label> 
                        <br>
                        <span>{{type.descripcion}}</span>
                    </div>

                </div>
            </div>

            <div class="min-container" :style="{marginTop: '0px'}">
                <p :style="{marginBottom: '10px'}">¿Tienes alguna identificación o uniforme para las prácticas?</p>
                <p
                    v-if="identificationRequired"
                    :style="{ color: '#ff3300', marginTop: '0px', fontSize: '13px', fontWeight:'bold',
                        marginLeft: '20px', fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
                    }"
                >Esta información es necesaria.</p>
                <div type="group" class="custom-radio">
                    <div class="option" @click="selectOption($event, 'id1', 'identificacion', 'false')">
                        <input type="radio" value="false" id="id1" name="identificacion" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label>No</label> 
                    </div>

                    <div class="option" @click="selectOption($event, 'id2', 'identificacion', 'true')">
                        <input type="radio" value="true" id="id2" name="identificacion" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label>Si</label> 
                    </div>
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

            <button @click="validateForm">Siguiente <i class="icofont-arrow-right"></i></button>

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
                tipoMiembro: null,
                grado: null,
                identificacion: null,
                identificacionDetails: null,
                otherMartialArt: null,
                otherMartialArtDetails: null,
                desire: null,
                interested: null
            },
            otherMartialArtRequired: false,
            depRequired: false,
            tipoRequired: false,
            identificationRequired: false,
            interestRequired: false,
            ready: false,
            dictionaries: {
                grados: [],
                tipoMiembros: [],
                interestTrain: []
            },
            loadingIcon,
            loadingTypes: true,
            loadingDepartments: true,
            loadingTrainingTypes: true
        }
    },
    methods: {
        validateForm() {
            this.depRequired = false;
            this.tipoRequired = false;
            this.interestRequired = false;
            this.identificationRequired = false;
            this.otherMartialArtRequired = false;

            if(!this.formResult.tipoMiembro || !this.formResult.grado || !this.formResult.identificacion || !this.formResult.otherMartialArt || !this.formResult.interested) {
                if(!this.formResult.grado) {
                    this.depRequired = true;
                }

                if(!this.formResult.tipoMiembro) {
                    this.tipoRequired = true;
                }

                if(!this.formResult.identificacion) {
                    this.identificationRequired = true;
                }

                if(!this.formResult.otherMartialArt) {
                    this.otherMartialArtRequired = true;
                }

                if(!this.formResult.interested) {
                    this.interestRequired = true;
                }
                return;
            }
            
            this.$emit("validation", {result: this.formResult, pos: 4});
        },
        highlightSelected(element, child) {
            const siblings = element.parentElement.getElementsByTagName("div");
            for (let e of siblings) {
                if (e.children[child]) e.children[child].checked = !e.children[child].checked;
                e.style.backgroundColor = '#fff';
                e.style.opacity = '.3';
            }
            element.style.backgroundColor = '#f7fffa';
            element.style.opacity = '1';
        },
        selectOption(e, i, name, value) {
            e.stopPropagation();
            this.formResult[name] = value;
            this.highlightSelected(e.target, i);
        }
    },
    async mounted() {
        let requests = [
            Request.Get.Grados(),
            Request.Get.tipoMiembros(),
            Request.Get.tipoEntrenamientos()
        ];

        let [grados, tipoMiembros, tipoEntrenamiento] = await Promise.all(requests).catch(() => []).finally(() => {
            this.loadingTrainingTypes = false;
            this.loadingDepartments = false;
            this.loadingTypes = false;
        });
        
        if(grados?.status == 200 && tipoMiembros?.status == 200 && tipoEntrenamiento?.status == 200) {
            this.dictionaries.interestTrain = tipoEntrenamiento.data;

            grados.data.forEach(dep => {
                if (!dep.deleted) this.dictionaries.grados.push(dep);
            });

            tipoMiembros.data.forEach((tp) => {
                if (!tp.deleted) this.dictionaries.tipoMiembros.push(tp);
            });
        }
    }
}
</script>

<style scoped lang="scss">

.stepcontainer {
    display: flex;
    flex-direction: column;
}

.stepfour{
    display: flex;
    align-items: center;
    flex-direction: column;
}

@media only screen and (max-width: 900px) {
    /* .stepfour {
        max-width: 96vw;
        min-width: 95vw;
    }
 */
    .custom-radio {
        p {
            max-width: 100%;
            min-width: 90%;
        }
    }
}
</style>