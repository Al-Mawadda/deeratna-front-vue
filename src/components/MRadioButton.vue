<template>
  <div class="MRadioButton" :id="Name">
    <label v-for="(item, i) in Items" :key="i" class="MRadioButtonItem">
      <input type="radio" :name="Name" />
      <div class="MRadioButtonRadio">
        <div class="MRadioButtonRadioCircle"></div>
      </div>
      <div class="MRadioButtonText">{{ item }}</div>
    </label>
  </div>
</template>

<script>
var IsDisabled = false;

export default {
  props: {
    Name: { type: String, required: true },
    Items: { type: Array, required: true },
    Disabled: { type: Boolean, default: false },
  },
  watch: {
    Disabled: {
      handler(newValue) {
        IsDisabled = newValue;
        this.EnableDisable();
      },
      deep: true,
    },
  },
  mounted() {
    IsDisabled = this.Disabled;
    this.EnableDisable();
  },
  methods: {
    Get() {
      var Element = document.getElementById(this.Name).querySelector('input:checked');
      return Element.closest('.MRadioButtonItem').querySelector('.MRadioButtonText').innerHTML;
    },
    Set(TheValue) {
      var Element = document.getElementById(this.Name).querySelectorAll('.MRadioButtonItem');

      Element.forEach(function (e) {
        if (TheValue == e.querySelector('.MRadioButtonText').innerHTML) {
          e.querySelector('input').checked = true;
        }
      });
    },
    Disable(Radio = null) {
      if (Radio == null) {
        IsDisabled = true;
        this.EnableDisable();
      } else {
        document.getElementById(this.Name).querySelector('.MRadioButtonItem:nth-child(' + Radio + ') input').setAttribute('disabled', true);
      }
    },
    Enable(Radio = null) {
      if (Radio == null) {
        IsDisabled = false;
        this.EnableDisable();
      } else {
        document.getElementById(this.Name).querySelector('.MRadioButtonItem:nth-child(' + Radio + ') input').removeAttribute('disabled');
      }
    },
    EnableDisable() {
      var Element = document.getElementById(this.Name);
      Element.querySelectorAll('input').forEach(function (e) {
        if (IsDisabled == true) {
          e.setAttribute('disabled', true)
        } else {
          e.removeAttribute('disabled')
        }
      });
    },
  }
}
</script>

<style>
/* Light Mode Colors */
:root {
  --MRadioButtonShadow: rgba(25, 118, 210, 0.4);
  --MRadioButtonSelected: rgba(0, 0, 0, 1);
  --MRadioButtonNonSelected: rgba(0, 0, 0, 0.6);
  --MRadioButtonDisabled: #777;
}

/* Dark Mode Colors */
.DarkMode {
  --MRadioButtonShadow: rgba(25, 118, 210, 0.4);
  --MRadioButtonSelected: rgba(255, 255, 255, 1);
  --MRadioButtonNonSelected: rgba(255, 255, 255, 0.6);
  --MRadioButtonDisabled: #aaa;
}

.MRadioButton {
  display: flex;
  user-select: none;
}

.MRadioButtonItem {
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  margin: 5px;
}

.MRadioButtonItem input {
  display: none;
}

.MRadioButtonRadio {
  display: flex;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-left: 10px;
  border: 1px solid var(--MRadioButtonNonSelected);
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0px 0px 0px 3px transparent;
  transition-duration: 0.3s;
}

.MRadioButtonRadioCircle {
  display: flex;
  width: 0;
  height: 0;
  border-radius: 50%;
  transition-duration: 0.3s;
  background-color: var(--PrimaryColor);
}

.MRadioButtonText {
  display: flex;
  transition: 0.3s;
  font-family: 'MFontR';
  color: var(--MRadioButtonNonSelected);
}

/* On Check */
.MRadioButtonItem input:checked~.MRadioButtonRadio .MRadioButtonRadioCircle {
  animation: MRadioButtonSelectCircle 0.5s ease-in-out 1 forwards;
}

.MRadioButtonItem input:checked~.MRadioButtonRadio {
  animation: MRadioButtonSelectBorder 0.5s ease-in-out 1 forwards;
}

/* On Hover */
.MRadioButtonItem:hover .MRadioButtonText {
  color: var(--PrimaryColor);
}

.MRadioButtonItem:hover .MRadioButtonRadio {
  border-color: var(--PrimaryColor);
}

/* On Check Not Hover */
.MRadioButtonItem:not(:hover) input:checked~.MRadioButtonRadio {
  border-color: var(--MRadioButtonSelected);
}

.MRadioButtonItem:not(:hover) input:checked~.MRadioButtonText {
  color: var(--MRadioButtonSelected);
}

/* On Disabling */
.MRadioButtonItem:has(input:disabled) {
  cursor: default !important;
}

.MRadioButtonItem input:disabled~.MRadioButtonRadio {
  border-color: var(--MRadioButtonDisabled) !important;
  border-style: dashed;
}

.MRadioButtonItem input:disabled~.MRadioButtonRadio .MRadioButtonRadioCircle {
  background-color: var(--MRadioButtonDisabled) !important;
}

.MRadioButtonItem input:disabled~.MRadioButtonText {
  color: var(--MRadioButtonDisabled) !important;
}

@keyframes MRadioButtonSelectCircle {
  0% {
    width: 0;
    height: 0;
  }

  40% {
    width: 10px;
    height: 10px;
  }

  65% {
    width: 6px;
    height: 6px;
  }

  100% {
    width: 8px;
    height: 8px;
  }
}

@keyframes MRadioButtonSelectBorder {
  0% {
    box-shadow: 0px 0px 0px 3px transparent;

  }

  65% {
    box-shadow: 0px 0px 0px 3px var(--MRadioButtonShadow);
  }

  100% {
    box-shadow: 0px 0px 0px 3px transparent;
  }
}
</style>
