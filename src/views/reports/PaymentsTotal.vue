<template>
  <div class="ComponentWrapper">
    <div class="MGroup">
      <MDate ref="PaymentsTotalReportFromDate" :Name="'PaymentsTotalReportFromDate'" :Label="'التاريخ'" :Range="true" :Clearable="true"></MDate>
    </div>
    <div class="MGroup">
      <div class="MButton" id="GetPaymentTotalBTN">عرض البيانات</div>
    </div>

    <div class="container">
      <h2 class="title">مجاميع الدفع الالكتروني</h2>

      <div class="buttons">
        <button class="btn" @click="exportExcel">Export to Excel</button>
        <button class="btn" @click="printTable">Print</button>
      </div>

      <div class="table-wrapper">
        <table ref="transactionTable" class="styled-table">
          <thead>
            <tr>
              <th>Payment Name</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transactions" :key="item.payment_name">
              <td>{{ item.payment_name }}</td>
              <td>{{ formatCurrency(item.total_amount) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th>{{ formatCurrency(totalAmount) }}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { api } from '../../axios'

export default {
  name: 'TransactionsTable',
  data() {
    return {
      transactions: [],
    }
  },
  setup() {
    return {
      PaymentsTotalReportFromDate: ref(null),
    }
  },
  computed: {
    totalAmount() {
      return this.transactions.reduce((sum, item) => sum + Number(item.total_amount), 0)
    },
  },
  mounted() {
    let Instance = this
    document.getElementById('GetPaymentTotalBTN').addEventListener(
      'click',
      function () {
        let params = {}
        if (Instance.PaymentsTotalReportFromDate.Get()[0]) {
          //const dates = this.PaymentsTotalReportFromDate.Get()
          params.PaymentsTotalReportFrom = Instance.PaymentsTotalReportFromDate.Get()[0]
          params.PaymentsTotalReportTo = Instance.PaymentsTotalReportFromDate.Get()[1]
        }
        this.getdata(params)
      }.bind(this)
    )
  },

  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US').format(value)
    },

    exportExcel() {
      const ws = XLSX.utils.json_to_sheet(this.transactions)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions')

      const totalRow = [{ payment_name: 'Total', total_amount: this.totalAmount }]
      XLSX.utils.sheet_add_json(ws, totalRow, { origin: -1, skipHeader: true })

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'transactions.xlsx')
    },
    printTable() {
      const printContents = this.$refs.transactionTable.outerHTML
      const originalContents = document.body.innerHTML
      document.body.innerHTML = printContents
      window.print()
      document.body.innerHTML = originalContents
      window.location.reload()
    },
    getdata(params) {
      // API call
      api
        .get('getPaymentsTotal', { params })
        .then(res => {
          if (res.data.success) {
            this.transactions = res.data.data
            console.log('Transactions:', this.transactions)
          } else {
            console.error('API error:', res.data.message)
          }
        })
        .catch(err => {
          console.error('Request failed:', err)
        })
    },
  },
}
</script>

<style scoped>
#PaymentsTotalReportFromDate {
  max-width: 400px;
}
/* Container */
.container {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  background: #1e1e2f;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Title */
.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 15px;
  color: #00d1b2;
  font-family: 'MFontR';
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* Buttons */
.buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
.btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 8px 18px;
  margin-left: 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}
.btn:hover {
  background-color: #00b89a;
}

/* Table Wrapper */
.table-wrapper {
  overflow-x: auto;
}

/* Styled Table */
.styled-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #2a2a3d;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.styled-table th,
.styled-table td {
  padding: 12px 20px;
  text-align: center;
}

.styled-table thead tr {
  background-color: #00d1b2;
  color: #1e1e2f;
  font-weight: bold;
}

.styled-table tbody tr {
  border-bottom: 1px solid #444;
  transition: background 0.3s;
}
.styled-table tbody tr:hover {
  background-color: #3a3a55;
}

.styled-table tfoot tr {
  background-color: #11112b;
  font-weight: bold;
  color: #00d1b2;
  border-top: 2px solid #00d1b2;
}
</style>
