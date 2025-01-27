<template>
  <div class="MComboBox" :id="Name"></div>
</template>

<script>
import { nextTick } from 'vue';

export default {
  props: {
    Name: { type: String, required: true },
    Label: { type: String, required: true },
    Items: { type: Array, required: true },
    ItemsName: { type: String, default: null },
    MultipleSelections: { type: Boolean, default: false },
    AllowInput: { type: Boolean, default: false },
    MaxVisibleItems: { type: Number, default: 4 },
    Disabled: { type: Boolean, default: false },
    Clearable: { type: Boolean, default: false },
  },
  data() {
    return {
      MComboBox: null,
      IsDisabled: this.Disabled,
      SelectedItems: [],
      MCBItems: this.Items,
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
    Items: {
      handler(newValue) {
        nextTick(() => {
          if (this.Items && this.Items.length > 0) {
            var Element = document.getElementById(this.Name);
            this.MComboBox = this.MComboBoxBuild(Element, newValue, this.ItemsName, this.Label, this.MultipleSelections, this.AllowInput, this.MaxVisibleItems, this.Clearable);
          }
        });
      },
    },
  },
  mounted() {
    var Element = document.getElementById(this.Name);

    this.EnableDisable();
    this.MComboBox = this.MComboBoxBuild(Element, this.Items, this.ItemsName, this.Label, this.MultipleSelections, this.AllowInput, this.MaxVisibleItems, this.Clearable);
  },
  methods: {
    MComboBoxBuild(Element, Items, ItemsName, Label, MultipleSelections, AllowInput, MaxVisibleItems, Clearable) {
      Element.innerHTML = '';
      var MCBValue = '';
      var MFilteredItems = [];
      var ItemsArrayType = '';
      var Instance = this;

      if (Items.every(item => Array.isArray(item) || (typeof item === 'object' && item !== null))) {
        ItemsArrayType = '2D';
      } else {
        ItemsArrayType = '1D';
      }

      Instance.MCBItems = [];
      for (let i = 0; i < Items.length; i++) {
        if (ItemsArrayType == '1D') {
          Instance.MCBItems[i] = { "MCBIName": Items[i] };
          Instance.MCBItems[i]['MCBIID'] = i;
        }
        if (ItemsArrayType == '2D') {
          Instance.MCBItems[i] = JSON.parse(JSON.stringify(Items[i]));
          Instance.MCBItems[i]['MCBIID'] = i;
        }
      }

      MFilteredItems = Instance.MCBItems;

      if (Items.length == 0) {
        document.getElementById(this.Name).setAttribute('MCBDisabled', true)
      } else {
        document.getElementById(this.Name).removeAttribute('MCBDisabled')
      }

      MCBValue = '<input class="MComboBoxValueInput" autocomplete="false" type="text"/>';
      var MCBLabel = '<label>' + Label + '</label>'
      var ClearBTN = `<div class="MComboBoxClearBTN"><svg viewBox="0 0 1000 1000">
	<path d="M922.1,147.7c0.5,14.9-10.1,31.1-24.9,45.8C800.4,290,703.8,386.8,607.1,483.5c-16.5,16.5-16.5,16.5,0.5,33.4
		c97,97,194,194.1,291.1,291c17.4,17.3,27.2,36.8,22.7,61.9c-8.5,47.1-63.2,68.5-101.3,39.4c-5.5-4.2-10.5-9.3-15.4-14.2
		c-97.8-97.7-195.6-195.3-293-293.4c-9.4-9.5-14-9.2-23.2,0.1C389.7,701.1,290.3,800,191.3,899.3c-19.7,19.8-42.3,28.4-69.5,20
		c-41.1-12.7-57.5-63.1-32.2-97.9c4.1-5.6,9.2-10.6,14.1-15.5c97.3-97.4,194.7-194.8,292.1-292.2c13.8-13.8,13.8-13.8-0.5-28.1
		C297.3,387.5,199.3,289.3,101,191.4c-20.2-20.1-29.1-43-19.9-70.8c15-45.2,70.8-57.9,106.2-23.7c33.9,32.7,66.7,66.4,100,99.7
		c67.3,67.3,134.7,134.4,201.6,202c8.7,8.8,13.2,9.2,22.1,0.2c98.9-99.4,198.4-198.2,297.5-297.4c13.6-13.7,28.8-23,48.6-23.3
		C893.3,77.6,921.6,104.9,922.1,147.7z"/>
</svg></div>`;
      var MCBChevron = '<div class="MComboBoxChevron"><svg viewBox="0 0 1000 1000"><polygon points="333.8,75.7 241.9,167.7 574.2,500 241.9,832.3 333.8,924.3 758.1,500 "></polygon></svg></div>';
      var MCBBG = '<div class="MComboBoxBG"></div>'
      var MComboBoxValueContainer = '<div tabindex="-1" class="MComboBoxValueContainer">' + MCBValue + MCBLabel + MCBBG + ClearBTN + MCBChevron + '</div>';
      var MCBItemsContainer = '<div class="MComboBoxDropDown"><div class="MComboBoxItemsSearch"><input class="MComboBoxItemsSearchInput" placeholder="بحث" autocomplete="false" type="text"/></div><div class="MComboBoxItems"></div></div>';

      Element.innerHTML += MComboBoxValueContainer;
      Element.innerHTML += MCBItemsContainer;


      // Show/Hide Clear Button
      ShowHideClearBTN();

      FillComboBoxItems();

      if (AllowInput == true && MultipleSelections == false) {
        Element.querySelector('input').removeAttribute('readonly');
      } else {
        Element.querySelector('input').setAttribute('readonly', true);
      }

      if (Element.querySelector('.MComboBoxValueInput').value) {
        Element.setAttribute('valid', true);
      } else {
        Element.removeAttribute('valid');
      }

      // Set Max Visible Items
      Element.querySelector('.MComboBoxDropDown').style.display = 'none';
      Element.querySelector('.MComboBoxItems').style.maxHeight = (MaxVisibleItems * 41) + 'px';

      Element.removeEventListener('focusin', null);
      Element.addEventListener('focusin', function () {
        if (Element.getAttribute('MCBDisabled') != 'true') {
          if (Element.querySelector('.MComboBoxDropDown').style.display == 'none') {
            ShowDropDown();
          }
        }
      });

      Element.removeEventListener('focusout', null);
      Element.addEventListener('focusout', function (e) {
        if (Element.getAttribute('MCBDisabled') != 'true') {
          if (!e.relatedTarget || !e.relatedTarget.closest('.MComboBox') || e.relatedTarget.closest('.MComboBox').getAttribute('id') != Element.getAttribute('id')) {
            HideDropDown();
          }
        }
        InputValidate();
        window.removeEventListener('keydown', null);
      });

      Element.querySelector('.MComboBoxClearBTN').removeEventListener('click', null);
      Element.querySelector('.MComboBoxClearBTN').addEventListener('click', function () {
        Instance.SelectedItems = [];
        PopulateSelections();
        ShowHideClearBTN();
      });

      Element.querySelector('.MComboBoxValueInput').removeEventListener('keyup', null);
      Element.querySelector('.MComboBoxValueInput').addEventListener('keyup', function () {
        // Show/Hide Clear Button
        ShowHideClearBTN();
      });

      var CurrentHighlight = 0;
      Element.querySelector('.MComboBoxItemsSearchInput').removeEventListener('keyup', null);
      Element.querySelector('.MComboBoxItemsSearchInput').addEventListener('keyup', function (e) {
        var MCBSearchInput = Element.querySelector('.MComboBoxItemsSearchInput');
        MFilteredItems = Instance.MCBItems;

        if (ItemsArrayType == '1D') {
          MFilteredItems = Instance.MCBItems.filter(function (item) {
            if (item['MCBIName'].toLowerCase().indexOf(MCBSearchInput.value.toLowerCase()) > -1) {
              return item;
            }
          });
        }
        if (ItemsArrayType == '2D') {
          Element.removeAttribute('SelectionID');
          MFilteredItems = Instance.MCBItems.filter(function (item) {
            if (item[ItemsName].toLowerCase().indexOf(MCBSearchInput.value.toLowerCase()) > -1) {
              return item;
            }
          });
        }

        FillComboBoxItems();

        var MaxHighlight = Element.querySelectorAll('.MComboBoxItems .MComboBoxItem').length;

        if (e.keyCode == 38) {
          if (CurrentHighlight > 1) {
            CurrentHighlight--;
          }

          if (Element.querySelectorAll('.MComboBoxItemHighlight').length != 0) {
            Element.querySelector('.MComboBoxItemHighlight').removeClass('MComboBoxItemHighlight');
          }
          Element.querySelector('.MComboBoxItem:nth-child(' + CurrentHighlight + ')').classList.add('MComboBoxItemHighlight');
          Element.querySelector('.MComboBoxItemHighlight').scrollIntoView(false);
        } else if (e.keyCode == 40) {
          if (CurrentHighlight < MaxHighlight) {
            CurrentHighlight++;
          }
          if (Element.querySelectorAll('.MComboBoxItemHighlight').length != 0) {
            Element.querySelector('.MComboBoxItemHighlight').removeClass('MComboBoxItemHighlight');
          }
          Element.querySelector('.MComboBoxItem:nth-child(' + CurrentHighlight + ')').classList.add('MComboBoxItemHighlight');
          Element.querySelector('.MComboBoxItemHighlight').scrollIntoView(false);
        } else if (e.keyCode == 13) {
          if (Element.querySelector('.MComboBoxDropDown').style.display != 'none') {
            if (CurrentHighlight != 0) {
              Element.querySelector('input').value = Element.querySelector('.MComboBoxItem:nth-child(' + CurrentHighlight + ')').innerHTML;
              Element.querySelector('input').blur();
              HideDropDown();
            }
          } else {
            ShowDropDown();
          }
        } else {
          CurrentHighlight = 0;
        }
      });

      /* ============ FUNCTIONS ============ */
      function FillComboBoxItems() {
        var MFilteredItemsCode = '';
        Element.querySelector('.MComboBoxItems').innerHTML = '';
        if (ItemsArrayType == '1D') {
          for (let i = 0; i <= MFilteredItems.length - 1; i++) {
            MFilteredItemsCode += '<div tabindex="-1" style="display: flex;" class="MComboBoxItem" MCBIID="' + MFilteredItems[i]['MCBIID'] + '">' + MFilteredItems[i]['MCBIName'] + '</div>';
          }
        }
        if (ItemsArrayType == '2D') {
          for (let i = 0; i <= MFilteredItems.length - 1; i++) {
            MFilteredItemsCode += '<div tabindex="-1" style="display: flex;" class="MComboBoxItem" MCBIID="' + MFilteredItems[i]['MCBIID'] + '">' + MFilteredItems[i][ItemsName] + '</div>';
          }
        }

        Element.querySelector('.MComboBoxItems').innerHTML = MFilteredItemsCode;
        Element.querySelectorAll('.MComboBoxItem').forEach(function (e) {
          e.removeEventListener('click', null);
          e.addEventListener('click', function (event) {
            if (MultipleSelections == false) {
              Instance.SelectedItems = [];
              let SelectedItem = MFilteredItems.filter(MFilteredItem => MFilteredItem['MCBIID'] == event.target.getAttribute('MCBIID'))[0];
              Instance.SelectedItems.push(SelectedItem);
              HideDropDown();
            }
            if (MultipleSelections == true) {
              let SelectedItem = MFilteredItems.filter(MFilteredItem => MFilteredItem['MCBIID'] == event.target.getAttribute('MCBIID'))[0];
              let OldSelectedItems = Instance.SelectedItems.findIndex(OldSelectedItem => OldSelectedItem['MCBIID'] == SelectedItem['MCBIID']);
              if (OldSelectedItems == -1) {
                Instance.SelectedItems.push(SelectedItem);
              } else {
                Instance.SelectedItems = Instance.SelectedItems.filter(OldSelectedItem => OldSelectedItem['MCBIID'] != SelectedItem['MCBIID']);
              }
            }

            PopulateSelections();
            InputValidate();
            ShowHideClearBTN();

            const MCBValueChange = new CustomEvent("MCBValueChange", { detail: { MCBID: Element.getAttribute('SelectionID'), MCBValue: Element.querySelector('.MComboBoxValueInput').value, MCBData: Instance.SelectedItems } });
            Element.dispatchEvent(MCBValueChange);
          });
        });
      }
      function ShowDropDown() {
        Element.querySelector('.MComboBoxDropDown').style.display = 'flex';
        Element.querySelector('.MComboBoxChevron svg').style.transform = 'rotate(90deg)';
      }
      function HideDropDown() {
        Element.querySelector('.MComboBoxDropDown').style.display = 'none';
        Element.querySelector('.MComboBoxChevron svg').style.transform = 'rotate(0deg)';
      }
      function ShowHideClearBTN() {
        if (Element.getAttribute('MCBDisabled') != 'true') {
          if (Clearable == true && Element.querySelector('.MComboBoxValueInput').value != '') {
            Element.querySelector('.MComboBoxClearBTN').style.display = 'flex';
            Element.querySelector('.MComboBoxValueInput').style.width = 'calc(100% - 75px)';
          } else {
            Element.querySelector('.MComboBoxClearBTN').style.display = 'none';
            Element.querySelector('.MComboBoxValueInput').style.width = '';
          }
        } else {
          Element.querySelector('.MComboBoxClearBTN').style.display = 'none';
          Element.querySelector('.MComboBoxValueInput').style.width = 'calc(100% - 75px)';
        }
      }
      function InputValidate() {
        if (Element.querySelector('.MComboBoxValueInput').value) {
          Element.setAttribute('valid', true);
        } else {
          Element.removeAttribute('valid');
        }
      }
      function PopulateSelections() {
        var SelectedIDs = '';
        Element.querySelector('input').value = '';

        Element.querySelectorAll('.MComboBoxItem[Selected]').forEach(function (e) {
          e.removeAttribute('Selected');
        });

        for (let i = 0; i < Instance.SelectedItems.length; i++) {
          Element.querySelector('.MComboBoxItem[MCBIID="' + Instance.SelectedItems[i]['MCBIID'] + '"]').setAttribute('Selected', true);
          if (Element.querySelector('input').value != 0) {
            Element.querySelector('input').value += ' | ';
          }
          if (ItemsArrayType == '1D') {
            Element.querySelector('input').value += Instance.SelectedItems[i]['MCBIName'];
          }
          if (ItemsArrayType == '2D') {
            Element.querySelector('input').value += Instance.SelectedItems[i][ItemsName];
          }
          if (SelectedIDs != '') {
            SelectedIDs += '|';
          }
          SelectedIDs += Instance.SelectedItems[i]['MCBIID'];
        }

        ShowHideClearBTN();
        InputValidate();
        Element.setAttribute('SelectionID', SelectedIDs);
      }

      return {
        PopulateSelections: PopulateSelections,
      };
    },
    EnableDisable() {
      if (this.IsDisabled == true) {
        document.getElementById(this.Name).setAttribute('MCBDisabled', true)
      } else {
        document.getElementById(this.Name).removeAttribute('MCBDisabled')
      }
    },
    Get() {
      return this.SelectedItems;
    },
    GetValue() {
      return document.getElementById(this.Name).querySelector('.MComboBoxValueInput').value;
    },
    GetID() {
      if (!document.getElementById(this.Name).getAttribute('SelectionID')) {
        return [];
      }
      return document.getElementById(this.Name).getAttribute('SelectionID');
    },
    Set(Data, DataColumn = null, ItemsColumn = null) {
      var Element = document.getElementById(this.Name);
      nextTick(() => {
        this.SelectedItems = [];
        var ItemsArrayType = '';

        if (this.Items.every(item => Array.isArray(item) || (typeof item === 'object' && item !== null))) {
          ItemsArrayType = '2D';
        } else {
          ItemsArrayType = '1D';
        }

        if (ItemsArrayType == '1D') {
          if (typeof Data === "string" || typeof Data === "boolean" || (typeof Data === "number" && !isNaN(Data))) { // string, number, boolean
            let SelectedItem = this.MCBItems.filter(function (item) {
              if (item['MCBIName'] == Data) {
                return item;
              }
            })[0];

            this.SelectedItems.push(SelectedItem);
          } else {

            if (typeof Data[0] == "string") {
              for (let i = 0; i < Data.length; i++) {
                let SelectedItem = this.MCBItems.filter(function (item) {
                  if (item['MCBIName'] == Data[i]) {
                    return item;
                  }
                })[0];

                this.SelectedItems.push(SelectedItem);
              }
            } else {
              for (let i = 0; i < Data.length; i++) {
                let SelectedItem = this.MCBItems.filter(function (item) {
                  if (item['MCBIName'] == Data[i][DataColumn]) {
                    return item;
                  }
                })[0];

                this.SelectedItems.push(SelectedItem);
              }
            }
          }
        }

        if (ItemsArrayType == '2D') {
          if (typeof Data === "string" || typeof Data === "boolean" || (typeof Data === "number" && !isNaN(Data))) { // string, number, boolean
            let SelectedItem = this.MCBItems.filter(function (item) {
              if (item[DataColumn] == Data) {
                return item;
              }
            })[0];

            this.SelectedItems.push(SelectedItem);
          } else {
            if (Array.isArray(Data)) {
              for (let i = 0; i < Data.length; i++) {
                let SelectedItem = this.MCBItems.filter(function (item) {
                  if (item[ItemsColumn] == Data[i][DataColumn]) {
                    return item;
                  }
                })[0];

                this.SelectedItems.push(SelectedItem);
              }
            } else {
              let SelectedItem = this.MCBItems.filter(function (item) {
                if (item[ItemsColumn] == Data[DataColumn]) {
                  return item;
                }
              })[0];

              this.SelectedItems.push(SelectedItem);

            }
          }
        }

        const MCBValueChange = new CustomEvent("MCBValueChange", { detail: { MCBID: Element.getAttribute('SelectionID'), MCBValue: Element.querySelector('.MComboBoxValueInput').value, MCBData: this.SelectedItems } });
        Element.dispatchEvent(MCBValueChange);

        this.MComboBox.PopulateSelections();
      });
    },
    SetValue(TheValue) {
      nextTick(() => {
        document.getElementById(this.Name).querySelector('.MComboBoxValueInput').value = TheValue;
      });
    },
    SetID(TheValue) {
      nextTick(() => {
        document.getElementById(this.Name).setAttribute('SelectionID', TheValue);
      });
    },
    Disable() {
      nextTick(() => {
        this.IsDisabled = true;
        this.EnableDisable();
      });
    },
    Enable() {
      nextTick(() => {
        this.IsDisabled = false;
        this.EnableDisable();
      });
    },
    Clear() {
      nextTick(() => {
        this.SelectedItems = [];
        this.MComboBox.PopulateSelections();
      });
    },
  }
}
</script>

<style>
/* Light Mode Colors */
:root {
  --MComboBoxBG: #fff;
  --MComboBoxLabelColor: rgba(0, 0, 0, 0.6);
  --MComboBoxBorder: rgba(0, 0, 0, 0.6);
  --MComboBoxSVG: #666;
  --MComboBoxItemsBG: #fff;
  --MComboBoxItemsBorder: rgba(0, 0, 0, 0.6);
  --MComboBoxItemBG: rgba(0, 0, 0, 0.05);
  --MComboBoxFilled: rgba(0, 0, 0, 1);
  --MComboBoxDisabled: #777;
  --MComboBoxScroll: rgba(0, 0, 0, 0.3);
  --MComboBoxScrollHover: rgba(0, 0, 0, 0.6);
  --MComboBoxItemsSearchInputBG: rgba(0, 0, 0, 0.1);
  --MComboBoxItemsSearchInputPH: #666;
  --MComboBoxChevronBG: rgba(0, 0, 0, 0.05);
  --MComboBoxChevronBorder: #666;
  --MComboBoxItemBGHover: rgba(25, 118, 210, 0.1);
}

/* Dark Mode Colors */
.DarkMode {
  --MComboBoxBG: #2f3349;
  --MComboBoxLabelColor: rgba(255, 255, 255, 0.6);
  --MComboBoxBorder: rgba(255, 255, 255, 0.6);
  --MComboBoxSVG: #aaa;
  --MComboBoxItemsBG: #2f3349;
  --MComboBoxItemsBorder: rgba(255, 255, 255, 0.6);
  --MComboBoxItemBG: rgba(255, 255, 255, 0.05);
  --MComboBoxFilled: rgba(255, 255, 255, 1);
  --MComboBoxDisabled: #aaa;
  --MComboBoxScroll: rgba(255, 255, 255, 0.3);
  --MComboBoxScrollHover: rgba(255, 255, 255, 0.6);
  --MComboBoxItemsSearchInputBG: rgba(255, 255, 255, 0.1);
  --MComboBoxItemsSearchInputPH: #aaa;
  --MComboBoxChevronBG: rgba(255, 255, 255, 0.05);
  --MComboBoxChevronBorder: #aaa;
  --MComboBoxItemBGHover: rgba(25, 118, 210, 0.1);
}

/*rtl:begin:ignore*/
.MComboBox {
  display: flex;
  position: relative;
  max-height: 40px;
  height: 37px;
  margin: 15px 5px;
}

.MComboBox ::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.MComboBox ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 1);
}

