<template>
    <div class="stations">
        <h1>Escuelas</h1>
                
        <p class="report-action" v-if="!loadin">
            <span @click="getEscuelas(1)" class="minimal-action"><i class="icofont-refresh"></i>Actualizar</span>
            <span @click="showFiltersBlur = true" class="minimal-action"><i class="icofont-search-user"></i>Busqueda</span>
            <span @click="showFiltersBlur = true" class="minimal-action"><i class="icofont-download"></i>Exportar</span>
        </p>
        
        <p class="add-info" v-if="_allowCreateStationPermission">
            <span @click="showBlur = true"><i class="icofont-duotone icofont-plus-circle"></i> Agregar</span>
        </p>

        <div class="dataview">
            <img class="rotating" src="../assets/spinner.png" alt="loadin" v-if="loadin">
            <h2 v-if="!loadin && !escuelas.length" :style="{ margin:'auto', color:'#c8c8c8' }">No hay registros</h2>

            <DynamicConfigurationManager 
                :data="escuelas" 
                :fields="_fields"
                :saveEdited="_allowEditStationPermission"
                :allowDelete="_allowDeleteStationPermission"
                :allowRestore="_allowRestoreStationPermission"
                @updateField="handleUpdateField" 
                @delete="handleDelete" 
                @restore="handleRestore"
                v-if="!loadin && escuelas.length"
            />
        </div>
        <div class="steps">
            <p v-if="resume.total > 0" class="resume">Visualizando {{ resume.currentX  }} a {{ resume.currentN }} de {{ resume.total }} miembros</p>
            <div class="stepsView">
                <p 
                    v-for="page in pages" 
                    :key="page" 
                    @click="getEscuelas(page)"
                    :style="{
                        color: page == cPage ? 'white' : 'black',
                        backgroundColor: page == cPage ? '#008000a8' : 'transparent',
                        border: page == cPage ? '1px solid gray' : '1px solid black',
                    }"
                >{{page}}</p>
            </div>
        </div>
        
        <transition name="circle-blur">
            <div class="blury-cnt" @click="handleHideBlur()" v-if="showBlur">
                <DynamicModelCreator
                    @hide="showBlur = false"
                    @ready="hideCreatingLoading = $event"
                    @done="handleCreateStation($event)"
                    :fields="_fields" 
                    :title="'Crear escuela'" 
                />
            </div>
        </transition>
    </div>
</template>

