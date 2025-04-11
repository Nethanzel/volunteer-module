<template>
    <div class="practiceManager" @click="preventHide($event)">

        <div class="head">
            <div class="ico">
                <i class="icofont-arrow-left" @click="$emit('hide')"></i>
            </div>
            <div class="title">
                <h2>{{ title }}</h2>
            </div>
        </div>

        <div class="cnt">
            <div class="fields" v-if="fields">
                <template v-for="(field, i) in fields.length" >
                    <EditableField 
                        v-if="!fields[i].ignore"
                        :type="fields[i].type" 
                        :label="fields[i].display" 
                        :disableSave="!editMode || !saveEdited" 
                        :_key="fields[i].key" 
                        :value="editMode ? record[fields[i].key] : null" 
                        :options="(fields[i].options && fields[i].options.length) ? fields[i].options : ['']"
                        :key="i"
                        @change="catchChange($event, fields[i])"
                        @save="handleSaveField($event, record.id)"
                    />
                </template>
            </div>

            <div class="detail-labels" v-else>
                <p><b><i class="icofont-university"></i> Escuela: </b>{{ record.escuela.nombre }}.</p>
                <p><b><i class="icofont-wall-clock"></i> Horario:</b> {{ getSchedule(record) }}.</p>
                <p><b><i class="icofont-users-social"></i> Asistencia: </b> {{ record.asistencia.length }} miembro(s).</p>
            </div>

            <div class="atendance">
                <h2>Asistencia</h2>
                <template v-if="fields">
                    <h3>Miembros de la escuela</h3>
                    <div class="_memberList">
                        <template v-if="_members.length">
                            <p class="member " v-for="(member, i) in _members" :key="`memb-${i}`">
                                <i class="icofont-ui-user"></i>
                                {{ `${member.nombre} ${member.apellido}` }}

                                <i class="icofont-check" @click="handleAddAtendant(member, $event)"></i>
                                <img class="rotating" src="../assets/spinner.png" alt="loading">
                            </p>
                        </template>
                        <p v-else class="nothing">No hay miembros</p>
                    </div>
                </template>

                <h3 :style="{ marginTop:'15px' }">
                    Miembros que asistieron 
                    <span @click="showBlur = true" v-if="!addingFromSearch && fields" class="minimal-action"><i class="icofont-search-user"></i>Agregar</span>
                    <span v-if="addingFromSearch" class="loadin minimal-action"><i class="icofont-spinner rotating"></i>Agregando asistencia...</span>
                </h3>
                <div class="_memberList">
                    <p 
                        v-for="(atendant, x) in atendance" :key="`atend-${x}`"
                        :class="{ 'deleted':atendant.deleted, 'member':true, 'atendant':true }"
                    >
                        <i class="icofont-ui-user"></i>
                        {{ `${atendant.nombre} ${atendant.apellido}` }}

                        <i class="icofont-close" v-if="!atendant.deleted && fields"  @click="handleRemoveAtendant(atendant, $event)"></i>
                        <i class="icofont-refresh" v-if="atendant.deleted && fields"  @click="handleRestoreAtendant(atendant, $event)"></i>

                        <img class="rotating" src="../assets/spinner.png" alt="loading">
                    </p>
                    <p v-if="!atendance.length" class="nothing">No hay miembros</p>
                </div>
            </div>

            <button v-if="!executin && !editMode && fields" @click="createObj">Terminar</button>
            <img v-if="executin" class="rotating" src="../assets/spinner.png" alt="loading">
        </div>

        <transition name="circle-blur">
            <div class="blury-cnt" @click="handleHideBlur()" v-if="showBlur">
                <GlobalMemberSearch
                    @close="handleHideBlur"
                    @selected="handleSearchSelection"
                />
            </div>
        </transition>
    </div>
</template>

