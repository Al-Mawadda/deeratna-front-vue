<template>
  <div class="MDate" :id="Name">
    <div class="MDateValues">
      <input class="MDateInput" autocomplete="false" DateType="Day" maxlength="2" type="tel" required>
      <div class="MDateInputSeperator">/</div>
      <input class="MDateInput" autocomplete="false" DateType="Month" maxlength="2" type="tel" required>
      <div class="MDateInputSeperator">/</div>
      <input class="MDateInput" autocomplete="false" DateType="Year" maxlength="4" type="tel" required>
    </div>
    <div class="MDateSeperator" v-show="Range == true">-</div>
    <div class="MDateValues" v-show="Range == true">
      <input class="MDateInput" autocomplete="false" DateType="Day" maxlength="2" type="tel" required>
      <div class="MDateInputSeperator">/</div>
      <input class="MDateInput" autocomplete="false" DateType="Month" maxlength="2" type="tel" required>
      <div class="MDateInputSeperator">/</div>
      <input class="MDateInput" autocomplete="false" DateType="Year" maxlength="4" type="tel" required>
    </div>
    <label>{{ Label }}</label>
    <div class="MDateClearBTN">
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
    <div class="MDatePickerBTN">
      <svg viewBox="0 0 1000 1000">
        <path d="M82.1,525.3c-0.9-55.6-0.1-111.3,2.9-166.8c2-37.4,0-75.2,9.6-111.9c18.6-71.2,85.3-122.7,159-123.1
	c12.2-0.1,24.3-0.3,36.5,0.1c6.9,0.2,9.3-2.5,9-9.2c-0.3-8.3-0.3-16.7,0-25c0.7-18.9,14.8-32.5,33.7-32.6
	c19-0.1,33.8,14.1,34.4,33.1c0.2,8.3,0.3,16.7,0,25c-0.2,6.2,2.2,8.9,8.5,8.6c9-0.3,18.1-0.1,27.1-0.1c72.3,0,144.7-0.2,217,0.2
	c10.8,0.1,14.4-3.2,13.2-13.6c-0.7-6.5-0.3-13.2-0.1-19.8c0.5-19.6,14.6-33.4,33.8-33.5c19-0.1,33.7,14.1,34.3,33.2
	c0.2,8,0.4,16,0,24c-0.4,7.3,2.5,9.6,9.7,9.7c23.6,0.4,47.2-1.8,70.6,3.8c75.6,18.1,127.1,83.7,130.8,161
	c5.4,110.8,7.2,221.7,5.3,332.6c-1,55.6-2.8,111.2-7.8,166.6c-6.7,75.1-72.9,140.8-147.9,147c-30.8,2.5-61.7,4.5-92.6,5.7
	c-92.8,3.7-185.6,4-278.5,1.8c-51-1.2-102.1-3-153-7.4c-74.4-6.4-141-73-147.3-147.7c-3.6-42.2-4.6-84.6-6.5-127
	C81.9,615,82.6,570.2,82.1,525.3z M501.2,392c-111.6,0-223.3,0.1-334.9-0.1c-8.5,0-13.9,1.2-14,11.5c-0.3,43.8-2.1,87.6-1.5,131.4
	c1.1,78.9,2.6,157.7,7.4,236.5c2.7,44.9,34.8,84.6,79,93c26.4,5,53.3,4.9,80,5.7c70.8,2.3,141.7,4.6,212.6,3.7
	c72.7-1,145.2-3.2,217.8-7c48.4-2.6,90.7-41.6,93.9-90c2.9-43.3,5.3-86.7,6.2-130.1c1.8-80,1.2-160,0.2-239.9
	c-0.2-14-0.8-14.6-14.9-14.6C722.4,392,611.8,392,501.2,392z M500,323.8c105.3,0,210.7,0,316,0c6.6,0,13.2-0.2,19.8,0
	c5.8,0.2,8.4-2.2,8-8c-0.6-9.7-1.2-19.4-1.8-29.1c-2.5-42.1-23.9-70.8-62.1-87.3c-23.4-10.1-48.4-7.4-73-7.5c-5.4,0-5.7,4.1-5.7,8.1
	c0,8.3,0.1,16.7-0.1,25c-0.5,19.4-14.8,33.4-33.9,33.5c-18.9,0-33.7-14.2-34.2-33.3c-0.2-8.3-0.3-16.7,0-25c0.2-6.4-2.6-8.5-8.7-8.5
	c-82.7,0.1-165.5,0.1-248.2,0c-7,0-9.1,2.9-8.9,9.4c0.3,8,0.2,16,0,24c-0.5,19.4-14.8,33.4-33.9,33.5c-18.9,0-33.7-14.2-34.2-33.3
	c-0.2-8.3-0.3-16.7,0-25c0.2-6.4-2.5-8.6-8.7-8.5c-10.8,0.3-21.6-0.2-32.3,0.2c-51.1,1.8-89.4,33.2-98.5,81.3
	c-2.2,11.9-2.5,24.2-3,36.3c-0.7,14.4-0.4,14.4,13.9,14.4C280.3,323.8,390.2,323.8,500,323.8z" />
        <path d="M282.4,540.6c0.2-28.5,22.5-50.1,51.6-49.9c28.6,0.2,50.2,22.5,49.9,51.6c-0.2,28.6-22.6,50.2-51.7,49.9
	C303.7,592.1,282.2,569.8,282.4,540.6z" />
        <path d="M449.3,540.4c0.2-28.4,22.7-50,51.9-49.7c28.5,0.3,50,22.7,49.7,51.8c-0.3,28.5-22.8,50-51.9,49.7
	C470.5,592,449.1,569.6,449.3,540.4z" />
        <path d="M616.3,540.8c0.1-28.6,22.5-50.2,51.5-50c28.7,0.2,50.2,22.4,50.1,51.5c-0.2,28.6-22.6,50.3-51.6,50.1
	C637.7,592.1,616.1,569.9,616.3,540.8z" />
        <path d="M332.9,657.7c29-0.1,51,21.7,51.1,50.5c0.1,28.9-21.8,51-50.5,51.1c-29,0.1-50.9-21.7-51-50.5
	C282.3,679.8,304.1,657.8,332.9,657.7z" />
        <path d="M550.9,709.1c-0.2,28.6-22.5,50.4-51.5,50.2c-28.6-0.2-50.2-22.4-50.1-51.5c0.1-28.6,22.4-50.3,51.4-50.1
	C529.4,657.9,551.1,680,550.9,709.1z" />
        <path d="M667.5,657.7c28.7,0.1,50.4,22.2,50.3,51.3c-0.1,28.7-22.4,50.5-51.3,50.3c-28.7-0.1-50.3-22.2-50.3-51.3
	C616.3,679.3,638.5,657.6,667.5,657.7z" />
      </svg>
    </div>
    <div class="MDateBG"></div>
    <div class="MDatePicker" tabindex="-1">
      <div class="MDatePickerHeader">
        <div class="MDatePickerMonth">
          <div class="MDatePickerMonthPrevious">
            <svg viewBox="0 0 1000 1000">
              <polygon points="333.8,75.7 241.9,167.7 574.2,500 241.9,832.3 333.8,924.3 758.1,500 "></polygon>
            </svg>
          </div>
          <input class="MDatePickerMonthValue MDateValidate" maxlength="2" value="11" DateType="Month" />
          <div class="MDatePickerMonthNext">
            <svg viewBox="0 0 1000 1000">
              <polygon points="333.8,75.7 241.9,167.7 574.2,500 241.9,832.3 333.8,924.3 758.1,500 "></polygon>
            </svg>
          </div>
        </div>
        <div class="MDatePickerYear">
          <div class="MDatePickerYearPrevious">
            <svg viewBox="0 0 1000 1000">
              <polygon points="333.8,75.7 241.9,167.7 574.2,500 241.9,832.3 333.8,924.3 758.1,500 "></polygon>
            </svg>
          </div>
          <input class="MDatePickerYearValue MDateValidate" maxlength="4" value="2024" DateType="Year" />
          <div class="MDatePickerYearNext">
            <svg viewBox="0 0 1000 1000">
              <polygon points="333.8,75.7 241.9,167.7 574.2,500 241.9,832.3 333.8,924.3 758.1,500 "></polygon>
            </svg>
          </div>
        </div>
      </div>
      <div class="MDatePickerFullDate"></div>
      <div class="MDatePickerContent">
        <table class="MDatePickerDaysTable"></table>
      </div>
    </div>
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
      SelectedDates: [],
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

    this.Element.querySelectorAll('.MDateInput').forEach(function (e) {
      var Instance = this;
      e.addEventListener('focus', function () {
        Instance.Element.setAttribute('focus', true);
      });
      e.addEventListener('blur', function () {
        Instance.InputToArray();
        Instance.Element.removeAttribute('focus');
      });
      e.addEventListener('input', function (event) {
        var keyCode = event.which ? event.which : event.keyCode
        if (!(keyCode >= 48 && keyCode <= 57)) {
          event.preventDefault();
        }

        // Show/Hide Clear Button
        if (Instance.IsDisabled != true && Instance.Clearable == true) {
          let Inputs = Instance.Element.querySelectorAll('.MDateValues');

          let [YearFrom, MonthFrom, DayFrom] = [
            Inputs[0].querySelector('.MDateInput[DateType=Year]').value,
            Inputs[0].querySelector('.MDateInput[DateType=Month]').value,
            Inputs[0].querySelector('.MDateInput[DateType=Day]').value,
          ];

          let [YearTo, MonthTo, DayTo] = [
            Inputs[1].querySelector('.MDateInput[DateType=Year]').value,
            Inputs[1].querySelector('.MDateInput[DateType=Month]').value,
            Inputs[1].querySelector('.MDateInput[DateType=Day]').value,
          ];
          if (YearFrom != '' || MonthFrom != '' || DayFrom != '' || YearTo != '' || MonthTo != '' || DayTo != '') {
            Instance.Element.querySelector('.MDateClearBTN').style.opacity = 1;
            Instance.Element.querySelector('.MDateClearBTN').style.pointerEvents = '';
          } else {
            Instance.Element.querySelector('.MDateClearBTN').style.opacity = 0;
            Instance.Element.querySelector('.MDateClearBTN').style.pointerEvents = 'none';
          }
        } else {
          Instance.Element.querySelector('.MDateClearBTN').style.opacity = 0;
          Instance.Element.querySelector('.MDateClearBTN').style.pointerEvents = 'none';
        }

        Instance.InputValidate();
      });
      e.addEventListener('paste', function (event) {
        event.preventDefault();
      });
      e.addEventListener('change', function (event) {
        var MDateInputValue = event.target.closest('.MDateValues');
        var DaysOfMonth = new Date(MDateInputValue.querySelector('.MDateInput[DateType=Year]').value, MDateInputValue.querySelector('.MDateInput[DateType=Month]').value, 0).getDate();
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
        if (MDateInputValue.querySelector('.MDateInput[DateType=Day]').value > DaysOfMonth) {
          MDateInputValue.querySelector('.MDateInput[DateType=Day]').value = DaysOfMonth;
        }
      });
    }.bind(this));

    this.Element.querySelector('.MDatePickerMonthValue').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');

      if (e.target.value < 1 && e.target.value != '') {
        e.target.value = '1';
      }

      if (e.target.value > 12 && e.target.value != '') {
        e.target.value = '12';
      }

      if (e.target.value == '') {
        this.Element.querySelector('.MDatePickerDaysTable').innerHTML = '';
      } else {
        this.MDatePickerBuild(this.Element.querySelector('.MDatePickerYearValue').value, this.Element.querySelector('.MDatePickerMonthValue').value);
      }

    }.bind(this));

    this.Element.querySelector('.MDatePickerYearValue').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');

      if (e.value < 1 && e.target.value != '') {
        e.value = '1';
      }

      if (e.target.value == '') {
        this.Element.querySelector('.MDatePickerDaysTable').innerHTML = '';
      } else {
        this.MDatePickerBuild(this.Element.querySelector('.MDatePickerYearValue').value, this.Element.querySelector('.MDatePickerMonthValue').value);
      }
    }.bind(this));

    this.Element.querySelector('.MDatePickerMonthPrevious').addEventListener('click', function () {
      var TheMonth = this.Element.querySelector('.MDatePickerMonthValue');
      var TheYear = this.Element.querySelector('.MDatePickerYearValue');

      if (TheMonth.value == 1) {
        TheMonth.value = 12;
        TheYear.value--;
      } else {
        TheMonth.value--;
      }
      this.MDatePickerBuild(TheYear.value, TheMonth.value);
    }.bind(this));

    this.Element.querySelector('.MDatePickerMonthNext').addEventListener('click', function () {
      var TheMonth = this.Element.querySelector('.MDatePickerMonthValue');
      var TheYear = this.Element.querySelector('.MDatePickerYearValue');

      if (TheMonth.value == 12) {
        TheMonth.value = 1;
        TheYear.value++
      } else {
        TheMonth.value++;
      }
      this.MDatePickerBuild(TheYear.value, TheMonth.value);
    }.bind(this));

    this.Element.querySelector('.MDatePickerYearPrevious').addEventListener('click', function () {
      var TheMonth = this.Element.querySelector('.MDatePickerMonthValue');
      var TheYear = this.Element.querySelector('.MDatePickerYearValue');

      if (TheYear.value < 1) {
        TheYear.value = 1;
      } else {
        TheYear.value--;
      }

      this.MDatePickerBuild(TheYear.value, TheMonth.value);
    }.bind(this));

    this.Element.querySelector('.MDatePickerYearNext').addEventListener('click', function () {
      var TheMonth = this.Element.querySelector('.MDatePickerMonthValue');
      var TheYear = this.Element.querySelector('.MDatePickerYearValue');

      TheYear.value++;

      this.MDatePickerBuild(TheYear.value, TheMonth.value);
    }.bind(this));

    this.Element.querySelector('.MDatePicker').addEventListener('focusout', function () {
      if (this.Range == true) {
        if (this.SelectedDates.length == 1) {
          this.SelectedDates.push(this.SelectedDates[0]);
        }
      }

      // Show/Hide Clear Button
      if (this.IsDisabled != true && this.Clearable == true) {
        let Inputs = this.Element.querySelectorAll('.MDateValues');

        let [YearFrom, MonthFrom, DayFrom] = [
          Inputs[0].querySelector('.MDateInput[DateType=Year]').value,
          Inputs[0].querySelector('.MDateInput[DateType=Month]').value,
          Inputs[0].querySelector('.MDateInput[DateType=Day]').value,
        ];

        let [YearTo, MonthTo, DayTo] = [
          Inputs[1].querySelector('.MDateInput[DateType=Year]').value,
          Inputs[1].querySelector('.MDateInput[DateType=Month]').value,
          Inputs[1].querySelector('.MDateInput[DateType=Day]').value,
        ];
        if (YearFrom != '' || MonthFrom != '' || DayFrom != '' || YearTo != '' || MonthTo != '' || DayTo != '') {
          this.Element.querySelector('.MDateClearBTN').style.opacity = 1;
          this.Element.querySelector('.MDateClearBTN').style.pointerEvents = '';
        } else {
          this.Element.querySelector('.MDateClearBTN').style.opacity = 0;
          this.Element.querySelector('.MDateClearBTN').style.pointerEvents = 'none';
        }
      } else {
        this.Element.querySelector('.MDateClearBTN').style.opacity = 0;
        this.Element.querySelector('.MDateClearBTN').style.pointerEvents = 'none';
      }

      if (this.Range == true) {
        if (this.SelectedDates.length == 1) {
          this.SelectedDates.push(this.SelectedDates[0]);
          this.ArrayToInput();
          this.InputValidate();
        }
      }

      this.HideMDatePicker();
    }.bind(this));

    this.Element.querySelector('.MDatePickerBTN').addEventListener('click', function () {
      if (this.Range == false) {
        if (this.Element.querySelectorAll('.MDateValues')[0].querySelector('.MDateInput[DateType=Year]').value == '' || this.Element.querySelectorAll('.MDateValues')[0].querySelector('.MDateInput[DateType=Month]').value == '' || this.Element.querySelectorAll('.MDateValues')[0].querySelector('.MDateInput[DateType=Day]').value == '') {
          let Year = new Date().getFullYear();
          let Month = new Date().getMonth() + 1;

          this.MDatePickerBuild(Year, Month);
        } else {
          this.InputToArray();
        }
      }
      if (this.Range == true) {
        if (this.Element.querySelectorAll('.MDateValues')[0].querySelector('.MDateInput[DateType=Year]').value == '' || this.Element.querySelectorAll('.MDateValues')[0].querySelector('.MDateInput[DateType=Month]').value == '' || this.Element.querySelectorAll('.MDateValues')[0].querySelector('.MDateInput[DateType=Day]').value == '' || this.Element.querySelectorAll('.MDateValues')[1].querySelector('.MDateInput[DateType=Year]').value == '' || this.Element.querySelectorAll('.MDateValues')[1].querySelector('.MDateInput[DateType=Month]').value == '' || this.Element.querySelectorAll('.MDateValues')[1].querySelector('.MDateInput[DateType=Day]').value == '') {
          let Year = new Date().getFullYear();
          let Month = new Date().getMonth() + 1;

          this.MDatePickerBuild(Year, Month);
        } else {
          this.InputToArray();
        }
      }

      this.ShowMDatePicker();
      this.Element.querySelector('.MDatePicker').focus();
    }.bind(this));

    this.Element.querySelector('.MDateClearBTN').addEventListener('click', function () {
      this.Clear();
    }.bind(this));

    // Show/Hide Clear Button
    if (this.IsDisabled != true && this.Clearable == true) {
      let Inputs = this.Element.querySelectorAll('.MDateValues');

      let [YearFrom, MonthFrom, DayFrom] = [
        Inputs[0].querySelector('.MDateInput[DateType=Year]').value,
        Inputs[0].querySelector('.MDateInput[DateType=Month]').value,
        Inputs[0].querySelector('.MDateInput[DateType=Day]').value,
      ];

      let [YearTo, MonthTo, DayTo] = [
        Inputs[1].querySelector('.MDateInput[DateType=Year]').value,
        Inputs[1].querySelector('.MDateInput[DateType=Month]').value,
        Inputs[1].querySelector('.MDateInput[DateType=Day]').value,
      ];
      if (YearFrom != '' || MonthFrom != '' || DayFrom != '' || YearTo != '' || MonthTo != '' || DayTo != '') {
        this.Element.querySelector('.MDateClearBTN').style.opacity = 1;
        this.Element.querySelector('.MDateClearBTN').style.pointerEvents = '';
      } else {
        this.Element.querySelector('.MDateClearBTN').style.opacity = 0;
        this.Element.querySelector('.MDateClearBTN').style.pointerEvents = 'none';
      }
    } else {
      this.Element.querySelector('.MDateClearBTN').style.opacity = 0;
      this.Element.querySelector('.MDateClearBTN').style.pointerEvents = 'none';
    }

    this.EnableDisable();
  },
  methods: {
    MDatePickerBuild(Year, Month) {
      this.Element.querySelector('.MDatePickerDaysTable').innerHTML = '';
      var Instance = this;
      var FirstDay = (new Date(Year, Month - 1, 1).getDay() + 1) % 7;
      var TotalDays = new Date(Year, Month, 0).getDate();
      var Weeks = Math.ceil((FirstDay + TotalDays) / 7);
      var DayNo = 1;

      var DaysCode = `
      <thead>
        <tr>
          <th><div class="MDatePickerDaysName">س</div></th>
          <th><div class="MDatePickerDaysName">ا</div></th>
          <th><div class="MDatePickerDaysName">ث</div></th>
          <th><div class="MDatePickerDaysName">ث</div></th>
          <th><div class="MDatePickerDaysName">ا</div></th>
          <th><div class="MDatePickerDaysName">خ</div></th>
          <th><div class="MDatePickerDaysName">ج</div></th>
        </tr>
      </thead>`;
      DaysCode += '<tbody>';

      for (let i = 0; i < Weeks; i++) {
        DaysCode += '<tr>';
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < FirstDay) {
            DaysCode += '<td></td>';
          } else if (DayNo > TotalDays) {
            DaysCode += '<td></td>';
          } else {
            DaysCode += '<td><div MDatePickerValue=' + Year + '-' + Month + '-' + DayNo + ' class="MDatePickerDay">' + DayNo + '</div></td>';
            DayNo++;
          }
        }
        DaysCode += '</tr>';
      }

      DaysCode += '</tbody>';
      this.Element.querySelector('.MDatePickerDaysTable').innerHTML = DaysCode;

      this.Element.querySelector('.MDatePickerMonthValue').value = Month;
      this.Element.querySelector('.MDatePickerYearValue').value = Year;

      Instance.PickerSelect();

      // Events 
      this.Element.querySelectorAll('.MDatePickerDay').forEach(function (e) {
        e.addEventListener('click', function (d) {
          if (Instance.Range == false) {
            Instance.SelectedDates = [];
            Instance.SelectedDates.push(d.target.getAttribute('MDatePickerValue'));

            Instance.ArrayToInput()
            Instance.InputValidate();

            Instance.Element.querySelector('.MDatePicker').style.display = 'none';
          }
          if (Instance.Range == true) {
            if (Instance.SelectedDates.includes(d.target.getAttribute('MDatePickerValue'))) {
              if (Instance.SelectedDates.length == 2 && Instance.SelectedDates[0] == Instance.SelectedDates[1]) {
                Instance.SelectedDates.pop();
              } else {
                Instance.SelectedDates = Instance.SelectedDates.filter(item => item !== d.target.getAttribute('MDatePickerValue'));
              }
            } else {
              if (Instance.SelectedDates.length == 0) {
                Instance.SelectedDates.push(d.target.getAttribute('MDatePickerValue'));
                Instance.SelectedDates.push(d.target.getAttribute('MDatePickerValue'));
              }
              if (Instance.SelectedDates.length == 1) {
                Instance.SelectedDates.push(d.target.getAttribute('MDatePickerValue'));
              }
              if (Instance.SelectedDates.length == 2) {
                Instance.SelectedDates[1] = d.target.getAttribute('MDatePickerValue');
              }
              /*
              if (Instance.SelectedDates.length == 2) {
                Instance.Element.querySelector('.MDatePicker').style.display = 'none';
              }
              */
            }

            Instance.SelectedDates.sort((a, b) => new Date(a) - new Date(b));

            Instance.ArrayToInput();
            Instance.InputValidate();
          }

          Instance.PickerSelect();
        });
      });
    },
    Get() {
      if (this.SelectedDates && this.SelectedDates.length > 0) {
        if (this.Range == false) {
          return this.SelectedDates[0];
        }
        if (this.Range == true) {
          return this.SelectedDates;
        }
      } else {
        return '';
      }
    },
    Set(TheValue) {
      let MDateSetValue = TheValue;
      let Instance = this;
      if (MDateSetValue && MDateSetValue != '') {
        Instance.SelectedDates = [];
        if (typeof MDateSetValue == "string") {
          MDateSetValue = MDateSetValue.replaceAll("/", "-");
          MDateSetValue = MDateSetValue.replace(/-0(\d)/g, '-$1'); // remove zeros
        } else {
          for (let i = 0; i < MDateSetValue.length; i++) {
            MDateSetValue[i] = MDateSetValue[i].replaceAll("/", "-");
            MDateSetValue[i] = MDateSetValue[i].replace(/-0(\d)/g, '-$1'); // remove zeros
          }
        }


        if (Instance.Range == false) {
          if (typeof MDateSetValue === "string") {
            Instance.SelectedDates.push(MDateSetValue);
          } else {
            Instance.SelectedDates.push(MDateSetValue[0]);
          }
        }
        if (Instance.Range == true) {
          if (typeof MDateSetValue === "string") {
            Instance.SelectedDates.push(MDateSetValue);
            Instance.SelectedDates.push(MDateSetValue);
          } else {
            if (MDateSetValue.length == 1) {
              Instance.SelectedDates.push(MDateSetValue[0]);
              Instance.SelectedDates.push(MDateSetValue[0]);
            }
            if (MDateSetValue.length == 2) {
              Instance.SelectedDates.push(MDateSetValue[0]);
              Instance.SelectedDates.push(MDateSetValue[1]);
            }
          }
        }

        Instance.ArrayToInput();
        Instance.InputValidate();
      }
    },
    Clear() {
      var Instance = this;
      Instance.SelectedDates = [];
      Instance.Element.querySelectorAll('.MDateInput').forEach(function (e) {
        e.value = '';
      });
    },
    Disable() {
      this.IsDisabled = true;
      this.EnableDisable();
    },
    Enable() {
      this.IsDisabled = false;
      this.EnableDisable();
    },
    PickerSelect() {
      var Instance = this;
      Instance.Element.querySelector('.MDatePickerFullDate').innerHTML = '';
      Instance.Element.querySelectorAll('.MDatePickerDay').forEach(function (e) {
        e.removeAttribute('Selected');
        e.closest('td').classList.remove("MDateRangeShadow");
        e.closest('td').classList.remove("MDateRangeStart");
        e.closest('td').classList.remove("MDateRangeEnd");
      });

      for (let i = 0; i < Instance.SelectedDates.length; i++) {
        if (i > 0) {
          Instance.Element.querySelector('.MDatePickerFullDate').innerHTML += '-';
        }

        Instance.Element.querySelector('.MDatePickerFullDate').innerHTML += '<div class="MDatePickerFullDateValue">' + Instance.SelectedDates[i] + '</div>';

        if (Instance.Element.querySelector('.MDatePickerDay[MDatePickerValue="' + Instance.SelectedDates[i] + '"]')) {
          Instance.Element.querySelector('.MDatePickerDay[MDatePickerValue="' + Instance.SelectedDates[i] + '"]').setAttribute('Selected', true);
        }
      }

      if (Instance.Element.querySelector('.MDatePickerFullDateValue')) {
        Instance.Element.querySelectorAll('.MDatePickerFullDateValue').forEach(function (e) {
          e.addEventListener('click', function (d) {
            var TheDate = new Date(d.target.innerHTML);
            var Year = TheDate.getFullYear();
            var Month = TheDate.getMonth() + 1;

            Instance.MDatePickerBuild(Year, Month);
          });
        });
      }

      if (Instance.SelectedDates.length == 2) {
        var DatesRange = [];
        var Start = new Date(Instance.SelectedDates[0]);
        var End = new Date(Instance.SelectedDates[1]);

        var TargetYear = parseInt(Instance.Element.querySelector('.MDatePickerYearValue').value);
        var TargetMonth = parseInt(Instance.Element.querySelector('.MDatePickerMonthValue').value);

        while (Start <= End) {
          var Year = Start.getFullYear();
          var Month = Start.getMonth() + 1;
          var Day = Start.getDate();

          if (Year == TargetYear && Month == TargetMonth) {
            DatesRange.push(`${Year}-${Month}-${Day}`);
          }
          Start.setDate(Start.getDate() + 1);
        }

        for (let i = 0; i < DatesRange.length; i++) {
          if (this.Element.querySelector('.MDatePickerDay[MDatePickerValue="' + DatesRange[i] + '"]')) {
            if (this.Element.querySelectorAll('.MDateRangeStart').length == 0) {
              this.Element.querySelector('.MDatePickerDay[MDatePickerValue="' + DatesRange[i] + '"]').closest('td').classList.add("MDateRangeStart");
            }
            if (this.Element.querySelector('.MDatePickerDay[MDatePickerValue="' + DatesRange[i] + '"]').closest("tr") != this.Element.querySelector('.MDatePickerDay[MDatePickerValue="' + DatesRange[i + 1] + '"]')?.closest("tr")) {
              this.Element.querySelector('.MDatePickerDay[MDatePickerValue="' + DatesRange[i] + '"]').closest('td').classList.add("MDateRangeEnd");
            }
            this.Element.querySelector('.MDatePickerDay[MDatePickerValue="' + DatesRange[i] + '"]').closest('td').classList.add("MDateRangeShadow");
          }
        }
      } else {
        Instance.Element.querySelectorAll('.MDatePickerDay').forEach(function (e) {
          e.closest('td').classList.remove("MDateRangeShadow");
          e.closest('td').classList.remove("MDateRangeStart");
          e.closest('td').classList.remove("MDateRangeEnd");
        });
      }
    },
    EnableDisable() {
      this.Element.querySelectorAll('.MDateInput').forEach(function (e) {
        if (this.IsDisabled == true) {
          e.setAttribute('disabled', true);
        } else {
          e.removeAttribute('disabled')
        }
      }.bind(this));

      if (this.IsDisabled == true) {
        this.Element.setAttribute('disabled', true);
        this.Element.querySelector('.MDatePickerBTN').style.display = 'none';
      } else {
        this.Element.removeAttribute('disabled');
        this.Element.querySelector('.MDatePickerBTN').style.display = '';
      }

      // Show/Hide Clear Button
      if (this.IsDisabled != true && this.Clearable == true) {
        let Inputs = this.Element.querySelectorAll('.MDateValues');

        let [YearFrom, MonthFrom, DayFrom] = [
          Inputs[0].querySelector('.MDateInput[DateType=Year]').value,
          Inputs[0].querySelector('.MDateInput[DateType=Month]').value,
          Inputs[0].querySelector('.MDateInput[DateType=Day]').value,
        ];

        let [YearTo, MonthTo, DayTo] = [
          Inputs[1].querySelector('.MDateInput[DateType=Year]').value,
          Inputs[1].querySelector('.MDateInput[DateType=Month]').value,
          Inputs[1].querySelector('.MDateInput[DateType=Day]').value,
        ];
        if (YearFrom != '' || MonthFrom != '' || DayFrom != '' || YearTo != '' || MonthTo != '' || DayTo != '') {
          this.Element.querySelector('.MDateClearBTN').style.opacity = 1;
          this.Element.querySelector('.MDateClearBTN').style.pointerEvents = '';
        } else {
          this.Element.querySelector('.MDateClearBTN').style.opacity = 0;
          this.Element.querySelector('.MDateClearBTN').style.pointerEvents = 'none';
        }
      } else {
        this.Element.querySelector('.MDateClearBTN').style.opacity = 0;
        this.Element.querySelector('.MDateClearBTN').style.pointerEvents = 'none';
      }
    },
    InputValidate() {
      var FilledInputs = 0;
      this.Element.querySelectorAll('.MDateInput').forEach(function (e) {
        if (e.value) {
          FilledInputs++;
        }
      }.bind(this));
      if (FilledInputs > 0) {
        this.Element.setAttribute('valid', true);
      } else {
        this.Element.removeAttribute('valid');
      }
    },
    ArrayToInput() {
      if (this.Range == false) {
        this.Element.querySelectorAll('.MDateValues')[0].querySelector('.MDateInput[DateType="Day"]').value = (this.SelectedDates[0]).split('-')[2];
        this.Element.querySelectorAll('.MDateValues')[0].querySelector('.MDateInput[DateType="Month"]').value = (this.SelectedDates[0]).split('-')[1];
        this.Element.querySelectorAll('.MDateValues')[0].querySelector('.MDateInput[DateType="Year"]').value = (this.SelectedDates[0]).split('-')[0];
      }
      if (this.Range == true) {
        for (let i = 0; i < this.SelectedDates.length; i++) {
          if (this.Element.querySelectorAll('.MDateValues')[i]) {
            this.Element.querySelectorAll('.MDateValues')[i].querySelector('.MDateInput[DateType="Day"]').value = (this.SelectedDates[i]).split('-')[2];
            this.Element.querySelectorAll('.MDateValues')[i].querySelector('.MDateInput[DateType="Month"]').value = (this.SelectedDates[i]).split('-')[1];
            this.Element.querySelectorAll('.MDateValues')[i].querySelector('.MDateInput[DateType="Year"]').value = (this.SelectedDates[i]).split('-')[0];
          }
        }
      }
    },
    InputToArray() {
      if (this.Range == false) {
        this.SelectedDates = [];
        let Year = this.Element.querySelectorAll('.MDateValues')[0].querySelector('.MDateInput[DateType=Year]').value;
        let Month = this.Element.querySelectorAll('.MDateValues')[0].querySelector('.MDateInput[DateType=Month]').value;
        let Day = this.Element.querySelectorAll('.MDateValues')[0].querySelector('.MDateInput[DateType=Day]').value;

        if (Year != '' && Month != '' && Day != '') {
          this.SelectedDates.push(Year + '-' + Month + '-' + Day);
          this.MDatePickerBuild(Year, Month);
        }
      }
      if (this.Range == true) {
        this.SelectedDates = [];
        let Inputs = this.Element.querySelectorAll('.MDateValues');

        let [YearFrom, MonthFrom, DayFrom] = [
          Inputs[0].querySelector('.MDateInput[DateType=Year]').value,
          Inputs[0].querySelector('.MDateInput[DateType=Month]').value,
          Inputs[0].querySelector('.MDateInput[DateType=Day]').value,
        ];

        let [YearTo, MonthTo, DayTo] = [
          Inputs[1].querySelector('.MDateInput[DateType=Year]').value,
          Inputs[1].querySelector('.MDateInput[DateType=Month]').value,
          Inputs[1].querySelector('.MDateInput[DateType=Day]').value,
        ];

        if (YearFrom == '' || MonthFrom == '' || DayFrom == '') {
          if (YearTo != '' && MonthTo != '' && DayTo != '') {
            [YearFrom, MonthFrom, DayFrom] = [YearTo, MonthTo, DayTo];
          }
        }

        if (YearTo == '' || MonthTo == '' || DayTo == '') {
          if (YearFrom != '' && MonthFrom != '' && DayFrom != '') {
            [YearTo, MonthTo, DayTo] = [YearFrom, MonthFrom, DayFrom];

          }
        }

        if ((YearFrom != '' && MonthFrom != '' && DayFrom != '') || (YearTo != '' && MonthTo != '' && DayTo != '')) {
          if (new Date(`${YearFrom}-${MonthFrom}-${DayFrom}`) > new Date(`${YearTo}-${MonthTo}-${DayTo}`)) {
            [YearFrom, MonthFrom, DayFrom, YearTo, MonthTo, DayTo] = [YearTo, MonthTo, DayTo, YearFrom, MonthFrom, DayFrom];
          }

          this.SelectedDates.push(`${YearFrom}-${MonthFrom}-${DayFrom}`);
          this.SelectedDates.push(`${YearTo}-${MonthTo}-${DayTo}`);

          Inputs[0].querySelector('.MDateInput[DateType=Year]').value = YearFrom;
          Inputs[0].querySelector('.MDateInput[DateType=Month]').value = MonthFrom;
          Inputs[0].querySelector('.MDateInput[DateType=Day]').value = DayFrom;

          Inputs[1].querySelector('.MDateInput[DateType=Year]').value = YearTo;
          Inputs[1].querySelector('.MDateInput[DateType=Month]').value = MonthTo;
          Inputs[1].querySelector('.MDateInput[DateType=Day]').value = DayTo;
        }


        this.MDatePickerBuild(YearTo, MonthTo);
      }
    },
    ShowMDatePicker() {
      const targetDiv = this.Element.querySelector('.MDatePicker');
      const referenceDiv = this.Element;
      const offset = 10;
      const referenceRect = referenceDiv.getBoundingClientRect();
      
      targetDiv.style.display = 'flex';

      let newTop = referenceRect.bottom;
      let newLeft = referenceRect.left;

      if (newTop + targetDiv.offsetHeight > window.innerHeight - offset) {
        newTop = window.innerHeight - targetDiv.offsetHeight - offset;
      }
      if (newTop < offset) {
        newTop = offset;
      }

      if (newLeft + targetDiv.offsetWidth > window.innerWidth - offset) {
        newLeft = window.innerWidth - targetDiv.offsetWidth - offset;
      }
      if (newLeft < offset) {
        newLeft = offset;
      }

      targetDiv.style.top = `${newTop}px`;
      targetDiv.style.left = `${newLeft}px`;
    },
    HideMDatePicker() {
      this.Element.querySelector('.MDatePicker').style.display = 'none';
    }
  }
}
</script>

