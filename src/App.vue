<script setup>
import { ref, onMounted } from 'vue'
import MSidebar from './components/MSidebar.vue'
import MHeader from './components/MHeader.vue'
import { subscribeForegroundAsync, getFcmToken } from './firebase'

const MPrompt = ref(null)
const animateOn = ref('none')
let sharedAudioCtx = null

function getAudioContext() {
  if (sharedAudioCtx) return sharedAudioCtx
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    sharedAudioCtx = new AudioCtx()
    return sharedAudioCtx
  } catch {
    return null
  }
}

function playBeepAdvanced() {
  try {
    const ctx = getAudioContext()
    if (!ctx || ctx.state !== 'running') return
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()
    osc1.type = 'sine'
    osc2.type = 'sine'
    osc1.frequency.value = 880
    osc2.frequency.value = 1320
    try {
      osc2.detune.value = 6
    } catch { /* empty */ }
    const now = ctx.currentTime
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.33)
    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)
    osc1.start(now)
    osc2.start(now + 0.01)
    setTimeout(() => {
      try {
        osc1.stop()
      } catch { /* empty */ }
      try {
        osc2.stop()
      } catch { /* empty */ }
    }, 340)
  } catch {
    // ignore audio errors
  }
}

onMounted(() => {
  setTimeout(() => {
    animateOn.value = 'slide-fade'
  }, 2000)

  window.ShowMessage = function (Message) {
    MPrompt.value.ShowMessage(Message)
  }
  window.ShowChoose = function (Message, YesFunction, NoFunction) {
    MPrompt.value.ShowChoose(Message, YesFunction, NoFunction)
  }
  window.HideChoose = function () {
    MPrompt.value.HideChoose()
  }
  window.ShowLoading = function () {
    MPrompt.value.ShowLoading()
  }
  window.HideLoading = function () {
    MPrompt.value.HideLoading()
  }

  // Ask for browser notification permission and pre-register FCM
  try {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(async (permission) => {
          if (permission === 'granted') {
            await getFcmToken()
          }
        })
      } else if (Notification.permission === 'granted') {
        getFcmToken()
      }
    }
  } catch {
    // ignore
  }

  // Listen for messages from the service worker to play sound (e.g., on notification click)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'play-sound') {
        playBeepAdvanced()
      }
    })
  }
})

// Subscribe for foreground FCM messages → show desktop notification + sound
onMounted(async () => {
  await subscribeForegroundAsync((payload) => {
    try {
      if (Notification && Notification.permission === 'granted') {
        const title = (payload && payload.notification && payload.notification.title) || 'إشعار'
        const body = (payload && payload.notification && payload.notification.body) || ''
        const data = (payload && payload.data) || {}
        new Notification(title, { body, data })
        playBeepAdvanced()
      }
    } catch {
      // ignore
    }
  })
})
</script>

<template>
  <MPrompts ref="MPrompt" />
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
