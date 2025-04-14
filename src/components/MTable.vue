<template>
  <div class="MTable" :id="Name"></div>
</template>

<script>
var FilterDataArray = {}
var SortDataArray = {}

export default {
  props: {
    Name: { type: String, required: true },
    DataArray: { type: Array, required: true },
    Columns: { type: Array, required: true },
    ShowFilterRow: { type: Boolean, default: true },
    GetDataFunction: { type: Function, default: null },
    Sums: Object,
    RowsCount: Number,
    RowsPerPage: Number,
    MTableMaxHeight: { type: Number, default: 600 },
  },
  created() {
    for (var i = 0; i < this.Columns.length; i++) {
      FilterDataArray[this.Columns[i]['name']] = ''
    }
  },
  data() {
    return {
      Element: null,
      OptionsArray: [],
      PageNo: 1,
      PagesCount: 1,
      SumsColumns: [],
    }
  },
  mounted() {
    this.Element = document.getElementById(this.Name)

    // Get The Options
    var slotContent = this.$slots['options'] ? this.$slots['options']() : []
    slotContent.forEach(vnode => {
      if (vnode.props) {
        var name = vnode.children
          .find(child => child.props?.class?.includes('MTableOptionName'))
          .children.trim()

        var icon = ''
        var iconNode = vnode.children.find(child =>
          child.props?.class?.includes('MTableOptionIcon')
        )

        if (iconNode) {
          var svgNode = iconNode.children.find(child => child.type === 'svg')
          if (svgNode) {
            icon = this.serializeVNode(svgNode)
          }
        }

        const optionEventName = vnode.props.OptionEventName || ''
        this.OptionsArray.push({ name, icon, event: optionEventName })
      }
    })

    this.BuildMTable(
      this.Element,
      [],
      this.Columns,
      50,
      200,
      this.MTableMaxHeight,
      this.ShowFilterRow,
      this.GetDataFunction,
      this.PagesCount,
      this.OptionsArray
    )
  },
  watch: {
    DataArray: {
      handler(newValue) {
        if (this.RowsPerPage) {
          this.PagesCount = Math.ceil(this.RowsCount / this.RowsPerPage)
        }
        this.BuildMTable(
          this.Element,
          newValue,
          this.Columns,
          50,
          200,
          this.MTableMaxHeight,
          this.ShowFilterRow,
          this.GetDataFunction,
          this.PagesCount,
          this.OptionsArray
        )
      },
      deep: true,
    },
  },
  methods: {
    BuildMTable(
      Element,
      DataArray,
      Columns,
      MinCellWidth,
      MaxCellWidth,
      MaxTableHeight,
      ShowFilterRow,
      GetDataFunction,
      PagesCount,
      MTableOptions
    ) {
      // Empty The Element
      Element.innerHTML = ''
      var Instance = this
      // Fix DataArray (Null,Undefined)
      for (var i = 0; i < DataArray.length; i++) {
        for (var key in DataArray[i]) {
          if (DataArray[i][key] === null || DataArray[i][key] == 'null') {
            DataArray[i][key] = ''
          }
        }
      }

      var HeaderCodeBlock = ''
      var FilterCodeBlock = ''
      var ContentCodeBlock = ''
      var TotalCodeBlock = ''
      var TotalResultArray = []
      var MTableCode = ''
      var ScrollWidth = 0
      var MTableOptionsCode = ''

      //Icons
      var SearchIcon = `<svg viewBox="0 0 1000 1000">
	      <path d="M70.8,400.4c2.1-14.3,3.7-28.6,6.4-42.8c12-63.4,40-118.9,83.3-166.7c50.8-56.1,113.2-92.5,187.4-107.2
		    c86.8-17.3,169.3-4.2,245.4,41.6c86.6,52.1,141.4,128.1,162.4,227c17.9,84.2,4.7,164.5-37.1,239.9c-8,14.5-8.3,14.3,3.7,26.3
		    c60.5,60.5,121,121.1,181.6,181.6c19.6,19.6,28.3,42.5,21.2,69.9c-13.3,51.1-77.7,70.3-118.3,28.9
		    c-34.2-34.8-68.9-69.1-103.4-103.6c-27.6-27.6-55.2-55.2-82.8-82.8c-1.7-1.7-3.6-3.4-4.7-4.3c-21.5,11.2-41.8,23.8-63.5,32.8
		    c-93.3,38.5-186.6,38.1-278.9-3.7C204,705.9,151.2,656.2,114.1,590c-23.8-42.3-37.8-87.8-41.8-136.3c-0.2-2.7-1-5.4-1.5-8.1
		    C70.8,430.6,70.8,415.5,70.8,400.4z M183,423c0.3,129.1,105.7,234,234.5,233.6c128.9-0.5,233.3-104.9,233.6-233.7
		    c0.3-128.5-105.5-234.2-234.2-234C287.7,189.1,182.6,294.3,183,423z"/>
        </svg>`

      var ClearIcon = `<svg viewBox="0 0 1000 1000">
	      <path d="M922.1,147.7c0.5,14.9-10.1,31.1-24.9,45.8C800.4,290,703.8,386.8,607.1,483.5c-16.5,16.5-16.5,16.5,0.5,33.4
		    c97,97,194,194.1,291.1,291c17.4,17.3,27.2,36.8,22.7,61.9c-8.5,47.1-63.2,68.5-101.3,39.4c-5.5-4.2-10.5-9.3-15.4-14.2
		    c-97.8-97.7-195.6-195.3-293-293.4c-9.4-9.5-14-9.2-23.2,0.1C389.7,701.1,290.3,800,191.3,899.3c-19.7,19.8-42.3,28.4-69.5,20
		    c-41.1-12.7-57.5-63.1-32.2-97.9c4.1-5.6,9.2-10.6,14.1-15.5c97.3-97.4,194.7-194.8,292.1-292.2c13.8-13.8,13.8-13.8-0.5-28.1
		    C297.3,387.5,199.3,289.3,101,191.4c-20.2-20.1-29.1-43-19.9-70.8c15-45.2,70.8-57.9,106.2-23.7c33.9,32.7,66.7,66.4,100,99.7
		    c67.3,67.3,134.7,134.4,201.6,202c8.7,8.8,13.2,9.2,22.1,0.2c98.9-99.4,198.4-198.2,297.5-297.4c13.6-13.7,28.8-23,48.6-23.3
		    C893.3,77.6,921.6,104.9,922.1,147.7z"/>
        </svg>`

      // Set Max MTable Height
      Element.style.maxHeight = MaxTableHeight + 'px'

      //Build Table Loader
      var LoaderCodeBlock = '<div class="MTableLoader"></div>'

      //Build Table Header
      HeaderCodeBlock = '<div class="MTableRow MTableHeaderRow">'
      for (var H = 0; H < Columns.length; H++) {
        HeaderCodeBlock +=
          '<div class="MTableCell" headername="' +
          Columns[H]['name'] +
          '"><div class="MTableHeader">' +
          Columns[H]['label'] +
          '</div></div>'
      }
      HeaderCodeBlock += '<div class="MTableRowOptionsPadding"></div></div>'

      //Build Table Filter
      FilterCodeBlock = '<div class="MTableRow MTableFilterRow">'
      for (let j = 0; j < Columns.length; j++) {
        if (Columns[j]['filter'] == 'combo') {
          let ComboItems = ``
          for (let k = 0; k < Columns[j]['filter_items'].length; k++) {
            ComboItems +=
              '<div class="MTableFilterComboItem" tabindex="-1">' +
              Columns[j]['filter_items'][k] +
              '</div>'
          }
          FilterCodeBlock += `<div class="MTableCell" filtername="${Columns[j]['name']}">
                <div class="MTableFilterContent">
                  <input class="MTableFilterInput" readonly type="text" placeholder="" />
                  <div class="MTableFilterBTN">
                    <div class="MTableFilterIcon">${SearchIcon}</div>
                  </div>
                  <div class="MTableClearBTN">
                  <div class="MTableFilterIcon">${ClearIcon}</div>
                </div>
                <div class="MTableFilterCombo">
                  <div class="MTableFilterComboItems">${ComboItems}</div>
                  </div>
              </div>
            </div>`
        } else if (Columns[j]['filter'] == 'date') {
          FilterCodeBlock += `<div class="MTableCell" filtername="${Columns[j]['name']}">
                <div class="MTableFilterContent">
                  <input class="MTableFilterInput" type="text" placeholder="" />
                  <input class="MTableFilterDate" type="date" maxlength="10"/>
                  <div class="MTableFilterBTN">
                    <div class="MTableFilterIcon">${SearchIcon}</div>
                  </div>
                  <div class="MTableClearBTN">
                  <div class="MTableFilterIcon">${ClearIcon}</div>
                </div>
              </div>
            </div>`
        } else {
          FilterCodeBlock += `<div class="MTableCell" filtername="${Columns[j]['name']}">
                <div class="MTableFilterContent">
                  <input class="MTableFilterInput" type="text" placeholder="" />
                  <div class="MTableFilterBTN">
                    <div class="MTableFilterIcon">${SearchIcon}</div>
                  </div>
                  <div class="MTableClearBTN">
                  <div class="MTableFilterIcon">${ClearIcon}</div>
                </div>
              </div>
            </div>`
        }
      }
      FilterCodeBlock += '<div class="MTableRowOptionsPadding"></div></div>'

      // Build Options
      if (MTableOptions.length > 0) {
        MTableOptionsCode = '<div tabindex="-1" class="MTableOptions">'
        MTableOptions.forEach(function (e) {
          MTableOptionsCode +=
            '<div class="MTableOption"><div class="MTableOptionIcon">' +
            e['icon'] +
            '</div><div class="MTableOptionName">' +
            e['name'] +
            '</div></div>'
        })
        MTableOptionsCode += '</div>'
      }

      // Build Table Structure
      MTableCode =
        MTableOptionsCode +
        '<div class="MTableWrapper"><div class="MTableBackground"></div><div class="MTableTableContainer"><div class="MTableContent"><div class="MTableHeaderContainer">' +
        HeaderCodeBlock +
        FilterCodeBlock +
        '</div>' +
        LoaderCodeBlock +
        '<div class="MTableBodyContainer"></div><div class="MTableFooterContainer"></div></div></div><div class="MTableBackground"></div></div><div class="MTableExtension"><div class="MTableSummary">عدد النتائج: ' +
        new Intl.NumberFormat('en-US').format(this.RowsCount) +
        '</div><div class="MTableExtensionSpace"></div><div class="MTablePageButtons"></div></div>'
      Element.innerHTML = MTableCode

      Element.querySelectorAll('.MTableOption').forEach(
        function (e) {
          e.removeEventListener('click', null)
          e.addEventListener(
            'click',
            function () {
              MTableOptions.forEach(function (d) {
                if (
                  d['name'] == e.querySelector('.MTableOptionName').innerHTML
                ) {
                  Element.dispatchEvent(
                    new CustomEvent(d['event'], {
                      detail: {
                        RowData:
                          DataArray[
                            e
                              .closest('.MTableOptions')
                              .getAttribute('MTableRowID')
                          ],
                      },
                    })
                  )
                }
              })
            }.bind(this)
          )
        }.bind(this)
      )

      // Hide Summary If Its Empty
      if (this.RowsCount) {
        Element.querySelector('.MTableSummary').style.display = 'flex'
      } else {
        Element.querySelector('.MTableSummary').style.display = 'none'
      }

      // Hide Pages If Its One Page
      if (PagesCount > 1) {
        Element.querySelector('.MTablePageButtons').style.display = 'flex'
      } else {
        Element.querySelector('.MTablePageButtons').style.display = 'none'
      }

      FillTableContent()
      if (Instance.PageNo != 0 && DataArray.length > 0) {
        BuildMTablePages()
      } else {
        this.Element.querySelector('.MTableSummary').style.display = 'none'
        this.Element.querySelector('.MTablePageButtons').innerHTML = ''
      }

      // Fill The Filter Rows
      for (var F = 0; F < Columns.length; F++) {
        let FilterCell = Element.querySelector(
          '.MTableFilterRow .MTableCell[filtername="' +
            Columns[F]['name'] +
            '"]'
        )
        FilterCell.querySelector('.MTableFilterInput').value =
          FilterDataArray[Columns[F]['name']]
        if (Columns[F]['filter'] && Columns[F]['filter'] == 'combo') {
          let ComboItems = FilterDataArray[Columns[F]['name']].split(',')
          ComboItems.forEach(function (e) {
            FilterCell.querySelectorAll('.MTableFilterComboItem').forEach(
              function (d) {
                if (e == d.innerHTML) {
                  d.classList.add('SelectedMTableFilterComboItem')
                }
              }
            )
          })
        }
      }

      // Show/Hide Clear Filter Button
      Element.querySelectorAll('.MTableFilterRow .MTableCell').forEach(
        function (e) {
          if (e.querySelector('input').value != '') {
            e.querySelector('.MTableClearBTN').style.display = 'flex'
          }

          e.removeEventListener('focusout', null)
          e.addEventListener('focusout', function (d) {
            if (
              !d.relatedTarget ||
              !d.relatedTarget.classList.contains('MTableFilterComboItem')
            ) {
              HideCombo()
            }
          })

          if (e.querySelector('.MTableFilterDate')) {
            e.querySelector('.MTableFilterDate').addEventListener(
              'change',
              function (d) {
                e.querySelector('.MTableFilterInput').value = d.target.value
                e.querySelector('.MTableFilterBTN').style.display = 'none'
                if (d.value == FilterDataArray[e.getAttribute('filtername')]) {
                  e.querySelector('.MTableFilterBTN').style.display = 'none'
                  if (d.value != '') {
                    e.querySelector('.MTableClearBTN').style.display = 'flex'
                  }
                } else {
                  e.querySelector('.MTableFilterBTN').style.display = 'flex'
                  e.querySelector('.MTableClearBTN').style.display = 'none'
                }
              }
            )
          }
        }
      )

      // Filter Rows Code
      Element.querySelectorAll('.MTableFilterRow .MTableFilterInput').forEach(
        function (e) {
          e.removeEventListener('keyup', null)
          e.addEventListener('keyup', function () {
            e
              .closest('.MTableCell')
              .querySelector('.MTableFilterBTN').style.display = 'none'
            if (
              e.value ==
              FilterDataArray[
                e.closest('.MTableCell').getAttribute('filtername')
              ]
            ) {
              e
                .closest('.MTableCell')
                .querySelector('.MTableFilterBTN').style.display = 'none'
              if (e.value != '') {
                e
                  .closest('.MTableCell')
                  .querySelector('.MTableClearBTN').style.display = 'flex'
              }
            } else {
              e
                .closest('.MTableCell')
                .querySelector('.MTableFilterBTN').style.display = 'flex'
              e
                .closest('.MTableCell')
                .querySelector('.MTableClearBTN').style.display = 'none'
            }
            for (let i = 0; i < Columns.length; i++) {
              if (
                Columns[i]['name'] ==
                e.closest('.MTableCell').getAttribute('filtername')
              ) {
                if (Columns[i]['filter'] == 'date') {
                  e
                    .closest('.MTableCell')
                    .querySelector('.MTableFilterDate').value = e.value
                }
              }
            }
          })

          e.removeEventListener('keypress', null)
          e.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
              event.preventDefault()
              for (var i = 0; i < Columns.length; i++) {
                var FilterRowInput = Element.querySelector(
                  '.MTableFilterRow .MTableCell[filtername="' +
                    Columns[i]['name'] +
                    '"] .MTableFilterInput'
                )
                FilterDataArray[Columns[i]['name']] = FilterRowInput.value
              }

              Element.querySelector('.MTableLoader').style.display = 'flex'

              Element.querySelectorAll('.MTableFilterRow input').forEach(
                function (e) {
                  e.disabled = true
                }
              )
              Element.querySelectorAll(
                '.MTableFilterRow .MTableFilterBTN'
              ).forEach(function (e) {
                e.style.display = 'none'
              })
              Element.querySelectorAll('.MTableHeaderRow .MTableCell').forEach(
                function (e) {
                  e.style.pointerEvents = 'none'
                }
              )
              Element.querySelector(
                '.MTableBodyContainer'
              ).style.pointerEvents = 'none'
              Element.querySelectorAll(
                '.MTablePageButtons .MTablePageButton'
              ).forEach(function (e) {
                e.style.pointerEvents = 'none'
              })

              if (GetDataFunction) {
                Instance.PageNo = 1
                GetDataFunction({
                  PageNo: Instance.PageNo,
                  Filters: FilterDataArray,
                  Sorts: SortDataArray,
                  Sums: Instance.SumsColumns,
                  RowsPerPage: Instance.RowsPerPage,
                  Columns: Instance.Columns,
                })
              }
            }
          })

          e.removeEventListener('focus', null)
          e.addEventListener('focus', function (event) {
            ShowCombo(event.target)
          })
        }
      )

      Element.querySelectorAll('.MTableFilterRow .MTableFilterBTN').forEach(
        function (e) {
          e.removeEventListener('click', null)
          e.addEventListener('click', function () {
            for (var i = 0; i < Columns.length; i++) {
              var FilterRowInput = Element.querySelector(
                '.MTableFilterRow .MTableCell[filtername="' +
                  Columns[i]['name'] +
                  '"] .MTableFilterInput'
              )
              FilterDataArray[Columns[i]['name']] = FilterRowInput.value
            }

            Element.querySelector('.MTableLoader').style.display = 'flex'

            Element.querySelectorAll('.MTableFilterRow input').forEach(
              function (e) {
                e.disabled = true
              }
            )
            Element.querySelectorAll(
              '.MTableFilterRow .MTableFilterBTN'
            ).forEach(function (e) {
              e.style.display = 'none'
            })
            Element.querySelectorAll('.MTableHeaderRow .MTableCell').forEach(
              function (e) {
                e.style.pointerEvents = 'none'
              }
            )
            Element.querySelector('.MTableBodyContainer').style.pointerEvents =
              'none'
            Element.querySelectorAll(
              '.MTablePageButtons .MTablePageButton'
            ).forEach(function (e) {
              e.style.pointerEvents = 'none'
            })
            if (GetDataFunction) {
              Instance.PageNo = 1
              GetDataFunction({
                PageNo: Instance.PageNo,
                Filters: FilterDataArray,
                Sorts: SortDataArray,
                Sums: Instance.SumsColumns,
                RowsPerPage: Instance.RowsPerPage,
                Columns: Instance.Columns,
              })
            }
          })
        }
      )

      Element.querySelectorAll('.MTableFilterRow .MTableClearBTN').forEach(
        function (e) {
          e.removeEventListener('click', null)
          e.addEventListener('click', function () {
            e.closest('.MTableCell').querySelector('input').value = ''
            for (var i = 0; i < Columns.length; i++) {
              var FilterRowInput = Element.querySelector(
                '.MTableFilterRow .MTableCell[filtername="' +
                  Columns[i]['name'] +
                  '"] .MTableFilterInput'
              )
              FilterDataArray[Columns[i]['name']] = FilterRowInput.value
            }

            Element.querySelector('.MTableLoader').style.display = 'flex'

            Element.querySelectorAll('.MTableFilterRow input').forEach(
              function (e) {
                e.disabled = true
              }
            )
            Element.querySelectorAll(
              '.MTableFilterRow .MTableFilterBTN'
            ).forEach(function (e) {
              e.style.display = 'none'
            })
            Element.querySelectorAll('.MTableHeaderRow .MTableCell').forEach(
              function (e) {
                e.style.pointerEvents = 'none'
              }
            )
            Element.querySelector('.MTableBodyContainer').style.pointerEvents =
              'none'
            Element.querySelectorAll(
              '.MTablePageButtons .MTablePageButton'
            ).forEach(function (e) {
              e.style.pointerEvents = 'none'
            })

            if (GetDataFunction) {
              Instance.PageNo = 1
              GetDataFunction({
                PageNo: Instance.PageNo,
                Filters: FilterDataArray,
                Sorts: SortDataArray,
                Sums: Instance.SumsColumns,
                RowsPerPage: Instance.RowsPerPage,
                Columns: Instance.Columns,
              })
            }
          })
        }
      )

      // Show / Hide Filter Row
      if (ShowFilterRow == true) {
        Element.querySelector('.MTableFilterRow').style.display = 'flex'
      } else {
        Element.querySelector('.MTableFilterRow').style.display = 'none'
      }

      Element.querySelectorAll('.MTableFilterComboItem').forEach(function (e) {
        e.removeEventListener('click', null)
        e.addEventListener('click', function () {
          if (e.classList.contains('SelectedMTableFilterComboItem')) {
            e.classList.remove('SelectedMTableFilterComboItem')
          } else {
            e.classList.add('SelectedMTableFilterComboItem')
          }
          PopulateCombo(e.closest('.MTableCell'))
        })
      })

      // Set Max TBody Height
      var UsedHeights = 190
      Element.querySelector('.MTableBodyContainer').style.maxHeight =
        parseInt(Element.style.maxHeight) - UsedHeights + 'px'

      /* =============== FUNCTIONS =============== */
      function FillTableContent() {
        TotalResultArray = []
        Element.querySelector('.MTableBodyContainer').innerHTML = ''
        ContentCodeBlock = ''
        var MTableColumnsSizes = []
        var MaxMTableColumnsSizes = 0
        var ColumnSizeCanvas = document.createElement('canvas')
        var ColumnSize = ColumnSizeCanvas.getContext('2d')
        var CurrentColumnSize = 0

        //Get Only Selected Columns
        var DisplayArray = DataArray.map(function (item) {
          var DisplayArrayColumnsObject = {}
          for (var i = 0; i <= Columns.length - 1; i++) {
            var TheValue = Columns[i]['name'].match(
              /^([a-zA-Z_]\w*)\.([a-zA-Z_]\w*)$/
            )
            if (TheValue) {
              DisplayArrayColumnsObject[Columns[i]['name']] = item[TheValue[1]]
            } else {
              DisplayArrayColumnsObject[Columns[i]['name']] =
                item[Columns[i]['name']]
            }
          }
          return DisplayArrayColumnsObject
        })

        //Get Header Column Max Size
        for (let HW = 0; HW < Columns.length; HW++) {
          ColumnSize.font = '18px MFontB'
          MTableColumnsSizes[HW] = Math.ceil(
            ColumnSize.measureText(Columns[HW]['label']).width
          )
        }

        // Get Sums Columns
        Instance.SumsColumns = []
        for (let S = 0; S < Columns.length; S++) {
          if (Columns[S]['sum'] == true) {
            Instance.SumsColumns.push(Columns[S]['name'])
          }
        }

        //Build The Table Data
        for (let x = 0; x < DisplayArray.length; x++) {
          var ArrayCounter = 0
          ContentCodeBlock +=
            '<div class="MTableRow MTableDataRow" tabindex="-1" MTableRowID="' +
            x +
            '">'
          for (var y in DisplayArray[x]) {
            // MTable Sub Arrays
            if (y != 'id') {
              var TheValue = y.match(/^([a-zA-Z_]\w*)\.([a-zA-Z_]\w*)$/)
              if (TheValue) {
                var TheData = DisplayArray[x][y]
                CurrentColumnSize = 0
                if (TheData.length > 0) {
                  DisplayArray[x][y] = '<div class="MTableDataSubArray">'
                  for (var D = 0; D < TheData.length; D++) {
                    DisplayArray[x][y] +=
                      '<div class="MTableDataSubArrayItem">' +
                      TheData[D][TheValue[2]] +
                      '</div>'
                    ColumnSize.font = '16px MFontR'
                    CurrentColumnSize += Math.ceil(
                      ColumnSize.measureText(TheData[D][TheValue[2]]).width
                    )
                  }
                  DisplayArray[x][y] += '</div>'
                }
              } else {
                // Calculating The Columns Sizes Array
                if (Columns[ArrayCounter]['type'] == 'image') {
                  CurrentColumnSize = 100
                } else {
                  ColumnSize.font = '16px MFontR'
                  CurrentColumnSize = Math.ceil(
                    ColumnSize.measureText(DisplayArray[x][y]).width
                  )
                }

                if (Columns[ArrayCounter]['filter'] == 'date') {
                  CurrentColumnSize = 100
                }
              }
            } else {
              // Calculating The Columns Sizes Array
              if (Columns[ArrayCounter]['type'] == 'image') {
                CurrentColumnSize =
                  Element.querySelector('.MTableCellImage').style.width
              } else {
                ColumnSize.font = '16px MFontR'
                CurrentColumnSize = Math.ceil(
                  ColumnSize.measureText(DisplayArray[x][y]).width
                )
              }
            }

            // Column Width Limit
            if (CurrentColumnSize > 150) {
              CurrentColumnSize = 150
            }

            // Creating The Columns Sizes Array
            if (MTableColumnsSizes[ArrayCounter] <= CurrentColumnSize) {
              MTableColumnsSizes[ArrayCounter] = CurrentColumnSize
            }

            // Check The Column Type
            if (
              !Columns[ArrayCounter]['type'] ||
              Columns[ArrayCounter]['type'] == 'text'
            ) {
              ContentCodeBlock +=
                '<div class="MTableCell"><div class="MTableData">' +
                DisplayArray[x][y] +
                '</div></div>'
            }
            if (Columns[ArrayCounter]['type'] == 'currency') {
              ContentCodeBlock +=
                '<div class="MTableCell"><div class="MTableData">' +
                new Intl.NumberFormat('en-US').format(DisplayArray[x][y]) +
                '</div></div>'
            }
            if (Columns[ArrayCounter]['type'] == 'image') {
              ContentCodeBlock +=
                '<div class="MTableCell"><div class="MTableData MTableCellImage"><div class="MTableCellImageZoom">' +
                SearchIcon +
                '</div><img src="' +
                DisplayArray[x][y] +
                '"/></div></div>'
            }

            //Build Totals Array
            if (Columns[ArrayCounter]['sum'] == true) {
              if (Instance.Sums[Columns[ArrayCounter]['name']]) {
                TotalResultArray[ArrayCounter] =
                  Instance.Sums[Columns[ArrayCounter]['name']]
              } else {
                if (TotalResultArray[ArrayCounter] == null) {
                  TotalResultArray[ArrayCounter] = parseFloat(
                    DisplayArray[x][y]
                  )
                } else {
                  TotalResultArray[ArrayCounter] =
                    parseFloat(TotalResultArray[ArrayCounter]) +
                    parseFloat(DisplayArray[x][y])
                }
                TotalResultArray[ArrayCounter] = Number.isInteger(
                  TotalResultArray[ArrayCounter]
                )
                  ? TotalResultArray[ArrayCounter]
                  : TotalResultArray[ArrayCounter].toFixed(2)
              }
            } else {
              TotalResultArray[ArrayCounter] = ''
            }
            ArrayCounter++
          }
          var MTableOptionsIcon = `<svg viewBox="0 0 1000 1000">
<path d="M739.1,503c0-50.7,40-90.3,91-90.1c50.1,0.1,89.7,40,89.7,90.5c0,50.7-39.9,90.2-90.9,90.1C778.6,593.4,739,553.5,739.1,503
	z"/>
<path d="M410.2,503.2c0-50.7,39.8-90.4,90.8-90.3c50.2,0.1,89.9,39.9,89.9,90.3c0,50.8-39.8,90.4-90.8,90.3
	C449.9,593.4,410.2,553.6,410.2,503.2z"/>
<path d="M262,503.1c0,50.8-39.7,90.5-90.7,90.4c-50.3-0.1-89.9-39.8-90-90.2c0-50.8,39.8-90.5,90.7-90.4
	C222.3,412.9,262,452.7,262,503.1z"/>
</svg>`

          if (MTableOptions.length == 1) {
            MTableOptionsIcon = MTableOptions[0]['icon']
          }

          ContentCodeBlock =
            ContentCodeBlock +
            '<div class="MTableRowOptions" MTableRowID="' +
            x +
            '"><div class="MTableOptionsIcon">' +
            MTableOptionsIcon +
            '</div></div>' +
            '</div>'
        }

        Element.querySelector('.MTableBodyContainer').innerHTML =
          ContentCodeBlock

        // If No Data Exists
        if (DataArray.length == 0) {
          Element.querySelector('.MTableBodyContainer').innerHTML =
            '<div class="MTableNoData">لا توجد بيانات</div>'
        }

        //Build Table Totals
        if (DataArray.length > 0) {
          TotalCodeBlock = ''
          Element.querySelector('.MTableFooterContainer').innerHTML = ''
          TotalCodeBlock += ' <div class="MTableRow MTableTotalsRow">'
          for (let k = 0; k <= TotalResultArray.length - 1; k++) {
            if (Columns[k]['type'] == 'currency') {
              TotalCodeBlock +=
                '<div class="MTableCell">' +
                new Intl.NumberFormat('en-US').format(TotalResultArray[k]) +
                '</div>'
            } else {
              TotalCodeBlock +=
                '<div class="MTableCell">' + TotalResultArray[k] + '</div>'
            }
          }
          TotalCodeBlock += '<div class="MTableRowOptionsPadding"></div></div>'
          Element.querySelector('.MTableFooterContainer').innerHTML =
            TotalCodeBlock

          //Get Totals Column Max Size
          for (var FW = 0; FW <= TotalResultArray.length - 1; FW++) {
            ColumnSize.font = '16px MFontB'
            if (
              MTableColumnsSizes[FW] <=
              Math.ceil(ColumnSize.measureText(TotalResultArray[FW]).width)
            ) {
              MTableColumnsSizes[FW] = Math.ceil(
                ColumnSize.measureText(TotalResultArray[FW]).width
              )
            }
          }
        }

        //Setting The Limits Of Column Sizes
        for (var m = 0; m <= MTableColumnsSizes.length - 1; m++) {
          if (Columns[m]['filter'] == 'date') {
            if (MTableColumnsSizes[m] < 90) {
              MTableColumnsSizes[m] = 90
            }
          } else {
            if (MTableColumnsSizes[m] <= MinCellWidth) {
              MTableColumnsSizes[m] = MinCellWidth
            }
            if (MTableColumnsSizes[m] >= MaxCellWidth) {
              MTableColumnsSizes[m] = MaxCellWidth
            }
          }

          MaxMTableColumnsSizes += MTableColumnsSizes[m]
        }

        //Set The Sizes
        const resizeObserver = new ResizeObserver(function () {
          MTableCellResize()
        })
        resizeObserver.observe(Element)

        //Pad The Scrollbar Width
        setTimeout(function () {
          MTableCellResize()
          ScrollWidth =
            Element.querySelector('.MTableBodyContainer').offsetWidth -
            Element.querySelector('.MTableBodyContainer').clientWidth

          Element.querySelectorAll('.MTableRowOptionsPadding').forEach(
            function (e) {
              e.style.minWidth +=
                parseInt(
                  parseInt(window.getComputedStyle(e).minWidth) + ScrollWidth
                ) + 'px'
            }
          )
        }, 0)

        // Set Events
        Element.querySelectorAll('.MTableBodyContainer .MTableRow').forEach(
          function (e) {
            e.removeEventListener('contextmenu', null)
            e.addEventListener('contextmenu', event => {
              event.preventDefault()
              if (MTableOptions.length == 1) {
                Element.dispatchEvent(
                  new CustomEvent(MTableOptions[0]['event'], {
                    detail: {
                      RowData: DataArray[e.getAttribute('MTableRowID')],
                    },
                  })
                )
              } else {
                ShowMTableOptions(event)
              }
            })

            // Hide Options
            e.removeEventListener('focusout', null)
            e.addEventListener('focusout', function (e) {
              HideMTableOptions(e)
            })
          }
        )

        Element.querySelectorAll(
          '.MTableBodyContainer .MTableRow .MTableRowOptions'
        ).forEach(function (e) {
          e.removeEventListener('click', null)
          e.addEventListener('click', function (event) {
            if (MTableOptions.length == 1) {
              Element.dispatchEvent(
                new CustomEvent(MTableOptions[0]['event'], {
                  detail: { RowData: DataArray[e.getAttribute('MTableRowID')] },
                })
              )
            } else {
              ShowMTableOptions(event)
            }
          })
        })

        Element.querySelector('.MTableBodyContainer').addEventListener(
          'scroll',
          () => {
            HideMTableOptions()
          }
        )

        Element.querySelectorAll('.MTableCellImage').forEach(function (e) {
          e.querySelector('.MTableCellImageZoom svg').removeEventListener(
            'click',
            null
          )
          e.querySelector('.MTableCellImageZoom svg').addEventListener(
            'click',
            function () {
              var Image = e.querySelector('img').getAttribute('src')
              if (Image.startsWith('data:image')) {
                var byteCharacters = atob(Image.split(',')[1])
                var byteNumbers = new Array(byteCharacters.length)
                for (var i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i)
                }
                var byteArray = new Uint8Array(byteNumbers)
                var blob = new Blob([byteArray], { type: 'image/png' })

                var blobUrl = URL.createObjectURL(blob)
                window.open(blobUrl)
              } else {
                window.open(Image)
              }
            }
          )
        })

        // Sorting
        Element.querySelectorAll('.MTableHeaderRow .MTableCell').forEach(
          function (e) {
            e.removeEventListener('click', null)
            e.addEventListener('click', function () {
              var MTableHeaderIndex = Array.from(
                this.parentNode.children
              ).indexOf(this)
              var SortName = Columns[MTableHeaderIndex]['name']

              // Check if its sub array
              if (SortName.match(/^([a-zA-Z_]\w*)\.([a-zA-Z_]\w*)$/)) {
                return
              }

              var SortType = 'ASC'
              if (SortDataArray == null || SortDataArray[1] == 'DESC') {
                SortType = 'ASC'
              } else if (SortDataArray[1] == 'ASC') {
                SortType = 'DESC'
              }

              SortDataArray = [SortName, SortType]

              Element.querySelector('.MTableLoader').style.display = 'flex'

              Element.querySelectorAll('.MTableFilterRow input').forEach(
                function (e) {
                  e.disabled = true
                }
              )
              Element.querySelectorAll(
                '.MTableFilterRow .MTableFilterBTN'
              ).forEach(function (e) {
                e.style.display = 'none'
              })
              Element.querySelectorAll('.MTableHeaderRow .MTableCell').forEach(
                function (e) {
                  e.style.pointerEvents = 'none'
                }
              )
              Element.querySelector(
                '.MTableBodyContainer'
              ).style.pointerEvents = 'none'
              Element.querySelectorAll(
                '.MTablePageButtons .MTablePageButton'
              ).forEach(function (e) {
                e.style.pointerEvents = 'none'
              })
              if (GetDataFunction) {
                Instance.PageNo = 1
                GetDataFunction({
                  PageNo: Instance.PageNo,
                  Filters: FilterDataArray,
                  Sorts: SortDataArray,
                  Sums: Instance.SumsColumns,
                  RowsPerPage: Instance.RowsPerPage,
                  Columns: Instance.Columns,
                })
              }
            })
          }
        )

        if (SortDataArray != null) {
          for (var SA = 0; SA < Columns.length; SA++) {
            if (Columns[SA]['name'] == SortDataArray[0]) {
              Element.querySelector(
                '.MTableHeaderRow .MTableCell:nth-child(' + (SA + 1) + ')'
              ).innerHTML += '<div class="MTableSortArrow"></div>'
              if (SortDataArray[1] == 'ASC') {
                Element.querySelector(
                  '.MTableHeaderRow .MTableCell:nth-child(' +
                    (SA + 1) +
                    ') .MTableSortArrow'
                ).style.transform = 'rotate(0)'
              } else {
                Element.querySelector(
                  '.MTableHeaderRow .MTableCell:nth-child(' +
                    (SA + 1) +
                    ') .MTableSortArrow'
                ).style.transform = 'rotate(180deg)'
              }
            }
          }
        }

        if (MTableOptions.length == 0) {
          Element.querySelectorAll('.MTableRowOptions').forEach(function (e) {
            e.style.display = 'none'
          })
          Element.querySelectorAll('.MTableRowOptionsPadding').forEach(
            function (e) {
              e.style.display = 'none'
            }
          )
        }

        function MTableCellResize() {
          // Set Loader Top
          Element.querySelector('.MTableLoader').style.top =
            Element.querySelector(
              '.MTableBodyContainer'
            ).getBoundingClientRect().top -
            Element.getBoundingClientRect().top -
            2 +
            'px'

          var MTableDataRows = Element.querySelectorAll('.MTableDataRow')
          var MTableHeaderRows = Element.querySelectorAll(
            '.MTableHeaderRow .MTableCell'
          )
          var MTableFilterRows = Element.querySelectorAll(
            '.MTableFilterRow .MTableCell'
          )
          var MTableTotalsRow = Element.querySelectorAll(
            '.MTableTotalsRow .MTableCell'
          )

          if (Element.clientWidth > MaxMTableColumnsSizes) {
            for (var l = 0; l < MTableColumnsSizes.length; l++) {
              var MTableColumnSizePercentage =
                (MTableColumnsSizes[l] / MaxMTableColumnsSizes) * 100
              var MTableColumnSizePixel = MTableColumnsSizes[l]

              if (MTableHeaderRows.length != 0) {
                Element.querySelector(
                  '.MTableHeaderRow .MTableCell:nth-child(' + (l + 1) + ')'
                ).style.width = MTableColumnSizePercentage + '%'
                Element.querySelector(
                  '.MTableHeaderRow .MTableCell:nth-child(' + (l + 1) + ')'
                ).style.minWidth = MTableColumnSizePixel + 'px'
              }

              if (MTableFilterRows.length != 0) {
                Element.querySelector(
                  '.MTableFilterRow .MTableCell:nth-child(' + (l + 1) + ')'
                ).style.width = MTableColumnSizePercentage + '%'
                Element.querySelector(
                  '.MTableFilterRow .MTableCell:nth-child(' + (l + 1) + ')'
                ).style.minWidth = MTableColumnSizePixel + 'px'
              }

              if (MTableDataRows.length != 0) {
                MTableDataRows.forEach(function (e) {
                  e.querySelector(
                    '.MTableCell:nth-child(' + (l + 1) + ')'
                  ).style.width = MTableColumnSizePercentage + '%'
                  e.querySelector(
                    '.MTableCell:nth-child(' + (l + 1) + ')'
                  ).style.minWidth = MTableColumnSizePixel + 'px'
                })
              }

              if (MTableTotalsRow.length != 0) {
                Element.querySelector(
                  '.MTableTotalsRow .MTableCell:nth-child(' + (l + 1) + ')'
                ).style.width = MTableColumnSizePercentage + '%'
                Element.querySelector(
                  '.MTableTotalsRow .MTableCell:nth-child(' + (l + 1) + ')'
                ).style.minWidth = MTableColumnSizePixel + 'px'
              }
            }
          } else {
            for (var MTCS = 0; MTCS <= MTableColumnsSizes.length - 1; MTCS++) {
              if (MTableHeaderRows.length != 0) {
                Element.querySelector(
                  '.MTableHeaderRow .MTableCell:nth-child(' + (MTCS + 1) + ')'
                ).style.width = MTableColumnsSizes[MTCS] + 'px'
                Element.querySelector(
                  '.MTableHeaderRow .MTableCell:nth-child(' + (MTCS + 1) + ')'
                ).style.minWidth = MTableColumnSizePixel + 'px'
              }
              if (MTableFilterRows.length != 0) {
                Element.querySelector(
                  '.MTableFilterRow .MTableCell:nth-child(' + (MTCS + 1) + ')'
                ).style.width = MTableColumnsSizes[MTCS] + 'px'
                Element.querySelector(
                  '.MTableFilterRow .MTableCell:nth-child(' + (MTCS + 1) + ')'
                ).style.minWidth = MTableColumnSizePixel + 'px'
              }
              if (MTableDataRows.length != 0) {
                Element.querySelector(
                  '.MTableTotalsRow .MTableCell:nth-child(' + (MTCS + 1) + ')'
                ).style.width = MTableColumnsSizes[MTCS] + 'px'
                Element.querySelector(
                  '.MTableTotalsRow .MTableCell:nth-child(' + (MTCS + 1) + ')'
                ).style.minWidth = MTableColumnSizePixel + 'px'
                MTableDataRows.forEach(function (e) {
                  e.querySelector(
                    '.MTableCell:nth-child(' + (MTCS + 1) + ')'
                  ).style.width = MTableColumnsSizes[MTCS] + 'px'
                  e.querySelector(
                    '.MTableCell:nth-child(' + (MTCS + 1) + ')'
                  ).style.minWidth = MTableColumnSizePixel + 'px'
                })
              }
            }
          }
        }
      }
      function ShowMTableOptions(event) {
        const contextMenu = Element.querySelector('.MTableOptions')
        const parentTable = Element.querySelector('.MTableWrapper') // Get the closest `.MTable` parent

        if (!contextMenu || !parentTable) return // Exit if elements aren't found

        // Get event coordinates
        let posX = event.pageX
        let posY = event.pageY

        // Get bounding box of `.MTable` container
        const parentRect = parentTable.getBoundingClientRect()

        // Get dimensions of the context menu
        const menuWidth = contextMenu.offsetWidth
        const menuHeight = contextMenu.offsetHeight

        // Check if menu overflows the right edge of `.MTable`
        if (posX + menuWidth > parentRect.right) {
          posX -= menuWidth // Move menu to the left if it exceeds `.MTable`
        }

        // Check if menu overflows the left edge of `.MTable`
        if (posX < parentRect.left) {
          posX = parentRect.left // Adjust to `.MTable` left edge
        }

        // Check if menu overflows the bottom edge of `.MTable`
        if (posY + menuHeight > parentRect.bottom) {
          posY -= menuHeight // Move menu upwards if it exceeds `.MTable`
          if (posY < parentRect.top) {
            posY = parentRect.top // Ensure menu stays within the top of `.MTable`
          }
        }

        // Check if menu overflows the top edge of `.MTable`
        if (posY < parentRect.top) {
          posY = parentRect.top // Adjust to `.MTable` top edge
        }

        // Clear background color for all rows
        document.querySelectorAll('.MTableDataRow').forEach(function (e) {
          e.style.backgroundColor = ''
        })

        // Set position and display the context menu
        contextMenu.style.left = posX + 'px'
        contextMenu.style.top = posY + 'px'
        contextMenu.setAttribute(
          'MTableRowID',
          event.target.closest('.MTableDataRow').getAttribute('MTableRowID')
        )
        event.target.closest('.MTableDataRow').style.backgroundColor =
          'var(--MTableRowHighlight)'
        contextMenu.style.display = 'flex'
      }
      function HideMTableOptions(event = null) {
        Element.querySelectorAll('.MTableBodyContainer .MTableRow').forEach(
          function (e) {
            e.style.backgroundColor = ''
          }
        )
        if (document.querySelector('.MTableOptions')) {
          if (event != null) {
            if (
              event.relatedTarget &&
              event.relatedTarget.classList.contains('MTableOptions')
            ) {
              setTimeout(function () {
                document.querySelector('.MTableOptions').style.display = 'none'
              }, 100)
            } else {
              document.querySelector('.MTableOptions').style.display = 'none'
            }
          } else {
            document.querySelector('.MTableOptions').style.display = 'none'
          }
        }
      }
      function BuildMTablePages() {
        var MTablePageButtonsElement =
          Element.querySelector('.MTablePageButtons')
        var ButtonsNo = 2

        MTablePageButtonsElement.innerHTML = ''
        if (PagesCount < 1) {
          PagesCount = 1
        }
        var PagesBefore = Instance.PageNo - 1
        var PagesAfter = PagesCount - Instance.PageNo
        var PagesBeforeResult = 0
        var PagesAfterResult = 0

        if (PagesBefore >= ButtonsNo) {
          PagesBeforeResult = ButtonsNo
        } else {
          PagesBeforeResult = PagesBefore
        }

        if (PagesAfter >= ButtonsNo * 2 - PagesBeforeResult) {
          PagesAfterResult = ButtonsNo * 2 - PagesBeforeResult
        } else {
          PagesAfterResult = PagesAfter
        }
        if (PagesBeforeResult + PagesAfterResult < ButtonsNo * 2) {
          if (PagesBefore > ButtonsNo * 2) {
            PagesBeforeResult = PagesBefore
            if (PagesBeforeResult + PagesAfterResult > ButtonsNo * 2) {
              PagesBeforeResult = ButtonsNo * 2 - PagesAfterResult
            }
          }
        }
        if (Instance.PageNo != 1) {
          MTablePageButtonsElement.innerHTML +=
            '<div id="1" class="MTablePageButton"><svg viewBox="0 0 100 100"><polygon points="53.7,49.99 28.95,25.24 23.3,30.9 42.4,50 23.3,69.1 28.95,74.76 53.7,50.01 53.69,50"/><polygon points="76.7,49.99 51.95,25.24 46.3,30.9 65.4,50 46.3,69.1 51.95,74.76 76.7,50.01 76.69,50"/></svg></div>'
        }
        for (var i = PagesBeforeResult; i >= 1; i--) {
          MTablePageButtonsElement.innerHTML +=
            '<div id="' +
            (Instance.PageNo - i) +
            '" class="MTablePageButton">' +
            (Instance.PageNo - i) +
            '</div>'
        }

        MTablePageButtonsElement.innerHTML +=
          '<div id="' +
          Instance.PageNo +
          '" class="MTablePageButton">' +
          Instance.PageNo +
          '</div>'

        for (var j = 1; j <= PagesAfterResult; j++) {
          MTablePageButtonsElement.innerHTML +=
            '<div id="' +
            (Instance.PageNo + j) +
            '" class="MTablePageButton">' +
            (Instance.PageNo + j) +
            '</div>'
        }
        if (Instance.PageNo != PagesCount) {
          MTablePageButtonsElement.innerHTML +=
            '<div id="' +
            PagesCount +
            '" class="MTablePageButton"><svg viewBox="0 0 100 100"><polygon points="46.3,49.99 71.05,25.24 76.7,30.9 57.6,50 76.7,69.1 71.05,74.76 46.3,50.01 46.31,50"/><polygon points="23.3,49.99 48.05,25.24 53.7,30.9 34.6,50 53.7,69.1 48.05,74.76 23.3,50.01 23.31,50"/></svg></div>'
        }

        var MTablePageButton =
          MTablePageButtonsElement.querySelectorAll('.MTablePageButton')
        MTablePageButton.forEach(function (e) {
          e.classList.remove('ActiveMTablePageButton')

          if (e.getAttribute('id') == Instance.PageNo) {
            e.classList.add('ActiveMTablePageButton')
          }

          e.removeEventListener('click', null)
          e.addEventListener('click', function () {
            Element.querySelector('.MTableLoader').style.display = 'flex'

            Element.querySelectorAll('.MTableFilterRow input').forEach(
              function (e) {
                e.disabled = true
              }
            )
            Element.querySelectorAll(
              '.MTableFilterRow .MTableFilterBTN'
            ).forEach(function (e) {
              e.style.display = 'none'
            })
            Element.querySelectorAll('.MTableHeaderRow .MTableCell').forEach(
              function (e) {
                e.style.pointerEvents = 'none'
              }
            )
            Element.querySelector('.MTableBodyContainer').style.pointerEvents =
              'none'
            Element.querySelectorAll(
              '.MTablePageButtons .MTablePageButton'
            ).forEach(function (e) {
              e.style.pointerEvents = 'none'
            })
            if (GetDataFunction) {
              Instance.PageNo = parseInt(this.getAttribute('id'))
              GetDataFunction({
                PageNo: Instance.PageNo,
                Filters: FilterDataArray,
                Sorts: SortDataArray,
                Sums: Instance.SumsColumns,
                RowsPerPage: Instance.RowsPerPage,
                Columns: Instance.Columns,
              })
            }
          })
        })
      }
      function ShowCombo(Filter) {
        const targetDiv =
          Filter.closest('.MTableCell').querySelector('.MTableFilterCombo')
        const referenceDiv = Filter.closest('.MTableCell').querySelector(
          '.MTableFilterContent'
        )
        const offset = 0
        const referenceRect = referenceDiv.getBoundingClientRect()

        if (referenceDiv && targetDiv) {
          targetDiv.style.width =
            parseFloat(referenceDiv.getBoundingClientRect().width.toFixed(2)) +
            'px'
          targetDiv.style.display = 'flex'
          let newTop = referenceRect.bottom + 5
          let newLeft = referenceRect.left

          if (newTop + targetDiv.offsetHeight > window.innerHeight - offset) {
            newTop = window.innerHeight - targetDiv.offsetHeight - offset
          }
          if (newTop < offset) {
            newTop = offset
          }

          if (newLeft + targetDiv.offsetWidth > window.innerWidth - offset) {
            newLeft = window.innerWidth - targetDiv.offsetWidth - offset
          }
          if (newLeft < offset) {
            newLeft = offset
          }

          targetDiv.style.top = `${newTop}px`
          targetDiv.style.left = `${newLeft}px`
        }
      }
      function HideCombo() {
        Element.querySelectorAll('.MTableFilterCombo').forEach(function (e) {
          e.style.display = 'none'
        })
      }
      function PopulateCombo(Filter) {
        Filter.querySelector('.MTableFilterInput').value = ''
        Filter.querySelectorAll('.SelectedMTableFilterComboItem').forEach(
          function (e) {
            if (Filter.querySelector('.MTableFilterInput').value == '') {
              Filter.querySelector('.MTableFilterInput').value += e.innerHTML
            } else {
              Filter.querySelector('.MTableFilterInput').value +=
                ',' + e.innerHTML
            }
          }
        )

        //Show/Hide The Search/Clear Button
        if (
          Filter.querySelector('.MTableFilterInput').value ==
          FilterDataArray[Filter.getAttribute('filtername')]
        ) {
          Filter.querySelector('.MTableFilterBTN').style.display = 'none'
          if (Filter.querySelector('.MTableFilterInput').value != '') {
            Filter.querySelector('.MTableClearBTN').style.display = 'flex'
          }
        } else {
          Filter.querySelector('.MTableFilterBTN').style.display = 'flex'
          Filter.closest('.MTableCell').querySelector(
            '.MTableClearBTN'
          ).style.display = 'none'
        }
      }
    },
    LoadMTable() {
      FilterDataArray = {}
      this.Element.querySelector('.MTableSummary').style.display = 'none'
      this.Element.querySelector('.MTablePageButtons').innerHTML = ''

      for (var i = 0; i < this.Columns.length; i++) {
        FilterDataArray[this.Columns[i]['name']] = ''
      }

      SortDataArray = {}

      this.Element.querySelector('.MTableLoader').style.display = 'flex'

      this.Element.querySelectorAll('.MTableFilterRow input').forEach(function (
        e
      ) {
        e.disabled = true
      })
      this.Element.querySelectorAll(
        '.MTableFilterRow .MTableFilterBTN'
      ).forEach(function (e) {
        e.style.display = 'none'
      })
      this.Element.querySelectorAll('.MTableHeaderRow .MTableCell').forEach(
        function (e) {
          e.style.pointerEvents = 'none'
        }
      )
      this.Element.querySelector('.MTableBodyContainer').style.pointerEvents =
        'none'
      this.Element.querySelectorAll(
        '.MTablePageButtons .MTablePageButton'
      ).forEach(function (e) {
        e.style.pointerEvents = 'none'
      })

      if (this.GetDataFunction) {
        this.GetDataFunction({
          PageNo: this.PageNo,
          Filters: FilterDataArray,
          Sorts: SortDataArray,
          Sums: this.SumsColumns,
          RowsPerPage: this.RowsPerPage,
          Columns: this.Columns,
        })
      }
    },
    serializeVNode(vnode) {
      if (!vnode) return ''
      let html = `<${vnode.type}`

      if (vnode.props) {
        for (const [key, value] of Object.entries(vnode.props)) {
          html += ` ${key}="${value}"`
        }
      }
      html += '>'

      if (vnode.children && Array.isArray(vnode.children)) {
        vnode.children.forEach(child => {
          html += typeof child === 'string' ? child : this.serializeVNode(child)
        })
      }

      html += `</${vnode.type}>`
      return html
    },
  },
}
</script>

