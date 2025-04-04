<template>
  <div class="home" ref="home">

    <header>
      <Navigation />
    </header>

    <section id="sec-1" v-if="devReady">
      <RecentEvents />
    </section>

    <section id="sec-2" :style="{ backgroundColor: '#ff0000bf' }" v-if="devReady">
      <SchoolAndSchdule />
    </section>

<!--     <section id="sec-3" :style="{ backgroundColor: '#f3cd2a' }" v-if="devReady">
      <h1>Calendario de Actividades recientes (brief)</h1>
    </section> -->
  </div>
</template>

<script>
  import Navigation from '../components/ViewHeader.vue';
  import RecentEvents from '../components/RecentEvents.vue';
  import SchoolAndSchdule from '../components/SchoolAndSchdule.vue';

  export default {
    name: 'Home',
    components: {
      Navigation,
      RecentEvents,
      SchoolAndSchdule
    },
    data() {
      return {
        devReady: true
      }
    },
    mounted() {
      //this.$refs.home.addEventListener("scroll", () => this.navScrollBehaivor());
      window.addEventListener('resize', this.updateScrollbarWidth);
      this.updateScrollbarWidth();
      this.handleShowSchools();
    },
    destroyed() {
      //this.$refs.home.removeEventListener("scroll", () => this.navScrollBehaivor());
      window.removeEventListener('resize', this.updateScrollbarWidth);
    },
    methods: {
      /* navScrollBehaivor() {
        if (this.$refs.home.scrollTop === 0 || this.$refs.home.scrollTop < 170) {
          this.$refs.home.scrollTop = 0;
        }
      }, */
      updateScrollbarWidth() {
        const homeEl = this.$refs.home;
        if (!homeEl) return;
        const scrollbarWidth = homeEl.offsetWidth - homeEl.clientWidth;
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      },
      handleShowSchools() {
        if (this.$route.params.showSchools === true) {
            setTimeout(() => document.getElementById('sec-2').scrollIntoView({ behavior: 'smooth' }), 250);
        } 
      }
    }
  }
</script>

<style scoped lang="scss">
  .home {
    height: 100dvh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    section {
      display: flex;
      align-items: center;
      flex-direction: column;
      scroll-snap-align: start;
      height: 100dvh;
    }

    #sec-2,
    #sec-3 {
      padding-top: 65px;
      height: calc(100dvh - 65px);
    }

    header {
      top: 0;
      left: 0;
      z-index: 100;
      padding: 3px 5px 3px 5px;
      transition: .5s;
      overflow: hidden;
      position: fixed;
      height: 55px;
      width: calc(100% - 9px - var(--scrollbar-width, 0px));
      background-color: #ffffffcc;
    }
  }

</style>
