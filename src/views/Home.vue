<template>
  <div class="home" ref="home">

    <header>
      <Navigation />
    </header>

    <section id="sec-1">
      <RecentEvents />
    </section>

    <section id="sec-2" :style="{ backgroundColor: '#ff5b5b' }">
      <h1>Calendario de Actividades recientes (brief)</h1>
    </section>

    <section id="sec-3">
      <h1>Escuelas y horarios de practica</h1>
    </section>
  </div>
</template>

<script>
  import Navigation from '../components/ViewHeader.vue';
  import RecentEvents from '../components/RecentEvents.vue';

  export default {
    name: 'Home',
    components: {
      Navigation,
      RecentEvents
    },
    data() {
      return {
      }
    },
    mounted() {
      this.$refs.home.addEventListener("scroll", () => this.navScrollBehaivor()); 
    },
    unmounted() {
    },
    methods: {
      navScrollBehaivor() {
        if (this.$refs.home.scrollTop === 0 || this.$refs.home.scrollTop < 170) {
          this.$refs.home.scrollTop = 0;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .home {
    height: 100vh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    section {
      display: flex;
      align-items: center;
      flex-direction: column;
      height: 100vh;
      scroll-snap-align: start;
    }

    #sec-2,
    #sec-3 {
      padding-top: 80px;
      height: calc(100vh - 80px);
    }

    header {
      top: 0;
      left: 0;
      z-index: 100;
      padding: 5px 10px 0px 10px;
      transition: .5s;
      overflow: hidden;
      position: fixed;
      width: calc(100% - 35px);
      background-color: #ffffffcc;
    }
  }
</style>
