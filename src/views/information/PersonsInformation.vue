<template>
  <div class="ComponentWrapper">
    <div class="MGroup">
      <MTable
        ref="PersonsTB"
        :Name="'PersonsTB'"
        :DataArray="PersonsTBData"
        :HeadersArray="PersonsTBHeaders"
        :TotalsArray="PersonsTBTotals"
        :DisplayColumnsArray="PersonsTBDisplayColumns"
        :GetDataFunction="GetPersonsData"
        :RowsCount="PersonsTBRowsCount"
        :RowsPerPage="10"
      >
        <template v-slot:options>
          <!-- View Videosdffhroif Option -->
          <div class="MTableOption" OptionEventName="ViewItem">
            <div class="MTableOptionIcon">
              <svg viewBox="0 0 1000 1000">
                <path
                  d="M500.2,249.6c124.1,1.1,233.2,42.7,328.2,122.1c39.6,33,72.3,72.7,106.8,110.6c9,9.9,8.7,25.5-0.8,36.4
  c-53.9,62.1-109.3,122.5-182.1,163.7c-66,37.4-136.2,60.8-212,66.4C399.6,759.2,276.4,716.6,169,626.3
  C130.9,594.3,99.2,556,66,519.3c-10-11-10.5-26-0.9-37.1c53.3-61.5,107.9-121.4,179.6-162.7c66.8-38.5,138-62.1,215.1-68.3
  C473.2,250.2,486.7,250.1,500.2,249.6z M504.7,308.1c-19.4,0.8-34.9,0.7-50.4,2.2c-61.5,6.1-119,24.8-173,54.6
  c-59.2,32.7-106.2,79.4-150.3,129.6c-4.1,4.7-3.1,8.1,0.7,12.1c21.3,22.2,40.9,45.9,63.9,66.5c86.2,77.3,186.4,118.2,302.7,118.9
  c68.3,0.4,133-14.2,194.7-43.2c70.8-33.3,126.2-85.4,176.6-143.7c4-4.6,2-7.9-1.3-11.3c-21.3-22.2-40.9-45.9-63.8-66.6
  C718.1,349.4,617.3,308.9,504.7,308.1z"
                />
                <path
                  d="M392.3,499.7c0.2-59,49.3-108.3,108.1-107.4c60.6,0.9,107.4,47.4,107.2,108c-0.2,60.9-47.5,106.9-107.8,107.4
  C440.8,608.1,392.1,558.6,392.3,499.7z M500.2,556.5c30.5,0,56.4-25.9,56.4-56.4c0-30.6-25.7-56.5-56.2-56.6
  c-31-0.1-56.9,25.8-56.8,56.8C443.8,530.8,469.7,556.6,500.2,556.5z"
                />
              </svg>
            </div>
            <div class="MTableOptionName">عرض</div>
          </div>
        </template>
      </MTable>
    </div>
  </div>
</template>

<!-- ======================================== -->
<script>
import { ref } from 'vue'
import { api } from '../../axios'
import { useAuthStore } from '../../stores/auth'

import { ShowMessage, ShowLoading, HideLoading, HideModal } from '@/MJS.js'
var thecount = 1