<style>
/* Light Mode Colors */
:root {
  --MDateBG: #fff;
  --MDateLabelColor: rgba(0, 0, 0, 0.6);
  --MDateBorder: rgba(0, 0, 0, 0.6);
  --MDateDisabled: #666;
  --MDatePickerBG: #fff;
  --MDateSVG: #666;
  --MDatePickerBTNColor: #fff;
  --MDatePickerBTNHover: rgba(25, 118, 210, 0.2);
  --MDatePickerShadow: rgba(0, 0, 0, 0.1);
  --MDatePickerSVG: rgba(0, 0, 0, 0.3);
  --MDatePickerSVGHover: rgba(0, 0, 0, 1);
  --MDatePickerFullDateBG: rgba(255, 255, 255, 0.15);
  --MDatePickerFullDateHover: rgba(255, 255, 255, 0.3);
  --MDatePickerDaysNameColor: #666;
  --MDatePickerRangeShadow: rgba(25, 118, 210, 0.2);
  --MDatePickerDayHover: rgba(25, 118, 210, 0.2);
  --MDatePickerDayShadow: rgba(25, 118, 210, 0.7);
}

/* Dark Mode Colors */
.DarkMode {
  --MDateBG: #2f3349;
  --MDateLabelColor: rgba(255, 255, 255, 0.6);
  --MDateBorder: rgba(255, 255, 255, 0.6);
  --MDateDisabled: #aaa;
  --MDatePickerBG: #2f3349;
  --MDateSVG: #aaa;
  --MDatePickerBTNColor: #fff;
  --MDatePickerBTNHover: rgba(25, 118, 210, 0.2);
  --MDatePickerShadow: rgba(0, 0, 0, 0.1);
  --MDatePickerSVG: rgba(255, 255, 255, 0.3);
  --MDatePickerSVGHover: rgba(255, 255, 255, 1);
  --MDatePickerFullDateBG: rgba(255, 255, 255, 0.15);
  --MDatePickerFullDateHover: rgba(255, 255, 255, 0.3);
  --MDatePickerDaysNameColor: #999;
  --MDatePickerRangeShadow: rgba(25, 118, 210, 0.2);
  --MDatePickerDayHover: rgba(25, 118, 210, 0.2);
  --MDatePickerDayShadow: rgba(25, 118, 210, 0.7);
}

