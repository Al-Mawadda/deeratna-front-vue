import { defineStore } from 'pinia'

export const useGlobalsStore = defineStore('Globals', {
  state: () => ({
    MArray: [],
    Permissions: [],
    ComboBoxes: [],
  }),
  actions: {
    setMArray(Value) {
      this.MArray = Value
    },
    setPermissions(Value) {
      this.Permissions = Value
    },
    SetComboBoxes(Value) {
      this.ComboBoxes = Value
    },
  },
})
