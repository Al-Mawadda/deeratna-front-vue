<template>
  <div class="user-management">
    <!-- Title Section -->
    <div class="card">
      <div class="card-header text-center">
        <h5>إدارة المستخدمين</h5>
      </div>

      <!-- Add Button -->
      <div class="card-body">
        <div class="row justify-between items-center mb-3">
          <button v-if="hasPermission('users_create')" class="btn btn-primary" @click="openCreateUserDialog">
            اضافة مستخدم جديد
          </button>
        </div>

        <!-- Users Table -->
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>المعرف</th>
              <th>اسم المستخدم</th>
              <th>الصلاحيات</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in processedUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>
                <div class="chip-container">
                  <span
                    v-for="permission in user.permissions"
                    :key="permission"
                    class="badge badge-primary me-1"
                  >
                    {{ permission }}
                  </span>
                </div>
              </td>
              <td>
                <button
                  v-if="hasPermission('users_update')"
                  class="btn btn-sm btn-warning me-1"
                  @click="openUpdateUserDialog(user)"
                >
                  تعديل
                </button>
                <button
                  v-if="hasPermission('users_delete')"
                  class="btn btn-sm btn-danger"
                  @click="deleteUser(user.id)"
                >
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit User Dialog -->
    <div v-if="showUserDialog" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editMode ? 'تعديل بيانات المستخدم' : 'اضافة مستخدم جديد' }}</h5>
            <button type="button" class="btn-close" @click="closeDialog"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="editMode ? updateUser() : createUser()">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label>اسم المستخدم</label>
                  <input type="text" v-model="form.name" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label>كلمة المرور</label>
                  <input
                    type="password"
                    v-model="form.password"
                    class="form-control"
                    required
                  />
                </div>
              </div>

              <!-- Permissions -->
              <div class="permissions-tree mt-3">
                <div v-for="group in groupedPermissions" :key="group.label" class="permission-group mb-3">
                  <label><strong>{{ group.label }}</strong></label>
                  <div class="permissions-items">
                    <div
                      v-for="permission in group.items"
                      :key="permission.val"
                      class="form-check"
                    >
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :id="permission.val"
                        v-model="form.permissions"
                        :value="permission.val"
                      />
                      <label :for="permission.val" class="form-check-label">
                        {{ permission.label }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4">
                <button type="submit" class="btn btn-primary w-100">حفظ</button>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDialog">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from '../../axios';
import { useAuthStore } from '../../stores/auth';
const users = ref([]);
const authStore = useAuthStore()

// Check permission
const hasPermission = permission => {
      return authStore.user && authStore.user.permissions.includes(permission)
    }
const groupedPermissions = ref([
  {
    label: 'الطلبات',
    items: [
      { val: 'request_view', label: 'عرض الطلبات' },
      { val: 'info_view', label: 'عرض ادارة المعلومات' },
    ],
  },
  {
    label: 'الدفع الإلكتروني',
    items: [
      { val: 'on_pay_view', label: 'رؤية الدفع الإلكتروني' },
      { val: 'on_pay_inst', label: 'عرض دفعات الأقساط' },
    ],
  },
  {
    label: 'إدارة المستخدمين',
    items: [
      { val: 'users_view', label: 'عرض المستخدمين' },
      { val: 'users_create', label: 'إنشاء مستخدم' },
    ],
  },
]);

const showUserDialog = ref(false);
const editMode = ref(false);
const form = ref({ id: null, name: '', password: '', permissions: [] });

const processedUsers = computed(() =>
  users.value.map((user) => ({
    ...user,
    permissions: user.permissions.map((perm) => getPermissionLabel(perm)),
  }))
);

const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    users.value = response.data;
  } catch {
    alert('فشل في تحميل المستخدمين');
  }
};

const openCreateUserDialog = () => {
  editMode.value = false;
  resetForm();
  showUserDialog.value = true;
};

const openUpdateUserDialog = (user) => {
  editMode.value = true;
  form.value = { ...user, permissions: user.permissions };
  showUserDialog.value = true;
};

const createUser = async () => {
  try {
    await api.post('/users', { ...form.value });
    alert('تم إنشاء المستخدم بنجاح!');
    fetchUsers();
    closeDialog();
  } catch {
    alert('فشل في إنشاء المستخدم.');
  }
};

const updateUser = async () => {
  try {
    await api.put(`/users/${form.value.id}`, { ...form.value });
    alert('تم تحديث المستخدم بنجاح!');
    fetchUsers();
    closeDialog();
  } catch {
    alert('فشل في تحديث المستخدم.');
  }
};

const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    alert('تم حذف المستخدم بنجاح!');
    fetchUsers();
  } catch {
    alert('فشل في حذف المستخدم.');
  }
};

const closeDialog = () => {
  resetForm();
  showUserDialog.value = false;
};

const resetForm = () => {
  form.value = { id: null, name: '', password: '', permissions: [] };
};

const getPermissionLabel = (perm) =>
  groupedPermissions.value
    .flatMap((group) => group.items)
    .find((item) => item.val === perm)?.label || perm;

onMounted(fetchUsers);
</script>


<style scoped>
.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
}
.permissions-tree {
  margin-top: 1rem;
}
.permission-group {
  margin-bottom: 1rem;
}
.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}
</style>
