<template>
    <div class="details" @click="preventHide($event)">
        <div class="head">
            <img v-if="showProflePhoto" :src="profilePhoto" alt="photo">
            <div v-if="!showProflePhoto" :style="{ width:'120px', height:'120px', textAlign:'center' }" >
                <i class="icofont-warning" :style="{ fontSize:'35px' }"></i>
            </div>
            <div class="info">
                <div class="_details">
                    <h2>{{ data.nombre }} {{ data.apellido }}</h2>
                    <p>{{ formatIdentification(data.identity) }}</p>
                    <p v-if="data.celular">
                        {{ formatPhoneNumber(data.celular) }} 
                        <i class="icofont-duotone icofont-phone" :style="{ fontSize:'20px' }"></i>
                        <i class="icofont-brand-whatsapp"></i>
                    </p>
                    <p v-if="data.telefonoFijo">
                        {{ formatPhoneNumber(data.telefonoFijo) }} 
                        <i class="icofont-duotone icofont-phone" :style="{ fontSize:'20px' }"></i> 
                        <i class="icofont-brand-whatsapp"></i>
                    </p>
                </div>
                <div class="actions">

                    <div v-if="!data.deleted && _allowDeleteUserPermission">
                        <p @click="updateSpecialField({ field: { key:'deleted', value:true }, target: $event.target })">
                            <i class="icofont-ui-delete"></i>
                            Eliminar
                        </p>
                        <img class="rotating" src="../assets/spinner.png" alt="loading">
                    </div>

                    <div v-if="data.deleted && _allowRestoreUserPermission">
                        <p @click="updateSpecialField({ field: { key:'deleted', value:false }, target: $event.target })">
                            <i class="icofont-refresh"></i>
                            Restaurar
                        </p>
                        <img class="rotating" src="../assets/spinner.png" alt="loading">
                    </div>

                    <div v-if="!data.checked && _allowConfirmUserPermission">
                        <p @click="updateSpecialField({ field: { key:'checked',value:true }, target: $event.target })">
                            <i class="icofont-check-circled"></i>
                            Confirmar
                        </p>
                        <img class="rotating" src="../assets/spinner.png" alt="loading">
                    </div>

                </div>

            </div>
        </div>
        <div class="cntent">

            <!--  -->
            <template v-if="isMinorAged && !data.checked">
                <div class="info-message warn">
                    <div class="icon">
                        <i class="icofont-warning"></i>
                    </div>
                    <div class="content">
                        <p class="title">
                            Según la fecha de nacimiento, este miembro es menor de edad!
                        </p>
                        <p>
                            Antes de confirmar el registro se debe comunicar con su(s) tutor(es).
                        </p>
                    </div>
                </div>

                <h2>Contactos con los tutores</h2>

                <div class="detail-card" v-for="(contact, i) in data.tutorInfo" :key="`tc-${i}`">
                    <div class="icn">
                        <i class="icofont-ui-user"></i>
                    </div>
                    <div class="cnt">
                        <p>{{ contact.relation }}</p>
                        <p>{{ contact.name }}</p>
                        <p>{{ formatPhoneNumber(contact.phone) }}</p>
                        <p v-if="contact.otherPhone">{{ formatPhoneNumber(contact.otherPhone) }}</p>
                    </div>
                    <div class="call" :style="{ flexDirection:'column' }">
                        <i class="icofont-duotone icofont-phone" :style="{ fontSize:'20px', marginBottom:'13px' }"></i>
                        <i class="icofont-brand-whatsapp" :style="{ fontSize:'18px' }"></i>
                    </div>
                </div>
            </template>
            <!--  -->

            <h2>Contactos de emergencia</h2>
            <p class="add-info" @click="$emit('addEmergencyContact')" v-if="_allowCreateContactPermission"><i class="icofont-plus-circle"></i> Agregar</p>
            
            <template v-if="data.contactoEmergencia.length">
                <div class="detail-card" v-for="(contact, i) in data.contactoEmergencia" :key="`ec-${i}`">
                    <div class="icn">
                        <i class="icofont-ui-user"></i>
                    </div>
                    <div class="cnt">
                        <p>{{ contact.relation }}</p>
                        <p>{{ contact.name }}</p>
                        <p>{{ formatPhoneNumber(contact.phone) }}</p>
                    </div>
                    <div class="call">
                        <i @click="removeContact(contact, $event)" class="icofont-close-circled" v-if="_allowRemoveContactPermission"></i>
                        <img class="rotating" src="../assets/spinner.png" alt="loading">
                    </div>
                </div>
            </template>
            <p v-else :style="{ textAlign: 'center', margin:' 20px 0 50px 0', color: '#848484a2' }">Sin contactos</p>

            <h2>Datos Importantes</h2>
            <EditableField @save="updateField" :type="'select'" :label="'Alguna enfermedad'" :value="data.enfermedad" :options="SiNoOptions" :_key="'enfermedad'" :isYesNo="true" />
            <EditableField @save="updateField" :type="'text-area'" :label="'Enfermedades'" :value="data.enfermedadDetalles" :_key="'enfermedadDetalles'" v-if="data.enfermedad" />
            <EditableField @save="updateField" :type="'select'" :label="'Alguna alergia'" :value="data.alergia" :options="SiNoOptions" :_key="'alergia'" :isYesNo="true" />
            <EditableField @save="updateField" :type="'text-area'" :label="'Alergias'" :value="data.alergiaDetalles" :_key="'alergiaDetalles'" v-if="data.alergia" />
            <EditableField @save="updateField" :type="'select'" :label="'Seguro de salud'" :value="data.assurance" :options="SiNoOptions" :_key="'assurance'" :isYesNo="true" />
            <EditableField @save="updateField" :type="'text'" :label="'Proveedor de segruo'" :value="data.assuranceCompany" :_key="'assuranceCompany'" v-if="data.assurance" />
            <EditableField @save="updateField" :type="'text'" :label="'Código afiliado'" :value="data.assuranceCode" :_key="'assuranceCode'" v-if="data.assurance" />


            <h2>Informacion personal</h2>
            <EditableField @save="updateField" :type="'text'" :label="'Cédula'" :value="data.identity" :_key="'identity'" />
            <EditableField @save="updateField" :type="'text'" :label="'Nombre'" :value="data.nombre" />
            <EditableField @save="updateField" :type="'text'" :label="'Apellido'" :value="data.apellido" />
            <EditableField @save="updateField" :type="'text'" :label="'Ocupación'" :value="data.ocupacion" :_key="'ocupacion'" />
            <EditableField @save="updateField" :type="'select'" :label="'Lugar nacimiento'" :value="data.lugarNacimiento" :options="_provincias" />
            <EditableField @save="updateField" :type="'date'" :label="'Fecha nacimiento'" :value="data.nacimiento.split('T')[0]" :_key="'nacimiento'" />
            <EditableField @save="updateField" :type="'text'" :label="'Peso'" :value="data.peso" />
            <EditableField @save="updateField" :type="'text'" :label="'Altura'" :value="data.altura" />

            <h2>Direccion</h2>
            <EditableField @save="updateField" :type="'select'" :label="'Municipio'" :value="data.municipio" :options="_municipios" />
            <EditableField @save="updateField" :type="'text'" :label="'Sector'" :value="data.sector" />
            <EditableField @save="updateField" :type="'text'" :label="'Calle'" :value="data.calle" />
            <EditableField @save="updateField" :type="'text'" :label="'Casa'" :value="data.casa" />
            <EditableField @save="updateField" :type="'text'" :label="'Apartamento'" :value="data.apartamento" />


            <h2>Contacto</h2>
            <EditableField @save="updateField" :type="'text'" :label="'Correo'" :value="data.correo" />
            <EditableField @save="updateField" :type="'text'" :label="'Celular'" :value="data.celular" />
            <EditableField @save="updateField" :type="'text'" :label="'Telefono fijo'" :value="data.telefonoFijo" />

            <!-- <h2>Formacion academica</h2>
            <EditableField @save="updateField" :type="'text'" :label="'Idiomas'" :value="data.idiomas" />
            <EditableField @save="updateField" :type="'text'" :label="'Otros idiomas'" :value="data.otherLanguaje" :_key="'otherLanguaje'" />
            
            <p class="described-add"><span class="lbl">Estudios</span> <span @click="$emit('addAcademicPrep')" class="add-info" v-if="_allowCreateAcademicPrepPermission"><i class="icofont-plus-circle"></i> Agregar</span></p>
            
            <template v-if="data.estudios.length">
                <div class="detail-card" v-for="(grade, i) in data.estudios" :key="`fa-${i}`">
                    <div class="icn">
                        <i class="icofont-hat-alt"></i>
                    </div>
                    <div class="cnt">
                        <p>{{ grade.place }}</p>
                        <p>{{ grade.grade }}</p>
                        <p>{{ grade.age }}</p>
                    </div>
                    <div class="call">
                        <i @click="removeAcademicPrep(grade, $event)" class="icofont-close-circled" v-if="_allowRemoveAcademicPrepPermission"></i>
                        <img class="rotating" src="../assets/spinner.png" alt="loading">
                    </div>
                </div>
            </template>
            <p v-else :style="{ textAlign: 'center', margin:' 20px 0 50px 0', color: '#848484a2' }">No hay estudios</p> -->

            <h2>Informacion institucional</h2>
            <EditableField @save="updateField" :type="'select'" :label="'Escuela'" :value="data.escuela.id" :options="_escuelas" :_key="'escuelaId'" />
            <EditableField @save="updateField" :type="'select'" :label="'Grado'" :value="data.Grado.id" :options="_grados" :_key="'GradoId'" />
            <EditableField @save="updateField" :type="'select'" :label="'Tipo miembro'" :value="data.TipoMiembro.id" :options="_tiposMiembro" :_key="'TipoMiembroId'" />
            <EditableField @save="updateField" :type="'select'" :label="'Interes'" :value="data.interested" :options="_tipoEntrenamiento" :_key="'interested'" />
            <EditableField @save="updateField" :type="'select'" :label="'Tiene uniforme'" :value="data.hasIdentification" :options="SiNoOptions" :_key="'hasIdentification'" :isYesNo="true" />
            <EditableField @save="updateField" :type="'select'" :label="'Otro estilo'" :value="data.otherMartialArt" :options="SiNoOptions" :_key="'otherMartialArt'" :isYesNo="true" />
            <EditableField @save="updateField" :type="'text-area'" :label="'Uniforme'" :value="data.idetifications" :_key="'idetifications'" v-if="data.hasIdentification" />
            <EditableField @save="updateField" :type="'text-area'" :label="'Detalles otro estilo'" :value="data.otherMartialArtDetails" :_key="'otherMartialArtDetails'" v-if="data.otherMartialArt" />
            <EditableField @save="updateField" :type="'text-area'" :label="'Desea prácticar porque...'" :value="data.desire" :_key="'desire'" />

            <h2>Archivos</h2>
            <input ref="inputFiles" @change="handleFileSelection" :style="{ display: 'none' }" type="file" multiple accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .doc, .docx">
            <p class="add-info" @click="$refs.inputFiles.click()" v-if="_allowAddFilePermission"><i class="icofont-plus-circle"></i> Agregar</p>
            <img v-if="loadinFiles" class="rotating" src="../assets/spinner.png" alt="loading" :style="{ margin:' 20px auto 50px auto', left: 'calc(50% - 15px)', position:'relative' }">

            <template v-if="_archivos.length && !loadinFiles">
                <div :class="{ 'detail-card':true, 'file-pending':archivo.pending, 'file-deleted':archivo.deleted }" v-for="(archivo, i) in _archivos" :key="`a-${i}`">
                    <div class="icn">
                        <i v-if="archivo.contentType.startsWith('image')" class="icofont-file-tiff"></i>
                        <i v-else class="icofont-file-document"></i>
                    </div>
                    <div class="cnt">
                        <p v-if="archivo.fileName" @click="showFilenameInput($event, archivo)" :style="{ pointerEvents: archivo.deleted ? 'none' : 'all' }">{{ archivo.fileName }}</p>
                        <div v-else :style="{ display:'flex', alignItems:'center', margin: '0 0 8px 0' }">
                            <input @blur="resetFilename(archivo)" type="text" placeholder="Nombre del archivo" :style="{ minWidth:'unset', width:'165px' }">
                            <i class="icofont-check" @click="handleSetFilename($event, archivo)" :style="{ marginLeft: '10px', fontSize:'23px', cursor:'pointer' }"></i>
                        </div>
                        <p>{{ archivo.contentType }}</p>
                        <p v-if="archivo.pending" :style="{ fontWeight:'bold', marginTop:'10px' }">No se ha guardado</p>
                    </div>
                    <div class="call" :style="{ flexDirection:'column' }" >
                        <i @click="downloadFile(archivo, $event)" class="icofont-download" :style="{ marginBottom: '10px', fontSize: '20px' }" v-if="!archivo.pending && _allowDownloadFilePermission"></i>
                        <i @click="uploadFile(archivo, $event)" class="icofont-upload-alt" :style="{ marginBottom: '10px', fontSize: '20px' }" v-if="archivo.pending && archivo.fileName"></i>
                        <i @click="removeFile(archivo, $event)" class="icofont-close-circled" :style="{ fontSize: '20px' }" v-if="!archivo.deleted && _allowDeleteFilePermission"></i>
                        <i @click="restoreFile(archivo, $event)" class="icofont-refresh" :style="{ fontSize: '20px' }" v-if="archivo.deleted && _allowRestoreFilePermission"></i>

                        <img class="rotating" src="../assets/spinner.png" alt="loading">
                    </div>
                    <div class="progress"></div>
                </div>
            </template>
            <p v-if="!_archivos.length && !loadinFiles" :style="{ textAlign: 'center', margin:' 20px 0 50px 0', color: '#848484a2' }">Sin archivos</p>

            <template v-if="_allowAccessPermission || _allowGivePermission || _allowRemovePermission">
                <h2>Acceso a la plataforma</h2>
                <EditableField v-if="_allowAccessPermission" @save="updateField" :type="'select'" :label="'Permitir acceso'" :value="data.allowAccess" :options="SiNoOptions" :_key="'allowAccess'" :isYesNo="true" />
                <template v-if="data.allowAccess">
                    <template v-if="_allowRemovePermission">
                        <p class="described-add"><span class="lbl">Permisos actuales:</span></p>
                        <div class="permission-view" v-if="data.permissions">
                            <p v-for="(key, i) in data.permissions.split(',')" :key="`p-${i}`" class="got-permission" @click="loopBack($event, true)">
                                <span class="key">{{ key }}</span>
                                <span class="desc">{{ dictionaries.permisos.filter(p => p.key == key)[0].description }}</span>
                                <i class="icofont-close" @click="arPermission($event, key, false)"></i>
                                <img class="rotating" src="../assets/spinner.png" alt="loading">
                            </p>
                        </div>
                        <p v-else :style="{ textAlign: 'center', margin:' 10px 0', color: '#848484a2' }">Sin permisos</p>
                    </template>
                    
                    <template v-if="_allowGivePermission">
                        <p class="described-add"><span class="lbl">Agregar permisos:</span></p>
                        <div class="permission-view">
                            <template v-if="data.permissions">
                                <p v-for="(permiso, i) in dictionaries.permisos.filter(p => !data.permissions.split(',').includes(p.key))" :key="`pp-${i}`" class="permission" @click="loopBack">
                                    <span class="key">{{ permiso.key }}</span>
                                    <span class="desc">{{ permiso.description }}</span>
                                    <input type="checkbox" @change="arPermission($event, permiso.key, true)">
                                    <img class="rotating" src="../assets/spinner.png" alt="loading">
                                </p>
                            </template>
                            <template v-else>
                                <p v-for="(permiso, i) in dictionaries.permisos" :key="`pp-${i}`" class="permission" @click="loopBack">
                                    <span class="key">{{ permiso.key }}</span>
                                    <span class="desc">{{ permiso.description }}</span>
                                    <input type="checkbox" @change="arPermission($event, permiso.key, true)">
                                    <img class="rotating" src="../assets/spinner.png" alt="loading">
                                </p>
                            </template>
                        </div>
                    </template>
                </template>
            </template>
        </div>
    </div>
