<script setup lang="ts">
import { useMenuItemsStore } from './store/menuItems'
import serverdata from './sedoserver/serveritems'
</script>

<template>
  <body :class="{ bgloadding: loadding }">
    <div class="loadding" v-if="loadding">
      <div class="loader"></div>
      loadding
    </div>
    <RouterView v-else />
  </body>
</template>
<script lang="ts">
export default {
  data() {
    return {
      loadding: true,
      menustore: useMenuItemsStore()
    }
  },
  created() {
    this.getcommondatas()
    setInterval(this.getcommondatas, 30000)
  },
  methods: {
    getcommondatas() {
      var presentdt = parseInt(String(Date.now() / 1000))
      presentdt = presentdt - 1 * 60 * 60 //next data update interval
      const menustore = useMenuItemsStore()
      if (
        menustore.allCats.length > 0 &&
        menustore.std &&
        parseInt(String(menustore.std)) > presentdt
      ) {
        console.log('previous value')
      } else {
        console.log('new stor created')
        menustore.setAll(serverdata.methods.createDummyData())
        menustore.std = parseInt(String(Date.now() / 1000))
      }
      //console.log(menustore.allCats)
      this.loadding = false
    }
  }
}
</script>
<style lang="css" scoped>
.loadding {
  color: #000834;
  font-weight: 900;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/* HTML: <div class="loader"></div> */
.loader {
  margin-left: 13px;
  width: 40px;
  aspect-ratio: 1;
  --c: no-repeat linear-gradient(#000 0 0);
  background:
    var(--c) 0 0,
    var(--c) 0 100%,
    var(--c) 50% 0,
    var(--c) 50% 100%,
    var(--c) 100% 0,
    var(--c) 100% 100%;
  background-size: 8px 50%;
  animation: l7-0 1s infinite;
  position: relative;
  overflow: hidden;
}
.loader:before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #000;
  top: calc(50% - 4px);
  left: -8px;
  animation: inherit;
  animation-name: l7-1;
}

@keyframes l7-0 {
  16.67% {
    background-size:
      8px 30%,
      8px 30%,
      8px 50%,
      8px 50%,
      8px 50%,
      8px 50%;
  }
  33.33% {
    background-size:
      8px 30%,
      8px 30%,
      8px 30%,
      8px 30%,
      8px 50%,
      8px 50%;
  }
  50% {
    background-size:
      8px 30%,
      8px 30%,
      8px 30%,
      8px 30%,
      8px 30%,
      8px 30%;
  }
  66.67% {
    background-size:
      8px 50%,
      8px 50%,
      8px 30%,
      8px 30%,
      8px 30%,
      8px 30%;
  }
  83.33% {
    background-size:
      8px 50%,
      8px 50%,
      8px 50%,
      8px 50%,
      8px 30%,
      8px 30%;
  }
}

@keyframes l7-1 {
  20% {
    left: 0px;
  }
  40% {
    left: calc(50% - 4px);
  }
  60% {
    left: calc(100% - 8px);
  }
  80%,
  100% {
    left: 100%;
  }
}
</style>
