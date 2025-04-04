<template>
    <div class="practica">
        <h1>Prácticas y Asistencia</h1>
                
        <p class="report-action" v-if="_allowCreatePracticePermission && selectedSchool && !loadinPractices && !loadinSchedule">
            <span @click="showFiltersBlur = true" class="minimal-action"><i class="icofont-search-user"></i>Busqueda</span>
            <span @click="showFiltersBlur = true" class="minimal-action"><i class="icofont-download"></i>Exportar</span>
        </p>

        <div class="_firstAction" v-if="!loadin">
            <p class="add-info" v-if="_allowCreatePracticePermission && selectedSchool && !loadinPractices && !loadinSchedule">
                <span @click="showCreateManager"><i class="icofont-duotone icofont-plus-circle"></i> Agregar</span>
            </p>

            <select v-model="selectedSchool">
                <option v-for="(school, i) in escuelas" :value="school.id" :key="`sch-${i}`">{{ school.nombre }}</option>
            </select>
        </div>

        <div class="dataview">
            <img class="rotating" src="../assets/spinner.png" alt="loadin" v-if="loadin || loadinPractices || loadinSchedule">
            <h2 v-if="!loadin && !selectedSchool && !loadinPractices && !loadinSchedule" :style="{ margin:'auto', color:'#c8c8c8' }">Selecciona una escuela</h2>
            <h2 v-if="!loadin && selectedSchool && !loadinPractices && !loadinSchedule && !schoolPractices.length" :style="{ margin:'auto', color:'#c8c8c8' }">No hay prácticas</h2>

            <PracticeRow
                v-if="!loadin && !loadinPractices && !loadinSchedule && schoolPractices.length"
                :week="daysOfWeek"
                :data="schoolPractices"
                :allowDelete="_allowDeletePracticePermission"
                :allowRestore="_allowRestorePracticePermission"
                @restore="handleRestore"
                @delete="handleDelete"
                @show="showEditManager($event)"
            />

        </div>
        <div class="steps" v-if="schoolPractices.length">
            <p class="resume">Visualizando {{ resume.currentX  }} a {{ resume.currentN }} de {{ resume.total }} miembros</p>
            <div class="stepsView">
                <p 
                    v-for="page in pages" 
                    :key="page" 
                    @click="getSchoolPractices(selectedSchool, page)"
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
                <PracticeManager v-if="showCreate"
                    @hide="showBlur = false"
                    @ready="hideCreatingLoading = $event"
                    @done="handleCreatePractice($event)"
                    @inSchedule="inSchedule = $event"
                    :title="'Crear práctica'"
                    :members="nombres"
                    :fields="fields" 
                />

                <PracticeManager v-if="showEdit"
                    @hide="showBlur = false"
                    @inSchedule="inSchedule = $event"
                    @updateField="handleUpdateField"
                    @removeAtendant="handleRemoveAtendant"
                    @restoreAtendant="handleRemoveAtendant($event, true)"
                    @appendAtendant="handleAppendAtendant"
                    :saveEdited="_allowEditPracticePermission"
                    :title="'Gestionar práctica'"
                    :record="selectedRow"
                    :members="nombres"
                    :fields="fields"
                    :editMode="true"
                />
            </div>
        </transition>
    </div>
</template>