export default {
  setup() {
    const authStore = useAuthStore()
    const hasPermission = permission =>
      authStore.user && authStore.user.permissions.includes(permission)

    return {
      hasPermission,
      Birth: ref(null),
      identificationIssuingDate: ref(null),
      ContractDate: ref(null),
      SaleDate: ref(null),
      PersonsTB: ref(null),
      PersonsTBData: ref([]),
      PersonsTBHeaders: ref([
        '#',
        'اسم المالك',
        'اسم الام',
        'رقم الهوية',
        'رقم الهاتف',
      ]),
      PersonsTBDisplayColumns: ref([
        'id',
        'name',
        'mother_name',
        'identification_number',
        'phone',
      ]),
      PersonsTBTotals: ref(['Count', '', '', '', '', '', '']),
      PersonsTBRowsCount: ref(0),
    }
  },
  mounted() {
    // this.PersonsTB.LoadMTable()
  },
  methods: {
    // GetPersonsData(PageNo = 1, FilterArray = {}, SortArray = {}) {
    //   api
    //     .get('GetPersonsTransactions', {
    //       params: {
    //         PageNo: PageNo,
    //         FilterArray: FilterArray,
    //         SortArray: SortArray,
    //         carLabelFrom: this.PersonsFromDate.Get(),
    //         carLabelTo: this.PersonsToDate.Get(),
    //       },
    //     })
    //     .then(response => {
    //       this.PersonsTBRowsCount = response.data.paginated_data.total
    //       this.PersonsTBData = response.data.paginated_data.data
    //       document.getElementById('PersonsTotal').innerHTML =
    //         new Intl.NumberFormat('en-US').format(
    //           response.data.total_payment_amount
    //         )
    //     })
    //     .catch(error => {
    //       this.ShowMessage('حدث خطا', error)
    //     })
    // },

    //==============Save  person=========================
    SavePerson() {
      ShowLoading()
      var Parameters = new FormData()
      Parameters.append(
        'name',
        document.getElementById('Name').querySelector('input').value
      )
      Parameters.append(
        'mother_name',
        document.getElementById('motherName').querySelector('input').value
      )
      Parameters.append(
        'gender',
        document.getElementById('Gender').querySelector('input').value
      )
      Parameters.append('birth', this.Birth.Get())
      Parameters.append(
        'identification_type',
        document.getElementById('identificationType').querySelector('input')
          .value
      )
      Parameters.append(
        'identification_number',
        document.getElementById('identificationNumber').querySelector('input')
          .value
      )
      Parameters.append(
        'identification_record',
        document.getElementById('identificationRecord').querySelector('input')
          .value
      )
      Parameters.append(
        'identification_page',
        document.getElementById('identificationPage').querySelector('input')
          .value
      )
      Parameters.append(
        'identification_issuing_authority',
        document
          .getElementById('identificationIssuingAuthority')
          .querySelector('input').value
      )
      Parameters.append(
        'identification_issuing_date',
        this.identificationIssuingDate.Get()
      )
      Parameters.append(
        'study',
        document.getElementById('Study').querySelector('input').value
      )
      Parameters.append(
        'work_type',
        document.getElementById('workType').querySelector('input').value
      )
      Parameters.append(
        'work_place',
        document.getElementById('workPlace').querySelector('input').value
      )
      Parameters.append(
        'phone',
        document.getElementById('Phone').querySelector('input').value
      )
      Parameters.append(
        'email',
        document.getElementById('Email').querySelector('input').value
      )
      Parameters.append(
        'address',
        document.getElementById('Address').querySelector('input').value
      )
      Parameters.append(
        'notes',
        document.getElementById('Notes').querySelector('input').value
      )

      //=========post ============
      api
        .post('persons', Parameters, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          HideLoading()
          if (response.data.message == 'تمت العملية بنجاح') {
            var PersonArray = {}
            PersonArray['count'] = thecount
            PersonArray['id'] = response.data.person_id
            PersonArray['name'] = document
              .getElementById('Name')
              .querySelector('input').value
            PersonArray['mother_name'] = document
              .getElementById('motherName')
              .querySelector('input').value
            PersonArray['identification_number'] = document
              .getElementById('identificationNumber')
              .querySelector('input').value
            PersonArray['phone'] = document
              .getElementById('Phone')
              .querySelector('input').value
            thecount = thecount + 1

            this.PersonsTBData.push(PersonArray)
            HideModal(document.getElementById('AddPersonModal'))
            this.clearFields()
          } else {
            HideLoading()
            ShowMessage(response.data.message)
          }
        })
        .catch(error => {
          HideLoading()
          if (error.response && error.response.status === 422) {
            const firstError = Object.values(error.response.data.errors)[0][0]
            ShowMessage(firstError)
          } else ShowMessage('حدث خطأ غير متوقع')
        })
    },

    clearFields() {
      Object.keys(this.$refs).forEach(ref => {
        const field = this.$refs[ref]
        // Check if the ref is an input field or a custom component
        if (field.tagName === 'INPUT') {
          field.value = ''
        } else if (typeof field.reset === 'function') {
          // If it's a custom component like MDate with a reset method
          field.reset()
        }
      })
    },
  },
}
</script>
<style scoped>
.MField,
.MDate {
  min-width: 200px;
}
</style>
