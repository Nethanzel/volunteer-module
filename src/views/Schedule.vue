<template>
    <div class="schedule">
        <h1>Harios de práctica</h1>
                
        <p class="report-action" v-if="_allowCreateSchedulePermission && selectedSchool && !loadinSchedule">
            <span @click="showFiltersBlur = true" class="minimal-action"><i class="icofont-search-user"></i>Busqueda</span>
            <span @click="showFiltersBlur = true" class="minimal-action"><i class="icofont-download"></i>Exportar</span>
        </p>
        
        <div class="_firstAction" v-if="!loadin">
            <p class="add-info" v-if="_allowCreateSchedulePermission && selectedSchool && !loadinSchedule">
                <span @click="showBlur = true"><i class="icofont-duotone icofont-plus-circle"></i> Agregar</span>    
            </p>

            <select v-model="selectedSchool">
                <option v-for="(school, i) in escuelas" :value="school.id" :key="`sch-${i}`">{{ school.nombre }}</option>
            </select>
        </div>

        <div class="dataview">
            <img class="rotating" src="../assets/spinner.png" alt="loadin" v-if="loadin || loadinSchedule">
            <h2 v-if="!loadin && !selectedSchool && !loadinSchedule" :style="{ margin:'auto', color:'#c8c8c8' }">Selecciona una escuela</h2>
            <h2 v-if="!loadin && selectedSchool && !loadinSchedule && !schoolSchedules.length" :style="{ margin:'auto', color:'#c8c8c8' }">No hay horarios</h2>

            <DynamicConfigurationManager 
                :data="schoolSchedules" 
                :fields="_fields"
                :saveEdited="_allowEditSchedulePermission"
                :allowDelete="_allowDeleteSchedulePermission"
                :allowRestore="_allowRestoreSchedulePermission"
                @updateField="handleUpdateField" 
                @delete="handleDelete" 
                @restore="handleRestore"
                v-if="!loadin && !loadinSchedule &&schoolSchedules.length"
            />
        </div>
        <div class="steps" v-if="schoolSchedules.length">
            <p class="resume">Visualizando {{ resume.currentX  }} a {{ resume.currentN }} de {{ resume.total }} miembros</p>
            <div class="stepsView">
                <p 
                    v-for="page in pages" 
                    :key="page" 
                    @click="getSchoolSchedule(selectedSchool, page)"
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
                    @done="handleCreateSchedule($event)"
                    :fields="_fields" 
                    :title="'Crear horario'" 
                />
            </div>
        </transition>
    </div>
</template>