<script>
    import Request from '../request/instance.js';
    import PracticeRow from '../components/PracticeRow.vue';
    import PracticeManager from '../components/PracticeManager.vue';
    import { showFieldLoading, hideFieldLoading } from '../utils/handleEditableField.js';
    import { isValidDate } from '../utils/inforFormat.js';

    export default {
        components: {
            PracticeManager,
            PracticeRow
        },
        data() {
            return {
                escuelas: [],
                nombres: [],
                schoolPractices: [],
                schoolSchedules: [],
                daysOfWeek: {},
                selectedSchool: null,
                loadin: true,
                loadinPractices: false,
                loadinSchedule: false,
                inSchedule: false,
                showBlur: false,
                hideCreatingLoading: () => {},
                pages: 0,
                cPage: 0,
                resume: {
                    total: 0,
                    currentX: 0,
                    currentN: 0
                },
                fields: [
                    {
                        key: 'scheduleId',
                        display: 'Horario',
                        type: 'select',
                        options: [''],
                        ignore: false
                    },
                    {
                        key: 'dayOfWeek',
                        display: 'Dia',
                        type: 'select',
                        options: [''],
                        ignore: false
                    },
                    {
                        key: 'startHour',
                        display: 'Hora inicio',
                        type: 'text',
                        ignore: false
                    },
                    {
                        key: 'endHour',
                        display: 'Hora fin',
                        type: 'text',
                        ignore: false
                    },
                    {
                        key: 'profesorId',
                        display: 'Profesor',
                        type: 'select',
                        options: [''],
                        ignore: false
                    },
                    {
                        key: 'fecha',
                        display: 'Fecha',
                        type: 'text',
                        ignore: false
                    },
                    {
                        key: 'comment',
                        display: 'Comentarios',
                        type: 'text-area',
                        ignore: false
                    }
                ],
                showCreate: false,
                showEdit: false,
                selectedRow: null
            }
        },
        mounted() {
            this.Init();
        },
        methods: {
            showCreateManager() {
                this.showEdit = false;
                this.showBlur = true;
                this.showCreate = true;
            },
            showEditManager(row) {
                this.selectedRow = row;
                
                this.showCreate = false;
                this.showBlur = true;
                this.showEdit = true;
            },
            async Init() {
                this.loadin = true;
                
                let requests = [ Request.Get.Escuelas(null, true), Request.Get.diasDeLaSemana() ];
                let [escuelas, semana] = await Promise.all(requests).catch(() => null).finally(() => this.loadin = false);

                if (escuelas?.status == 200) this.escuelas = escuelas.data.rows.sort((a, b) => b.id - a.id);
                if (semana?.status == 200) this.daysOfWeek = semana.data;
            },
            getSchoolPractices(id, page = 1) {
                this.loadinPractices = true;
                Request.Get.Practices(id, page)
                .then(res => {
                    if (res?.status == 200) 
                    {
                        let { rows, limit, count } = res.data;

                        for (let row of rows) row.fecha = (row.fecha != null) ? row.fecha.split('T')[0] : null;

                        this.cPage = page ? page : 1;
                        this.pages = Math.ceil(count / limit);
                        this.schoolPractices = rows.sort((a, b) => b.id - a.id);
                        this.updateResume({ limit, count, page: this.cPage });
                    }
                })
                .catch(() => null)
                .finally(() => this.loadinPractices = false);
            },
            getSchoolSchedule(id) {
                this.loadinSchedule = true;
                Request.Get.Schedule(id, null, true)
                .then(res => {
                    if (res?.status == 200) this.schoolSchedules = res.data.rows.sort((a, b) => b.id - a.id);
                })
                .catch(() => null)
                .finally(() => this.loadinSchedule = false);
            },
            getSchoolMembersName(id) {
                Request.Get.NombreMiembros(id)
                    .then((res) => {
                        if (res?.status == 200) this.nombres = res.data;
                    })
                    .catch(null);
            },
            async handleUpdateField(e) {
                showFieldLoading(e.target);

                if (e.field.key == 'fecha' && !isValidDate(e.field.value)) {
                    hideFieldLoading(e.target);
                    this.$throwAppMessage({ 
                        message: "La fecha no es válida!",
                        icon: "icofont-close-circled",
                        type: 'error',
                    });
                    return;
                }

                if (e.field.key == 'scheduleId' && Number(e.field.value) == 0) e.field.value = null;
                if (e.field.key == 'fecha' && !isValidDate(e.field.value)) e.field.value = new Date(e.field.value);

                let obj = { id: e.id, field: { [e.field.key]: e.field.value } }

                let res = await Request.Patch.UpdatePractice(obj).catch(() => hideFieldLoading(e.target)).finally(() => hideFieldLoading(e.target))
                if (res?.status == 204) {
                    this.schoolPractices.find(x => x.id == e.id)[e.field.key] = e.field.value;
                    this.$throwAppMessage({ 
                        message: "Informacion actualizada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async handleDelete(e) {
                let res = await Request.Delete.removePractice(e.id).catch(() => e.stopLoadin(e.id)).finally(() => e.stopLoadin(e.id));
                if (res?.status == 204) {
                    this.schoolPractices.find(x => x.id == e.id).deleted = true;
                    this.$throwAppMessage({ 
                        message: "Práctica borrada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async handleRestore(e) {
                let res = await Request.Patch.restorePractice(e.id).catch(() => e.stopLoadin(e.id)).finally(() => e.stopLoadin(e.id));
                if (res?.status == 204) {
                    this.schoolPractices.find(x => x.id == e.id).deleted = false;
                    this.$throwAppMessage({ 
                        message: "Práctica restaurada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            handleHideBlur() {
                this.showBlur = false;
            },
            async handleCreatePractice(e) {
                if (!isValidDate(e.fecha)) {
                    this.$throwAppMessage({ 
                        message: "La fecha no es válida!",
                        icon: "icofont-close-circled",
                        type: 'error',
                    });
                    this.hideCreatingLoading();
                    return;
                }

                e.escuelaId = this.selectedSchool;
                e.fecha = new Date(e.fecha);

                let res = await Request.Post.newPractice(e).catch(() => this.hideCreatingLoading()).finally(() => this.hideCreatingLoading());
                if (res?.status == 201) {
                    this.handleHideBlur();
                    this.getSchoolPractices(this.selectedSchool);
                    this.$throwAppMessage({ 
                        message: "Práctica registrada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            handleRemoveAtendant(e, restore = false) {
                let practica = this.schoolPractices.find(x => x.id == e.practica);
                practica.asistencia.find(x => x.id == e.asistencia).deleted = restore ? false : true;
            },
            handleAppendAtendant(e) {
                this.schoolPractices.find(x => x.id == e.practicaId).asistencia.push(e);
            },
            updateResume(e) {
                let lastElement = e.page * e.limit;
                this.resume.currentN = lastElement > e.count ? e.count : lastElement;
                this.resume.currentX = ((e.page * e.limit) - e.limit) + 1;
                this.resume.total = e.count
            }
        },
        computed: {
            _allowCreatePracticePermission() {
                return this.$store.getters.isAllowedToPermission(['CPR'])
            },
            _allowEditPracticePermission() {
                return this.$store.getters.isAllowedToPermission(['UPR'])
            },
            _allowDeletePracticePermission() {
                return this.$store.getters.isAllowedToPermission(['DPR'])
            },
            _allowRestorePracticePermission() {
                return this.$store.getters.isAllowedToPermission(['RPR'])
            },
        },
        watch: {
            selectedSchool(n) {
                this.getSchoolPractices(n);
                this.getSchoolSchedule(n);
                this.getSchoolMembersName(n);
            },
            nombres() {
                let result = [];
                this.nombres?.map(n => result.push({ key: n.id, value: `${n.nombre} ${n.apellido}` }));
                this.fields.find(x => x.key == 'profesorId').options = result;
            },
            daysOfWeek() {
                let result = [];
                Object.keys(this.daysOfWeek).forEach(k => result.push({ key: k, value: this.daysOfWeek[k] }));
                this.fields.find(x => x.key == 'dayOfWeek').options = result;
            },
            schoolSchedules() {
                let result = [{ key: 0, value: `Práctica extraordinaria` }];
                this.schoolSchedules?.map(n => result.push({ key: n.id, value: `${this.daysOfWeek[n.dayOfWeek]}, de ${n.startHour} a ${n.endHour}` }));
                this.fields.find(x => x.key == 'scheduleId').options = result;
            },
            inSchedule(n) {
                this.fields.filter(x => ['dayOfWeek','startHour','endHour','profesorId'].includes(x.key)).forEach(x => x.ignore = n);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .practica {
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
        .practica {
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