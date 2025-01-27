<script setup>
import { ref, onMounted } from 'vue'
import MSidebar from './components/MSidebar.vue'
import MHeader from './components/MHeader.vue'
const animateOn = ref('none')

onMounted(() => {
  setTimeout(() => {
    animateOn.value = 'slide-fade'
  }, 10000)
})
</script>

<template>
  <div class="ModalContainer" id="ChooseModal">
    <div class="ModalBackground">
      <div class="Modal">
        <div class="ChooseModalQuestion"></div>
        <div class="ModalButtons">
          <div class="MButton ChooseModalYesBTN">نعم</div>
          <div class="MButton ChooseModalNoBTN">كلا</div>
        </div>
      </div>
    </div>
  </div>
  <div class="ModalContainer" id="MessageModal">
    <div class="ModalBackground">
      <div class="Modal">
        <div class="ModalContent">
          <div class="TheMessage"></div>
          <div class="MButton" v-ModalCloseBTN>موافق</div>
        </div>
      </div>
    </div>
  </div>
  <div class="ModalContainer" id="LoadingModal">
    <div class="ModalBackground">
      <div class="Modal">
        <div class="ModalContent">
          <div class="Loader"><span></span></div>
          <div class="LoadingText">يرجى الانتظار ...</div>
        </div>
      </div>
    </div>
  </div>
  <div class="MainWrapper">
    <MSidebar />
    <div class="MainContent">
      <MHeader />
      <div class="ViewsContainer">
        <router-view v-slot="{ Component }">
          <transition :name="animateOn" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>
<script>
</script>
<style>
.MainWrapper {
  display: flex;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  align-items: center;
}

.MainContent {
  display: flex;
  flex: 1;
  height: 100%;
  max-height: 100vh;
  transition-duration: 0.3s;
  margin: 0 250px 0 0;
  padding: 0 15px;
  border-radius: 5px;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

.FullMainContent {
  margin: 0;
}

.ViewsContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  padding: 0 0 10px 0;
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

@media only screen and (max-width: 700px) {
  .MainContent {
    margin: 0;
  }
}
</style>
