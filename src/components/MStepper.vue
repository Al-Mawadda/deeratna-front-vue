<template>
  <div class="MStepper" :id="Name">
    <div class="MStepperHeader"></div>
    <div class="MStepperContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    Name: { type: String, required: true },
    StepSelection: { type: Boolean, default: true },
  },
  data() {
    return {
      Element: null,
      MStepper: null,
      StepsNames: [],
    }
  },
  mounted() {
    this.Element = document.getElementById(this.Name);
    const slotContent = this.$slots.default?.() || [];
    this.StepsNames = slotContent.map((vnode) => vnode.props?.Label || vnode.props?.label).filter((label) => label !== undefined);
    this.MStepperBuild(this.Element, this.StepsNames, this.StepSelection);
  },
  methods: {
    MStepperBuild(Element, MStepHeaders, AllowStepSelection) {
      let Instance = this;

      BuildMStepContent();
      BuildMStepHeader();
      Instance.GoToStep(1);

      Element.querySelectorAll('[MStepperGo]').forEach(function (e) {
        e.removeEventListener('click', null);
        e.addEventListener('click', function () {
          var GoValue = e.getAttribute('MStepperGo');
          Instance.GoToStep(GoValue);
        });
      });

      function BuildMStepHeader() {
        let MStepHeaderID = 1;
        let MaxStepWidth = 0;
        let CurrentStep = Element.querySelector('.ActiveMStepHeader')?.getAttribute('MStepID') || 1;
        Element.querySelector('.MStepperHeader').innerHTML = '';
        for (let i = 0; i < MStepHeaders.length; i++) {
          if (Element.querySelector('.MStepContent:nth-child(' + (i + 1) + ')').getAttribute('visible') != 'false') {
            Element.querySelector('.MStepperHeader').innerHTML +=
              '<div class="MStepHeader" MStepID="' +
              (MStepHeaderID) +
              '"><div class="MStepHeaderIcon">' +
              (MStepHeaderID) +
              '</div><div class="MStepHeaderTitle">' +
              MStepHeaders[i] +
              '</div></div>';
            if (i < MStepHeaders.length - 1) {
              Element.querySelector('.MStepperHeader').innerHTML += ' <div class="MStepperHeaderLine"></div>';
            }
            MStepHeaderID++;
          }
        }
        Element.querySelector('.MStepHeader[MStepID="' + CurrentStep + '"]').classList.add('ActiveMStepHeader');
        Element.querySelectorAll('.MStepHeader').forEach(function (e) {
          if (MaxStepWidth < e.offsetWidth) {
            MaxStepWidth = e.offsetWidth;
          }
          e.removeEventListener('click', null);
          if (AllowStepSelection == true) {
            e.style.cursor = 'pointer';
            e.addEventListener('click', function () {
              Instance.GoToStep(e.getAttribute('MStepID'));
            });
          } else {
            e.style.cursor = 'default';
          }
        });

        Element.querySelectorAll('.MStepperHeaderLine').forEach(function (Line) {
          new ResizeObserver(([e]) => {
            if (e.contentRect.width < 10) {
              Element.querySelectorAll('.MStepHeader').forEach(function (Header) {
                Header.querySelector('.MStepHeaderTitle').style.display = 'none';
              });
            } else {
              if (e.contentRect.width > MaxStepWidth) {
                Element.querySelectorAll('.MStepHeader').forEach(function (Header) {
                  Header.querySelector('.MStepHeaderTitle').style.display = 'flex';
                });
              }
            }
          }).observe(Line);
        });
      }
      function BuildMStepContent() {
        let MStepsContent = Element.querySelectorAll('.MStepContent');
        let MStepContentID = 1;
        for (let i = 0; i < MStepsContent.length; i++) {
          if (MStepsContent[i].getAttribute('visible') != 'false') {
            MStepsContent[i].style.display = 'flex';
            MStepsContent[i].setAttribute('MStepID', MStepContentID);
            MStepContentID++;
          } else {
            MStepsContent[i].style.display = 'none';
          }
          let MStepWrapper = document.createElement('div');
          MStepWrapper.className = 'MStepContentWrapper';
          while (MStepsContent[i].firstChild) {
            MStepWrapper.appendChild(MStepsContent[i].firstChild);
          }
          MStepsContent[i].appendChild(MStepWrapper);
        }
      }

      Element.querySelectorAll('.MStepContent').forEach(function (e) {
        new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'visible') {
              BuildMStepContent();
              BuildMStepHeader();
              break;
            }
          }
        }).observe(e, { attributes: true, attributeFilter: ['visible'] });
      });
    },
    GoToStep(TheStep) {
      let Instance = this;
      let Step = 0;
      let CurrentStep = parseInt(this.Element.querySelector('.ActiveMStepHeader').getAttribute('MStepID'));

      if (TheStep == 'Next') {
        if (CurrentStep < this.Element.querySelectorAll('.MStepHeader').length) {
          Step = CurrentStep + 1;
        }
      } else if (TheStep == 'Back') {
        if (CurrentStep > 1) {
          Step = CurrentStep - 1;
        }
      } else {
        Step = parseInt(TheStep);
      }

      Instance.Element.querySelectorAll('.MStepHeader').forEach(function (e) {
        e.classList.remove('ActiveMStepHeader');
      });
      Instance.Element.querySelector('.MStepHeader[MStepID="' + Step + '"]').classList.add('ActiveMStepHeader');

      Instance.Element.querySelector('.MStepContent[MStepID="' + Step + '"]').classList.add('ActiveMStepContent');

      Instance.Element.querySelectorAll('.MStepContent').forEach(function (e) {
        if (e.getAttribute('MStepID') != Step) {
          e.classList.remove('ActiveMStepContent');
        }
      });

      Instance.Element.querySelector('.MStepperContent').style.overflow = 'hidden';

      Instance.Element.querySelectorAll('.MStepContent').forEach(function (e) {
        var Translate = (Step - 1) * 100;
        e.style.right = '-' + Translate + '%';
      });

      setTimeout(function () {
        Instance.Element.querySelector('.MStepperContent').style.overflow = '';
      }, 300);
    }
  },
}
</script>