<script>
    import Request from '../request/instance.js';
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
                schoolSchedules: [],
                daysOfWeek: {},
                selectedSchool: null,
                loadin: true,
                loadinSchedule: false,
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
            this.Init();
        },
        methods: {
            async Init() {
                this.loadin = true;
                
                let requests = [ Request.Get.Escuelas(null, true), Request.Get.NombreMiembros(null), Request.Get.diasDeLaSemana() ];
                let [escuelas, nombres, semana] = await Promise.all(requests).catch(() => null).finally(() => this.loadin = false);

                if (escuelas?.status == 200) this.escuelas = escuelas.data.rows.sort((a, b) => b.id - a.id);
                if (semana?.status == 200) this.daysOfWeek = semana.data;
                if (nombres?.status == 200) this.nombres = nombres.data;
            },
            getSchoolSchedule(id, page = 1) {
                this.loadinSchedule = true;
                Request.Get.Schedule(id, page)
                .then(res => {
                    if (res?.status == 200) 
                    {
                        let { rows, limit, count } = res.data;
                        this.pages = Math.ceil(count / limit);
                        this.cPage = page ? page : 1;
                        this.schoolSchedules = rows.sort((a, b) => b.id - a.id);
                        this.updateResume({ limit, count, page: this.cPage });
                    }
                })
                .catch(() => null)
                .finally(() => this.loadinSchedule = false);
            },
            async handleUpdateField(e) {
                showFieldLoading(e.target);

                let obj = { id: e.id, field: { [e.field.key]: e.field.value } }

                let res = await Request.Patch.UpdateSchedule(obj).catch(() => hideFieldLoading(e.target)).finally(() => hideFieldLoading(e.target))
                if (res?.status == 204) {
                    this.$throwAppMessage({ 
                        message: "Informacion actualizada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async handleDelete(e) {
                let res = await Request.Delete.removeSchedule(e.id).catch(() => e.stopLoadin(e.id)).finally(() => e.stopLoadin(e.id));
                if (res?.status == 204) {
                    this.schoolSchedules.find(x => x.id == e.id).deleted = true;
                    this.$throwAppMessage({ 
                        message: "Horario borrado!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async handleRestore(e) {
                let res = await Request.Patch.restoreSchedule(e.id).catch(() => e.stopLoadin(e.id)).finally(() => e.stopLoadin(e.id));
                if (res?.status == 204) {
                    this.schoolSchedules.find(x => x.id == e.id).deleted = false;
                    this.$throwAppMessage({ 
                        message: "Horario restaurado!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            handleHideBlur() {
                this.showBlur = false;
            },
            async handleCreateSchedule(e) {
                if (!e.startHour) {
                    this.hideCreatingLoading();
                    return this.$throwAppMessage({ 
                        message: "Cuando inicia la práctica?",
                        icon: "icofont-close-circled",
                        type: 'error',
                    });
                }

                if (!e.endHour) {
                    this.hideCreatingLoading();
                    return this.$throwAppMessage({ 
                        message: "Cuando termina la práctica?",
                        icon: "icofont-close-circled",
                        type: 'error',
                    });
                }

                e.escuelaId = this.selectedSchool;

                let res = await Request.Post.newSchedule(e).catch(() => this.hideCreatingLoading()).finally(() => this.hideCreatingLoading());
                if (res?.status == 201) {
                    this.handleHideBlur();
                    this.getSchoolSchedule(this.selectedSchool);
                    this.$throwAppMessage({ 
                        message: "Horario creado!",
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
            _nombres() {
                let result = [];
                this.nombres?.map(n => result.push({ key: n.id, value: `${n.nombre} ${n.apellido}` }));
                return result;
            },
            _daysOfWeek() {
                let result = [];
                Object.keys(this.daysOfWeek).forEach(k => result.push({ key: k, value: this.daysOfWeek[k] }));
                return result;
            },
            _fields() {
                return [
                    {
                        key: 'dayOfWeek',
                        display: 'Dia',
                        type: 'select',
                        options: this._daysOfWeek
                    },
                    {
                        key: 'startHour',
                        display: 'Hora inicio',
                        type: 'text'
                    },
                    {
                        key: 'endHour',
                        display: 'Hora fin',
                        type: 'text'
                    },
                    {
                        key: 'profesorId',
                        display: 'Profesor',
                        type: 'select',
                        options: this._nombres
                    }
                ]
            },
            _allowCreateSchedulePermission() {
                return this.$store.getters.isAllowedToPermission(['CPS'])
            },
            _allowEditSchedulePermission() {
                return this.$store.getters.isAllowedToPermission(['UPS'])
            },
            _allowDeleteSchedulePermission() {
                return this.$store.getters.isAllowedToPermission(['DPS'])
            },
            _allowRestoreSchedulePermission() {
                return this.$store.getters.isAllowedToPermission(['RPS'])
            },
        },
        watch: {
            selectedSchool(n) {
                this.getSchoolSchedule(n);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .schedule {
        display: flex;
        flex-direction: column;
        height: calc(100dvh - 65px);
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
        ._firstAction {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 0 15px;
            margin-bottom: 10px;
            margin-left: auto;
            margin-right: auto;
            max-width: 1200px;
            width: calc(100% - 30px);
            select {
                height: 100%;
                min-height: 31px;
                margin-left: 15px;
            }
            p {
                margin: 0;
            }
        }
    }

    @media only screen and (max-width: 490px) {
        .schedule {
            ._firstAction {
                flex-direction: column-reverse;
                align-items: flex-end;
                .add-info {
                    max-width: 120px;
                    margin-top: 10px;
                }
            }
        }
    }
</style>