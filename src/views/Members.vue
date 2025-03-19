<template>
  <div class="list-all">
    <h1>Lista de miembros</h1>

    <p class="report-action" v-if="!membersLoading">
      <span @click="refreshMembers" class="minimal-action"><i class="icofont-refresh"></i>Actualizar</span>
      <span @click="showFiltersBlur = true" class="minimal-action"><i class="icofont-search-user"></i>Busqueda</span>
      <span @click="showFiltersBlur = true" class="minimal-action"><i class="icofont-download"></i>Exportar</span>
    </p>

    <MembersList 
      v-if="!loading" 
      @details="showDetails($event)"
      @load="membersLoading = false"
      @loading="membersLoading = true"
      @ready="refreshMembers = $event"
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
  import FiltersBuilder from '../components/FiltersBuilder.vue';

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
            display: 'Nombre',
            key: 'nombre',
            type: 'text',
            value: null
          },
          {
            display: 'Apellido',
            key: 'apellido',
            type: 'text',
            value: null
          },
        ],
        refreshMembers: () => {}
      }
    },
    methods: {
      showDetails(e) {
        if (!this._allowViewUserPermission) return;
        this.details = e;
        this.showBlur = true
      },
      async loadDictionaries() {
        let requests = [ Request.Get.Grados(), Request.Get.tipoMiembros(), Request.Get.Escuelas(), Request.Get.Permisos(), Request.Get.tipoEntrenamientos() ];
        let [grados, tipoMiembros, escuelas, permisos, tipoEntrenamiento] = await Promise.all(requests).catch(e => e).finally(() => this.loading = false);
        
        if (tipoMiembros.status == 200) this.dictionaries.tipoMiembros = tipoMiembros.data.rows;
        if (escuelas.status == 200) this.dictionaries.escuelas = escuelas.data.rows;
        if (grados.status == 200) this.dictionaries.grados = grados.data.rows;
        if (permisos.status == 200) this.dictionaries.permisos = permisos.data;
        if (tipoEntrenamiento.status == 200) this.dictionaries.tipoEntrenamiento = tipoEntrenamiento.data;
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
    },
    mounted() {
      this.loadDictionaries();
    },
    computed: {
      _allowViewUserPermission() {
        return this.$store.getters.isAllowedToPermission(['VV'])
      }
    }
  }
</script>

<style lang="scss">
  .list-all {
    height: calc(100dvh - 75px);
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
  