<script>
    import Request from '../request/instance.js';
    const provincias = require("../assets/data/provincias.json");
    const municipios = require("../assets/data/municipios.json");
    import DynamicModelCreator from '../components/DynamicModelCreator.vue';
    import DynamicConfigurationManager from '../components/DynamicConfigurationManager';
    import { showFieldLoading, hideFieldLoading } from '../utils/handleEditableField.js';

    export default {
        components: {
            DynamicConfigurationManager,
            DynamicModelCreator
        },
        data() {
            return {
                escuelas: [],
                nombres: [],
                loadin: true,
                provincias,
                showBlur: false,
                hideCreatingLoading: () => {},
                pages: 0,
                cPage: 0,
                resume: {
                    total: 0,
                    currentX: 0,
                    currentN: 0
                }
            }
        },
        mounted() {
            this.getEscuelas(1);
        },
        methods: {
            async getEscuelas(page) {
                this.loadin = true;
                
                let requests = [ Request.Get.Escuelas(page), Request.Get.NombreMiembros(null) ];
                let [escuelas, nombres] = await Promise.all(requests).catch(() => null).finally(() => this.loadin = false);

                if (escuelas?.status == 200) {
                    let { rows, limit, count } = escuelas.data;
                    this.pages = Math.ceil(count / limit);
                    this.cPage = page ? page : 1;
                    this.escuelas = rows.sort((a, b) => b.id - a.id);
                    this.updateResume({ limit, count, page: this.cPage });
                }
                if (nombres?.status == 200) this.nombres = nombres.data;

            },
            async handleUpdateField(e) {
                showFieldLoading(e.target);

                let obj = { id: e.id, field: { [e.field.key]: e.field.value } }
                if (e.field.key == 'municipio') {
                    let mun = municipios.find(m => m.municipio_id == e.field.value);
                    obj.field.provincia = mun.provincia_id;
                }
                let res = await Request.Patch.UpdateStacion(obj).catch(() => hideFieldLoading(e.target)).finally(() => hideFieldLoading(e.target))
                if (res?.status == 204) {
                    this.escuelas.find(x => x.id == e.id)[e.field.key] = e.field.value;
                    if (e.field.key == 'municipio') this.escuelas.find(x => x.id == e.id)["provincia"] = obj.field.provincia;

                    this.$throwAppMessage({ 
                        message: "Informacion actualizada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async handleDelete(e) {
                let res = await Request.Delete.removeEscuela(e.id).catch(() => e.stopLoadin(e.id)).finally(() => e.stopLoadin(e.id));
                if (res?.status == 204) {
                    this.escuelas.find(x => x.id == e.id).deleted = false;
                    this.getEscuelas();
                    this.$throwAppMessage({ 
                        message: "Escuela borrada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async handleRestore(e) {
                let res = await Request.Patch.restoreEscuela(e.id).catch(() => e.stopLoadin(e.id)).finally(() => e.stopLoadin(e.id));
                if (res?.status == 204) {
                    this.escuelas.find(x => x.id == e.id).deleted = false;
                    this.$throwAppMessage({ 
                        message: "Escuela restaurada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            handleHideBlur() {
                this.showBlur = false;
            },
            async handleCreateStation(e) {
                if (!e.municipio) {
                    return this.$throwAppMessage({ 
                        message: "Elige el municipio de la escuela!",
                        icon: "icofont-close-circled",
                        type: 'error',
                    });
                }

                e.provincia = municipios.find(m => m.municipio_id == e.municipio).provincia_id;

                e.lat = e.lat ? Number(e.lat) : null; 
                e.lng = e.lng ? Number(e.lng) : null;

                let res = await Request.Post.newStation(e).catch(() => this.hideCreatingLoading()).finally(() => this.hideCreatingLoading());
                if (res?.status == 201) {
                    this.handleHideBlur();
                    this.getEscuelas();
                    this.$throwAppMessage({ 
                        message: "Escuela creada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            updateResume(e) {
                let lastElement = e.page * e.limit;
                this.resume.currentN = lastElement > e.count ? e.count : lastElement;
                this.resume.currentX = ((e.page * e.limit) - e.limit) + 1;
                this.resume.total = e.count
            }
        },
        computed: {
            _municipios() {
                let result = [];
                municipios?.map(p => result.push({ key: p.municipio_id, value: p.municipio }));
                return result;
            },
            _nombres() {
                let result = [];
                this.nombres?.map(n => result.push({ key: n.id, value: `${n.nombre} ${n.apellido}` }));
                return result;
            },
            _fields() {
                return [
                    {
                        key: 'nombre',
                        display: 'Nombre',
                        type: 'text'
                    },
                    {
                        key: 'lat',
                        display: 'Latitud',
                        type: 'text'
                    },
                    {
                        key: 'lng',
                        display: 'Longitud',
                        type: 'text'
                    },
                    {
                        key: 'municipio',
                        display: 'Municipio',
                        type: 'select',
                        options: this._municipios
                    },
                    {
                        key: 'liderId',
                        display: 'Sifu a cargo',
                        type: 'select',
                        options: this._nombres
                    },
                ]
            },
            _allowCreateStationPermission() {
                return this.$store.getters.isAllowedToPermission(['CS'])
            },
            _allowEditStationPermission() {
                return this.$store.getters.isAllowedToPermission(['US'])
            },
            _allowDeleteStationPermission() {
                return this.$store.getters.isAllowedToPermission(['DE'])
            },
            _allowRestoreStationPermission() {
                return this.$store.getters.isAllowedToPermission(['RE'])
            },
        }
    }
</script>

<style lang="scss" scoped>
    .stations {
        display: flex;
        flex-direction: column;
        height: calc(100dvh - 65px);
        h1 {
            user-select: none;
        }
        .rotating {
            width: 50px;
            height: 50px;
            margin: auto;
        }
        .steps {
            .resume {
                margin-bottom: -5px;
                text-align: center;
                font-size: 14px;
                cursor: default;
            }
        }
    }
</style>