<template>
  <div class="MTime" :id="Name">
    <div class="MTimeValues" v-OnlyNumbers>
      <input class="MTimeInput" autocomplete="false" TimeType="Minutes" maxlength="2" type="tel" required>
      <div class="MTimeInputSeperator">:</div>
      <input class="MTimeInput" autocomplete="false" TimeType="Hours" maxlength="2" type="tel" required>
      <input class="MTimeSuffix" maxlength="1" readonly required>
    </div>
    <label>{{ Label }}</label>
    <div class="MTimeClearBTN">
      <svg viewBox="0 0 1000 1000">
        <path d="M922.1,147.7c0.5,14.9-10.1,31.1-24.9,45.8C800.4,290,703.8,386.8,607.1,483.5c-16.5,16.5-16.5,16.5,0.5,33.4
		c97,97,194,194.1,291.1,291c17.4,17.3,27.2,36.8,22.7,61.9c-8.5,47.1-63.2,68.5-101.3,39.4c-5.5-4.2-10.5-9.3-15.4-14.2
		c-97.8-97.7-195.6-195.3-293-293.4c-9.4-9.5-14-9.2-23.2,0.1C389.7,701.1,290.3,800,191.3,899.3c-19.7,19.8-42.3,28.4-69.5,20
		c-41.1-12.7-57.5-63.1-32.2-97.9c4.1-5.6,9.2-10.6,14.1-15.5c97.3-97.4,194.7-194.8,292.1-292.2c13.8-13.8,13.8-13.8-0.5-28.1
		C297.3,387.5,199.3,289.3,101,191.4c-20.2-20.1-29.1-43-19.9-70.8c15-45.2,70.8-57.9,106.2-23.7c33.9,32.7,66.7,66.4,100,99.7
		c67.3,67.3,134.7,134.4,201.6,202c8.7,8.8,13.2,9.2,22.1,0.2c98.9-99.4,198.4-198.2,297.5-297.4c13.6-13.7,28.8-23,48.6-23.3
		C893.3,77.6,921.6,104.9,922.1,147.7z" />
      </svg>
    </div>
    <div class="MTimeBG"></div>
  </div>
</template>

