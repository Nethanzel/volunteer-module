<template>
    <div class="tipos">
        <h1>Tipos de miembro</h1>
        <p class="add-info" @click="showBlur = true" v-if="_allowCreateUserTypePermission"><i class="icofont-plus-circle"></i> Agregar</p>

        <img class="rotating" src="../assets/spinner.png" alt="loadin" v-if="loadin">

        <DynamicConfigurationManager 
            :data="tipos" 
            :fields="fields" 
            :saveEdited="_allowEditUserTypePermission"
            :allowDelete="_allowDeleteUserTypePermission"
            :allowRestore="_allowRestoreUserTypePermission"
            @updateField="updateField" 
            @delete="handleDelete($event)" 
            @restore="handleRestore($event)" 
        />

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
                hideCreatingLoading: () => {}
            }
        },
        mounted() {
            this.getTipos();
        },
        methods: {
            async getTipos() {
                this.loadin = true;
                let result = await Request.Get.tipoMiembros().catch(() => null).finally(() => this.loadin = false);
                if (result.status == 200) this.tipos = result.data;
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
                return this.$store.getters.isAllowedToPermission(['RDE'])
            },
        }
    }
</script>

<style lang="scss" scoped>
    .tipos {
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