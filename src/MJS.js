/* ========== MComboBox ========== */
export function ShowLoading() {
  document.getElementById('LoadingModal').style.display = 'table'
}
export function HideLoading() {
  document.getElementById('LoadingModal').style.display = 'none'
}
export function ShowMessage(TheMessage) {
  document
    .getElementById('MessageModal')
    .querySelector('.TheMessage').innerHTML = TheMessage
  document.getElementById('MessageModal').style.display = 'table'
  document.querySelector('body').classList.add('ActiveModal')
  document.getElementById('MessageModal').classList.remove('out')
}
export function ShowChooseModal(Question, YesFunction, NoFunction) {
  var TheYesFunction = function () {
    document
      .getElementById('ChooseModal')
      .querySelector('.ChooseModalYesBTN')
      .removeEventListener('click', TheYesFunction)
    document
      .getElementById('ChooseModal')
      .querySelector('.ChooseModalNoBTN')
      .removeEventListener('click', TheNoFunction)
    YesFunction()
  }

  var TheNoFunction = function () {
    document
      .getElementById('ChooseModal')
      .querySelector('.ChooseModalYesBTN')
      .removeEventListener('click', TheYesFunction)
    document
      .getElementById('ChooseModal')
      .querySelector('.ChooseModalNoBTN')
      .removeEventListener('click', TheNoFunction)
    NoFunction()
  }

  document
    .getElementById('ChooseModal')
    .querySelector('.ChooseModalYesBTN')
    .removeEventListener('click', TheYesFunction)
  document
    .getElementById('ChooseModal')
    .querySelector('.ChooseModalYesBTN')
    .addEventListener('click', TheYesFunction)

  document
    .getElementById('ChooseModal')
    .querySelector('.ChooseModalNoBTN')
    .removeEventListener('click', TheNoFunction)
  document
    .getElementById('ChooseModal')
    .querySelector('.ChooseModalNoBTN')
    .addEventListener('click', TheNoFunction)

  document
    .getElementById('ChooseModal')
    .querySelector('.ChooseModalQuestion').innerHTML = Question
  document.getElementById('ChooseModal').style.display = 'table'
  document.querySelector('body').classList.add('ActiveModal')
  document.getElementById('ChooseModal').classList.remove('out')
}
export function ShowModal(TheModal) {
  TheModal.style.display = 'table'
  document.querySelector('body').classList.add('ActiveModal')
  TheModal.classList.remove('out')
}
export function HideModal(TheModal) {
  TheModal.classList.add('out')
  document.querySelector('body').classList.remove('ActiveModal')
  setTimeout(function () {
    TheModal.style.display = ''
  }, 700)
}
export function MStepperBuild(Element, MStepHeaders, AllowStepSelection) {
  if (Element.querySelectorAll('.MStepperHeader').length != 0) {
    Element.querySelector('.MStepperHeader').remove()
  }

  var MStepperHeaderHTML = '<div class="MStepperHeader">'
  for (var i = 0; i < MStepHeaders.length; i++) {
    MStepperHeaderHTML +=
      '<div class="MStepHeader" MStepID="' +
      (i + 1) +
      '"><div class="MStepHeaderIcon">' +
      (i + 1) +
      '</div><div class="MStepHeaderTitle">' +
      MStepHeaders[i] +
      '</div></div>'
    if (i < MStepHeaders.length - 1) {
      MStepperHeaderHTML += ' <div class="MStepperHeaderLine"></div>'
    }
  }
  MStepperHeaderHTML += '</div>'

  Element.insertAdjacentHTML('afterbegin', MStepperHeaderHTML)

  GoToStep(1)

  Element.querySelectorAll('.MStepHeader').forEach(function (e) {
    e.removeEventListener('click', null)
    if (AllowStepSelection == true) {
      e.style.cursor = 'pointer'
      e.addEventListener('click', function () {
        GoToStep(e.getAttribute('MStepID'))
      })
    } else {
      e.style.cursor = 'default'
    }
  })

  Element.querySelectorAll('[MStepperGo]').forEach(function (e) {
    e.removeEventListener('click', null)
    e.addEventListener('click', function () {
      var GoValue = e.getAttribute('MStepperGo')
      var CurrentStep = parseInt(
        Element.querySelector('.ActiveMStepHeader').getAttribute('MStepID'),
      )

      if (GoValue == 'Next') {
        if (
          CurrentStep < Element.querySelectorAll('.ActiveMStepHeader').length
        ) {
          GoToStep(CurrentStep + 1)
        }
      } else if (GoValue == 'Back') {
        if (CurrentStep > 1) {
          GoToStep(CurrentStep - 1)
        }
      } else {
        GoValue = parseInt(GoValue)
        GoToStep(GoValue)
      }
    })
  })

  function GoToStep(Step) {
    Element.querySelectorAll('.MStepHeader').forEach(function (e) {
      e.classList.remove('ActiveMStepHeader')
    })
    Element.querySelector('.MStepHeader[MStepID="' + Step + '"]').classList.add(
      'ActiveMStepHeader',
    )

    Element.querySelector(
      '.MStepContent:nth-child(' + Step + ')',
    ).classList.add('ActiveMStepContent')

    Element.querySelectorAll('.MStepContent').forEach(function (e, i) {
      if (i + 1 != Step) {
        e.classList.remove('ActiveMStepContent')
      }
    })
    Element.querySelector('.MStepperContent').style.overflow = 'hidden'

    Element.querySelectorAll('.MStepContent').forEach(function (e) {
      var Translate = (Step - 1) * 100
      e.style.right = '-' + Translate + '%'
    })

    setTimeout(function () {
      Element.querySelector('.MStepperContent').style.overflow = ''
    }, 300)
  }

  return {
    GoToStep: GoToStep,
  }
}
