<template>
  <div class="list-all">
    <h1>Lista de miembros</h1>

    <div class="actions" v-if="!membersLoading">
        <div>
            <p 
                class="minimal-action"
                @click="refreshMembers(null)"
                :style="{ marginLeft: 0 }"
            >
                <i class="icofont-refresh"></i>
                Actualizar
            </p>
            <img class="rotating" src="../assets/spinner.png" alt="loading">
        </div>

        <div>
            <p 
                class="minimal-action"
                @click="showFiltersBlur = true"
                :style="{ marginLeft: 0 }"
            >
                <i class="icofont-search-user"></i>
                Busqueda
            </p>
            <img class="rotating" src="../assets/spinner.png" alt="loading">
        </div>

        <div v-if="_allowExportMembersPermission">
            <p 
                class="minimal-action"
                @click="getReport($event.target)"
                :style="{ marginLeft: 0 }"
            >
                <i class="icofont-download"></i>
                Exportar
            </p>
            <img class="rotating" src="../assets/spinner.png" alt="loading">
        </div>
    </div>

    <div class="filters" v-if="!membersLoading && currentFilters.length">
        <!-- <p>Filtros aplicados:</p> -->
        <div class="tags">
            <span
                v-for="(filter, i) in currentFilters"
                :key="`filt-${i}`"
            >
                <b>{{ filter.display }}:</b> {{ filter.value }}

                <i class="icofont-close" @click="cleanFilter(filter)"></i>
            </span>
        </div>
    </div>

    <MembersList 
      v-if="!loading" 
      @details="showDetails($event)"
      @load="membersLoading = false"
      @loading="membersLoading = true"
      @ready="refreshMembers = $event"
      :filters="filters"
    />

    <transition name="circle-blur">
      <div class="blury-cnt" @click="handleHideBlur()" v-if="showBlur">
        <MemberDetails 
          :dictionaries="dictionaries" 
          :data="details" 
          @addEmergencyContact="showAddEmergencyContact = true"
          @addAcademicPrep="academicPrep = true"
          v-if="!showAddEmergencyContact && !academicPrep"
        />
        
        <DynamicModelCreator 
          @hide="showAddEmergencyContact = false"
          @ready="hideEmergencyContactLoading = $event"
          @done="addEmergencyContact($event)"
          :fields="emergencyContactFields" 
          :title="'Nuevo Contacto de emergencia'" 
          v-if="showAddEmergencyContact && !academicPrep"
        />
        
        <DynamicModelCreator 
          @hide="academicPrep = false"
          @ready="hideAcademicPrepLoading = $event"
          @done="createAcademicPrep($event)"
          :fields="academicPrepFields" 
          :title="'Agregar formación academica'" 
          v-if="academicPrep && !showAddEmergencyContact"
        />
      </div>
    </transition>

    <transition name="circle-blur">
      <div class="blury-cnt" @click="handleHideFiltersBlur()" v-if="showFiltersBlur">
        <FiltersBuilder
          :title="'Filtrar miembros'"
          :filters="filters"
          @hide="showFiltersBlur = false"
          @done="filtersRunAction"
        />
      </div>
    </transition>

  </div>
</template>
  
