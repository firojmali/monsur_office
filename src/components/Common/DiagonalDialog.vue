<script setup lang="ts"></script>
<template>
  <div
    class="diagonal-diagonal-dialog panel-shadow"
    :style="cssProps"
    @click="console.log('click inside')"
  >
    <div class="cros-div" @click="$emit('close')">
      <div class="cros-p cursor-pointer text-red-700 hover:text-fuchsia-950">X</div>
    </div>
    <slot name="pre"></slot>
    <slot></slot>
    <slot name="post"></slot>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    bgcolor: {
      type: String,
      default: '#e3ebeb'
    },
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  computed: {
    cssProps() {
      return {
        '--bg-color-diagonal-vue': this.bgcolor,
        '--height-diagonal-vue': this.height,
        '--width-diagonal-vue': this.width
      }
    }
  },
  methods: {
    buttonstyle() {}
  }
}
</script>
<style scoped>
.diagonal-diagonal-dialog {
  position: fixed;
  top: calc((100% - var(--height-diagonal-vue)) / 2);
  left: calc((100% - var(--width-diagonal-vue)) / 2);
  width: var(--width-diagonal-vue);
  height: var(--height-diagonal-vue);
  max-height: 100%;
  opacity: 1;
  z-index: 11;
  background-color: var(--bg-color-diagonal-vue);
  overflow: auto;
  padding: 8px;
}
.cros-div {
  width: 100%;
}
.cros-p {
  float: right;
  color: rgb(185 28 28 / var(--tw-text-opacity));
  background-color: #f9e86957;
  border-radius: 9px;
  font-weight: 900;
  width: 22px;
  text-align: center;
}
.visible {
  visibility: visible;
}
.notvisible {
  visibility: hidden;
}
</style>
