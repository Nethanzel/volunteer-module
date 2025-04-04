<template>
    <div class="tipos">
        <h1>Tipos de miembro</h1>
        
        <p class="report-action" v-if="!loadin">
            <span @click="showFiltersBlur = true" class="minimal-action"><i class="icofont-search-user"></i>Busqueda</span>
            <span @click="showFiltersBlur = true" class="minimal-action"><i class="icofont-download"></i>Exportar</span>
        </p>

        <p class="add-info" v-if="_allowCreateUserTypePermission">
            <span @click="showBlur = true"><i class="icofont-duotone icofont-plus-circle"></i> Agregar</span>
        </p>

        <div class="dataview">
            <img class="rotating" src="../assets/spinner.png" alt="loadin" v-if="loadin">
            <h2 v-if="!loadin && !tipos.length" :style="{ margin:'auto', color:'#c8c8c8' }">No hay registros</h2>

            <DynamicConfigurationManager 
                :data="tipos" 
                :fields="fields" 
                :saveEdited="_allowEditUserTypePermission"
                :allowDelete="_allowDeleteUserTypePermission"
                :allowRestore="_allowRestoreUserTypePermission"
                @updateField="updateField" 
                @delete="handleDelete($event)" 
                @restore="handleRestore($event)" 
                v-if="!loadin && tipos.length"
            />
        </div>
        <div class="steps">
            <p v-if="resume.total > 0" class="resume">Visualizando {{ resume.currentX  }} a {{ resume.currentN }} de {{ resume.total }} miembros</p>
            <div class="stepsView">
                <p 
                    v-for="page in pages" 
                    :key="page" 
                    @click="getTipos(page)"
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
                    @done="handleCreateUserType($event)"
                    :title="'Crear tipo miembro'" 
                    :fields="fields" 
                />
            </div>
        </transition>

    </div>
</template>

<script>
    import Request from '../request/instance.js';
    import DynamicModelCreator from '../components/DynamicModelCreator.vue';
    import DynamicConfigurationManager from '../components/DynamicConfigurationManager';
    import { hideFieldLoading, showFieldLoading } from '../utils/handleEditableField.js';

    export default {
        components: {
            DynamicConfigurationManager,
            DynamicModelCreator
        },
        data() {
            return {
                showBlur: false,
                loadin: true,
                tipos: [],
                fields: [
                    {
                        key: 'tipo',
                        display: 'Tipo',
                        type: 'text'
                    },
                    {
                        key: 'descripcion',
                        display: 'Descripcion',
                        type: 'text-area'
                    }
                ],
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
            this.getTipos(1);
        },
        methods: {
            async getTipos(page) {
                this.loadin = true;
                let result = await Request.Get.tipoMiembros(page).catch(() => null).finally(() => this.loadin = false);
                if (result.status == 200) {
                    let { rows, limit, count } = result.data;
                    this.pages = Math.ceil(count / limit);
                    this.cPage = page ? page : 1;
                    this.tipos = rows.sort((a, b) => b.id - a.id);
                    this.updateResume({ limit, count, page: this.cPage });
                }
            },
            async updateField(e) {
                showFieldLoading(e.target);

                let obj = { id: e.id, field: { [e.field.key]: e.field.value } }
                let res = await Request.Patch.UpdateUserType(obj).catch(() => hideFieldLoading(e.target)).finally(() => hideFieldLoading(e.target))
                if (res?.status == 204) {
                    this.tipos.find(x => x.id == e.id)[e.field.key] = e.field.value;
                    this.$throwAppMessage({ 
                        message: "Informacion actualizada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async handleDelete(e) {
                let res = await Request.Delete.removeUserType(e.id).catch(() => e.stopLoadin(e.id)).finally(() => e.stopLoadin(e.id));
                if (res?.status == 204) {
                    this.tipos.find(x => x.id == e.id).deleted = true;
                    this.$throwAppMessage({ 
                        message: "Tipo borrado!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async handleRestore(e) {
                let res = await Request.Patch.restoreUserType(e.id).catch(() => e.stopLoadin(e.id)).finally(() => e.stopLoadin(e.id));
                if (res?.status == 204) {
                    this.tipos.find(x => x.id == e.id).deleted = false;
                    this.$throwAppMessage({ 
                        message: "Tipo restaurado!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            handleHideBlur() {
                this.showBlur = false;
            },
            async handleCreateUserType(e) {
                let res = await Request.Post.newUserType(e).catch(() => this.hideCreatingLoading()).finally(() => this.hideCreatingLoading());
                if (res?.status == 201) {
                    this.handleHideBlur();
                    this.getTipos();
                    this.$throwAppMessage({ 
                        message: "Tipo creado!",
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
            _allowCreateUserTypePermission() {
                return this.$store.getters.isAllowedToPermission(['CVT'])
            },
            _allowEditUserTypePermission() {
                return this.$store.getters.isAllowedToPermission(['UVT'])
            },
            _allowDeleteUserTypePermission() {
                return this.$store.getters.isAllowedToPermission(['DVT'])
            },
            _allowRestoreUserTypePermission() {
                return this.$store.getters.isAllowedToPermission(['RVT'])
            },
        }
    }
</script>

<style lang="scss" scoped>
    .tipos {
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