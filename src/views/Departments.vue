<template>
    <div class="deps">
        <h1>Departamentos</h1>
        <p class="add-info" @click="showBlur = true" v-if="_allowCreateDepPermission"><i class="icofont-plus-circle"></i> Agregar</p>

        <img class="rotating" src="../assets/spinner.png" alt="loadin" v-if="loadin">

        <DynamicConfigurationManager 
            :data="departamentos" 
            :fields="fields"
            :saveEdited="_allowEditDepPermission"
            :allowDelete="_allowDeleteDepPermission"
            :allowRestore="_allowRestoreDepPermission"
            @updateField="updateField" 
            @delete="handleDelete" 
            @restore="handleRestore"
        />

        <transition name="circle-blur">
            <div class="blury-cnt" @click="handleHideBlur()" v-if="showBlur">
                <DynamicModelCreator
                    @hide="showBlur = false"
                    @ready="hideCreatingLoading = $event"
                    @done="handleCreateDepartment($event)"
                    :fields="fields" 
                    :title="'Crear departamento'" 
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
                departamentos: [],
                fields: [
                    {
                        key: 'departamento',
                        display: 'Departamento',
                        type: 'text'
                    },
                    {
                        key: 'descripcion',
                        display: 'Descripcion',
                        type: 'text-area'
                    }
                ],
                hideCreatingLoading: () => {}
            }
        },
        mounted() {
            this.getDepartmentos();
        },
        methods: {
            async getDepartmentos() {
                this.loadin = true;
                let result = await Request.Get.Departamentos().catch(() => null).finally(() => this.loadin = false);
                if (result.status == 200) this.departamentos = result.data;
            },
            async updateField(e) {
                showFieldLoading(e.target);

                let obj = { id: 1, field: { [e.field.key]: e.field.value } }
                let res = await Request.Patch.UpdateDepartment(obj).catch(() => hideFieldLoading(e.target)).finally(() => hideFieldLoading(e.target))
                if (res?.status == 204) {
                    this.departamentos.find(x => x.id == e.id)[e.field.key] = e.field.value;
                    this.$throwAppMessage({ 
                        message: "Informacion actualizada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async handleDelete(e) {
                let res = await Request.Delete.removeDepartment(e.id).catch(() => e.stopLoadin(e.id)).finally(() => e.stopLoadin(e.id));
                if (res?.status == 204) {
                    this.departamentos.find(x => x.id == e.id).deleted = true;
                    this.$throwAppMessage({ 
                        message: "Departamento borrado!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async handleRestore(e) {
                let res = await Request.Patch.restoreDepartment(e.id).catch(() => e.stopLoadin(e.id)).finally(() => e.stopLoadin(e.id));
                if (res?.status == 204) {
                    this.departamentos.find(x => x.id == e.id).deleted = false;
                    this.$throwAppMessage({ 
                        message: "Departamento restaurado!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            handleHideBlur() {
                this.showBlur = false;
            },
            async handleCreateDepartment(e) {
                let res = await Request.Post.newDepartment(e).catch(() => this.hideCreatingLoading()).finally(() => this.hideCreatingLoading());
                if (res?.status == 201) {
                    this.handleHideBlur();
                    this.getDepartmentos();
                    this.$throwAppMessage({ 
                        message: "Departamento creado!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            }
        },
        computed: {
            _allowCreateDepPermission() {
                return this.$store.getters.isAllowedToPermission(['CD'])
            },
            _allowEditDepPermission() {
                return this.$store.getters.isAllowedToPermission(['UD'])
            },
            _allowDeleteDepPermission() {
                return this.$store.getters.isAllowedToPermission(['DD'])
            },
            _allowRestoreDepPermission() {
                return this.$store.getters.isAllowedToPermission(['RDE'])
            },
        }
    }
</script>

<style lang="scss" scoped>
    .deps {
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