<template>
  <div class="MCheckBox" :id="Name">
    <input :id="Name + 'Input'" type="checkBox">
    <label :for="Name + 'Input'">
      <div class="MCheckBoxMarkBox">
        <div class="MCheckBoxMark"></div>
      </div>
      <div class="MCheckBoxText">{{ Label }}</div>
    </label>
  </div>
</template>

<script>
var IsVisible;
var IsDisabled;
var Value;

export default {
  props: {
    Name: { type: String, required: true },
    Label: { type: String, required: true },
    Visible: { type: Boolean, default: true },
    Disabled: { type: Boolean, default: false },
    Value: { type: Boolean, default: false },
  },
  watch: {
    Disabled: {
      handler(newValue) {
        IsDisabled = false;

        var Element = document.getElementById(this.Name);
        IsDisabled = newValue;

        if (IsDisabled == true) {
          Element.querySelector('input').setAttribute('disabled', true)
        } else {
          Element.querySelector('input').removeAttribute('disabled')
        }
      },
      deep: true,
    },
    Visible: {
      handler(newValue) {
        IsVisible = true;

        var Element = document.getElementById(this.Name);
        IsVisible = newValue;

        if (IsVisible == true) {
          Element.querySelector('input').setAttribute('disabled', true)
        } else {
          Element.querySelector('input').removeAttribute('disabled')
        }
      },
      deep: true,
    },
  },
  mounted() {
    var Element = document.getElementById(this.Name).querySelector('input');
    IsVisible = this.Visible;
    IsDisabled = this.Disabled;
    Value = this.Value;

    if (IsVisible == true) {
      Element.style.display = '';
    } else {
      Element.style.display = 'none';
    }

    if (IsDisabled == true) {
      Element.setAttribute('disabled', true)
    } else {
      Element.removeAttribute('disabled')
    }

    Element.checked = Value;
  },
  methods: {
    Get() {
      var Element = document.getElementById(this.Name).querySelector('input');
      return Element.checked;
    },
    Set(TheValue) {
      var Element = document.getElementById(this.Name).querySelector('input');
      Value = TheValue;
      Element.checked = Value;
    },
    Disable() {
      var Element = document.getElementById(this.Name).querySelector('input');
      IsDisabled = true;
      if (IsDisabled == true) {
        Element.setAttribute('disabled', true)
      } else {
        Element.removeAttribute('disabled')
      }
    },
    Enable() {
      var Element = document.getElementById(this.Name).querySelector('input');
      IsDisabled = false;
      if (IsDisabled == true) {
        Element.setAttribute('disabled', true)
      } else {
        Element.removeAttribute('disabled')
      }
    },
    Show() {
      var Element = document.getElementById(this.Name);
      IsVisible = true;
      if (IsVisible == true) {
        Element.style.display = '';
      } else {
        Element.style.display = 'none';
      }
    },
    Hide() {
      var Element = document.getElementById(this.Name);
      IsVisible = false;
      if (IsVisible == true) {
        Element.style.display = '';
      } else {
        Element.style.display = 'none';
      }
    }
  }
}
</script>

<style>
/* Light Mode Colors */
:root {
  --LabelHover: rgba(0, 0, 0, 0.1);
  --LabelDisabledBG: rgba(0, 0, 0, 0.1);
  --LabelDisabledBorder: rgba(0, 0, 0, 0.2);
  --LabelDisabledText: rgba(0, 0, 0, 0.6);
  --LabelDisabledBGChecked: rgba(0, 0, 0, 0.3);
}

/* Dark Mode Colors */
.DarkMode {
  --LabelHover: rgba(255, 255, 255, 0.1);
  --LabelDisabledBG: rgba(255, 255, 255, 0.1);
  --LabelDisabledBorder: rgba(255, 255, 255, 0.2);
  --LabelDisabledText: rgba(255, 255, 255, 0.5);
  --LabelDisabledBGChecked: rgba(255, 255, 255, 0.5);
}

.MCheckBox {
  user-select: none;
  width: min-content;
}

.MCheckBox input {
  display: none;
}

.MCheckBox label {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
}

.MCheckBox label .MCheckBoxMarkBox {
  Box-sizing: border-Box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  background: transparent;
  border: 1px solid var(--TextColor);
  border-radius: 2px;
  transition: 250ms cubic-bezier(.4, .0, .23, 1);
  position: relative;
}

.MCheckBox input:not(:disabled)+label .MCheckBoxMarkBox {
  background: var(--LabelHover);
}

.MCheckBox input:checked+label .MCheckBoxMarkBox {
  border: 9px solid var(--PrimaryColor);
}

.MCheckBox input:checked+label .MCheckBoxMark {
  position: absolute;
  top: -2.2px;
  left: -5.7px;
  border-right: 3px solid transparent;
  border-bottom: 3px solid transparent;
  transform: rotate(45deg);
  transform-origin: 0% 100%;
  animation: CheckAnimation 125ms 250ms cubic-bezier(.4, .0, .23, 1) forwards;
}

.MCheckBox .MCheckBoxText {
  font-family: 'MFontR';
  font-size: 15px;
  margin: 2px 10px;
  color: var(--TextColor);
}

.MCheckBox input:disabled {
  pointer-events: none;
}

.MCheckBox input:disabled+label {
  cursor: default;
}

.MCheckBox input:disabled+label .MCheckBoxText {
  color: var(--LabelDisabledText);
}

.MCheckBox input:disabled:not(:checked)+label .MCheckBoxMarkBox {
  background-color: var(--LabelDisabledBG);
  border-color: var(--LabelDisabledBorder);
}

.MCheckBox input:disabled:checked+label .MCheckBoxMarkBox {
  border-color: var(--LabelDisabledBGChecked);
}



@keyframes CheckAnimation {
  0% {
    width: 0;
    height: 0;
    border-color: #fff;
    transform: translate3d(0, 0, 0) rotate(45deg);
  }

  33% {
    width: 4px;
    height: 0;
    transform: translate3d(0, 0, 0) rotate(45deg);
  }

  100% {
    width: 4px;
    height: 8px;
    border-color: #fff;
    transform: translate3d(0, -8px, 0) rotate(45deg);
  }
}
</style>
