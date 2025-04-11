<template>
  <div class="options">
    <div class="wrapper">
      <GenericMemberStatistics />
      <genericLevelStatistics />
      <lastPracticesResume v-if="_allowViewAllPracticePermission" />
    </div>
  </div>
</template>
  
<script>
  import GenericMemberStatistics from '../components/dashboard/genericMemberStatistics.vue';
  import genericLevelStatistics from '../components/dashboard/genericLevelStatistics.vue';
  import lastPracticesResume from '../components/dashboard/lastPracticesResume.vue';

  export default {
    components: {
      GenericMemberStatistics,
      genericLevelStatistics,
      lastPracticesResume
    },
    computed: {
      _allowViewAllPracticePermission() {
        return this.$store.getters.isAllowedToPermission(['QPR']) 
      },
    }
  }
</script>

<style lang="scss" scoped>
.options {
  width: 100%;
  display: flex;
  min-height: calc(100vh - 65px);
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-content: flex-start;
    max-width: 800px;
    margin: 50px auto 0 auto;
    padding: 5px;
    width: calc(100% - 10px);
  }
}
</style>
  