<script>
    import GlobalMemberSearch from './GlobalMemberSearch.vue';
    import { formatToLongDate } from '../utils/inforFormat';
    import EditableField from './EditableField.vue';
    import Request from '../request/instance';

    export default {
        props: {
            title: String,
            fields: Array,
            members: Array,
            editMode: { type: [Boolean, null] },
            record: { type: [Object, null] },
            saveEdited: Boolean
        },
        data() {
            return {
                atendance: [],
                executin: false,
                showBlur: false,
                addingFromSearch: false
            }
        },
        components: {
            EditableField,
            GlobalMemberSearch
        },
        methods: {
            formatToLongDate,
            preventHide(e) {
                e.stopPropagation();
            },
            stopExcutin() {
                this.executin = false;
            },
            catchChange(value, field) {
                field.value = value;
                if (field.key == "scheduleId") this.$emit("inSchedule", (Number(value) < 1) ? false : true);
            },
            handleAddAtendant(member, e) {
                this.showHideMemberLoading(e.target.parentElement);
                if (this.editMode) {
                    Request.Patch.appendAtendance({ miembroId: member.id, practicaId: this.record.id })
                    .then((res) => {
                            if (res.status == 204) {
                                this.atendance.push(member);
                                this.$emit('appendAtendant', { miembroId: member.id, practicaId: this.record.id, deleted: false, id: 0, miembro: member });
                                this.$throwAppMessage({ 
                                    message: "Asistencia agregada!",
                                    icon: "icofont-check-circled",
                                    type: 'ok',
                                });
                            }
                    })
                    .catch(() => null)
                    .finally(() => this.showHideMemberLoading(e.target.parentElement, true));
                    return;
                }
                this.atendance.push(member);
                this.showHideMemberLoading(e.target.parentElement, true);
            },
            handleRemoveAtendant(member, e) {
                this.showHideMemberLoading(e.target.parentElement);
                if (this.editMode) {
                    Request.Delete.removeAtendance(member.asistenciaId)
                        .then((res) => {
                            if (res.status == 204) {
                                this.$emit('removeAtendant', { practica: member.practicaId, asistencia: member.asistenciaId });
                                this.$throwAppMessage({ 
                                    message: "Asistencia borrada!",
                                    icon: "icofont-check-circled",
                                    type: 'ok',
                                });
                                this.loadRecord();
                            }
                        })
                        .catch(() => null)
                        .finally(() => this.showHideMemberLoading(e.target.parentElement, true));

                    return;
                }
                this.atendance = this.atendance.filter(x => x.id != member.id);
                this.showHideMemberLoading(e.target.parentElement, true);
            },
            handleRestoreAtendant(member, e) {
                this.showHideMemberLoading(e.target.parentElement);
                if (this.editMode) {
                    Request.Patch.restoreAtendance(member.asistenciaId)
                        .then((res) => {
                            if (res.status == 204) {
                                this.$emit('restoreAtendant', { practica: member.practicaId, asistencia: member.asistenciaId });
                                this.$throwAppMessage({ 
                                    message: "Asistencia restaurada!",
                                    icon: "icofont-check-circled",
                                    type: 'ok',
                                });
                                this.loadRecord();
                            }
                        })
                        .catch(() => null)
                        .finally(() => this.showHideMemberLoading(e.target.parentElement, true));

                    return;
                }
                this.atendance = this.atendance.filter(x => x.id != member.id);
                this.showHideMemberLoading(e.target.parentElement, true);
            },
            createObj() {
                let obj = {};
                this.executin = true;
                this.fields.forEach(field => obj[field.key] = field.value);
                obj.atendance = this.atendance.map(obj => obj.id).filter(id => id != undefined);

                if (Number(obj.scheduleId) > 0) {
                    obj.dayOfWeek = null;
                    obj.endHour = null;
                    obj.profesorId = null;
                    obj.startHour = null;
                }

                this.$emit('done', obj);
            },
            loadRecord() {
                this.atendance = [];
                this.record.asistencia.forEach(att => {
                    att.miembro.asistenciaId = att.id;
                    att.miembro.deleted = att.deleted;
                    att.miembro.practicaId = this.record.id;
                    this.atendance.push(att.miembro);
                });
            },
            handleSaveField(event, id) {
                this.$emit('updateField', { field: event.field, target: event.target, id });
            },
            showHideMemberLoading(parent, hide = false) {
                let img = parent.getElementsByTagName('img')[0];
                let icon = parent.getElementsByTagName('i')[1];
                if (icon) icon.style.display = hide ? 'block' : 'none';
                if (img) img.style.display = hide ? 'none' : 'unset';
            },
            handleSearchSelection(e) {
                this.handleHideBlur();
                this.addingFromSearch = true;

                for (let atendant of e) {
                    Request.Patch.appendAtendance({ miembroId: atendant.id, practicaId: this.record.id })
                    .then((res) => {
                            if (res.status == 204) {
                                this.atendance.push(atendant);
                                this.$emit('appendAtendant', { miembroId: atendant.id, practicaId: this.record.id, deleted: false, id: 0, miembro: atendant });
                                this.$throwAppMessage({ 
                                    message: "Asistencia agregada!",
                                    icon: "icofont-check-circled",
                                    type: 'ok',
                                });
                            }
                    })
                    .catch(() => null)
                }

                setTimeout(() => this.addingFromSearch = false, 1000);
            },
            handleHideBlur() {
                this.showBlur = false;
            },
            getSchedule(practice) {
                if (practice.schedule) {
                    return `${practice.schedule.dayOfWeekText}, de ${practice.schedule.startHour} a ${practice.schedule.endHour}`
                }

                return this.formatToLongDate(practice.fecha ? practice.fecha : practice.createdAt) + `, de ${practice.startHour} a ${practice.endHour}`
            }
        },
        mounted() {
            this.$emit('ready', this.stopExcutin);
            if (this.editMode || !this.fields) this.loadRecord();
        },
        computed: {
            _members() {
                let attendants = this.atendance.map(obj => obj.id).filter(id => id != undefined);
                let membersLeft = this.members.filter(x => !attendants.includes(x.id));
                return membersLeft;
            }
        }
    }
