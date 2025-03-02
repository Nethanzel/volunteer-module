<template>
  <div class="list-all">
    <h1>Lista de voluntarios</h1>

    <Volunteers v-if="!loading" @details="showDetails($event)" />

    <transition name="circle-blur">
      <div class="blury-cnt" @click="handleHideBlur()" v-if="showBlur">
        <VolunteerDetails 
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

  </div>
</template>
  
<script>
  import Request from '../request/instance.js';
  import Volunteers from '../components/Volunteers.vue';
  import VolunteerDetails from '../components/VolunteerDetails.vue';
  import DynamicModelCreator from '../components/DynamicModelCreator.vue';

  export default {
    components: {
      Volunteers,
      VolunteerDetails,
      DynamicModelCreator
    },
    data() {
      return {
        loading: false,
        dictionaries: {},
        showBlur: false,
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
      }
    },
    methods: {
      showDetails(e) {
        if (!this._allowViewUserPermission) return;
        this.details = e;
        this.showBlur = true
      },
      async loadDictionaries() {
        let requests = [ Request.Get.Departamentos(), Request.Get.tipoVoluntarios(), Request.Get.Estaciones(), Request.Get.Permisos() ];
        let [departamentos, tipoVoluntarios, estaciones, permisos] = await Promise.all(requests).catch(e => e).finally(() => this.loading = false);
        
        if (tipoVoluntarios.status == 200) this.dictionaries.tipoVoluntarios = tipoVoluntarios.data;
        if (departamentos.status == 200) this.dictionaries.departamentos = departamentos.data;
        if (estaciones.status == 200) this.dictionaries.estaciones = estaciones.data;
        if (permisos.status == 200) this.dictionaries.permisos = permisos.data;
      },
      handleHideBlur() {
        this.showBlur = false;
        this.showAddEmergencyContact = false;
        this.academicPrep = false;
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
      }
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

<style>
.list-all {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}
</style>
  