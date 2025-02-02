<template>
  <div class="MPrompts" id="MPromptMessageBox">
    <div class="MPromptsBackground"></div>
    <div class="MPromptsWrapper">
      <div class="MPromptsContent">
        <div class="MPromptsContentWrapper">
          <div class="MPromptMessage"></div>
          <div class="MButton MPromptMessageBTN">موافق</div>
        </div>
      </div>
    </div>
  </div>
  <div class="MPrompts" id="MPromptChooseBox">
    <div class="MPromptsBackground"></div>
    <div class="MPromptsWrapper">
      <div class="MPromptsCloseBTN">
        <svg viewBox="0 0 100 100">
          <polygon points="85.179,16.589 83.411,14.821 50,48.232 16.589,14.821 14.821,16.589 48.232,50 14.821,83.411 16.589,85.179
              50,51.767 83.411,85.179 85.179,83.411 51.768,50 " />
          <path d="M89.421,16.59l-6.01-6.011L50,43.99L16.59,10.579l-6.011,6.011L43.99,50L10.579,83.411l6.011,6.01L50,56.01l33.411,33.411
              l6.01-6.01L56.01,50L89.421,16.59z" />
        </svg>
      </div>
      <div class="MPromptsContent">
        <div class="MPromptsContentWrapper">
          <div class="MPromptMessage"></div>
          <div class="MButton MPromptChooseBoxYesBTN">نعم</div>
          <div class="MButton MPromptChooseBoxNoBTN">كلا</div>
        </div>
      </div>
    </div>
  </div>
  <div class="MPrompts" id="MPromptLoading">
    <div class="MPromptsBackground"></div>
    <div class="MPromptsWrapper">
      <div class="MPromptsContent">
        <div class="MPromptsContentWrapper">
          <div class="MPromptLoader"></div>
          <div class="MPromptLoadingText">يرجى الانتظار ...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  mounted() {
    let MessageBox = document.getElementById('MPromptMessageBox');
    let ChooseBox = document.getElementById('MPromptChooseBox');

    MessageBox.querySelector('.MPromptMessageBTN').addEventListener('click', function () {
      this.HideMessage()
    }.bind(this));

    ChooseBox.querySelector('.MPromptsCloseBTN').addEventListener('click', function () {
      this.HideChoose()
    }.bind(this));
  },
  methods: {
    ShowMessage(Message) {
      let Element = document.getElementById('MPromptMessageBox');
      Element.classList.add('MPromptsActive');
      Element.querySelector('.MPromptMessage').innerHTML = Message;
    },
    HideMessage() {
      let Element = document.getElementById('MPromptMessageBox');
      Element.classList.add('MPromptsLeaving');
      setTimeout(function () {
        Element.classList.remove('MPromptsActive');
        Element.classList.remove('MPromptsLeaving');
      }, 230);
    },
    ShowChoose(Message, YesFunction, NoFunction) {
      let Element = document.getElementById('MPromptChooseBox');
      let YesBTN = Element.querySelector('.MPromptChooseBoxYesBTN');
      let NoBTN = Element.querySelector('.MPromptChooseBoxNoBTN');

      Element.classList.add('MPromptsActive');
      Element.querySelector('.MPromptMessage').innerHTML = Message;

      YesBTN.replaceWith(YesBTN.cloneNode(true));
      NoBTN.replaceWith(NoBTN.cloneNode(true));

      YesBTN = Element.querySelector('.MPromptChooseBoxYesBTN');
      NoBTN = Element.querySelector('.MPromptChooseBoxNoBTN');

      YesBTN.addEventListener('click', YesFunction);
      NoBTN.addEventListener('click', NoFunction);
    },
    HideChoose() {
      let Element = document.getElementById('MPromptChooseBox');
      let YesBTN = Element.querySelector('.MPromptChooseBoxYesBTN');
      let NoBTN = Element.querySelector('.MPromptChooseBoxNoBTN');

      Element.classList.add('MPromptsLeaving');

      YesBTN.replaceWith(YesBTN.cloneNode(true));
      NoBTN.replaceWith(NoBTN.cloneNode(true));

      setTimeout(function () {
        Element.classList.remove('MPromptsActive');
        Element.classList.remove('MPromptsLeaving');
      }, 230);
    },
    ShowLoading() {
      let Element = document.getElementById('MPromptLoading');

      Element.classList.add('MPromptsActive');
    },
    HideLoading() {
      let Element = document.getElementById('MPromptLoading');

      Element.classList.add('MPromptsLeaving');
      setTimeout(function () {
        Element.classList.remove('MPromptsActive');
        Element.classList.remove('MPromptsLeaving');
      }, 230);
    },
  }
}
</script>

