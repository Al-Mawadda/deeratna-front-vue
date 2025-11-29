<template>
  <div class="ComponentWrapper">
    <div class="MGroup">
      <div class="MGroupTitle">تسجيل الدخول</div>
      <div class="MField" id="Username">
        <input type="text" required />
        <label>اسم المستخدم</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Password">
        <input type="password" required />
        <label>كلمة المرور</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MButton" id="LoginBTN" @click="Login">تسجيل الدخول</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { api } from '../axios.js';
import { useGlobalsStore } from '../stores/Globals.js'
import { getFcmToken } from '../firebase.js'
export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore());
    return {
      GlobalsStore,
    }
  },
  mounted() {
    let Instance = this;
    document.getElementById('Username').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        Instance.Login();
      }
    });
    document.getElementById('Password').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        Instance.Login();
      }
    });
  },
  methods: {
    async Login() {
      window.ShowLoading();
      try {
        const Username = document.getElementById('Username').querySelector('input').value;
        const Password = document.getElementById('Password').querySelector('input').value;

        let fcmToken = '';
        try {
          fcmToken = (await getFcmToken()) || '';
        } catch {
          fcmToken = '';
        }

        const response = await api.post('Login', {
          username: Username,
          password: Password,
          fcm: fcmToken,
        }, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        window.HideLoading();
        if (response.data['success'] == true) {
          this.GlobalsStore.SetAuth(
            response.data.user,
            response.data.token
          )
          this.$router.push('/');
        } else {
          window.ShowMessage(response.data['message']);
        }
      } catch {
        window.HideLoading();
        window.ShowMessage('حدث خطا');
      }
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
