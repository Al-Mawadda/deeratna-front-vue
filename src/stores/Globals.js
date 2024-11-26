import { defineStore } from 'pinia';

export const useGlobalsStore = defineStore('Globals', { 
  state: () => ({
    MArray: [],
  }),
  actions: {
    setMArray(Value) {
      this.MArray = Value;
    },
  },
});