<style>
/* Light Mode Colors */
:root {
  --MPromptsLoading: rgba(0, 0, 0, 0.2);
}

/* Dark Mode Colors */
.DarkMode {
  --MPromptsLoading: rgba(0, 0, 0, 0.2);
}

.MPrompts {
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50;
  justify-content: center;
  align-items: center;
}

.MPromptsBackground {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.MPromptsWrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 2;
  background-color: var(--BGColor);
  min-width: 300px;
  max-width: 80vw;
  min-height: 100px;
  max-height: 80vh;
  border-radius: 5px;
  flex-wrap: wrap;
  position: relative;
}

.MPromptsHeader {
  display: flex;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px 5px 0 0;
  justify-content: center;
  position: relative;
}

.MPromptsTitle {
  font-family: 'MFontB';
  font-size: 15px;
  color: var(--TextColor);
  padding: 7px 0 10px 0;
}

.MPromptsCloseBTN {
  display: flex;
  position: absolute;
  width: 40px;
  height: 40px;
  top: 0;
  right: 0;
  cursor: pointer;
  justify-content: center;
  align-items: center;
}

.MPromptsCloseBTN svg {
  display: flex;
  width: 17px;
  fill: var(--TextColor);
  transition-duration: 0.3s;
}

.MPromptsCloseBTN:hover svg {
  fill: var(--PrimaryColor);

}

.MPromptsContent {
  display: flex;
  width: 100%;
  padding: 5px;
  max-height: calc(80vh - 60px);
  overflow-y: auto;
}

.MPromptsContentWrapper {
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}

.MPromptMessage {
  display: flex;
  width: 100%;
  font-size: 15px;
  font-family: 'MFontB';
  justify-content: center;
  margin: 20px 10px 20px 10px;
  color: var(--TextColor);
}

.MPromptChooseBoxYesBTN,
.MPromptChooseBoxNoBTN {
  min-width: 50px;
  justify-content: center;
}

.MPromptChooseBoxNoBTN {
  background-color: red;
}

.MPromptChooseBoxNoBTN:hover {
  background-color: rgba(255, 0, 0, 0.2);
  color: red;
}

#MPromptLoading {
  z-index: 400;
}

.MPromptLoader {
  width: 35px;
  height: 35px;
  border: 5px solid var(--MPromptsLoading);
  border-top-color: var(--PrimaryColor);
  border-radius: 50%;
  animation: MPromptLoadingSpin 1s linear infinite;
  margin: 15px 0;
}

.MPromptLoadingText {
  display: flex;
  font-family: MFontB;
  color: var(--TextColor);
  margin: 10px 5px;
  width: 100%;
  font-size: 16px;
  justify-content: center;
}

.MPromptsActive {
  display: flex;
}

.MPromptsActive .MPromptsWrapper {
  animation: ShowModal 0.25s ease;
}

.MPromptsLeaving .MPromptsWrapper {
  animation: HideModal 0.25s ease;
}

@keyframes ShowPrompt {
  0% {
    opacity: 0;
    transform: scale(0.8, 0.8);
  }

  65.5% {
    transform: scale(1.03, 1.03);
  }

  100% {
    opacity: 1;
    transform: scale(1, 1);
  }
}

@keyframes HidePrompt {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1, 1);
  }

  100% {
    opacity: 0;
    transform: translateY(35px) scale(0.97, 0.97);
  }
}

@keyframes MPromptLoadingSpin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
