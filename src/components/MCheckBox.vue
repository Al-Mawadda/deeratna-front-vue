<template>
  <div class="MCheckBox" :id="Name" :parent="Parent">
        <div class="MCheckBoxSubIcon"></div>

    <input :id="Name + 'Input'" type="checkBox" @change="OnChange">
    <label :for="Name + 'Input'">
      <div class="MCheckBoxMarkBox">
        <div class="MCheckBoxMark"></div>
      </div>
      <div class="MCheckBoxText">{{ Label }}</div>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    Name: { type: String, required: true },
    Label: { type: String, required: true },
    Visible: { type: Boolean, default: true },
    Disabled: { type: Boolean, default: false },
    Value: { type: Boolean, default: false },
    Parent: { type: String, default: null },
  },
  data() {
    return {
      Element: null,
      IsDisabled: false,
      TheValue: false,
    }
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
    this.TheValue = this.Value;

    this.EnableDisable();
    this.Set(this.TheValue);
  },
  emits: ['OnChange'],
  methods: {
    Get() {
      return this.Element.querySelector('input').checked;
    },
    Set(NewValue) {
      this.TheValue = NewValue;
      this.Element.querySelector('input').checked = this.TheValue;
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
      if (this.IsDisabled == true) {
        this.Element.querySelector('input').setAttribute('disabled', true)
      } else {
        this.Element.querySelector('input').removeAttribute('disabled')
      }
    },
    OnChange(e) {
      this.$emit('OnChange', this.Name, e.target.checked);
    }
  }
}

/* ========== Chain Checking (PUT THIS ON THE CALLING SIDE)
function MCheckBoxesChain(name, value) {
  let Instance = this;
  let ThePermission = Instance.Permissions.find(Permission => Permission.name === name);
  if (!ThePermission) return

  if (value) {
    CheckParents(ThePermission)
  } else {
    UncheckChildren(ThePermission)
  }

  //#region Functions
  function CheckParents(ThePermission) {
    if (!ThePermission) return

    Instance.MCheckBoxesRefs[ThePermission.name]?.Set(true)

    let ParentPermission = Instance.Permissions.find(Permission => Permission.id === ThePermission.parent_permission_id)
    CheckParents(ParentPermission)
  }
  function UncheckChildren(ThePermission) {
    if (!ThePermission) return

    Instance.MCheckBoxesRefs[ThePermission.name]?.Set(false)

    let ChildPermissions = Instance.Permissions.filter(
      Permission => Permission.parent_permission_id === ThePermission.id
    )
    ChildPermissions.forEach(child => UncheckChildren(child))
  }
  //#endregion
}
*/
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
  display: flex;
  user-select: none;
  width: min-content;
}

.MCheckBox:not([parent]) {
  margin-top: 5px;
}

.MCheckBoxSubIcon {
  display: none;
  width: 15px;
  height: 12px;
  margin: 0 8px 0 5px;
  border-right: 1px solid #888;
  border-bottom: 1px solid #888;
}

.MCheckBox[parent] .MCheckBoxSubIcon {
  display: flex;
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