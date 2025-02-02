<template>
  <div class="ComponentWrapper">
    <div class="MGroup">
      <div
        v-if="hasPermission('users_create')"
        class="MButton"
        id="LoginBTN"
        @click="openCreateUserDialog"
      >
        اضافة مستخدم جديد
      </div>

      <MTable
        ref="CarLabelsTB"
        :Name="'CarLabelsTB'"
        :DataArray="CarLabelsTBData"
        :HeadersArray="CarLabelsTBHeaders"
        :TotalsArray="CarLabelsTBTotals"
        :DisplayColumnsArray="CarLabelsTBDisplayColumns"
        :GetDataFunction="GetCarLabelsData"
        :RowsCount="CarLabelsTBRowsCount"
        :RowsPerPage="10"
      >
      </MTable>

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

    <div v-if="showUserDialog" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editMode ? 'تعديل بيانات المستخدم' : 'اضافة مستخدم جديد' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeDialog"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="editMode ? updateUser() : createUser()">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label>اسم المستخدم</label>
                  <input
                    type="text"
                    v-model="form.name"
                    class="form-control"
                    required
                  />
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
                <div
                  v-for="group in groupedPermissions"
                  :key="group.label"
                  class="permission-group mb-3"
                >
                  <label
                    ><strong>{{ group.label }}</strong></label
                  >
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
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeDialog"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


  <script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../../axios'
//import MTable from '../../components/MTable.vue'
import { useAuthStore } from '../../stores/auth'

const users = ref([])
const authStore = useAuthStore()

const hasPermission = permission => {
  return authStore.user && authStore.user.permissions.includes(permission)
}
const groupedPermissions = ref([
  {
    label: 'الطلبات',
    items: [
      { val: 'request_view', label: 'عرض الطلبات' },
      { val: 'info_view', label: 'عرض ادارة المعلومات' },
      { val: 'info_accept', label: 'قبول طلب إدارة المعلومات' },
      { val: 'info_reject', label: 'رفض طلب إدارة المعلومات ' },
      { val: 'entry_card_view', label: 'رؤية بطاقات الدخول' },
      { val: 'entry_card_accept', label: 'قبول طلب بطاقات الدخول' },
      { val: 'entry_card_reject', label: 'رفض طلب بطاقات الدخول ' },
      { val: 'car_label_view', label: 'عرض ملصق السيارة' },
      { val: 'car_label_accept', label: 'قبول طلب ملصق السيارة' },
      { val: 'car_label_reject', label: 'رفض طلب ملصق السيارة' },
      { val: 'internet_requests_view', label: 'عرض طلبات الانترنيت' },
    ],
  },
  {
    label: 'الدفع الإلكتروني',
    items: [
      { val: 'on_pay_view', label: 'رؤية الدفع الإلكتروني' },
      { val: 'on_pay_inst', label: 'عرض دفعات الأقساط' },
      { val: 'on_pay_ene', label: 'عرض دفعات المولد' },
      { val: 'on_pay_ser', label: 'عرض دفعات الخدمات' },
      { val: 'on_pay_nfcadd', label: 'عرض دفعات بطاقات الدخول' },
      { val: 'on_pay_nfcrenew', label: 'عرض دفعات تجديد بطاقات الدخول' },
      { val: 'on_pay_caradd', label: 'عرض دفعات ملصق السيارة' },
      { val: 'on_pay_carrenew', label: 'عرض دفعات تجديد ملصق السيارة' },
    ],
  },
  {
    label: 'إدارة المستخدمين',
    items: [
      { val: 'users_view', label: 'عرض المستخدمين' },
      { val: 'users_create', label: 'إنشاء مستخدم' },
      { val: 'users_update', label: 'تعديل المستخدمين' },
      { val: 'users_delete', label: 'حذف المستخدم' },
    ],
  },
  {
    label: 'إدارة الإعلانات',
    items: [
      { val: 'ads_view_all', label: 'عرض الإعلانات' },

      { val: 'ads_video_view', label: 'عرض إعلانات الفيديوا' },
      { val: 'ads_video_create', label: 'إنشاء فيديو جديد' },
      { val: 'ads_video_delete', label: 'حذف الفيديو' },

      { val: 'ads_main_view', label: 'عرض الاعلانات العامة' },
      { val: 'ads_main_create', label: 'انشاء الاعلانات العامة' },
      { val: 'ads_main_delete', label: 'حذف الاعلانات العامة' },

      { val: 'ads_ser_view', label: 'عرض اعلانات الخدمات' },
      { val: 'ads_ser_create', label: 'انشاء اعلانات الخدمات' },
      { val: 'ads_ser_delete', label: 'حذف اعلانات الخدمات' },

      { val: 'ads_ene_view', label: 'عرض اعلانات المولد' },
      { val: 'ads_ene_create', label: 'انشاء اعلانات المولد' },
      { val: 'ads_ene_delete', label: 'حذف اعلانات المولد' },
    ],
  },
  {
    label: 'الانترنت',
    items: [
      { val: 'internet_view_all', label: 'الانترنت' },

      { val: 'subscribers_view', label: 'عرض بيانات المشتركين' },

      { val: 'profile_view', label: 'عرض الاشتراكات' },
    ],
  },
])

const showUserDialog = ref(false)
const editMode = ref(false)
const form = ref({ id: null, name: '', password: '', permissions: [] })

const processedUsers = computed(() =>
  users.value.map(user => ({
    ...user,
    permissions: user.permissions.map(perm => getPermissionLabel(perm)),
  }))
)

const fetchUsers = async () => {
  try {
    const response = await api.get('/users')
    users.value = response.data
  } catch {
    alert('فشل في تحميل المستخدمين')
  }
}

const openCreateUserDialog = () => {
  editMode.value = false
  resetForm()
  showUserDialog.value = true
}

const openUpdateUserDialog = user => {
  editMode.value = true
  form.value = { ...user, permissions: user.permissions }
  showUserDialog.value = true
}

const createUser = async () => {
  try {
    await api.post('/users', { ...form.value })
    alert('تم إنشاء المستخدم بنجاح!')
    fetchUsers()
    closeDialog()
  } catch {
    alert('فشل في إنشاء المستخدم.')
  }
}

const updateUser = async () => {
  try {
    await api.put(`/users/${form.value.id}`, { ...form.value })
    alert('تم تحديث المستخدم بنجاح!')
    fetchUsers()
    closeDialog()
  } catch {
    alert('فشل في تحديث المستخدم.')
  }
}

const deleteUser = async id => {
  try {
    await api.delete(`/users/${id}`)
    alert('تم حذف المستخدم بنجاح!')
    fetchUsers()
  } catch {
    alert('فشل في حذف المستخدم.')
  }
}

const closeDialog = () => {
  resetForm()
  showUserDialog.value = false
}

const resetForm = () => {
  form.value = { id: null, name: '', password: '', permissions: [] }
}

const getPermissionLabel = perm =>
  groupedPermissions.value
    .flatMap(group => group.items)
    .find(item => item.val === perm)?.label || perm

onMounted(fetchUsers)
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
