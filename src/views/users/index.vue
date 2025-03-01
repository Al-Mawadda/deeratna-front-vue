<template>
  <div class="ComponentWrapper">
    <div class="MGroup">
      <div v-if="hasPermission('users_create')" class="MButton" id="LoginBTN" @click="openCreateUserDialog">
        اضافة مستخدم جديد
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
                <span v-for="permission in user.permissions" :key="permission" class="badge badge-primary me-1">
                  {{ permission }}
                </span>
              </div>
            </td>
            <td>
              <div v-if="hasPermission('users_update')" class="MButton me-1" @click="openUpdateUserDialog(user)">
                تعديل
              </div>
              <div v-if="hasPermission('users_delete')" class="MButton" @click="deleteUser(user.id)">
                حذف
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showUserDialog" class="custom-modal-overlay">
      <div class="custom-modal">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? 'تعديل بيانات المستخدم' : 'اضافة مستخدم جديد' }}
          </h5>
          <div class="close-btn MButton" @click="closeDialog">×</div>
        </div>
        <div class="modal-body">
          <form>
            <div class="row mb-3">
              <div class="MField">
                <input v-model="form.name" type="text" required />
                <label>اسم المستخدم</label>
                <div class="MFieldBG"></div>
              </div>
              <span style="height: 25px !important; width: 100% !important"></span>
              <div class="MField">
                <input v-model="form.password" type="password" required />
                <label>كلمة المرور</label>
                <div class="MFieldBG"></div>
              </div>
              <MComboBox ref="UserType" :Name="'UserType'" :Label="' نوع المستخدم *'" :Items="UserTypeItems">
              </MComboBox>
            </div>

            <!-- Permissions -->
            <div class="permissions-tree mt-3">
              <!-- Global Select All Button -->
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h4 class="text-white">الأذونات</h4>
              </div>

              <!-- Permission Groups -->
              <div v-for="group in groupedPermissions" :key="group.label" class="permission-group mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label><strong>{{ group.label }}</strong></label>
                </div>
                <div class="permissions-items">
                  <div class="permissions-grid">
                    <!-- Permission Items -->
                    <div v-for="permission in group.items" :key="permission.val" class="form-check permission-item">
                      <input type="checkbox" class="form-check-input" :id="permission.val" v-model="form.permissions"
                        :value="permission.val" />
                      <label :for="permission.val" class="form-check-label">
                        {{ permission.label }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr />
            <div class="ModalButtons">
              <div class="MButton" id="SavePersonBTN" @click.prevent="editMode ? updateUser() : createUser()">
                حفـــظ
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <div class="MButton" @click="closeDialog">إلغاء</div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../../axios'
import { useAuthStore } from '../../stores/auth'
import { useGlobalsStore } from '../../stores/Globals.js'

const users = ref([])
const authStore = useAuthStore()

const hasPermission = permission => {
  return authStore.user && authStore.user.permissions.includes(permission)
}
const UserType = ref(null)
const globalsStore = useGlobalsStore()
const UserTypeItems = ref([])
const groupedPermissions = ref(
  [
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
    {
      label: 'خطار',
      items: [
        {
          val: 'qr_security',
          label: 'تطبيق خطار الامنية'
        },

        {
          val: 'qr_managment',
          label: 'تطبيق خطار الادارة المحلية'
        },
      ],
    },
  ].map(group => ({
    ...group,
    items: group.items.map(item => ({
      ...item,
      val: item.val.trim(),
    })),
  }))
)

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

  const reversedPermissions = user.permissions
    .map(label => {
      const found = groupedPermissions.value
        .flatMap(group => group.items)
        .find(item => item.label === label)
      return found ? found.val : null
    })
    .filter(Boolean)

  form.value = { ...user, permissions: reversedPermissions }
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

onMounted(async () => {
  UserTypeItems.value = globalsStore.ComboBoxes['userType'] || [], fetchUsers()
})

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

/* Modal Overlay */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  /* Slightly darker background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 10px;
  /* Adds spacing for small screens */
}

/* Modal Container */
.custom-modal {
  background: #2b2b2b;
  /* Dark background for better visibility */
  width: 80%;
  /* 80% width of the screen */
  max-width: 1200px;
  /* Max width for larger screens */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
  overflow: hidden;
  /* Prevent content from overflowing */
  color: #fff;
  /* White text for contrast */
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
}

/* Close Button */
.close-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
}

/* Modal Body */
.modal-body {
  margin-top: 10px;
  max-height: 70vh;
  /* Restricts height for better responsiveness */
  overflow-y: auto;
  /* Adds scrolling if content overflows */
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .custom-modal {
    width: 95%;
    /* Reduce width for smaller screens */
    padding: 15px;
  }

  .modal-body {
    max-height: 60vh;
    /* Reduce height for smaller screens */
  }
}

/* Fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.form-check-input {
  accent-color: #007bff;
  /* Custom checkbox color */
}

.modal-body {
  max-height: 70vh;
  /* Limit modal height */
  overflow-y: auto;
  /* Enable scrolling if content is too long */
}

/* Permissions Tree */
.permissions-tree {
  background-color: #1e1e1e;
  /* Dark background for better visibility */
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

/* Permission Group */
.permission-group {
  margin-bottom: 30px;
  /* Add spacing between sections */
  padding-bottom: 10px;
  /* Optional: Adds padding inside each group */
  border-bottom: 1px solid #444;
  /* Optional: Divider between sections */
}

.permission-group:last-child {
  margin-bottom: 0;
  /* Remove margin for the last section */
  border-bottom: none;
  /* Remove divider for the last section */
}

/* Permissions Grid */
.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  /* Auto-adjust columns */
  gap: 15px;
  /* Spacing between items */
  margin-top: 10px;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 10px;
  /* Spacing between checkbox and label */
}

.permission-group label strong {
  color: #ffffff;
  /* White text for better contrast */
  margin-bottom: 10px;
  /* Space between the title and checkboxes */
  display: inline-block;
  /* Ensure margin applies properly */
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 5px;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.permission-group {
  margin-bottom: 20px;
}

.permission-group button {
  margin-left: 10px;
}
</style>
