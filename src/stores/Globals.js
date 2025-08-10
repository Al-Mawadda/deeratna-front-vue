import { defineStore } from 'pinia'
import axios from '../axios'

export const useGlobalsStore = defineStore('Globals', {
  state: () => ({
    MArray: [],
    ComboBoxes: [],
    User: null,
    Token: '',
  }),
  getters: {
    IsAuthenticated: (state) => Boolean(state.Token),
    CheckPermissions: (state) => (permissions) => {
      const UserPermissions = state.User?.permissions || []
      const list = Array.isArray(permissions) ? permissions : [permissions]
      return list.some(ThePermissions => UserPermissions.includes(ThePermissions)) ?? false;
    },
  },
  actions: {
    setMArray(Value) {
      this.MArray = Value
    },
    SetComboBoxes(Value) {
      this.ComboBoxes = Value
    },
    SetAuth(user, token) {
      this.User = user
      this.Token = token

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
    },
    ClearAuth() {
      this.User = null
      this.Token = ''

      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      delete axios.defaults.headers.common['Authorization']
    },
    InitializeAuth() {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');
      if (token && user) {
        try {
          this.Token = token;
          this.User = JSON.parse(user);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch {
          this.ClearAuth();
        }
      }
    },
  },
})