</script>

<style scoped lang="scss">
    .practiceManager {
        display: flex;
        flex-direction: column;
        padding: 10px;
        padding-right: 0px;
        max-width: 700px;
        width: 100%;
        min-width: 335px;
        max-height: 550px;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        .head {
            display: flex;
            margin-bottom: 15px;
            
            .title {
                h2 {
                    user-select: none;
                }
            }
            .ico {
                padding-right: 20px;
                i {
                    font-size: 35px;
                    cursor: pointer;
                }
            }
            .ico, .title {
                display: flex;
                align-items: center;
            }
        }

        .cnt {
            display: flex;
            align-items: flex-start;
            align-content: flex-start;
            flex-wrap: wrap;
            width: 100%;
            overflow: hidden;
            overflow-y: auto;
            .atendance {
                padding: 10px 0 0 0;
                width: 100%;
                h2 {
                    margin-bottom: 10px;
                }
                h3 {
                    margin-left: 15px;
                    margin-bottom: 10px;
                    cursor: default;
                    display: flex;
                    align-items: center;
                    .loadin {
                        display: flex;
                        flex-direction: row;
                        cursor: default;

                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;

                        i {
                            height: unset;
                            width: unset;
                            margin-top: 0;
                            font-weight: bold;
                        }
                    }
                }
                ._memberList {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    align-items: flex-start;
                    .member {
                        margin: 5px 10px;
                        padding: 5px 8px;
                        border: 1px solid #c4c4c4a2;
                        background-color: #e1e1e180;
                        border-radius: 3px;
                        display: inline-flex;
                        align-items: center;
                        cursor: default;
                        font-size: 15px;
                        i {
                            margin-right: 8px;
                        }
                        .icofont-close, .icofont-check, .icofont-refresh {
                            margin-right: 0px;
                            margin-left: 18px;
                            cursor: pointer;
                        }
                        .rotating {
                            margin: unset;
                            height: 17px;
                            width: 17px;
                            display: none;
                            margin-left: 18px;
                        }
                    }
                    .atendant {
                        background-color: #bdffb780;
                    }
                    .deleted {
                        opacity: .5;
                    }
                    .nothing {
                        cursor: default;
                        user-select: none;
                        color: #9a9a9a80;
                    }
                }
            }
            .detail-labels {
                p {
                    margin-bottom: 5px;
                }
                p:last-child {
                    margin-bottom: 0px;
                }
            }
            .fields {
                display: flex;
                align-items: flex-start;
                align-content: flex-start;
                justify-content: center;
                flex-wrap: wrap;
                width: 100%;
            }
        }

        button {
            width: 125px;
            margin-top: 15px;
            margin-left: auto;
        }
        .rotating {
            width: 36px;
            height: 36px;
            margin-top: 15px;
            margin-left: auto;
            //margin-right: calc(125px / 2 - 36px / 2);
        }
    }
</style>