<style>
/* =========== MTable =========== */

/* Light Mode Colors */
:root {
  --MTablePrimaryColor: #1976d2;
  --MTableBG: #fff;
  --MTableFilterInputBG: rgba(0, 0, 0, 0.1);
  --MTableFilterInputHoverBG: rgba(0, 0, 0, 0.2);
  --MTableRowHighlight: rgba(0, 0, 0, 0.1);
  --MTableOptionsBG: rgba(0, 0, 0, 0.05);
  --MTableTextColor: #000;
  --MTableLines: #aaa;
  --MTableFilterBTNHoverBG: rgba(0, 0, 0, 0.1);
  --MTablePageBTNHoverBG: rgba(0, 0, 0, 0.1);
  --MTableDataRowHover: rgba(0, 0, 0, 0.1);
  --MTableSubArrayBG: rgba(0, 0, 0, 0.1);
  --MTableSummaryBG: rgba(0, 0, 0, 0.05);
  --MTableComboBG: #fff;
  --MTableComboItemBG: rgba(0, 0, 0, 0.1);
  --MTableComboItemBGHover: rgba(0, 0, 0, 0.2);
}

/* Dark Mode Colors */
.DarkMode {
  --MTablePrimaryColor: #1976d2;
  --MTableBG: #2f3349;
  --MTableFilterInputBG: rgba(255, 255, 255, 0.1);
  --MTableFilterInputHoverBG: rgba(255, 255, 255, 0.2);
  --MTableRowHighlight: rgba(255, 255, 255, 0.1);
  --MTableOptionsBG: rgba(255, 255, 255, 0.05);
  --MTableTextColor: #fff;
  --MTableLines: #888;
  --MTableFilterBTNHoverBG: rgba(255, 255, 255, 0.1);
  --MTablePageBTNHoverBG: rgba(255, 255, 255, 0.1);
  --MTableDataRowHover: rgba(255, 255, 255, 0.1);
  --MTableSubArrayBG: rgba(255, 255, 255, 0.1);
  --MTableSummaryBG: rgba(255, 255, 255, 0.05);
  --MTableComboBG: #2f3349;
  --MTableComboItemBG: rgba(255, 255, 255, 0.1);
  --MTableComboItemBGHover: rgba(255, 255, 255, 0.2);
}