</template>

<script>
    import { showFieldLoading, hideFieldLoading } from "../utils/handleEditableField.js";
    import { calcularEdad, formatIdentification, formatPhoneNumber, titleCase } from "../utils/inforFormat.js"
    const provincias = require("../assets/data/provincias.json");
    const municipios = require("../assets/data/municipios.json");
    import { blobToFile } from "../utils/downloadFile.js";
    import { bufferToBase64 } from "../utils/image.js";
    import EditableField from "./EditableField.vue";
    import Request from "../request/instance.js";
     
    export default {
        props: {
            data: Object,
            dictionaries: Object
        },
        data() {
            return {
                estadosCivil: [
                    { 
                        value: "Solter@",
                        key: "Solter@" 
                    },
                    { 
                        value: "Casad@",
                        key: "Casad@" 
                    },
                    { 
                        value: "Unión libre",
                        key: "Unión libre" 
                    }
                ],
                bloodOptions: [
                    {
                        key: "O-", 
                        value: "O-",
                    },
                    {
                        key: "O+", 
                        value: "O+",
                    },
                    {
                        key: "A-", 
                        value: "A-",
                    },
                    {
                        key: "A+", 
                        value: "A+",
                    },
                    {
                        key: "B-", 
                        value: "B-",
                    },
                    {
                        key: "B+", 
                        value: "B+",
                    },
                    {
                        key: "AB-", 
                        value: "AB-",
                    },
                    {
                        key: "AB+", 
                        value: "AB+",
                    },
                ],
                SiNoOptions: [
                    {
                        key: "true",
                        value: "Si"
                    },
                    {
                        key: false,
                        value: "No"
                    }
                ],
                showProflePhoto: false,
                profilePhoto: null,
                loadinFiles: false,
            }
        },
        components: {
            EditableField
        },
        methods: {
            formatIdentification,
            formatPhoneNumber,
            preventHide(e) {
                e.stopPropagation();
            },
            getProfilePhoto() {
                let file = this.data.Archivos.filter(f => f.fileName?.toLowerCase() == "profile photo")[0];
                if (!file) return;
                this.profilePhoto = bufferToBase64(file.content.data, file.contentType)
                this.showProflePhoto = true;
            },
            async updateSpecialField(event) {
                showFieldLoading(event.target);
                let res = await Request.Patch.UpdateMiembro({ id: this.data.id, field: { [event.field.key]: event.field.value } }, true).catch(() => hideFieldLoading(event.target)).finally(() => hideFieldLoading(event.target, false));
                if (res?.status == 204) {
                    this.data[event.field.key] = event.field.value;
                    this.$throwAppMessage({ 
                        message: "Dato actualizado!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async updateField(event) {
                showFieldLoading(event.target);
                let res;
                if (event.field.key == "allowAccess") res = await Request.Patch.allowAccess({ id: this.data.id, field: { [event.field.key]: event.field.value } }).catch(() => hideFieldLoading(event.target)).finally(() => hideFieldLoading(event.target, false));
                else res = await Request.Patch.UpdateMiembro({ id: this.data.id, field: { [event.field.key]: event.field.value } }).catch(() => hideFieldLoading(event.target)).finally(() => hideFieldLoading(event.target, false));
                
                if (res?.status == 204) {
                    this.data[event.field.key] = event.field.value;
                    this.$throwAppMessage({ 
                        message: "Dato actualizado!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async arPermission(e, key, add) {
                e.stopPropagation();
                if (add) {
                    showFieldLoading(e.target);
                    e.target.checked = false;
                    let res = await Request.Patch.addPermission({ id: this.data.id, key }).catch(() => hideFieldLoading(e.target)).finally(() => hideFieldLoading(e.target));
                    if (res?.status == 204) {
                        if (!this.data.permissions) this.data.permissions = key;
                        else this.data.permissions += `,${key}`;
                        this.$throwAppMessage({ 
                            message: "Permiso agregado!",
                            icon: "icofont-check-circled",
                            type: 'ok',
                        });
                    }
                }
                else {
                    showFieldLoading(e.target);
                    let res = await Request.Patch.removePermission({ id: this.data.id, key }).catch(() => hideFieldLoading(e.target)).finally(() => hideFieldLoading(e.target));
                    if (res?.status == 204) {
                        let p = this.data.permissions.split(',');
                        p.splice(p.indexOf(key), 1);
                        this.data.permissions = p.join(',');
                        
                        this.$throwAppMessage({ 
                            message: "Permiso removido!",
                            icon: "icofont-check-circled",
                            type: 'ok',
                        });
                    }
                }
            },
            async removeContact(contact, e) {
                this.showHideCardLoading(e, true);
                let res = await Request.Delete.removeContact({ id: this.data.id, record: contact }).catch(() => this.showHideCardLoading(e, false)).finally(() => this.showHideCardLoading(e, false));
                if (res?.status == 204) {
                    let index = this.data.contactoEmergencia.findIndex(c => c.name === contact.name && c.phone === contact.phone && c.relation === contact.relation);
                    this.data.contactoEmergencia.splice(index, 1);
                    this.$throwAppMessage({ 
                        message: "Contacto eliminado!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async removeAcademicPrep(prep, e) {
                this.showHideCardLoading(e, true);
                let res = await Request.Delete.removeAcademicPrep({ id: this.data.id, record: prep }).catch(() => this.showHideCardLoading(e, false)).finally(() => this.showHideCardLoading(e, false));
                if (res?.status == 204) {
                    let index = this.data.estudios.findIndex(c => c.age === prep.age && c.grade === prep.grade && c.place === prep.place);
                    this.data.estudios.splice(index, 1);
                    this.$throwAppMessage({ 
                        message: "Informacion eliminada!",
                        icon: "icofont-check-circled",
                        type: 'ok',
                    });
                }
            },
            async removeFile(file, e) {
                this.showHideCardLoading(e, true);

                if (file.pending) {
                    let fileIndex = this.data.Archivos.indexOf(file);
                    if (fileIndex > -1) this.data.Archivos.splice(fileIndex, 1);
                    this.showHideCardLoading(e, false);
                }
                else {
                    await Request.Delete.removeFile({ uid: this.data.id, id: file.id })
                    .then((res) => {
                        if (res.status == 204) {
                            this.$throwAppMessage({ 
                                message: "Archivo eliminado!",
                                icon: "icofont-check-circled",
                                type: 'ok',
                            });
                            this.realoadFiles();
                        }
                    })
                    .catch(() => null)
                    .finally(() => this.showHideCardLoading(e, false));
                }
            },
            async restoreFile(file, e) {
                this.showHideCardLoading(e, true);

                await Request.Patch.restoreFile({ uid: this.data.id, id: file.id })
                .then((res) => {
                    if (res.status == 204) {
                        this.$throwAppMessage({ 
                            message: "Archivo restaurado!",
                            icon: "icofont-check-circled",
                            type: 'ok',
                        });
                        this.realoadFiles();
                    }
                })
                .catch(() => null)
                .finally(() => this.showHideCardLoading(e, false));
            },
            showHideCardLoading(e, show) {
                const parent = e.target.parentElement;
                parent.getElementsByTagName('img')[0].style.display = show ? 'initial' : 'none';
                for (const element of parent.getElementsByTagName('i')) element.style.display = show ? 'none' : 'initial';
            },
            handleFileSelection(e) {
                if (e.target.files.length > 5) {
                    this.$throwAppMessage({ 
                        message: "Solo se permiten 5 archivos a la vez!",
                        icon: "icofont-close-circled",
                        type: 'error',
                    });
                    return;
                }

                const fileSizeLimit = 1024 * 1024 * 5;

                for (const file of e.target.files) {
                    if (file.size > fileSizeLimit) {
                        this.$throwAppMessage({ 
                            message: `El archivo "${file.name}" supera el tamaño máximo permitido (5MB)`,
                            icon: "icofont-close-circled",
                            type: 'error',
                        });
                        continue;
                    }
                    this.data.Archivos.push({
                        id: file.name,
                        fileName: null,
                        contentType: file.type,
                        identity: this.data.id,
                        content: file,
                        pending: true,
                        ext: file.name.split(".").pop().toLowerCase()
                    });
                }
            },
            async downloadFile(file, e) {
                this.showHideCardLoading(e, true);

                const progressReport = (progress) => {
                    const percentCompleted = Math.round((progress.loaded * 100) / progress.total);
                    this.IOProgress(e.target, percentCompleted);
                }

                await Request.Get.DownloadFile(file.id, progressReport)
                    .then((res) => {
                        if (res.status == 200) {
                            this.$throwAppMessage({ 
                                message: "Archivo descargado!",
                                icon: "icofont-check-circled",
                                type: 'ok',
                            });
                            blobToFile(res.data, `${file.fileName}.${file.ext}`)
                        }
                    })
                    .catch(() => null)
                    .finally(() => {
                        this.showHideCardLoading(e, false);
                        setTimeout(() => this.resetProgress(e.target), 1500);
                    });
            },
            async uploadFile(file, e) {
                this.showHideCardLoading(e, true);

                if (!file) {
                    this.$throwAppMessage({ 
                        message: "Archivo inválido!",
                        icon: "icofont-close-circled",
                        type: 'error',
                    });
                    this.showHideCardLoading(e, false)
                    return;
                }

                file.pending = false;

                const formData = new FormData();
                formData.append("file", file.content);
                formData.append("fileName", file.fileName);
                formData.append("identity", file.identity);
                formData.append("contentType", file.contentType);
                formData.append("ext", file.ext);

                const progressReport = (upload) => {
                    let progress = Math.round((upload.loaded * 100) / upload.total);
                    this.IOProgress(e.target, progress);
                }

                await Request.Post.uploadFile(formData, progressReport)
                .then((res) => {
                    if (res.status == 204) {
                        this.realoadFiles();
                        this.$throwAppMessage({ 
                            message: "Archivo cargado!",
                            icon: "icofont-check-circled",
                            type: 'ok',
                        });
                    }
                })
                .catch(() => file.pending = true)
                .finally(() => {
                    this.showHideCardLoading(e, false);
                    setTimeout(() => this.resetProgress(e.target), 1500);
                });
            },
            IOProgress(e, progress) {
                let progressEl = e.parentElement.parentElement.getElementsByClassName('progress')[0];
                if (progressEl) {
                    progressEl.style.width = `${progress}%`;
                    progressEl.style.backgroundColor = `#89ff97b8`;
                }
            },
            resetProgress(e) {
                let progressEl = e.parentElement.parentElement.getElementsByClassName('progress')[0];
                if (progressEl) {
                    progressEl.style.backgroundColor = `transparent`;
                }
            },
            async handleSetFilename(e, file) {
                let input = e.target.parentElement.getElementsByTagName('input')[0];
                if (input) {
                    let value = input.value;
                    if (!value || value.length < 4) {
                        this.$throwAppMessage({ 
                            message: "Nombre de archivo inválido!",
                            icon: "icofont-close-circled",
                            type: 'error',
                        });
                        return;
                    }

                    if (file.pending) {
                        file['oldFileName'] = value;
                        file.fileName = value;
                    }
                    else {
                        let targetParent = e.target.parentElement;
                        let targetGrandParent = targetParent.parentElement;
                        let targetGrandParentX2 = targetGrandParent.parentElement;
                        let loader = targetGrandParentX2.getElementsByClassName('call')[0]?.getElementsByTagName('img')[0];
                        this.showHideCardLoading({ target:loader }, true);

                        await Request.Patch.setFilename({ id: file.id, field: { fileName: value } })
                        .then((res) => {
                            if (res.status == 204) {
                                file['oldFileName'] = value;
                                file.fileName = value;
                                this.$throwAppMessage({ 
                                    message: "Nombre guardado!",
                                    icon: "icofont-check-circled",
                                    type: 'ok',
                                });
                            }
                        })
                        .catch(() => null)
                        .finally(() => this.showHideCardLoading({ target:loader }, false));                    
                    }
                }
            },
            showFilenameInput(e, file) {
                if (!this._allowEditFilePermission) return;

                const parentElement = e.target.parentElement;
                file['oldFileName'] = file.fileName;
                file.fileName = null;
                
                setTimeout(() => {
                    let input = parentElement.getElementsByTagName('input')[0];
                    if (input) input.focus();
                }, 500);
            },
            resetFilename(file) {
                setTimeout(() => file.fileName = file.oldFileName, 250);
            },
            async realoadFiles() {
                this.loadinFiles = true;
                await Request.Get.Files(this.data.id)
                .then((res) => this.data.Archivos = res.data)
                .catch(() => null)
                .finally(() => this.loadinFiles = false);
            },
            loopBack(e, remove = false) {
                let input = null;

                e.stopPropagation();

                if (remove) input = e.target.getElementsByTagName('i')[0]
                else input = e.target.getElementsByTagName('input')[0];

                if (input) input.click()
            }
        },
        mounted() {
            this.getProfilePhoto();
        },
        computed: {
            isMinorAged() {
                return calcularEdad(this.data.nacimiento) > 17 ? false : true;
            },
            _provincias() {
                let result = [];
                provincias?.map(p => result.push({ key: p.provincia_id, value: p.provincia }));
                return result;
            },
            _municipios() {
                let result = [];
                municipios?.map(m => result.push({ key: m.municipio_id, value: titleCase(m.municipio) }));
                return result;
            },
            _escuelas() {
                let result = [];
                this.dictionaries?.escuelas?.map(e => result.push({ key: e.id, value: `Escuela ${e.nombre}` }));
                return result;
            },
            _grados() {
                let result = [];
                this.dictionaries?.grados?.map(e => result.push({ key: e.id, value: e.grado }));
                return result;
            },
            _tiposMiembro() {
                let result = [];
                this.dictionaries?.tipoMiembros?.map(e => result.push({ key: e.id, value: e.tipo }));
                return result;
            },
            _tipoEntrenamiento() {
                let result = [];
                this.dictionaries?.tipoEntrenamiento?.map(e => result.push({ key: e.id, value: e.name }));
                return result;
            },
            _archivos() {
                return this.data.Archivos.filter(x => x.fileName?.toLowerCase() != "profile photo");
            },
            _allowRemovePermission() {
                return this.$store.getters.isAllowedToPermission(['RP'])
            },
            _allowGivePermission() {
                return this.$store.getters.isAllowedToPermission(['GP'])
            },
            _allowAccessPermission() {
                return this.$store.getters.isAllowedToPermission(['AA'])
            },
            _allowCreateContactPermission() {
                return this.$store.getters.isAllowedToPermission(['AEC'])
            },
            _allowRemoveContactPermission() {
                return this.$store.getters.isAllowedToPermission(['DEC'])
            },
            _allowCreateAcademicPrepPermission() {
                return this.$store.getters.isAllowedToPermission(['AAI'])
            },
            _allowRemoveAcademicPrepPermission() {
                return this.$store.getters.isAllowedToPermission(['DAI'])
            },
            _allowAddFilePermission() {
                return this.$store.getters.isAllowedToPermission(['AF'])
            },
            _allowEditFilePermission() {
                return this.$store.getters.isAllowedToPermission(['UF'])
            },
            _allowDownloadFilePermission() {
                return this.$store.getters.isAllowedToPermission(['DF'])
            },
            _allowDeleteFilePermission() {
                return this.$store.getters.isAllowedToPermission(['EF'])
            },
            _allowRestoreFilePermission() {
                return this.$store.getters.isAllowedToPermission(['RDF'])
            },
            _allowDeleteUserPermission() {
                return this.$store.getters.isAllowedToPermission(['DU'])
            },
            _allowRestoreUserPermission() {
                return this.$store.getters.isAllowedToPermission(['RDU'])
            },
            _allowConfirmUserPermission() {
                return this.$store.getters.isAllowedToPermission(['CUI'])
            },
        }
    }
</script>

<style lang="scss" scoped>
    .details {
        background-color: #fff;
        border-radius: 10px;
        min-height: 500px;
        min-width: 320px;
        max-width: 700px;
        height: 80%;
        overflow: hidden;
        .head {
            display: flex;
            cursor: default;
            img {
                height: 120px;
                margin-right: 15px;
                margin-left: 10px;
            }
            div {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .info {
                display: flex;
                flex-direction: row;
                overflow: hidden;
                width: 100%;
                ._details {
                    width: 84%;
                    h2 {
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    p {
                        display: flex;
                        align-items: center;
                        i {
                            font-size: 16px;
                            margin-right: 13px;
                            cursor: pointer;
                            margin-bottom: 7px;
                        }
                        i:first-child {
                            margin-left: 7px;
                        }
                    }
                }
                .actions {
                    margin-left: auto;
                    padding: 0 20px;
                    width: 16%;
                    div {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        margin-bottom:15px;

                        p {
                            cursor:pointer;
                            font-size:14px;
                            display: flex;
                            align-items: center;
                            width: 100%;
                            i {
                                font-size:17px;
                                margin-right: 7px;
                                pointer-events: none;
                            }
                            &:last-child {
                                margin-bottom: 0px;
                            }
                        }
                        .rotating {
                            height: 15px;
                            width: 15px;
                            display: none;
                        }
                    }
                }
            }

        }
        .cntent {
            height: calc(81% - 25px);
            padding-bottom: 25px;
            overflow-y: auto;
            display: block;
            h2 {
                margin: 5px 0 10px 0;
                text-align: center;
                user-select: none;
            }
            .detail-card {
                display: inline-flex;
                align-items: center;
                max-width: 295px;
                width: 100%;
                padding: 10px;
                margin: 5px 10px;
                margin-bottom: 15px;
                border: 1px solid #c4c4c4a2;
                border-left: 4px solid #000;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                position: relative;
                overflow: hidden;
                .icn {
                    margin-right: 15px;
                    z-index: 5;
                    i {
                        font-size: 30px;
                    }
                }
                .cnt {
                    z-index: 5;
                    overflow: hidden;
                    p {
                        cursor: default;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
                .call {
                    margin-left: auto;
                    display: flex;
                    align-items: center;
                    z-index: 5;
                    i {
                        font-size: 25px;
                        cursor: pointer;
                    }
                    img {
                        height: 25px;
                        width: 25px;
                        margin: auto 0;
                        display: none;
                    }
                }
                .progress {
                    background-color: #89ff97b8;
                    position: absolute;
                    height: 100%;
                    z-index: 0;
                    width: 0%;
                    left: 0;
                    top: 0;
                    transition: width .25s, background-color 3s;
                }
            }
            .described-add {
                display: flex;
                padding-left: 30px;
                align-items: center;
                cursor: default;
                width: calc(100% - 30px);
                .lbl {
                    font-weight: bold;
                    font-size: 18px;
                }
            }
            .permission-view {
                display: flex;
                margin-bottom: 15px;
                margin-top: 5px;
                flex-wrap: wrap;
                .got-permission, .permission {
                    display: inline-flex;
                    align-items: center;
                    margin: 5px 10px;
                    padding: 5px 0;
                    width: calc(100% - 30px);
                    background-color: #bdffb780;
                    border: 1px solid #c4c4c4a2;
                    border-radius: 3px;
                    max-width: 318px;
                    min-width: 310px;
                    cursor: default;
                    .key {
                        margin-left: 5px;
                        margin-right: 15px;
                        display: inline-block;
                        text-align: right;
                        min-width: 35px;
                        font-weight: bold;
                    }
                    span {
                        pointer-events: none;
                    }
                    .desc {
                        font-style: italic;
                    }
                    i {
                        margin-left: auto;
                        margin-right: 5px;
                        cursor: pointer;
                    }
                    img {
                        height: 15px;
                        width: 15px;
                        margin-left: auto;
                        margin-right: 5px;
                        display: none;
                    }
                }
                .permission {
                    background-color: #e1e1e180;
                    input {
                        margin-left: auto;
                        margin-right: 5px;
                    }
                }
            }
            .file-pending {
                background-color: #ffb30066;
            }
            .file-deleted {
                opacity: .4;
            }
            .rotating {
                height: 30px;
                width: 30px;
            }
        }
    }

    @media only screen and (max-width: 700px) {
        .blury-cnt {
            .details {
                .head {
                    .info {
                        flex-direction: column;
                        ._details {
                            width: 100%;
                        }
                        .actions {
                            flex-direction: row;
                            justify-content: flex-start;
                            margin: unset;
                            width: 100%;
                            padding: 5px 0;
                            div {
                                margin-bottom: 0;
                            }
                            div:first-child {
                                margin-bottom: 0;
                                margin-right: 20px;
                            }
                        }
                    }
                }

                .cntent {
                    display: block;
                    text-align: center;
                    .detail-card, .info-message {
                        text-align: left;
                    }
                    .permission-view {
                        .got-permission, .permission {
                            width: calc(100% - 0px);
                            max-width: unset;
                            text-align: left;
                        }
                    }
                }
            }
        }
    }
</style>