<template>
  <div class="MDate" :id="Name">
    <input autocomplete="false" DateType="Day" maxlength="2" type="tel" required>
    <div class="MDateSeperator">/</div>
    <input autocomplete="false" DateType="Month" maxlength="2" type="tel" required>
    <div class="MDateSeperator">/</div>
    <input autocomplete="false" DateType="Year" maxlength="4" type="tel" required>
    <label>{{ Label }}</label>
    <div class="MDateBG"></div>
  </div>
</template>

<script>
var IsVisible;
var IsDisabled;

export default {
  props: {
    Name: { type: String, required: true },
    Label: { type: String, required: true },
    Visible: { type: Boolean, default: true },
    Disabled: { type: Boolean, default: false },
  },
  watch: {
    Disabled: {
      handler(newValue) {
        var Element = document.getElementById(this.Name);
        IsDisabled = newValue;

        Element.querySelectorAll('input').forEach(function (e) {
          if (IsDisabled == true) {
            e.setAttribute('disabled', true)
          } else {
            e.removeAttribute('disabled')
          }
        });
      },
      deep: true,
    },
    Visible: {
      handler(newValue) {
        var Element = document.getElementById(this.Name);
        IsVisible = newValue;

        if (IsVisible == true) {
          Element.style.display = 'flex';
        } else {
          Element.style.display = 'none';
        }
      },
      deep: true,
    },
  },
  mounted() {
    var Element = document.getElementById(this.Name);
    IsVisible = this.Visible;
    IsDisabled = this.Disabled;

    if (IsVisible == true) {
      Element.style.display = '';
    } else {
      Element.style.display = 'none';
    }

    Element.querySelectorAll('input').forEach(function (e) {
      e.addEventListener('focus', function () {
        Element.querySelectorAll('.MDateSeperator').forEach(function (i) {
          i.style.display = 'flex';
        });
      });
      e.addEventListener('blur', function () {
        var Inputs = 0;
        Element.querySelectorAll('input').forEach(function (i) {
          if (i.value != '') {
            Inputs++;
          }
        });
        if (Inputs == 0) {
          Element.querySelectorAll('.MDateSeperator').forEach(function (i) {
            i.style.display = 'none';
          });
        }

      });
      e.addEventListener('keypress', function (event) {
        var keyCode = event.which ? event.which : event.keyCode
        if (!(keyCode >= 48 && keyCode <= 57)) {
          event.preventDefault();
        }
      });
      e.addEventListener('paste', function (event) {
        event.preventDefault();
      });
      e.addEventListener('change', function (event) {
        var DaysOfMonth = new Date(Element.querySelector('input[DateType=Year]').value, Element.querySelector('input[DateType=Month]').value, 0).getDate();
        if (event.target.getAttribute('DateType') == 'Day') {
          if (event.target.value < 1 && event.target.value != '') {
            event.target.value = '1';
          }
        }
        if (event.target.getAttribute('DateType') == 'Month') {
          if (event.target.value < 1 && event.target.value != '') {
            event.target.value = '1';
          } else if (event.target.value > 12 && event.target.value != '') {
            event.target.value = '12';
          }
        }
        if (event.target.getAttribute('DateType') == 'Year') {
          if (event.target.value < 1 && event.target.value != '') {
            event.target.value = '1';
          }
        }
        if (Element.querySelector('input[DateType=Day]').value > DaysOfMonth) {
          Element.querySelector('input[DateType=Day]').value = DaysOfMonth;
        }
      });

      if (IsDisabled == true) {
        e.setAttribute('disabled', true)
      } else {
        e.removeAttribute('disabled')
      }
    });
  },
  methods: {
    Get() {
      var Element = document.getElementById(this.Name);
      if (Element.querySelector('input[DateType=Day]').value == '' && Element.querySelector('input[DateType=Month]').value == '' && Element.querySelector('input[DateType=Year]').value == '') {
        return '';
      } else {
        return Element.querySelector('input[DateType=Year]').value + '-' + Element.querySelector('input[DateType=Month]').value + '-' + Element.querySelector('input[DateType=Day]').value;
      }
    },
    Set(TheValue) {
      var Element = document.getElementById(this.Name);
      var Separator;
      if (TheValue.includes('/')) {
        Separator = '/';
      } else {
        Separator = '-';
      }
      var TheMDate = TheValue.split(Separator);

      Element.querySelector('input[DateType="Day"]').value = TheMDate[2];
      Element.querySelector('input[DateType="Month"]').value = TheMDate[1];
      Element.querySelector('input[DateType="Year"]').value = TheMDate[0];
      Element.querySelectorAll('.MDateSeperator').forEach(function (i) {
        i.style.display = 'flex';
      });
    },
    Clear() {
      var Element = document.getElementById(this.Name);
      Element.querySelectorAll('input').forEach(function (e) {
        e.value = '';
      });
      Element.querySelectorAll('.MDateSeperator').forEach(function (i) {
        i.style.display = 'none';
      });
    },
    Disable() {
      var Element = document.getElementById(this.Name);
      IsDisabled = true;
      Element.querySelectorAll('input').forEach(function (e) {
        if (IsDisabled == true) {
          e.setAttribute('disabled', true)
        } else {
          e.removeAttribute('disabled')
        }
      });
    },
    Enable() {
      var Element = document.getElementById(this.Name);
      IsDisabled = false;
      Element.querySelectorAll('input').forEach(function (e) {
        if (IsDisabled == true) {
          e.setAttribute('disabled', true)
        } else {
          e.removeAttribute('disabled')
        }
      });
    },
    Show() {
      var Element = document.getElementById(this.Name);
      IsVisible = true;
      if (IsVisible == true) {
        Element.style.display = 'flex';
      } else {
        Element.style.display = 'none';
      }
    },
    Hide() {
      var Element = document.getElementById(this.Name);
      IsVisible = false;
      if (IsVisible == true) {
        Element.style.display = 'flex';
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
  --MDateBG: #fff;
  --LabelColor: rgba(0, 0, 0, 0.6);
  --MDateBorder: rgba(0, 0, 0, 0.6);
  --Disabledd: #666;
}

/* Dark Mode Colors */
.DarkMode {
  --MDateBG: #2f3349;
  --LabelColor: rgba(255, 255, 255, 0.6);
  --MDateBorder: rgba(255, 255, 255, 0.6);
  --Disabledd: #aaa;
}

.MDate {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  transition-duration: 0.3s;
  z-index: 1;
  align-items: center;
  font-size: 16px;
  font-family: 'MFontR';
  margin: 15px 5px;
  min-height: 35px;
  flex: 1;
  min-width: 150px;
}

.MDate label {
  display: flex;
  width: min-content;
  position: absolute;
  pointer-events: none;
  top: 7px;
  right: 5px;
  font-family: 'MFontR';
  font-size: 14px;
  color: var(--LabelColor);
  transition-duration: 0.3s;
  padding: 0 3px;
  z-index: 5;
  white-space: nowrap;
}

.MDate label::before {
  content: '';
  position: absolute;
  height: 3px;
  width: 100%;
  bottom: 3px;
  right: 0;
  background-color: var(--MDateBG);
  z-index: -1;
  transition-duration: 0.3s;
}

.MDate input,
.MDate textarea {
  margin: 6px 8px;
  display: flex;
  width: 100%;
  padding: 0;
  background-color: rgba(0, 0, 0, 0);
  border: 0;
  outline: 0;
  font-family: 'MFontR';
  font-size: 15px;
  color: var(--TextColor);
}

.MDateBG {
  display: flex;
  width: calc(100% - 4px);
  height: 100%;
  border-radius: 5px;
  background-color: var(--MDateBG);
  border: 1px solid var(--MDateBorder);
  position: absolute;
  top: 0;
  right: 0;
  z-index: -1;
  transition-duration: 0.3s;
}

.MDateSeperator {
  display: none;
  color: var(--TextColor);
}

.MDate input:focus~.MDateBG,
.MDate textarea:focus~.MDateBG {
  border: 1px solid var(--PrimaryColor);
}

.MDate input:valid:not(:focus)~.MDateBG,
.MDate textarea:valid:not(:focus)~.MDateBG {
  border: 1px solid var(--TextColor);
}

.MDate input:focus~label,
.MDate textarea:focus~label {
  color: var(--PrimaryColor);
  top: -13px;
  font-size: 13px;
  font-family: 'MFontR';
}

.MDate input:valid:not(:focus)~label,
.MDate textarea:valid:not(:focus)~label {
  color: var(--TextColor);
  top: -13px;
  font-size: 13px;
  font-family: 'MFontR';
}

.MDate input:read-only,
.MDate textarea:read-only {
  color: var(--Disabledd);
  cursor: default;
  line-height: 0.5;

}

.MDate input:read-only~.MDateBG {
  border: 1px dashed var(--Disabledd);
}

.MDate input:read-only~label {
  color: var(--Disabledd);
  top: -13px;
  font-size: 13px;
  font-family: 'MFontR';
}

.MDate input:read-only~.MDateSeperator {
  color: var(--Disabledd);
}

.MDate input[DateType="Day"],
.MDate input[DateType="Month"] {
  width: 20%;
  max-width: 30px;
  margin: 5px;
  text-align: center;
}

.MDate input[DateType="Year"] {
  flex: 1;
  margin: 5px;
  text-align: right;
}
</style>
