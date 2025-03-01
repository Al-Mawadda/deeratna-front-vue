<script setup>
  import { ref } from 'vue'
    const qr = ref('');
    const generateQR = () => {
      qr.value = 'https://www.google.com';
    };

</script>
<template>
  <div style="padding-top: 190px;">
    <input type="text" v-model="qr" />
    <button @click="generateQR">Generate QR</button>
    <img :src="qr" />
  </div>
</template>
