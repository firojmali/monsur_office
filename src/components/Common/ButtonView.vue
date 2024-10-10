<script setup lang="ts"></script>
<template>
  <button :style="buttonstyle()">
    <slot name="pre"></slot>
    <slot></slot>
    <slot name="post"></slot>
  </button>
</template>
<script lang="ts">
export default {
  props: {
    color: {
      type: String,
      default: '#ffffffff'
    },
    height: {
      type: String,
      default: '15'
    },
    width: {
      type: String,
      default: '#ffffffff'
    }
  },
  methods: {
    buttonstyle() {
      var str = {
        'background-color': this.color,
        border: '0px solid ' + this.color
      }
      return str
    }
  }
}
</script>
<style scoped>
.centerdiv {
  position: relative;
  top: 50%;
  margin-top: 10px;
}
.logo {
  width: 140px;
  height: 30px;
  background-image: url('/src/assets/logo.svg');
  background-repeat: no-repeat;
  background-size: cover;
}
.topbar {
  width: 100%;
  min-height: 50px;
  margin: 0;
  padding: 5px 5px 10px 5px;
  background-color: aliceblue;
}
.upperline {
  width: 100%;
  display: flex;
}
.searchbar {
  height: 30px;
  margin: auto;
  border: 2px solid #cf626296;
  border-radius: 12px;
  padding: 0px 8px 0px 8px;
}
.searchbar .input {
  border: none;
  background-color: #ffffff00;
  height: 30px;
}
.searchbar .input:focus {
  border: none;
  background-color: #ffffff00;
  outline: none;
}
</style>