<script>
export default {
  props: {
    Name: { type: String, required: true },
    Label: { type: String, required: true },
    Disabled: { type: Boolean, default: false },
    Range: { type: Boolean, default: false },
    Clearable: { type: Boolean, default: false },
  },
  data() {
    return {
      Element: null,
      SelectedTime: '',
      IsDisabled: null,
    };
  },
  watch: {
    Disabled: {
      handler(newValue) {
        this.IsDisabled = newValue;
        this.EnableDisable();
      },
      deep: true,
    },
  },
  mounted() {
    this.Element = document.getElementById(this.Name);
    this.IsDisabled = this.Disabled;
    let Instance = this;

    this.Element.querySelectorAll('.MTimeInput').forEach(function (e) {
      e.addEventListener('focus', function () {
        Instance.Element.setAttribute('focus', true);
      });
      e.addEventListener('blur', function () {
        Instance.Element.removeAttribute('focus');
      });
      e.addEventListener('input', function (event) {
        var keyCode = event.which ? event.which : event.keyCode
        if (!(keyCode >= 48 && keyCode <= 57)) {
          event.preventDefault();
        }
        if (event.target.getAttribute('TimeType') == 'Hours') {
          if (Instance.Element.querySelector('.MTimeInput[TimeType=Minutes]').value == '') {
            Instance.Element.querySelector('.MTimeInput[TimeType=Minutes]').value = '00';
          }
        }
        if (event.target.getAttribute('TimeType') == 'Minutes') {
          if (Instance.Element.querySelector('.MTimeInput[TimeType=Hours]').value == '') {
            Instance.Element.querySelector('.MTimeInput[TimeType=Hours]').value = '12';
          }
        }
        if (Instance.Element.querySelector('.MTimeSuffix').value == '') {
          Instance.Element.querySelector('.MTimeSuffix').value = 'ص';
        }

        Instance.ShowHideClearBTN();
        Instance.InputValidate();
      });
      e.addEventListener('paste', function (event) {
        event.preventDefault();
      });
      e.addEventListener('change', function (event) {
        if (event.target.value.length === 1) {
          event.target.value = event.target.value.padStart(2, '0');
        }
        if (event.target.getAttribute('TimeType') == 'Hours') {
          if (event.target.value == '') {
            event.target.value = '12';
          }
          if (parseInt(event.target.value) < 1) {
            event.target.value = '01';
          }
          if (parseInt(event.target.value) > 12) {
            event.target.value = '12';
          }
        }
        if (event.target.getAttribute('TimeType') == 'Minutes') {
          if (event.target.value == '') {
            event.target.value = '00';
          }
          if (parseInt(event.target.value) < 0) {
            event.target.value = '00';
          }
          if (parseInt(event.target.value) > 60) {
            event.target.value = '60';
          }
        }
        const MTimeValueChange = new CustomEvent('MTimeValueChange');
        Instance.Element.dispatchEvent(MTimeValueChange);
      });
    }.bind(this));

    this.Element.querySelector('.MTimeSuffix').addEventListener('click', function () {
      if (Instance.Element.querySelector('.MTimeSuffix').value == 'ص') {
        Instance.Element.querySelector('.MTimeSuffix').value = 'م';
      } else {
        Instance.Element.querySelector('.MTimeSuffix').value = 'ص';
      }
      if (Instance.Element.querySelector('.MTimeSuffix').value != '') {
        Instance.Element.setAttribute('valid', true);
      } else {
        Instance.Element.removeAttribute('valid');
      }
      if (Instance.Element.querySelector('.MTimeInput[TimeType=Hours]').value == '') {
        Instance.Element.querySelector('.MTimeInput[TimeType=Hours]').value = '12';
      }
      if (Instance.Element.querySelector('.MTimeInput[TimeType=Minutes]').value == '') {
        Instance.Element.querySelector('.MTimeInput[TimeType=Minutes]').value = '00';
      }
      Instance.ShowHideClearBTN();
      const MTimeValueChange = new CustomEvent('MTimeValueChange');
      Instance.Element.dispatchEvent(MTimeValueChange);
    });

    this.Element.querySelector('.MTimeClearBTN').addEventListener('click', function () {
      this.Clear();
    }.bind(this));

    this.ShowHideClearBTN();
    this.EnableDisable();
  },
  methods: {
    Get() {
      let Hours = this.Element.querySelector('.MTimeInput[TimeType=Hours]').value;
      let Minutes = this.Element.querySelector('.MTimeInput[TimeType=Minutes]').value;
      let Suffix = this.Element.querySelector('.MTimeSuffix').value;

      if (Hours != '' && Minutes != '' && Suffix != '') {
        if (Suffix == 'م' && parseInt(Hours) < 12) {
          Hours = (parseInt(Hours) + 12).toString()
        } else if (Suffix == 'ص' && parseInt(Hours) == 12) {
          Hours = '00';
        }

        this.SelectedTime = Hours + ':' + Minutes;
        return this.SelectedTime;
      } else {
        return '';
      }
    },
    Set(TheValue) {
      let Hours = '';
      let Minutes = '';
      let Suffix = '';

      const time24Regex = /^([01]?\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/;
      const time12Regex = /^(0?[1-9]|1[0-2]):([0-5]\d)(?::[0-5]\d)?\s?(ص|م)$/i;

      if (time24Regex.test(TheValue)) {
        const [h, m] = TheValue.split(':').map(Number);
        const hour12 = h % 12 || 12;
        Hours = hour12.toString().padStart(2, '0');
        Minutes = m.toString().padStart(2, '0');
        Suffix = h >= 12 ? 'م' : 'ص';
      }
      if (time12Regex.test(TheValue)) {
        const match = TheValue.match(time12Regex);
        const h = match[1];
        const m = match[2];
        const s = match[3];

        Hours = h.padStart(2, '0');
        Minutes = m.padStart(2, '0');
        Suffix = s;
      }

      this.Element.querySelector('.MTimeInput[TimeType=Minutes]').value = Minutes;
      this.Element.querySelector('.MTimeInput[TimeType=Hours]').value = Hours;
      this.Element.querySelector('.MTimeSuffix').value = Suffix;
      this.InputValidate();
      this.ShowHideClearBTN();
      const MTimeValueChange = new CustomEvent('MTimeValueChange');
      this.Element.dispatchEvent(MTimeValueChange);
    },
    Clear() {
      let Instance = this;
      Instance.SelectedDates = '';
      Instance.Element.querySelectorAll('input').forEach(function (e) {
        e.value = '';
      });
      Instance.Element.removeAttribute('valid');
      Instance.ShowHideClearBTN();
      const MTimeValueChange = new CustomEvent('MTimeValueChange');
      Instance.Element.dispatchEvent(MTimeValueChange);
    },
    Disable() {
      this.IsDisabled = true;
      this.EnableDisable();
    },
    Enable() {
      this.IsDisabled = false;
      this.EnableDisable();
    },
    EnableDisable() {
      let Instance = this;

      this.Element.querySelectorAll('input').forEach(function (e) {
        if (this.IsDisabled == true) {
          e.setAttribute('disabled', true);
        } else {
          e.removeAttribute('disabled')
        }
      }.bind(this));

      if (this.IsDisabled == true) {
        this.Element.setAttribute('disabled', true);
      } else {
        this.Element.removeAttribute('disabled');
      }

      Instance.ShowHideClearBTN()
    },
    InputValidate() {
      var FilledInputs = 0;
      this.Element.querySelectorAll('.MTimeInput').forEach(function (e) {
        if (e.value) {
          FilledInputs++;
        }
      }.bind(this));
      if (this.Element.querySelector('.MTimeSuffix').value != '') {
        FilledInputs++;
      }
      if (FilledInputs > 0) {
        this.Element.setAttribute('valid', true);
      } else {
        this.Element.removeAttribute('valid');
      }
    },
    ShowHideClearBTN() {
      let Instance = this;
      if (Instance.IsDisabled != true && Instance.Clearable == true) {
        let Hours = Instance.Element.querySelector('.MTimeInput[TimeType=Hours]').value;
        let Minutes = Instance.Element.querySelector('.MTimeInput[TimeType=Minutes]').value;

        if (Hours != '' || Minutes != '') {
          Instance.Element.querySelector('.MTimeClearBTN').style.opacity = 1;
          Instance.Element.querySelector('.MTimeClearBTN').style.pointerEvents = '';
        } else {
          Instance.Element.querySelector('.MTimeClearBTN').style.opacity = 0;
          Instance.Element.querySelector('.MTimeClearBTN').style.pointerEvents = 'none';
        }
      } else {
        Instance.Element.querySelector('.MTimeClearBTN').style.opacity = 0;
        Instance.Element.querySelector('.MTimeClearBTN').style.pointerEvents = 'none';
      }
    }
  }
}
</script>

<style>
/* Light Mode Colors */
:root {
  --MTimeBG: #fff;
  --MTimeLabelColor: rgba(0, 0, 0, 0.6);
  --MTimeBorder: rgba(0, 0, 0, 0.6);
  --MTimeDisabled: #666;
  --MTimePickerBG: #fff;
  --MTimeSVG: #666;
  --MTimePickerBTNColor: #fff;
  --MTimePickerBTNHover: rgba(25, 118, 210, 0.2);
  --MTimePickerShadow: rgba(0, 0, 0, 0.1);
  --MTimePickerSVG: rgba(0, 0, 0, 0.3);
  --MTimePickerSVGHover: rgba(0, 0, 0, 1);
  --MTimePickerFullDateBG: rgba(255, 255, 255, 0.15);
  --MTimePickerFullDateHover: rgba(255, 255, 255, 0.3);
  --MTimePickerDaysNameColor: #666;
  --MTimePickerRangeShadow: rgba(25, 118, 210, 0.2);
  --MTimePickerDayHover: rgba(25, 118, 210, 0.2);
  --MTimePickerDayShadow: rgba(25, 118, 210, 0.7);
}

/* Dark Mode Colors */
.DarkMode {
  --MTimeBG: #2f3349;
  --MTimeLabelColor: rgba(255, 255, 255, 0.6);
  --MTimeBorder: rgba(255, 255, 255, 0.6);
  --MTimeDisabled: #aaa;
  --MTimePickerBG: #2f3349;
  --MTimeSVG: #aaa;
  --MTimePickerBTNColor: #fff;
  --MTimePickerBTNHover: rgba(25, 118, 210, 0.2);
  --MTimePickerShadow: rgba(0, 0, 0, 0.1);
  --MTimePickerSVG: rgba(255, 255, 255, 0.3);
  --MTimePickerSVGHover: rgba(255, 255, 255, 1);
  --MTimePickerFullDateBG: rgba(255, 255, 255, 0.15);
  --MTimePickerFullDateHover: rgba(255, 255, 255, 0.3);
  --MTimePickerDaysNameColor: #999;
  --MTimePickerRangeShadow: rgba(25, 118, 210, 0.2);
  --MTimePickerDayHover: rgba(25, 118, 210, 0.2);
  --MTimePickerDayShadow: rgba(25, 118, 210, 0.7);
}

.MTime {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  transition-duration: 0.3s;
  align-items: center;
  font-size: 16px;
  font-family: 'MFontR';
  margin: 15px 5px;
  min-height: 35px;
  flex: 1;
  min-width: min-content;
  box-sizing: border-box;
  flex-wrap: nowrap;
  padding: 5px;
  justify-content: space-between;
  max-height: min-content;
}

.MTimeValues {
  display: flex;
  min-width: min-content;
  align-items: center;
}

.MTime label {
  display: flex;
  width: min-content;
  position: absolute;
  pointer-events: none;
  top: 7px;
  right: 5px;
  font-family: 'MFontR';
  font-size: 14px;
  color: var(--MTimeLabelColor);
  transition-duration: 0.3s;
  padding: 0 3px;
  z-index: 5;
  white-space: nowrap;
}

.MTime label::before {
  content: '';
  position: absolute;
  height: 3px;
  width: 100%;
  bottom: 3px;
  right: 0;
  background-color: var(--MTimeBG);
  z-index: -1;
  transition-duration: 0.3s;
  pointer-events: none;
}

.MTimeInput {
  display: flex;
  width: 25px;
  height: 25px;
  padding: 0;
  background-color: transparent;
  border: 0;
  outline: 0;
  font-family: 'MFontR';
  font-size: 15px;
  z-index: 5;
  color: var(--TextColor);
  text-align: center;
  border-radius: 4px;
}

.MTimeSuffix {
  display: flex;
  width: 23px;
  height: 23px;
  color: var(--TextColor);
  z-index: 5;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: transparent;
  border: 0;
  outline: 0;
  user-select: none;
  text-align: center;
  font-family: MFontR;
  vertical-align: middle;
  cursor: pointer;
  margin-right: 7px;
}

.MTimeBG {
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: var(--MTimeBG);
  border: 1px solid var(--MTimeBorder);
  position: absolute;
  top: 0;
  right: 0;
  transition-duration: 0.3s;
  box-sizing: border-box;
}

.MTimeInputSeperator {
  display: flex;
  opacity: 0;
  color: var(--TextColor);
  justify-content: center;
  z-index: 5;
  font-size: 20px;
  padding: 0 2px;
  align-items: flex-start;
  line-height: 0.5px;
}

.MTime[focus] .MTimeSeperator,
.MTime[focus] .MTimeInputSeperator {
  opacity: 1;
}

.MTime[focus] .MTimeInput,
.MTime[focus] .MTimeSuffix {
  background-color: rgba(255, 255, 255, 0.1);
}

.MTime[valid] .MTimeInput,
.MTime[valid] .MTimeSuffix {
  background-color: rgba(255, 255, 255, 0.1);
}

.MTime[valid] .MTimeSeperator,
.MTime[valid] .MTimeInputSeperator {
  opacity: 1;
}

.MTime[focus] .MTimeBG {
  border: 1px solid var(--PrimaryColor);
}

.MTime[valid]:not([focus]) .MTimeBG {
  border: 1px solid var(--TextColor);
}

.MTime[focus] label {
  color: var(--PrimaryColor);
  top: -13px;
  font-size: 13px;
  font-family: 'MFontR';
}

.MTime[valid]:not([focus]) label {
  color: var(--TextColor);
  top: -13px;
  font-size: 13px;
  font-family: 'MFontR';
}

.MTime[disabled] .MTimeInput {
  color: var(--MTimeDisabled);
  cursor: default;
  line-height: 0.5;
}

.MTime[disabled] .MTimeSuffix {
  color: var(--MTimeDisabled);
  cursor: default;
  line-height: 0.5;
}

.MTime[disabled] .MTimeBG {
  border: 1px dashed var(--MTimeDisabled) !important;
}

.MTime[disabled] label {
  color: var(--MTimeDisabled) !important;
  top: -13px;
  font-size: 13px;
  font-family: 'MFontR';
}

.MTime[disabled] .MTimeInputSeperator {
  color: var(--MTimeDisabled);
}

.MTimeClearBTN {
  display: flex;
  left: 40px;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  min-width: 20px;
  max-width: 20px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0;
  z-index: 5;
}

.MTimeClearBTN svg {
  fill: var(--MTimeSVG);
  display: flex;
  width: 60%;
  height: 60%;
  transition-duration: 0.3s;
}

.MTimeClearBTN:hover svg {
  fill: var(--PrimaryColor);
}

.MTimePickerBTN {
  display: flex;
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  background-color: var(--PrimaryColor);
  border-radius: 5px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  transition-duration: 0.3s;
  padding-right: 1px;
  margin-right: 5px;
  z-index: 5;
}

.MTimePickerBTN svg {
  display: flex;
  width: 65%;
  height: 65%;
  fill: var(--MTimePickerBTNColor);
  transition-duration: 0.3s;
}

.MTimePickerBTN:hover {
  background-color: var(--MTimePickerBTNHover);
}

.MTimePickerBTN:hover svg {
  fill: var(--PrimaryColor);
}
</style>
