<template>
  <div class="ComponentWrapper">
    <div class="MGroup">
      <div class="MGroupTitle">معلومات المستخدم</div>
      <div class="MField" v-show="$route.meta.Operation == 'EDIT'" id="ID">
        <input disabled type="text" required>
        <label>الرمز</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Username">
        <input type="text" required>
        <label>اسم المستخدم</label>
        <div class="MFieldBG"></div>
      </div>
      <div class="MField" id="Password">
        <input type="password" required>
        <label>كلمة المرور</label>
        <div class="MFieldBG"></div>
      </div>
      <MComboBox ref='Status' :Name="'Status'" v-show="$route.meta.Operation == 'EDIT'" :Label="'الحالة'"
        :Items="StatusItems"></MComboBox>
      <MComboBox ref='Department' :Name="'Department'" :Disabled="DepartmentItems.length == 1" :Label="'القسم'"
        :ItemsName="'name'" :Items="DepartmentItems">
      </MComboBox>
      <MComboBox ref='Compounds' :Name="'Compounds'" :Disabled="CompoundsItems.length == 1" :Label="'المدينة'"
        :MultipleSelections="true" :Items="CompoundsItems"></MComboBox>

    </div>
    <div class="MGroup" id="PermissionsMGroup" v-if="FormPermissions">
      <div class="MGroupTitle">الصلاحيات</div>
      <div class="PermissionsContainer"
        v-show="FormPermissionsGroups.slice(0, Math.ceil(FormPermissionsGroups.length / 2)).length != 0">
        <div v-for="TheGroup in FormPermissionsGroups.slice(0, Math.ceil(FormPermissionsGroups.length / 2))"
          :key="TheGroup.group_name">
          <div class="PermissionGroupTitle">{{ TheGroup.group_name }}</div>
          <MCheckBox v-for="Permission in TheGroup.permissions" :key="Permission.id" :Name="Permission.name"
            :ref="TheRefs => (MCheckBoxesRefs[Permission.name] = TheRefs)" :Label="Permission.label"
            :Parent="GetMCheckBoxParentName(Permission.parent_permission_id)"
            @OnChange="(name, Value) => { MCheckBoxesChain(name, Value); }" />
        </div>
      </div>
      <div class="PermissionsContainer"
        v-show="FormPermissionsGroups.slice(Math.ceil(FormPermissionsGroups.length / 2)).length != 0">
        <div v-for="TheGroup in FormPermissionsGroups.slice(Math.ceil(FormPermissionsGroups.length / 2))"
          :key="TheGroup.group_name">
          <div class="PermissionGroupTitle">{{ TheGroup.group_name }}</div>
          <MCheckBox v-for="Permission in TheGroup.permissions" :key="Permission.id" :Name="Permission.name"
            :ref="TheRefs => (MCheckBoxesRefs[Permission.name] = TheRefs)" :Label="Permission.label"
            :Parent="GetMCheckBoxParentName(Permission.parent_permission_id)"
            @OnChange="(name, Value) => { MCheckBoxesChain(name, Value); }" />
        </div>
      </div>
    </div>
    <div class="ComponentButtons">
      <div class="MButton" id="SaveBTN"
        v-show="(Operation == 'ADD' && GlobalsStore.CheckPermissions('users_add')) || (Operation == 'EDIT' && GlobalsStore.CheckPermissions('users_edit'))"
        @click="Save">حفظ</div>
      <div class="MButton" id="DeleteBTN" v-show="Operation == 'EDIT' && GlobalsStore.CheckPermissions('users_delete')"
        @click="Delete">حذف</div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { api } from '../../axios.js';
import { useGlobalsStore } from '../../stores/Globals.js';