.MComboBox ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.5);
}

.MComboBox ::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.6);
  width: 10px;
}

.MComboBox ::-webkit-scrollbar:hover * {
  width: 10px;
}

.MComboBox ::-webkit-scrollbar-track:hover {
  width: 10px;
}

.MComboBoxValueContainer {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  transition-duration: 0.3s;
  width: 100%;
  height: 100%;
  z-index: 1;
  align-items: center;
  justify-content: space-between;
}

.MComboBoxBG {
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: var(--MComboBoxBG);
  border: 1px solid var(--MComboBoxBorder);
  position: absolute;
  top: 0;
  right: 0;
  z-index: -1;
  transition-duration: 0.3s;
  box-sizing: border-box;
}

.MComboBox label {
  display: flex;
  width: min-content;
  position: absolute;
  pointer-events: none;
  top: calc(50% - 0.7em);
  right: 5px;
  font-family: 'MFontR';
  font-size: 14px;
  color: var(--MComboBoxLabelColor);
  transition-duration: 0.3s;
  padding: 0 3px;
  z-index: 5;
  white-space: nowrap;
}

.MComboBox label::before {
  content: '';
  position: absolute;
  height: 3px;
  width: 100%;
  bottom: 5px;
  right: 0;
  background-color: var(--MComboBoxBG);
  z-index: -1;
  transition-duration: 0.3s;
}