.MTable {
  display: flex;
  width: 100%;
  max-width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0;
}

.MTable ::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

.MTable ::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.MTable ::-webkit-scrollbar-thumb {
  background: #888;
}

.MTable ::-webkit-scrollbar-thumb:hover {
  background: #555;
  width: 10px;
}

.MTable ::-webkit-scrollbar:hover * {
  width: 10px;
}

.MTable ::-webkit-scrollbar-track:hover {
  width: 10px;
}

.MTableOptions {
  display: none;
  position: fixed;
  min-width: 150px;
  max-width: 250px;
  width: min-content;
  height: min-content;
  z-index: 10;
  flex-wrap: wrap;
  background-color: var(--MTableOptionsBG);
  border-radius: 3px;
  padding: 10px;
  backdrop-filter: blur(5px);
  border: 1px solid #999;
}

.MTableOption {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  cursor: pointer;
}

.MTableOption:not(:last-child) {
  border-bottom: 1px solid #777;
  padding-bottom: 10px;
}

.MTableOption:not(:first-child) {
  padding-top: 10px;
}

.MTableOptionIcon {
  display: flex;
  width: 25px;
  height: 25px;
  margin: 0 10px;
}

.MTableOptionIcon svg {
  fill: var(--MTableTextColor);
  transition-duration: 0.3s;
}

