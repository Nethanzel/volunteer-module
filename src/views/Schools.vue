<template>
    <div class="stations">
        <h1>Escuelas</h1>
        <p class="add-info" @click="showBlur = true" v-if="_allowCreateStationPermission"><i class="icofont-plus-circle"></i> Agregar</p>

        <img class="rotating" src="../assets/spinner.png" alt="loadin" v-if="loadin">

        <DynamicConfigurationManager 
            :data="escuelas" 
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
                hideCreatingLoading: () => {}
            }
        },
        mounted() {
            this.getEscuelas();
        },
        methods: {
            async getEscuelas() {
                this.loadin = true;
                
                let requests = [ Request.Get.Escuelas(), Request.Get.NombreMiembros() ];
                let [escuelas, nombres] = await Promise.all(requests).catch(() => null).finally(() => this.loadin = false);

                if (escuelas?.status == 200) this.escuelas = escuelas.data;
                if (nombres?.status == 200) this.nombres = nombres.data.rows;

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
                return this.$store.getters.isAllowedToPermission(['RDE'])
            },
        }
    }
</script>

<style lang="scss" scoped>
    .stations {
        display: flex;
        flex-direction: column;
        height: calc(100dvh - 75px);
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