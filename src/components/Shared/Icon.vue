<template>
  <div
    class="icon"
    :style="{
      width: ImgWidth + 'px',
      height: ImgHeight + 'px',
    }"
  >
    <img :src="srcImage" alt="User Icon" class="image" />
  </div>
</template>

<script>
export default {
  name: 'UserIcon',
  props: {
    srcImage: {
      type: String
    },
    ImgWidth: {
      type: Number,
      default: 40
    },
    ImgHeight: {
      type: Number,
      default: 40
    }
  }
}
</script>

<style scoped>
.icon {
  overflow: hidden;
  cursor: pointer;
  display: flex;
  
  
}

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>