.MComboBoxValueInput {
  margin: 6px 8px;
  display: flex;
  width: calc(100% - 48px);
  height: calc(100% - 12px);
  padding: 0;
  background-color: rgba(0, 0, 0, 0);
  border: 0;
  outline: 0;
  font-family: 'MFontR';
  font-size: 15px;
  color: var(--TextColor);
}

.MComboBoxClearBTN {
  display: flex;
  position: absolute;
  left: 40px;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  min-width: 20px;
  max-width: 20px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.MComboBoxClearBTN svg {
  fill: var(--MComboBoxSVG);
  display: flex;
  width: 60%;
  height: 60%;
  transition-duration: 0.3s;
}

.MComboBoxClearBTN:hover svg {
  fill: var(--PrimaryColor);
}

.MComboBoxChevron {
  width: 15px;
  display: flex;
  padding: 11px 8px;
  transform: rotate(0);
  transition-duration: 0.3s;
  border-right: 1px solid var(--MComboBoxChevronBorder);
  background-color: var(--MComboBoxChevronBG);
}

.MComboBoxChevron svg {
  fill: var(--MComboBoxSVG);
  width: 100%;
  transition-duration: 0.3s;
}

.MComboBoxDropDown {
  position: absolute;
  display: flex;
  background-color: var(--MComboBoxItemsBG);
  border: 1px solid var(--PrimaryColor);
  border-radius: 5px;
  width: 100%;
  overflow-y: auto;
  top: calc(100% + 5px);
  z-index: 100;
  transition-duration: 0.3s;
  flex-wrap: wrap;
  justify-content: center;
  box-sizing: border-box;
}

.MComboBoxItemsSearch {
  display: flex;
  justify-content: center;
  width: 100%;
}

.MComboBoxItemsSearchInput {
  display: flex;
  width: 100%;
  margin: 7px;
  padding: 5px;
  border-radius: 5px;
  background-color: var(--MComboBoxItemsSearchInputBG);
  border: 0;
  color: var(--TextColor);
  outline: none;
  font-family: 'MFontR';
}

.MComboBoxItemsSearchInput::placeholder {
  color: var(--MComboBoxItemsSearchInputPH);
}

.MComboBoxItems {
  display: flex;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  transition-duration: 0.3s;
  flex-wrap: wrap;
}

.MComboBoxItem {
  font-family: 'MFontR';
  font-size: 14px;
  color: var(--TextColor);
  width: 100%;
  padding: 2px 10px;
  outline: none;
  user-select: none;
  cursor: pointer;
  min-height: 30px;
  transition-duration: 0.3s;
  align-items: center;
  margin: 0 7px 7px 7px;
  border-radius: 5px;
  background-color: var(--MComboBoxItemBG);
}

.MComboBoxItem:hover {
  background-color: var(--MComboBoxItemBGHover);
  color: var(--PrimaryColor);
}

.MComboBoxItem[selected] {
  background-color: var(--PrimaryColor);
  color: #fff;
  box-shadow: 0px 0px 6px 0px rgba(25, 118, 210, 0.8);
}

.MComboBoxItemHighlight {
  color: var(--PrimaryColor) !important;
}

.MComboBoxValueInput:focus~.MComboBoxBG {
  border: 1px solid var(--PrimaryColor);
}

.MComboBox[valid] .MComboBoxValueInput:not(:focus)~.MComboBoxBG {
  border: 1px solid var(--MComboBoxFilled);
}

.MComboBoxValueInput:focus~label {
  color: var(--PrimaryColor);
  top: -11.5px;
  font-size: 13px;
  font-family: 'MFontR';
}

.MComboBox[valid] .MComboBoxValueInput:not(:focus)~label {
  color: var(--MComboBoxFilled);
  top: -11.5px;
  font-size: 13px;
  font-family: 'MFontR';
}

.MComboBoxValueInput:focus~.MComboBoxChevron {
  border-color: var(--PrimaryColor);
}

.MComboBoxValueInput:focus~.MComboBoxChevron svg {
  fill: var(--PrimaryColor);
}

.MComboBox[valid] .MComboBoxValueInput:not(:focus)~.MComboBoxChevron {
  border-color: var(--MComboBoxFilled);
}

.MComboBox[valid] .MComboBoxValueInput:not(:focus)~.MComboBoxChevron svg {
  fill: var(--MComboBoxFilled);
}

.MComboBox[MCBDisabled] {
  pointer-events: none;
}

.MComboBox[MCBDisabled] .MComboBoxValueInput {
  color: var(--MComboBoxDisabled) !important;
}

.MComboBox[MCBDisabled] label {
  color: var(--MComboBoxDisabled) !important;
}

.MComboBox[MCBDisabled] .MComboBoxChevron {
  border-right-style: dashed;
}

.MComboBox[MCBDisabled] .MComboBoxBG {
  border: 1px dashed var(--MComboBoxDisabled) !important;
}

/*rtl:end:ignore*/
</style>
