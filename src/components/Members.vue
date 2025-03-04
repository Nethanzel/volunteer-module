<template>
    <div class="record-list">
        <div v-if="!isRequesting" class="dataview">
            <div :class="{ element: true, nocheck: !miembro.checked, deleted:miembro.deleted }" v-for="miembro in Miembros" :key="miembro.identity" @click="$emit('details', miembro)">
                <div class="photo">
                    <img v-if="showProfilePhoto(miembro.Archivos)" :src="getProfilePhoto(miembro.Archivos)" alt="photo">
                    <i v-else class="icofont-warning"></i>
                </div>
                <div class="info">
                    <p v-if="miembro.identity">{{formatIdentification(miembro.identity)}}</p>
                    <p :style="{ fontWeight:'bold', fontSize: '16px' }">{{miembro.nombre}} {{miembro.apellido}}</p>
                    <p>{{ formatDate(miembro.nacimiento, true) }} <span>({{ calcularEdad(miembro.nacimiento) }} años)</span></p>
                    <p v-if="miembro.municipio">De {{getMunicipio(miembro.municipio, true)}}</p>
                    <p 
                        :style="{ marginBottom:'5px' }" 
                        v-if="miembro.escuela"
                    >
                        Escuela {{miembro.escuela.nombre}} - {{getMunicipio(miembro.escuela.municipio)}}
                    </p>
                    
                    <div 
                        class="level" 
                        v-if="miembro.Grado" 
                        :style="{ outline: `1px solid #${miembro.Grado.color}`, borderLeft:`5px solid #${miembro.Grado.color}` }"
                    >
                        <div class="icon">
                            <img 
                                v-if="miembro.Grado.color != '00000000'"
                                src="../assets/grade-rep.png" alt="level-icon" 
                                :style="{ backgroundColor:`#${miembro.Grado.color}`, outline:`1px solid #${miembro.Grado.color}` }"
                            >
                            <i
                                class="icofont-baby"
                                v-else
                            >
                            </i>
                        </div>
                        <div class="cntnt">
                            <p :style="{ marginBottom:'0px' }"><span>{{ miembro.Grado.prefix }} </span>{{ miembro.Grado.grado }}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div v-if="!isRequesting" class="steps">
            <p class="resume">Visualizando {{ resume.currentX  }} a {{ resume.currentN }} de {{ resume.total }} miembros</p>
            <div class="stepsView">
                <p 
                    v-for="page in pages" 
                    :key="page" 
                    @click="getMembers(page)"
                    :style="{
                        color: page == cPage ? 'white' : 'black',
                        backgroundColor: page == cPage ? '#008000a8' : 'transparent',
                        border: page == cPage ? '1px solid gray' : '1px solid black',
                    }"
                >{{page}}</p>
            </div>
        </div>

        <img v-if="isRequesting" class="rotating await" src="../assets/spinner.png" alt="loadin">
    </div>
</template>

<script>
import { formatIdentification, formatDate, calcularEdad, titleCase } from "../utils/inforFormat.js"
import municipios from '../assets/data/municipios.json';
import provincias from '../assets/data/provincias.json';
import { bufferToBase64 } from "../utils/image.js";
import Request from "../request/instance.js";

export default {
    data() {
        return {
            isRequesting: false,
            Miembros: null,
            pages: 0,
            cPage: 0,
            resume: {
                total: 0,
                currentX: 0,
                currentN: 0
            }
        }
    },
    methods: {
        titleCase,
        formatIdentification,
        async getMembers(page) {
            this.isRequesting = true;

            let requestResult = await Request.Get.Miembros(page ? page : 1)
                .catch(() => null)
                .finally(() => this.isRequesting = false);
            
            if(requestResult?.status == 200) {
                let { rows, limit, count } = requestResult.data;
                this.pages = Math.ceil(count / limit);
                this.cPage = page ? page : 1;
                this.Miembros = rows;

                this.updateResume({ limit, count, page: this.cPage });
            }
        },
        bufferToBase64,
        formatDate,
        calcularEdad,
        showProfilePhoto(files) {
            let file = files.filter(f => f.fileName?.toLowerCase() == "profile photo")[0];
            if (!file) return false;
            return true;
        },
        getProfilePhoto(files) {
            let file = files.filter(f => f.fileName?.toLowerCase() == "profile photo")[0];
            if (!file) return;

            return bufferToBase64(file.content.data, file.contentType)
        },
        getMunicipio(id, includeProvince = false) {
            if (!includeProvince) return this.titleCase(municipios.find(x => x.municipio_id == id).municipio);
            
            const municipio = municipios.find(x => x.municipio_id == id);
            const provincia = provincias.find(p => p.provincia_id == municipio.provincia_id);

            let municipio_ = this.titleCase(municipio.municipio);

            return `${municipio_} (${provincia.provincia})`;
        },
        updateResume(e) {
            let lastElement = e.page * e.limit;
            this.resume.currentN = lastElement > e.count ? e.count : lastElement;
            this.resume.currentX = ((e.page * e.limit) - e.limit) + 1;
            this.resume.total = e.count
        }
    },
    mounted() {
        this.getMembers();
    }
}
</script>

<style lang="scss" scoped>
.record-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    .steps {
        .resume {
            margin-bottom: -5px;
            text-align: center;
            font-size: 14px;
            cursor: default;
        }
    }

    .dataview {
        display: flex;
        overflow: hidden;
        flex-wrap: wrap;
        margin: 0 auto;
        max-width: 1235px;
        width: 100%;
        max-height: calc(100% - 60px);
        overflow-y: auto;
        justify-content: center;
        .element {
            display: inline-flex;
            flex-wrap: wrap;
            max-width: 330px;
            min-width: 315px;
            margin: 10px 15px;
            border-radius: 5px;
            border: 1px solid rgb(187, 187, 187);
            user-select: none;
            overflow: hidden;
            cursor: pointer;
            .photo {
                display: flex;
                justify-content: center;
                align-items: center; 
                width: 35%;
                img {
                    object-fit: cover;
                    width: 100%;
                    height: 100%;
                }
                i {
                    font-size: 35px;
                }
            }
            .info {
                width: 65%;
                padding: 8px 0 8px 0;
                display: flex;
                flex-direction: column;
                p {
                    font-size: 13px;
                    margin: 0px 0px 3px 10px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }

            &:hover {
                background-color: #ebebeb;
            }
        }
        .nocheck {
            background-color: #ffb30059;
        }
        .deleted {
            opacity: .5;
        }
    }

    .await {
        width: 50px;
        height: 50px;
        margin: auto;
    }

    @media only screen and (max-width: 400px) {
        .dataview {
            .element {
                .photo {
                    width: 30%;
                }
                .info {
                    width: 70%;
                }
            }
        }
    }
}


</style>