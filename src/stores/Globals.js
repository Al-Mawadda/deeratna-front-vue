import { defineStore } from 'pinia'

export const useGlobalsStore = defineStore('Globals', {
  state: () => ({
    MArray: [],
    Permissions: [],
  }),
  actions: {
    setMArray(Value) {
      this.MArray = Value
    },
    setPermissions(Value) {
      this.Permissions = Value
    },
  },
})
