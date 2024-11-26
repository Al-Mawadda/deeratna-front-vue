

<template >
  <div class="componentwrapper">
  <div class="login-container">
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="form.name"
            placeholder="Enter your username"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</div>
</template>


<script>
import { useAuthStore } from '../stores/auth';
import { ShowMessage } from '@/MJS.js';
export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
      },
      errorMessage: null,
    };
  },
  methods: {
    async login() {

        const authStore = useAuthStore();
        authStore.login(this.form.name,this.form.password).then(()=>{
          this.$router.push("/");
        }).catch((error)=>{
          ShowMessage("حدث خطا "+error);
        });
    },
  },
};
</script>

<style scoped>
.componentwrapper {
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f4f4f9;
}

.login-form {
  background: #fff;
  padding: 20px 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
.login-form form .form-group{
  width: 80%;
  align-items: center;
  margin:  auto ;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