export default {
  setup() {
    const GlobalsStore = ref(useGlobalsStore());

    return {
      GlobalsStore,
      Operation: ref(''),
      ID: ref(0),
      Status: ref(null),
      StatusItems: ref([]),
      Department: ref(null),
      DepartmentItems: ref([]),
      Compounds: ref(null),
      CompoundsItems: ref([]),
      FormPermissions: ref([]),
      FormPermissionsGroups: ref([]),
      MCheckBoxesRefs: reactive({}),

    };
  },
  mounted() {
    this.Operation = this.$route.meta.Operation;
    this.StatusItems = this.GlobalsStore.ComboBoxes['Status'];
    this.CleanForm();
    this.GetUserFormItems();
  },
  methods: {
    ComponentLoad() {
      let Instance = this;

      if (Instance.Operation == 'EDIT') {
        Instance.ID = Instance.GlobalsStore.MArray['id'];
        document.getElementById('ID').querySelector('input').value = Instance.GlobalsStore.MArray['id'];
        document.getElementById('Username').querySelector('input').value = Instance.GlobalsStore.MArray['username'];
        Instance.Status.Set(Instance.GlobalsStore.MArray['status']);

        Instance.Department.Set(Instance.GlobalsStore.MArray['department_id'], 'id');
        Instance.Compounds.Set(Instance.GlobalsStore.MArray['compounds'], 'compound');

        if (!Instance.GlobalsStore.CheckPermissions('users_edit')) {
          this.DisableAllInputs();
        }

        setTimeout(() => {
          Object.entries(Instance.MCheckBoxesRefs).forEach(([name, TheRef]) => {
            if (Instance.GlobalsStore.MArray['permissions'].some(Permission => Permission.permissions_name == name)) {
              TheRef?.Set(true)
            } else {
              TheRef?.Set(false)
            }
          });
        }, 10);
      }
    },
    CleanForm() {
      this.DepartmentItems = [];
      this.CompoundsItems = [];
      this.FormPermissions = [];
      this.FormPermissionsGroups = [];

      document.querySelectorAll('input').forEach(function (e) {
        e.value = '';
      });

      this.Status.Clear();
      this.Department.Clear();
      this.Compounds.Clear();

      Object.values(this.MCheckBoxesRefs).forEach(MCheckBox => {
        MCheckBox?.Set(false);
      });
    },
    Save() {
      window.ShowLoading();
      let SelectedPermissions = [];
      Object.entries(this.MCheckBoxesRefs).forEach(([name, TheRef]) => {
        if (TheRef.Get()) {
          SelectedPermissions.push(name);
        }
      });

      let Parameters = new FormData();

      Parameters.append('id', this.ID);
      Parameters.append('username', document.getElementById('Username').querySelector('input').value);
      Parameters.append('password', document.getElementById('Password').querySelector('input').value);
      Parameters.append('status', this.Status.GetValue());
      Parameters.append('department_id', this.Department.Get('id')[0]);

      Parameters.append('compounds', JSON.stringify(this.Compounds.Get('MCBIName')));
      Parameters.append('permissions', JSON.stringify(SelectedPermissions));

      if (this.Operation == 'ADD') {
        api.post('AddUser', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            window.HideLoading();
            this.$router.back();
          } else {
            window.HideLoading();
            window.ShowMessage(response.data);
          }
        }).catch(error => {
          window.HideLoading();
          window.ShowMessage(error);
        });
      }

      if (this.Operation == 'EDIT') {
        api.post('EditUser', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            window.HideLoading();
            this.$router.back();
          } else {
            window.HideLoading();
            window.ShowMessage(response.data);
          }
        }).catch(error => {
          window.HideLoading();
          window.ShowMessage(error);
        });
      }
    },
    Delete() {
      var YesFunction = function () {
        window.ShowLoading();
        window.HideChoose();
        api.post("DeleteUser", null, {
          params: {
            id: this.ID,
          }
        }).then(response => {
          if (response.data == 'تمت العملية بنجاح') {
            this.$router.back();
          } else {
            window.ShowMessage(response.data);
          }
          window.HideLoading();
        }).catch(error => {
          window.HideLoading();
          window.ShowMessage(error);
        });
      }.bind(this);
      var NoFunction = function () {
        window.HideChoose();
      }
      window.ShowChoose('هل انت متاكد من عملية الحذف؟', YesFunction, NoFunction);
    },
    GetUserFormItems() {
      window.ShowLoading();
      api.get('GetUserFormItems').then(response => {
        window.HideLoading();
        this.DepartmentItems = response.data.departments;
        this.CompoundsItems = response.data.compounds;
        this.FormPermissions = response.data.permissions;

        this.FormPermissionsGroups = response.data.permissions.reduce((acc, Permission) => {
          let Group = acc.find(g => g.group_name === Permission.permissions_group)
          if (!Group) {
            Group = { group_name: Permission.permissions_group, permissions: [] }
            acc.push(Group)
          }
          Group.permissions.push(Permission)
          return acc
        }, []);

        if (this.Operation == 'ADD') {
          if (this.DepartmentItems.length == 1) {
            this.Department.Set(this.DepartmentItems[0]);
          }

          if (this.CompoundsItems.length == 1) {
            this.Compounds.Set(this.CompoundsItems[0]);
          }
        }
        if (this.Operation == 'EDIT') {
          this.ComponentLoad();
        }
      }).catch(() => {
        this.Department.Clear();
        this.Compounds.Clear();

        this.DepartmentItems = [];
        this.CompoundsItems = [];
        this.FormPermissions = [];

        window.HideLoading();
        window.ShowMessage('حدث خطا');
      });
    },
    MCheckBoxesChain(name, value) {
      let Instance = this;
      let ThePermission = Instance.FormPermissions.find(Permission => Permission.name === name);
      if (!ThePermission) return

      if (value) {
        CheckParents(ThePermission)
      } else {
        UncheckChildren(ThePermission)
      }

      //#region Functions
      function CheckParents(ThePermission) {
        if (!ThePermission) return

        Instance.MCheckBoxesRefs[ThePermission.name]?.Set(true)

        let ParentPermission = Instance.FormPermissions.find(Permission => Permission.id === ThePermission.parent_permission_id)
        CheckParents(ParentPermission)
      }
      function UncheckChildren(ThePermission) {
        if (!ThePermission) return

        Instance.MCheckBoxesRefs[ThePermission.name]?.Set(false)

        let ChildPermissions = Instance.FormPermissions.filter(
          Permission => Permission.parent_permission_id === ThePermission.id
        )
        ChildPermissions.forEach(child => UncheckChildren(child))
      }
      //#endregion
    },
    GetMCheckBoxParentName(ID) {
      if (ID != 0) {
        return this.FormPermissions.find(Permission => Permission.id === ID)['name'];
      } else {
        return null;
      }
    },
    DisableAllInputs() {
      document.querySelectorAll('input').forEach(function (e) {
        e.disabled = true;
      });

      this.Status.Disable();
      this.Department.Disable();
      this.Compounds.Disable();

      setTimeout(() => {
        Object.values(this.MCheckBoxesRefs).forEach(MCheckBox => {
          MCheckBox?.Disable();
        });
      }, 10);
    }
  }
}
</script>

<style scoped>
#DeleteBTN {
  background-color: red;
}

#DeleteBTN:hover {
  background-color: var(--MButtonBG);
  color: red;
}

.MField,
.MComboBox {
  min-width: 200px;
}

#PermissionsMGroup {
  display: flex;
  align-items: flex-start;
}

.PermissionsContainer {
  width: calc(50% - 40px);
  padding: 0 30px 20px 30px;
  margin: 5px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.1);
  min-width: 300px;
  flex: 1;
}

.PermissionGroupTitle {
  display: flex;
  font-size: 14px;
  font-family: 'MFontB';
  margin: 15px 0 3px 0;
  padding: 5px 0;
  border-bottom: 1px solid #888;
}
</style>
