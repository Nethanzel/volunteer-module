<template>
    <div class="stations">
        <h1>Estaciones</h1>
        <p class="add-info" @click="showBlur = true" v-if="_allowCreateStationPermission"><i class="icofont-plus-circle"></i> Agregar</p>

        <img class="rotating" src="../assets/spinner.png" alt="loadin" v-if="loadin">

        <DynamicConfigurationManager 
            :data="estaciones" 
            :fields="_fields"
            :saveEdited="_allowEditStationPermission"
            :allowDelete="_allowDeleteStationPermission"
            :allowRestore="_allowRestoreStationPermission"
            @updateField="handleUpdateField" 
            @delete="handleDelete" 
            @restore="handleRestore" 
        />
        
        <transition name="circle-blur">
            <div class="blury-cnt" @click="handleHideBlur()" v-if="showBlur">
                <DynamicModelCreator
                    @hide="showBlur = false"
                    @ready="hideCreatingLoading = $event"
                    @done="handleCreateStation($event)"
                    :fields="_fields" 
                    :title="'Crear estación'" 
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
                estaciones: [],
                loadin: true,
                provincias,
                showBlur: false,
                hideCreatingLoading: () => {}
            }
        },
        mounted() {
            this.getEstaciones();
        },
        methods: {
            async getEstaciones() {
                this.loadin = true;
                let result = await Request.Get.Estaciones().catch(() => null).finally(() => this.loadin = false);
                if (result.status == 200) this.estaciones = result.data;
            },
            async handleUpdateField(e) {
                showFieldLoading(e.target);

                let obj = { id: 1, field: { [e.field.key]: e.field.value } }
                if (e.field.key == 'municipio') {
                    let mun = municipios.find(m => m.municipio_id == e.field.value);
                    obj.field.provincia = mun.provincia_id;
                }
                let res = await Request.Patch.UpdateStacion(obj).catch(() => hideFieldLoading(e.target)).finally(() => hideFieldLoading(e.target))
                if (res?.status == 204) {
                    this.estaciones.find(x => x.id == e.id)[e.field.key] = e.field.value;
                    if (e.field.key == 'municipio') this.estaciones.find(x => x.id == e.id)["provincia"] = obj.field.provincia;

                    this.$throwAppMessage({ 
                        message: "Informacion actualizada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async handleDelete(e) {
                let res = await Request.Delete.removeEstacion(e.id).catch(() => e.stopLoadin(e.id)).finally(() => e.stopLoadin(e.id));
                if (res?.status == 204) {
                    this.estaciones.find(x => x.id == e.id).deleted = false;
                    this.getEstaciones();
                    this.$throwAppMessage({ 
                        message: "Estacion borrada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async handleRestore(e) {
                let res = await Request.Patch.restoreEstacion(e.id).catch(() => e.stopLoadin(e.id)).finally(() => e.stopLoadin(e.id));
                if (res?.status == 204) {
                    this.estaciones.find(x => x.id == e.id).deleted = false;
                    this.$throwAppMessage({ 
                        message: "Estacion restaurada!",
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
                        message: "Elige el municipio de la estación!",
                        icon: "icofont-close-circled",
                        type: 'error',
                    });
                }

                e.provincia = municipios.find(m => m.municipio_id == e.municipio).provincia_id;
                
                let res = await Request.Post.newStation(e).catch(() => this.hideCreatingLoading()).finally(() => this.hideCreatingLoading());
                if (res?.status == 201) {
                    this.handleHideBlur();
                    this.getEstaciones();
                    this.$throwAppMessage({ 
                        message: "Estacion creada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            }
        },
        computed: {
            _municipios() {
                let result = [];
                municipios?.map(p => result.push({ key: p.municipio_id, value: p.municipio }));
                return result;
            },
            _fields() {
                return [
                    {
                        key: 'numero',
                        display: 'Número',
                        type: 'number'
                    },
                    {
                        key: 'municipio',
                        display: 'Municipio',
                        type: 'select',
                        options: this._municipios
                    }
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
                return this.$store.getters.isAllowedToPermission(['RDE'])
            },
        }
    }
</script>

<style lang="scss" scoped>
    .stations {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 75px);
        h1 {
            user-select: none;
        }
        .rotating {
            width: 50px;
            height: 50px;
            margin: 20px auto;
        }
    }
</style>