.MDate {
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
}

.MDateValues {
  display: flex;
  min-width: min-content;
  align-items: center;
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
  color: var(--MDateLabelColor);
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
  pointer-events: none;
}

.MDate .MDateInput {
  display: flex;
  width: 100%;
  padding: 0;
  background-color: transparent;
  border: 0;
  outline: 0;
  font-family: 'MFontR';
  font-size: 15px;
  z-index: 5;
  color: var(--TextColor);
}

.MDateBG {
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: var(--MDateBG);
  border: 1px solid var(--MDateBorder);
  position: absolute;
  top: 0;
  right: 0;
  transition-duration: 0.3s;
  box-sizing: border-box;
}

.MDateSeperator {
  display: flex;
  opacity: 0;
  color: var(--TextColor);
  font-family: 'MFontB';
  font-size: 16px;
  flex: 1;
  justify-content: center;
  padding: 0 5px;
  z-index: 5;
}

.MDateInputSeperator {
  display: flex;
  opacity: 0;
  color: var(--TextColor);
  flex: 1;
  justify-content: center;
  padding: 0 1px;
  z-index: 5;
}

.MDate[focus] .MDateSeperator,
.MDate[focus] .MDateInputSeperator {
  opacity: 1;
}

.MDate[valid] .MDateSeperator,
.MDate[valid] .MDateInputSeperator {
  opacity: 1;
}

