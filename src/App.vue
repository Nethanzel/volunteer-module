<template>
  <div id="app" :style="{ paddingTop: paddingTop, minHeight: `calc(100vh - ${paddingTop})` }" @click="collapseMenu()">

    <MessageStack />

    <aside 
      ref="nav_cnt"
      class="aside-hide"
      v-if="showNavigation"
    >
      <NavigationMenu @ready="($event) => hideMenu = $event" /> 
    </aside>

    <header 
      class="header" 
      :style="{ position: 'fixed', display: navDisplay, height: '65px' }"
    >
      <ViewHeader/>
    </header>

    <router-view/>

  </div>
</template>

<script>
  import axiosRequest from './request/instance';
  import ViewHeader from './components/ViewHeader.vue';
  import MessageStack from './components/MessageStack.vue';
  import NavigationMenu from './components/NavigationMenu.vue';

  export default {
    components: {
      ViewHeader,
      MessageStack,
      NavigationMenu
    },
    data() {
      return {
        paddingTop: '75px',
        navDisplay: 'flex',
        hideMenu: () => {}
      }
    },
    watch: {
      $route(to) {
        if (to.name == "Home") {
          this.paddingTop = '0px';
          this.navDisplay = 'none';
          return;
        }
        this.paddingTop = '75px';
        this.navDisplay = 'flex';
      }
    },
    computed: {
      showNavigation() {
        if (this.$route.name == 'Home') return false;
        if (this.$route.name == 'Login') return false;
        
        return true;
      }
    },
    mounted() {
      axiosRequest.Get.validateAccess()
      .then(res => this.$store.commit('setUserData', res.data))
      .catch(() => null)
      .finally(() => this.$store.commit('stopValidating'));
    },
    methods: {
      collapseMenu() {
        this.hideMenu()
      }
    }
  }
</script>

<style lang="scss">

@import './styles/forms.scss';
@import './styles/styleBase.scss';
@import './styles/inputStyle.scss';
@import './styles/infinityRotate.scss';
@import './styles//slideAnimation.scss';
@import './styles//circlePopAnimation.scss';

* {
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
}

.header {
  top: 0;
  left: 0;
  z-index: 100;
  transition: .5s;
  background-color: #fff;
  box-shadow: 0px 1px 5px 0px;
  padding: 5px 10px 0px 10px;
  width: calc(100% - 20px);
}

aside {
  box-shadow: 10px 0px 10px 0px #00000030;
  height: calc(100vh - 80px);
  position: fixed;
  z-index: 50;

  a {
    font-weight: bold;
    color: #2c3e50;
    font-size: 15px;
    &.router-link-exact-active {
      background-color: #42b983;
      padding: 10px;
      color: #fff;
    }
  }
}

.aside-hide {
  transition: transform .25s;
  transform: translateX(-120%);
}

.aside-show {
  transition: transform .25s;
  transform: translateX(0%);
}

h1 {
  text-align: center;
  margin-bottom: 15px;
  margin-top: 10px;
}

</style>