<script>
  import Request from '../request/instance.js';
  import MembersList from '../components/MemberList.vue';
  import MemberDetails from '../components/MemberDetails.vue';
  import DynamicModelCreator from '../components/DynamicModelCreator.vue';
  import { hideFieldLoading, showFieldLoading } from '../utils/handleEditableField.js';
  import FiltersBuilder from '../components/FiltersBuilder.vue';
  import { blobToFile } from '../utils/downloadFile.js';
  import { getFilters, getParts } from '../utils/inforFormat.js';
  export default {
    components: {
      MembersList,
      MemberDetails,
      DynamicModelCreator,
      FiltersBuilder
    },
    data() {
      return {
        loading: false,
        dictionaries: {},
        showBlur: false,
        showFiltersBlur: false,
        details: null,
        emergencyContactFields: [
          {
            key: 'name',
            display: 'Nombre',
            type: 'text'
          },
          {
            key: 'relation',
            display: 'Parentezco',
            type: 'text'
          },
          {
            key: 'phone',
            display: 'Telefono de contacto',
            type: 'text'
          }
        ],
        showAddEmergencyContact: false,
        academicPrepFields: [
          {
            key: 'grade',
            display: 'Estudio',
            type: 'select',
            options: [
              {
                key: "basica",
                value: "Básica"
              },
              {
                key: "secundaria",
                value: "Secundaria (Bachiller/Highschool)"
              },
              {
                key: "universidad",
                value: "Universidad"
              },
            ]
          },
          {
            key: 'place',
            display: 'Centro de estudio',
            type: 'text'
          },
          {
            key: 'age',
            display: 'Año de graduación',
            type: 'text'
          }
        ],
        academicPrep: false,
        hideAcademicPrepLoading: () => {},
        hideEmergencyContactLoading: () => {},
        membersLoading: false,
        filters: [
            {
                display: 'Cédula',
                key: 'identity',
                type: 'text',
                value: null,
                op: 'eq/text',
                desc: null
            },
            {
                display: 'Código miembro',
                key: 'referenceCode',
                type: 'text',
                value: null,
                op: 'eq/text',
                desc: null
            },
            {
                display: 'Nombre',
                key: 'nombre',
                type: 'text',
                value: null,
                op: 'like/text',
                desc: null
            },
            {
                display: 'Apellido',
                key: 'apellido',
                type: 'text',
                value: null,
                op: 'like/text',
                desc: null
            },
            {
                options: [''],
                display: 'Escuela',
                key: 'escuelaId',
                type: 'select',
                value: null,
                op: 'eq/number',
                desc: null,
                valueDesc: (v, options) => {
                    return options.find(x => x.key == v).value;
                }
            },
            {
                options: [''],
                display: 'Grado',
                key: 'GradoId',
                type: 'select',
                value: null,
                op: 'eq/number',
                desc: null,
                valueDesc: (v, options) => {
                    return options.find(x => x.key == v).value;
                }
            },
            {
                options: [''],
                display: 'Tipo miembro',
                key: 'TipoMiembroId',
                type: 'select',
                value: null,
                op: 'eq/number',
                desc: null,
                valueDesc: (v, options) => {
                    return options.find(x => x.key == v).value;
                }
            },
            {
                options: [''],
                display: 'Tipo entrenamiento',
                key: 'interested',
                type: 'select',
                value: null,
                op: 'eq/number',
                desc: null,
                valueDesc: (v, options) => {
                    return options.find(x => x.key == v).value;
                }
            },
            {
                options: [
                    {
                        key: null,
                        value: null
                    },
                    {
                        key: "M",
                        value: "Masculino"
                    },
                    {
                        key: "F",
                        value: "Femenino"
                    }
                ],
                display: 'Género',
                key: 'genero',
                type: 'select',
                value: null,
                op: 'eq/text',
                desc: null,
                valueDesc: function (v, options) {
                    return options.find(x => x.key == v).value;
                }
            },
            {
                display: 'Peso',
                key: 'peso',
                type: 'text',
                value: null,
                op: 'between/number',
                desc: 'libras'
            },
            {
                display: 'Estatura',
                key: 'altura',
                type: 'text',
                value: null,
                op: 'between/number',
                desc: 'pies'
            },
            {
                display: 'Edad',
                key: 'nacimiento',
                type: 'text',
                value: null,
                op: 'between/age',
                desc: 'años'
            }
        ],
        currentFilters: [],
        refreshMembers: () => {}
      }
    },
    methods: {
        getFilters,
        showDetails(e) {
            if (!this._allowViewUserPermission) return;
            this.details = e;
            this.showBlur = true
        },
        async loadDictionaries() {
            let requests = [ Request.Get.Grados(), Request.Get.tipoMiembros(), Request.Get.Escuelas(), Request.Get.Permisos(), Request.Get.tipoEntrenamientos() ];
            let [grados, tipoMiembros, escuelas, permisos, tipoEntrenamiento] = await Promise.all(requests).catch(e => e).finally(() => this.loading = false);
            
            if (tipoMiembros.status == 200) {
            this.dictionaries.tipoMiembros = tipoMiembros.data.rows;
            this.filters.find(x => x.key == 'TipoMiembroId').options = this.getFilter(tipoMiembros.data.rows, 'tipo');
            }

            if (escuelas.status == 200) {
            this.dictionaries.escuelas = escuelas.data.rows;
            this.filters.find(x => x.key == 'escuelaId').options = this.getFilter(escuelas.data.rows, 'nombre');
            }

            if (grados.status == 200) {
            this.dictionaries.grados = grados.data.rows; 
            this.filters.find(x => x.key == 'GradoId').options = this.getFilter(grados.data.rows, 'grado');
            }

            if (tipoEntrenamiento.status == 200) {
            this.dictionaries.tipoEntrenamiento = tipoEntrenamiento.data;
            this.filters.find(x => x.key == 'interested').options = this.getFilter(tipoEntrenamiento.data, 'name');
            }

            if (permisos.status == 200) this.dictionaries.permisos = permisos.data;
        },
        handleHideBlur() {
            this.showBlur = false;
            this.showAddEmergencyContact = false;
            this.academicPrep = false;
        },
        handleHideFiltersBlur() {
            this.showFiltersBlur = false;
        },
        async addEmergencyContact(e) {
            let res = await Request.Patch.addContact({ id: this.details.id, record: e }).catch(() => this.hideEmergencyContactLoading()).finally(() => this.hideEmergencyContactLoading());
            if (res?.status == 204) {
            this.details.contactoEmergencia.push(e);
            this.showAddEmergencyContact = false;
            this.$throwAppMessage({ 
                message: "Contacto agregado!",
                icon: "icofont-check-circled",
                type: 'ok',
            });
            }
        },
        async createAcademicPrep(e) {
            let res = await Request.Patch.addAcademicPrep({ id: this.details.id, record: e }).catch(() => this.hideAcademicPrepLoading()).finally(() => this.hideAcademicPrepLoading());
            if (res?.status == 204) {
            this.details.estudios.push(e);
            this.academicPrep = false;
            this.$throwAppMessage({ 
                message: "Informacion agregada!",
                icon: "icofont-check-circled",
                type: 'ok',
            });
            }
        },
        getReport(target) {
            showFieldLoading(target);

            Request.Get.generateMembersListForm(this.getFilters(this.filters))
            .then(res => {
            this.$throwAppMessage({ 
                message: "Archivo descargado!",
                icon: "icofont-check-circled",
                type: 'ok',
            });
            blobToFile(res.data, res.headers['content-disposition'].split('filename=')[1].replace(/"/g, ''))
            })
            .then(() => hideFieldLoading(target))
            .catch(() => hideFieldLoading(target))
        },
        getFilter(data, value) {
            let result = [{ key: null, value: '' }];
            Object.keys(data).forEach((i) => result.push({ key: data[i].id, value: data[i][value] }));
            return result
        },
        filtersRunAction() {
            this.showFiltersBlur = false;
            this.getFiltersDisplay();
            this.refreshMembers();
        },
        getFiltersDisplay() {
            this.currentFilters = [];
            let filterValues = this.filters.filter(x => x.value);
            filterValues.forEach(filter => {
                let parts = getParts(filter, false);
                let description;
                if (parts.op == 'eq') description = `Igual a "${filter.valueDesc ? filter.valueDesc(filter.value, filter.options) : parts.value}"${filter.desc ? ` ${filter.desc}` : ''}`;
                else if (parts.op == 'between') description = `Entre "${parts.value[0]}" y "${parts.value[1]}"${filter.desc ? ` ${filter.desc}` : ''}"`;
                else if (parts.op == 'like') description = `Incluye "${parts.value}"${filter.desc ? ` ${filter.desc}` : ''}`;
                
                this.currentFilters.push({ display: filter.display, value: description, key: filter.key });
                this.filters.find(o => o.key == filter.key)['filterDescription'] = { display: filter.display, value: description }
            });
        },
        cleanFilter(filter) {
            this.filters.find(f => f.key == filter.key).value = null;
            this.currentFilters = this.currentFilters.filter(f => f.key != filter.key);
        }
    },
    mounted() {
      this.loadDictionaries();
    },
    computed: {
      _allowViewUserPermission() {
        return this.$store.getters.isAllowedToPermission(['VV'])
      },
      _allowExportMembersPermission() {
        return this.$store.getters.isAllowedToPermission(['PML'])
      },
    }
  }
</script>

<style lang="scss">
  .list-all {
    height: calc(100dvh - 65px);
    display: flex;
    flex-direction: column;
    h1 {
      cursor: default;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
  