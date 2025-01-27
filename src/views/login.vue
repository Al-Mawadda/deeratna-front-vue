<template>
  <div class="ComponentWrapper">
    <div class="MGroup">
      <div class="MGroupTitle">تسجيل الدخول</div>
      <div class="MField" id="username">
        <input type="text" required />
        <label>اسم المستخدم</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="password">
        <input type="password" required />
        <label>كلمة المرور</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MButton" id="LoginBTN" @click="login">تسجيل الدخول</div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { ShowMessage, ShowLoading, HideLoading } from '@/MJS.js'
export default {
  methods: {

    async login() {
    const username = document.getElementById('username').querySelector('input').value;
    const password = document.getElementById('password').querySelector('input').value;

    if (!username || !password) {
      ShowMessage('يجب ادخال اسم المستخدم وكلمة المرور');
      return;
    }

    ShowLoading();
    const authStore = useAuthStore();
    authStore
      .login(username, password)
      .then(() => {
        HideLoading();
        this.$router.push('/');
      })
      .catch(() => {
        HideLoading();
        ShowMessage('خطأ في بيانات الدخول');
      });
  },
  },
}
</script>

<style scoped>
.ComponentWrapper {
  display: flex;
  flex-wrap: wrap;
  position: fixed;
  z-index: 11;
  top: 0;
  right: 0;
  background-color: var(--BGColor);
  justify-content: center;
  width: 100vw;
  height: 100vh;
  align-items: center;
  padding: 0;
  margin: 0;
}
.MGroup {
  padding: 30px 50px;
  width: 70%;
  max-width: 300px;
  min-width: 300px;
}
.MField {
  min-width: 100%;
  margin: 10px;
}
.MButton {
  margin-top: 20px;
}
</style>
