<template>
    <div class="cntn">
        <template>
            <div 
                v-for="(row, i) in data"
                class="row"
                :key="i"
                :style="{ opacity: row.deleted ? '0.5' : '1' }"
            >

                <span v-if="row.scheduleId == null">
                    <i class="icofont-runner-alt-1"></i>

                    {{ formatToLongDate(row.fecha ? row.fecha : row.createdAt) }}

                    <i class="icofont-users-social"></i>
                    {{ row.asistencia.length }}

                    <i class="icofont-wall-clock"></i>
                    {{ week[row.dayOfWeek] }}, de 
                    {{ row.startHour }} a 
                    {{ row.endHour }}

                </span>

                <span v-else>
                    <i class="icofont-runner-alt-1"></i>
                    {{ formatToLongDate(row.fecha ? row.fecha : row.createdAt) }} 

                    <i class="icofont-users-social"></i>
                    {{ row.asistencia.length }}

                    <i class="icofont-wall-clock"></i>
                    {{ week[row.schedule.dayOfWeek] }}, de 
                    {{ row.schedule.startHour }} a 
                    {{ row.schedule.endHour }}
                </span>

                <div class="_actions" :ref="`rv-${row.id}`">
                    <i class="icofont-ui-delete" @click="deleteRecord(row, $event)" v-if="!row.deleted && allowDelete" :style="{ fontSize:'16px' }"></i>
                    <i class="icofont-refresh" @click="restoreRecord(row, $event)" v-if="row.deleted && allowRestore"></i>
                    <i class="icofont-eye-alt" @click="$emit('show', row)" :style="{ marginLeft:'15px' }"></i>
                    <img class="rotating" src="../assets/spinner.png" alt="loading">
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import { formatDate, formatToLongDate } from '../utils/inforFormat';

    export default {
        props: {
            data: Array,
            allowDelete: Boolean,
            allowRestore: Boolean,
            week: Object
        },
        methods: {
            formatDate,
            formatToLongDate,
            deleteRecord(record, e) {
                this.showLoadin(e);
                this.$emit('delete', { id:record.id, stopLoadin:this.hideLoadin });
            },
            restoreRecord(record, e) {
                this.showLoadin(e);
                this.$emit('restore', { id:record.id, stopLoadin:this.hideLoadin });
            },
            showLoadin(e) {
                e.target.parentElement.getElementsByTagName('img')[0].style.display = 'block';
                for (const c of e.target.parentElement.getElementsByTagName('i')) c.style.display = 'none';
            },
            hideLoadin(i) {
                const parent = this.$refs[`rv-${i}`][0];
                if (!parent) return;
                parent.getElementsByTagName('img')[0].style.display = 'none';
                for (const c of parent.getElementsByTagName('i')) c.style.display = 'block';
            },
        }
    }
</script>

<style lang="scss" scoped>
    .cntn {
        display: flex;
        flex-direction: column;
        width: 100%;
        .row {
            width: 80%;
            margin: 10px auto;
            padding: 10px;
            border-radius: 10px;
            background-color: #e7e7e7;

            display: flex;
            align-items: center;
            justify-content: flex-start;

            span {
                font-weight: bold;
                cursor: default;

                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;

                margin-right: 10px;
                .icofont-wall-clock, .icofont-users-social {
                    margin: 0 5px 0 10px;
                }
            }
            ._actions {
                margin-left: auto;
                display: flex;
                justify-content: center;
                align-items: center;
                i {
                    margin-right: 0px;
                    cursor: pointer;
                }
                .rotating {
                    width: 20px;
                    height: 20px;
                    display: none;
                }
            }
            i {
                font-size: 20px;
                margin-right: 5px;
            }

        }
    }

    @media only screen and (max-width: 800px) {
        .cntn {
            .row {
                width: 92%;
                align-items: flex-start;
                flex-direction: column;
                overflow: hidden;
                span {
                    width: 100%;
                }
                ._actions {
                    margin-top: 13px;
                    margin-right: 10px;
                }
            }
        }
    }

</style>