<style>
/* Light Mode Colors */
:root {
  --MStepperHeaderColor: #000;
  --MStepperHeaderBorder: #000;
  --MStepperHeaderTitleColor: #000;
  --MStepperheaderHoverBG: rgba(0, 0, 0, 0.05);
  --MStepperHeaderLineBG: #000;
  --MStepperContentBG: #fff;
}

/* Dark Mode Colors */
.DarkMode {
  --MStepperHeaderColor: #fff;
  --MStepperHeaderBorder: #fff;
  --MStepperHeaderTitleColor: #fff;
  --MStepperheaderHoverBG: rgba(255, 255, 255, 0.05);
  --MStepperHeaderLineBG: #fff;
  --MStepperContentBG: rgba(47, 51, 73, 0.7);
}

.MStepper {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}

.MStepperHeader {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 10px;
}

.MStepHeader {
  display: flex;
  width: min-content;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  transition-duration: 0.3s;
}

.MStepHeaderIcon {
  display: flex;
  width: 25px;
  height: 25px;
  min-width: 25px;
  min-height: 25px;
  border-radius: 50%;
  border: 1px solid var(--MStepperHeaderBorder);
  color: var(--MStepperHeaderColor);
  justify-content: center;
  align-items: center;
  font-family: 'MFontB';
  line-height: 0.3;
  transition-duration: 0.3s;
  margin-left: 5px;
}

.MStepHeaderTitle {
  font-family: 'MFontB';
  display: flex;
  white-space: nowrap;
  width: min-content;
  height: 100%;
  align-items: center;
  color: var(--MStepperHeaderTitleColor);
  transition-duration: 0.3s;
}

.ActiveMStepHeader .MStepHeaderIcon {
  border: 1px solid var(--PrimaryColor);
  background-color: var(--PrimaryColor);
  color: #fff;
}

.ActiveMStepHeader .MStepHeaderTitle {
  color: var(--PrimaryColor);
}

.MStepHeader:hover {
  background-color: var(--MStepperheaderHoverBG);
}

.MStepperHeaderLine {
  display: flex;
  flex: 1;
  background-color: var(--MStepperHeaderLineBG);
  height: 1px;
}

.MStepperContent {
  display: flex;
  width: 100%;
  background-color: var(--MStepperContentBG);
  border-radius: 5px;
  flex-wrap: nowrap;
  white-space: nowrap;
  position: relative;
  box-shadow: 0 2px 5px 1px #0000001a;
}

.MStepContent {
  display: flex;
  min-width: calc(100% - 20px);
  padding: 20px 10px;
  height: min-content;
  transition-duration: 0.3s;
  justify-content: center;
  position: relative;
}

.MStepContentWrapper {
  display: none;
  flex-wrap: wrap;
}

.ActiveMStepContent .MStepContentWrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