.MDate[focus] .MDateBG {
  border: 1px solid var(--PrimaryColor);
}

.MDate[valid]:not([focus]) .MDateBG {
  border: 1px solid var(--TextColor);
}

.MDate[focus] label {
  color: var(--PrimaryColor);
  top: -13px;
  font-size: 13px;
  font-family: 'MFontR';
}

.MDate[valid]:not([focus]) label {
  color: var(--TextColor);
  top: -13px;
  font-size: 13px;
  font-family: 'MFontR';
}

.MDate[disabled] .MDateInput {
  color: var(--MDateDisabled);
  cursor: default;
  line-height: 0.5;

}

.MDate[disabled] .MDateBG {
  border: 1px dashed var(--MDateDisabled) !important;
}

.MDate[disabled] label {
  color: var(--MDateDisabled) !important;
  top: -13px;
  font-size: 13px;
  font-family: 'MFontR';
}

.MDate[disabled] .MDateInputSeperator {
  color: var(--MDateDisabled);
}

.MDate .MDateInput[DateType="Day"],
.MDate .MDateInput[DateType="Month"] {
  width: 20px;
  text-align: center;
}

.MDate .MDateInput[DateType="Year"] {
  width: 35px;
  text-align: right;
}

.MDateClearBTN {
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

.MDateClearBTN svg {
  fill: var(--MDateSVG);
  display: flex;
  width: 60%;
  height: 60%;
  transition-duration: 0.3s;
}

.MDateClearBTN:hover svg {
  fill: var(--PrimaryColor);
}

.MDatePickerBTN {
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

.MDatePickerBTN svg {
  display: flex;
  width: 65%;
  height: 65%;
  fill: var(--MDatePickerBTNColor);
  transition-duration: 0.3s;
}

.MDatePickerBTN:hover {
  background-color: var(--MDatePickerBTNHover);
}

.MDatePickerBTN:hover svg {
  fill: var(--PrimaryColor);
}

.MDatePicker {
  display: none;
  position: fixed;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
  background-color: var(--MDatePickerBG);
  box-shadow: 0 2px 5px 1px var(--MDatePickerShadow);
  border-radius: 5px;
  z-index: 100;
  outline: none;
  width: min-content;
  top: -41px;
  left: 10px;
}

.MDatePickerHeader {
  display: flex;
  width: 100%;
  height: 40px;
  border-radius: 5px 5px 0 0;
  position: relative;
  justify-content: center;
  align-items: center;
}

.MDatePickerYear {
  display: flex;
  width: 100px;
  height: 100%;
  justify-content: center;
  align-items: center;
  margin-left: 3px;
  flex-wrap: wrap;
  position: absolute;
  top: 0;
  left: 3px;
}

.MDatePickerYearValue {
  display: flex;
  font-family: 'MFontB';
  font-size: 20px;
  color: var(--TextColor);
  outline: 0;
  width: 45px;
  background-color: transparent;
  border: 0;
  padding: 0;
  text-align: center;
}

.MDatePickerMonth {
  display: flex;
  width: 70px;
  height: 100%;
  justify-content: center;
  align-items: center;
  margin-left: 3px;
  flex-wrap: wrap;
  position: absolute;
  top: 0;
  right: 0;
}

.MDatePickerMonthValue {
  display: flex;
  font-family: 'MFontB';
  font-size: 20px;
  color: var(--TextColor);
  outline: 0;
  width: 20px;
  background-color: transparent;
  border: 0;
  padding: 0;
  text-align: center;
}

.MDatePickerMonthNext,
.MDatePickerMonthPrevious,
.MDatePickerYearNext,
.MDatePickerYearPrevious {
  display: flex;
  height: 20px;
  width: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;

  user-select: none;
}

.MDatePickerMonthNext svg,
.MDatePickerMonthPrevious svg,
.MDatePickerYearNext svg,
.MDatePickerYearPrevious svg {
  display: flex;
  height: 85%;
  width: 85%;
  fill: var(--MDatePickerSVG);
  transition-duration: 0.3s;
}

.MDatePickerMonthNext,
.MDatePickerYearNext {
  transform: rotate(180deg);

}

.MDatePickerMonthNext svg:hover,
.MDatePickerMonthPrevious svg:hover,
.MDatePickerYearNext svg:hover,
.MDatePickerYearPrevious svg:hover {
  fill: var(--MDatePickerSVGHover);
}

.MDatePickerFullDate {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  width: 100%;
  height: 40px;
  background-color: var(--PrimaryColor);
  font-family: 'MFontB';
  font-size: 18px;
}

.MDatePickerFullDateValue {
  display: flex;
  background-color: var(--MDatePickerFullDateBG);
  padding: 3px 10px;
  margin: 0 5px;
  border-radius: 5px;
  transition-duration: 0.3s;
  cursor: pointer;
  font-family: 'MFontB';
  font-size: 16px;
  letter-spacing: 1px;
}

.MDatePickerFullDateValue:hover {
  background-color: var(--MDatePickerFullDateHover);
}

.MDatePickerContent {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 5px;
}

.MDatePickerDaysTable {
  width: 100%;
  border-spacing: 0 3px;
  border-collapse: separate;
}

.MDatePicker td,
.MDatePicker th {
  padding: 0;
}

.MDatePickerDaysNames {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-start;
}

.MDatePickerDaysName {
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  color: var(--MDatePickerDaysNameColor);
  font-family: 'MFontB';
  font-size: 13px;
}

.MDatePickerDays {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.MDateRangeShadow {
  background-color: var(--MDatePickerRangeShadow);
}

.MDateRangeShadow:first-child {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.MDateRangeShadow:last-child {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.MDateRangeStart {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.MDateRangeEnd {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.MDatePickerDay {
  display: flex;
  height: 32px;
  width: 32px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  transition-duration: 0.3s;
  cursor: pointer;
  font-size: 14px;
}

.MDatePickerDay:hover {
  color: var(--PrimaryColor);
}

.MDatePickerDay[Selected] {
  background-color: var(--PrimaryColor);
  color: #fff;
  box-shadow: 0px 0px 6px 0px var(--MDatePickerDayShadow);
}
</style>