.MTableOptionName {
  display: flex;
  align-items: center;
  color: var(--MTableTextColor);
  font-family: 'MFontR';
}

.MTableOption:hover .MTableOptionName {
  color: var(--MTablePrimaryColor);
}

.MTableOption:hover .MTableOptionIcon svg {
  fill: var(--MTablePrimaryColor);
}

.MTableWrapper {
  display: flex;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  flex-wrap: wrap;
  border-radius: 5px;
  position: relative;
  background-color: var(--MTableBG);
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
}

.MGroup .MTableWrapper {
  border: 1px solid #777;
}

.MTableBackground {
  width: 100%;
  height: 5px;
}

.MTableTableContainer {
  overflow-y: hidden;
  overflow-x: auto;
  width: calc(100% - 0.1px);
}

.MTable .MTableContent {
  width: 100%;
  min-width: fit-content;
  display: flex;
  flex-wrap: wrap;
}

.MTable .MTableRow {
  display: flex;
  width: 100%;
}

.MTable .MTableCell {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  box-sizing: border-box;
}

.MTable .MTableCell div {
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
}

.MTable .MTableHeaderContainer {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.MTable .MTableBodyContainer {
  overflow-x: hidden;
  overflow-y: auto;
  display: block;
  flex-wrap: wrap;
  width: 100%;
}

.MTableData {
  display: flex;
  width: max-content;
  max-width: 100%;
  justify-content: center;
}

.MTableCellImage {
  display: flex;
  width: 60px !important;
  height: 60px !important;
  border-radius: 5px;
  position: relative;
}

.MTableCellImageZoom {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition-duration: 0.3s;
}

.MTableCellImage:hover .MTableCellImageZoom {
  opacity: 1;
}

.MTableCellImageZoom svg {
  display: flex;
  width: 20px;
  height: 20px;
  fill: #fff;
  cursor: pointer;
  transition-duration: 0.3s;
}

.MTableCellImageZoom svg:hover {
  fill: var(--MTablePrimaryColor);
}

.MTableCellImage img {
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  object-fit: cover;
}

.MTable .MTableHeaderRow {
  font-family: MFontB;
  font-size: 15px;
  color: var(--MTableTextColor);
  text-align: center;
  border-bottom: 2px solid var(--MTableLines);
}

.MTable .MTableHeaderRow .MTableCell {
  padding: 10px 0;
}

.MTable .MTableHeaderRow .MTableHeader {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-content: center;
}

.MTable .MTableSortArrow {
  display: flex;
  width: 0;
  height: 0;
  border-bottom: 10px solid var(--MTableTextColor);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  transform: rotate(0);
  margin: 0 5px;
}

.MTableFilterRow {
  position: relative;
  overflow: hidden;
  border-bottom: 2px solid var(--MTableLines);
}

.MTableFilterRow .MTableCell {
  margin: 5px 0;
  padding: 0;
}

.MTableFilterContent {
  display: flex;
  width: 100%;
  background-color: var(--MTableFilterInputBG);
  text-align: center;
  border-radius: 5px;
  margin: 0 2.5px;
  align-items: center;
  position: relative;
  transition-duration: 0.3s;
}

.MTableFilterRow .MTableCell:first-child .MTableFilterContent {
  margin-right: 5px;
}

.MTableFilterRow .MTableCell:last-child .MTableFilterContent {
  margin-left: 5px;
}

.MTableFilterRow .MTableCell:hover .MTableFilterContent {
  background-color: var(--MTableFilterInputHoverBG);
}

.MTableFilterRow input {
  font-family: MFontR;
  font-size: 15px;
  color: var(--MTableTextColor);
  width: 100%;
  margin: 5px 0;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid rgba(0, 0, 0, 0);
  outline: none;
  padding: 3px 5px;
  z-index: 5;
}

.MTableFilterBTN,
.MTableClearBTN {
  display: none;
  width: 25px;
  height: 25px;
  background-color: var(--MTablePrimaryColor);
  border-radius: 5px;
  min-width: 25px;
  max-width: 25px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition-duration: 0.3s;
  margin-left: 6px;
}

.MTableFilterIcon {
  fill: #fff;
  display: flex;
  width: 60%;
  height: 60%;
}

.MTableFilterBTN:hover,
.MTableClearBTN:hover {
  background-color: var(--MTableFilterBTNHoverBG);
}

.MTableFilterBTN:hover .MTableFilterIcon,
.MTableClearBTN:hover .MTableFilterIcon {
  fill: var(--MTablePrimaryColor);
}

.MTableDataRow {
  padding: 5px 0;
}

.MTableDataRow:hover {
  background-color: var(--MTableDataRowHover);
}

.MTableDataRow:not(:last-child) {
  border-bottom: 1px solid var(--MTableLines);
}

.MTableDataRow .MTableCell {
  font-family: MFontR;
  font-size: 14px;
  color: var(--MTableTextColor);
  text-align: center;
  padding-top: 9px;
  padding-bottom: 7px;
}

.MTableDataSubArray {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.MTableDataSubArrayItem {
  display: flex;
  padding: 5px 10px;
  background-color: var(--MTableSubArrayBG);
  border-radius: 5px;
  margin: 2px;
}

.MTableRowOptions {
  display: flex;
  width: 35px;
  min-width: 35px;
  cursor: pointer;
  justify-content: flex-start;
  align-items: center;
}

.MTableRowOptionsPadding {
  display: flex;
  width: 35px;
  min-width: 35px;
}

.MTableOptionsIcon {
  display: flex;
  width: 27px;
  height: 27px;
  fill: #fff;
  background-color: var(--MTablePrimaryColor);
  border-radius: 5px;
  transition-duration: 0.3s;
  justify-content: center;
  align-items: center;
}

.MTableOptionsIcon:hover {
  color: var(--MTablePrimaryColor);
  fill: var(--MTablePrimaryColor);
  background-color: var(--MTablePageBTNHoverBG);
}

.MTableOptionsIcon svg {
  display: flex;
  width: 18px;
}

.MTableTotalsRow {
  border-top: 2px solid var(--MTableLines);
}

.MTableFooterContainer {
  display: flex;
  flex-wrap: wrap;
  width: calc(100% - 0.1px);
}

.MTableTotalsRow .MTableCell {
  font-family: MFontR;
  font-size: 16px;
  color: var(--MTableTextColor);
  text-align: center;
  padding-top: 12px;
  padding-bottom: 10px;
}

.MTableExtension {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 10px;
  justify-content: center;
}

.MTableSummary {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
  width: min-content;
  background-color: var(--MTableSummaryBG);
  padding: 10px;
  border-radius: 5px;
}

.MTableExtensionSpace {
  display: flex;
  flex: 1;
}

.MTablePageButtons {
  width: min-content;
  display: flex;
  justify-content: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  min-width: 280px;
}

.MTablePageButton {
  font-family: MFontR;
  font-size: 16px;
  color: var(--MTableTextColor);
  fill: var(--MTableTextColor);
  border-radius: 4px;
  display: flex;
  width: 30px;
  height: 30px;
  margin: 5px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition-duration: 0.3s;
}

.MTablePageButton:hover {
  color: var(--MTablePrimaryColor);
  fill: var(--MTablePrimaryColor);
  background-color: var(--MTablePageBTNHoverBG);
}

.ActiveMTablePageButton,
.MTablePageButton:active {
  background-color: var(--MTablePrimaryColor);
  color: #fff;
  border-color: var(--MTablePrimaryColor);
}

.MTablePageButton:active svg {
  fill: var(--MTablePrimaryColor);
}

.MTableNoData {
  display: flex;
  width: 100%;
  height: 60px;
  color: var(--MTableTextColor);
  font-size: 16px;
  justify-content: center;
  align-items: center;
  font-family: 'MFontB';
}

.MTableLoader {
  display: none;
  position: absolute;
  height: 2px;
  right: 0;
  width: 100%;
}

.MTableLoader::after {
  content: '';
  position: absolute;
  height: 3px;
  top: -0.5px;
  left: -80%;
  z-index: 3;
  background: var(--MTablePrimaryColor);
  animation: MTableLoading 1.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}

/* #region Combo */
.MTableFilterCombo {
  display: none;
  position: fixed;
  top: 30px;
  left: 0;
  width: 100%;
  height: min-content;
  max-height: 200px;
  background-color: var(--MTableComboBG);
  border-radius: 5px;
  overflow-y: auto !important;
  border: 1px solid #777;
}

.MTableFilterComboItems {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: var(--MTableComboBG);
  border-radius: 5px;
  flex-wrap: wrap;
}

.MTableFilterComboItem {
  display: flex;
  width: 100%;
  height: min-content;
  background-color: var(--MTableComboBG);
  border-radius: 5px;
  justify-content: center;
  background-color: var(--MTableComboItemBG);
  transition-duration: 0.3s;
  margin: 3px 5px;
  padding: 7px 5px;
  cursor: pointer;
}

.MTableFilterComboItem:hover:not(.SelectedMTableFilterComboItem) {
  background-color: var(--MTableComboItemBGHover);
}

.SelectedMTableFilterComboItem {
  background-color: var(--MTablePrimaryColor);
  box-shadow: 0px 0px 6px 0px rgba(25, 118, 210, 0.8);
}

.MTableFilterComboItem:first-child {
  margin-top: 6px;
}

.MTableFilterComboItem:last-child {
  margin-bottom: 6px;
}

/* #endregion */

/* #region Date */
.MTableFilterDate {
  width: 20px !important;
  height: 20px !important;
  margin: 0 0 0 5px !important;
  padding: 0 !important;
  color: #fff !important;
}

.MTableFilterDate::-webkit-calendar-picker-indicator {
  filter: invert(1) !important;
}

/* #endregion */
@keyframes MTableLoading {
  0% {
    right: -35%;
    left: 100%;
  }

  80%,
  100% {
    right: 100%;
    left: -160%;
  }
}
</style>
