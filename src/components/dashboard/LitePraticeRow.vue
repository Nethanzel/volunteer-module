<template>
    <div class="cntn">
        <template>
            <div 
                v-for="(row, i) in data"
                class="row"
                :key="i"
                :style="{ opacity: row.deleted ? '0.5' : '1' }"
            >
                <div class="lbls">
                    <p><i class="icofont-university"></i> {{ row.escuela.nombre }}</p>

                    <span v-if="row.scheduleId == null">
                        <i class="icofont-wall-clock"></i>
                        {{ formatToLongDate(row.fecha ? row.fecha : row.createdAt) }}

                        <i class="icofont-users-social"></i>
                        {{ row.asistencia.length }}

                        <!-- <i class="icofont-wall-clock"></i>
                        {{ week[row.dayOfWeek] }}, de 
                        {{ row.startHour }} a 
                        {{ row.endHour }} -->

                    </span>

                    <span v-else>
                        <i class="icofont-wall-clock"></i>
                        {{ formatToLongDate(row.fecha ? row.fecha : row.createdAt) }} 

                        <i class="icofont-users-social"></i>
                        {{ row.asistencia.length }}

                        <!-- <i class="icofont-wall-clock"></i>
                        {{ week[row.schedule.dayOfWeek] }}, de 
                        {{ row.schedule.startHour }} a 
                        {{ row.schedule.endHour }} -->
                    </span>
                </div>

                <div class="_actions" :ref="`rv-${row.id}`">
                    <i class="icofont-eye-alt" @click="$emit('show', row)" :style="{ marginLeft:'15px' }"></i>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { formatDate, formatToLongDate } from '../../utils/inforFormat';

    export default {
        props: {
            data: Array,
            week: Object
        },
        methods: {
            formatDate,
            formatToLongDate
        }
    }
</script>

<style lang="scss" scoped>
    .cntn {
        display: flex;
        flex-direction: column;
        width: 100%;
        .row {
            width: 95%;
            padding: 7px;
            margin: 5px auto;
            border-radius: 6px;
            background-color: #e7e7e7;

            display: flex;
            align-items: center;
            justify-content: flex-start;

            .lbls {
                width: calc(100% - 30px);
            }

            p {
                margin-bottom: 3px;
                font-weight: bold;
                margin-left: 5px;
                font-size: 14px;

                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            span {
                font-size: 12px;
                cursor: default;

                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;

                margin-right: 10px;
                .icofont-wall-clock, .icofont-users-social {
                    margin: 0 2px 0 5px;
                    font-size: 14px;
                }
                .icofont-users-social {
                    margin-left: 10px;
                }
            }
            ._actions {
                margin-left: auto;
                display: flex;
                justify-content: center;
                align-items: center;
                i {
                    font-size: 15px;
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
                font-size: 16px;
                margin-right: 5px;
            }
        }
    }
</style>