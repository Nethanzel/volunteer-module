<template>
    <div class="record-list">
        <div v-if="!isRequesting" class="dataview">
            <div :class="{ element: true, nocheck: !miembro.checked, deleted:miembro.deleted }" v-for="miembro in Miembros" :key="miembro.identity" @click="$emit('details', miembro)">
                <div class="photo">
                    <img v-if="showProfilePhoto(miembro.Archivos)" :src="getProfilePhoto(miembro.Archivos)" alt="photo">
                    <i v-else class="icofont-warning"></i>
                </div>
                <div class="info">
                    <p>{{formatIdentification(miembro.identity)}}</p>
                    <p>{{miembro.nombre}} {{miembro.apellido}}</p>
                    <p v-if="miembro.Escuela">Escuela {{miembro.Escuela.numero}} - {{getMunicipio(miembro.Escuela.municipio)}}</p>
                    <p>{{formatDate(miembro.createdAt)}}</p>
                </div>
            </div>
        </div>
        <div v-if="!isRequesting" class="pagination">
            <p 
                v-for="page in pages" 
                :key="page" 
                @click="getMembers(page)"
                :style="{
                    color: page == cPage ? 'white' : 'black',
                    backgroundColor: page == cPage ? 'red' : 'transparent',
                    border: page == cPage ? '1px solid gray' : '1px solid black',
                }"
            >{{page}}</p>
        </div>

        <img v-if="isRequesting" class="rotating await" src="../assets/spinner.png" alt="loadin">
    </div>
</template>

<script>
import { formatIdentification, formatDate } from "../utils/inforFormat.js"
import municipios from '../assets/data/municipios.json'
import { bufferToBase64 } from "../utils/image.js";
import Request from "../request/instance.js";

export default {
    data() {
        return {
            isRequesting: false,
            Miembros: null,
            pages: 0,
            cPage: 0
        }
    },
    methods: {
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
            } else {
                //show errors here
            }
        },
        bufferToBase64,
        formatDate,
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
        getMunicipio(id) {
            return municipios.find(x => x.municipio_id == id).municipio
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
    .pagination {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 5px;
        margin: 10px;
        margin-top: auto;
        p {
            border: 1px solid black;
            border-radius: 50%;
            width: 15px;
            height: 15px;
            cursor: pointer;
            padding: 5px;
            margin: 0 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .dataview {
        display: flex;
        overflow: hidden;
        flex-wrap: wrap;
        margin: 0 auto;
        max-width: 1035px;
        width: 100%;
        max-height: calc(100% - 60px);
        overflow-y: auto;
        justify-content: center;
        .element {
            display: inline-flex;
            flex-wrap: wrap;
            max-width: 310px;
            min-width: 305px;
            max-height: 100px;
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
                width: 30%;
                max-width: 90px;
                img {
                    object-fit: contain;
                    width: 100%;
                    height: 100%;
                }
                i {
                    font-size: 35px;
                }
            }
            .info {
                width: 70%;
                max-width: 213px;
                padding: 4px 0;
                p {
                    font-size: 13px;
                    margin: 5px 10px;
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
}


</style>