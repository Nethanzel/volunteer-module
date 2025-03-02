<template>
    <div class="manager-view">
        <div :class="{ record:true, deleted:record.deleted }" v-for="(record, i) in data" :key="`mv-${i}`">
            <div class="head" :ref="`mv-${record.id}`">
                <i 
                    v-if="!record.deleted && allowDelete"
                    class="icofont-ui-delete" 
                    :style="{ display: record.deleted ? 'none' : 'block' }" 
                    @click="deleteRecord(record, $event)"
                >
                </i>
                <i 
                    v-if="record.deleted && allowRestore"
                    class="icofont-refresh" 
                    :style="{ display: record.deleted ? 'block' : 'none' }" 
                    @click="restoreRecord(record, $event)"
                >
                </i>
                <img class="rotating" src="../assets/spinner.png" alt="loading">
            </div>
            <EditableField 
                v-for="(field, i) in fields"
                :type="field.type" 
                :key="`mf-${i}`"
                :label="field.display"
                :_key="field.key"
                :value="record[field.key]"
                :options="field.options"
                @save="handleSaveField($event, record.id)"
                :style="{ pointerEvents: record.deleted ? 'none' : 'unset' }"
                :data-record-id="record.id"
                :disableSave="!saveEdited"
            />
        </div>
    </div>
</template>

<script>
    import EditableField from "./EditableField"
    export default {
        props: {
            data: Array,
            fields: Array,
            saveEdited: Boolean,
            allowDelete: Boolean,
            allowRestore: Boolean
        },
        components: {
            EditableField
        },
        methods: {
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
                const parent = this.$refs[`mv-${i}`][0];
                if (!parent) return;
                parent.getElementsByTagName('img')[0].style.display = 'none';
                for (const c of parent.getElementsByTagName('i')) c.style.display = 'block';
            },
            handleSaveField(event, id) {
                this.$emit('updateField', { field: event.field, target: event.target, id });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .manager-view {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin: 0 auto;
        max-width: 765px;
        padding-bottom: 25px;
        .record {
            margin: 10px;
            padding: 10px;
            max-width: 340px;
            border-radius: 5px;
            background-color: #e7e7e7;
            .head {
                display: flex;
                justify-content: flex-end;
                text-align: right;
                margin: 0 5px 10px 0;
                min-height: 16px;
                i {
                    cursor: pointer;
                }
                .rotating {
                    width: 20px;
                    height: 20px;
                    display: none;
                }
            }
        }
        .deleted {
            opacity: .5;
        }
    }
</style>