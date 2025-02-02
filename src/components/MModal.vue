<template>
  <div class="MModal" :id="Name">
    <div class="MModalBackground"></div>
    <div class="MModalWrapper">
      <div class="MModalHeader">
        <div class="MModalTitle">{{ Title }}</div>
        <div class="MModalCloseBTN">
          <svg viewBox="0 0 100 100">
            <polygon points="85.179,16.589 83.411,14.821 50,48.232 16.589,14.821 14.821,16.589 48.232,50 14.821,83.411 16.589,85.179
              50,51.767 83.411,85.179 85.179,83.411 51.768,50 " />
            <path d="M89.421,16.59l-6.01-6.011L50,43.99L16.59,10.579l-6.011,6.011L43.99,50L10.579,83.411l6.011,6.01L50,56.01l33.411,33.411
              l6.01-6.01L56.01,50L89.421,16.59z" />
          </svg>
        </div>
      </div>
      <div class="MModalContent">
        <div class="MModalContentWrapper">
          <slot></slot>
        </div>
      </div>
      <div class="MModalFooter"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    Name: { type: String, required: true },
    Title: { type: String, required: true },
  },
  data() {
    return {
      Element: null,
    };
  },
  mounted() {
    this.Element = document.getElementById(this.Name);

    this.Element.querySelector('.MModalCloseBTN').addEventListener('click', function () {
      this.Hide()
    }.bind(this));
  },
  methods: {
    Show() {
      this.Element.classList.add('MModalActive');
    },
    Hide() {
      this.Element.classList.add('MModalLeaving');
      setTimeout(function () {
        this.Element.classList.remove('MModalActive');
        this.Element.classList.remove('MModalLeaving');
      }.bind(this), 230);
    }
  }
}

</script>

<style>
/* Light Mode Colors */
:root {
  --MCheckBoxLabelHover: rgba(0, 0, 0, 0.1);
  --MCheckBoxLabelDisabledBG: rgba(0, 0, 0, 0.1);
  --MCheckBoxLabelDisabledBorder: rgba(0, 0, 0, 0.2);
  --MCheckBoxLabelDisabledText: rgba(0, 0, 0, 0.6);
  --MCheckBoxLabelDisabledBGChecked: rgba(0, 0, 0, 0.3);
}

/* Dark Mode Colors */
.DarkMode {
  --MCheckBoxLabelHover: rgba(255, 255, 255, 0.1);
  --MCheckBoxLabelDisabledBG: rgba(255, 255, 255, 0.1);
  --MCheckBoxLabelDisabledBorder: rgba(255, 255, 255, 0.2);
  --MCheckBoxLabelDisabledText: rgba(255, 255, 255, 0.5);
  --MCheckBoxLabelDisabledBGChecked: rgba(255, 255, 255, 0.5);
}

.MModal {
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

.MModalBackground {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.MModalWrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 2;
  background-color: var(--BGColor);
  min-width: 300px;
  max-width: 80vw;
  min-height: 170px;
  max-height: 80vh;
  border-radius: 5px;
  flex-wrap: wrap;
}

.MModalHeader {
  display: flex;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px 5px 0 0;
  justify-content: center;
  position: relative;
}

.MModalTitle {
  font-family: 'MFontB';
  font-size: 15px;
  color: var(--TextColor);
  padding: 7px 0 10px 0;
}

.MModalCloseBTN {
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

.MModalCloseBTN svg {
  display: flex;
  width: 17px;
  fill: var(--TextColor);
  transition-duration: 0.3s;
}

.MModalCloseBTN:hover svg {
  fill: var(--PrimaryColor);

}

.MModalContent {
  display: flex;
  width: 100%;
  padding: 5px;
  max-height: calc(80vh - 60px);
  overflow-y: auto;
}

.MModalContentWrapper {
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}

.MModalFooter {
  display: flex;
  height: 10px;
  width: 100%;
}

.MModalActive {
  display: flex;
}

.MModalActive .MModalWrapper {
  animation: ShowModal 0.25s ease;
}

.MModalLeaving .MModalWrapper {
  animation: HideModal 0.25s ease;
}

@keyframes ShowModal {
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

@keyframes HideModal {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1, 1);
  }
  100% {
    opacity: 0;
    transform: translateY(35px) scale(0.97, 0.97);
  }
}
</style>
