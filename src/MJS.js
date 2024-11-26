/* ========== MComboBox ========== */
export function MComboBoxBuild(Element, Items, ItemsName, ItemsID, Label, DefaultValue, MComboBoxInput, AllowNonListedInput, MaxVisibleItems, Optional) {
    Element.innerHTML = '';
    var MCBValue = '';

    if (Optional == true) {
        if (ItemsName === null) {
            Items = [''].concat(Items);
        } else {
            Items.unshift({ id: 0, name: '' });
        }
    }

    var MFilteredItems = Items;

    MCBValue = '<input autocomplete="false" required type="text" value="' + DefaultValue + '"/>';
    var MCBLabel = '<label>' + Label + '</label>'
    var MCBChevron = '<div class="MComboBoxChevron"><svg viewBox="0 0 1000 1000"><polygon points="333.8,75.7 241.9,167.7 574.2,500 241.9,832.3 333.8,924.3 758.1,500 "></polygon></svg></div>';
    var MCBBG = '<div class="MComboBoxBG"></div>'
    var MCBValueContainer = '<div tabindex="-1" class="MCBValueContainer">' + MCBValue + MCBLabel + MCBBG + MCBChevron + '</div>';
    var MCBItemsContainer = '<div class="MComboBoxItems"></div>';

    Element.innerHTML += MCBValueContainer;
    Element.innerHTML += MCBItemsContainer;

    FillComboBoxItems();

    if (MComboBoxInput == true) {
        Element.querySelector('input').style.pointerEvents = '';
        Element.querySelector('.MComboBoxBG').style.cursor = 'default';
    } else {
        Element.querySelector('input').style.pointerEvents = 'none';
        Element.querySelector('.MComboBoxBG').style.cursor = 'pointer';
    }

    // Set Max Visible Items
    Element.querySelector('.MComboBoxItems').style.display = 'none';
    Element.querySelector('.MComboBoxItems').style.maxHeight = (MaxVisibleItems * 31) + 'px';

    Element.querySelector('input').removeEventListener('focus', null);
    Element.querySelector('input').addEventListener('focus', function () {
        if (Element.querySelector('.MComboBoxItems').style.display == 'none') {
            FillComboBoxItems();

            Element.querySelector('.MComboBoxItems').style.display = 'flex';
            Element.querySelector('.MComboBoxChevron').style.transform = 'rotate(90deg)';
        }

        window.removeEventListener('keydown', null);
        window.addEventListener('keydown', function (e) {
            if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault();
            }
        });
    });

    Element.querySelector('.MComboBoxChevron').removeEventListener('click', null);
    Element.querySelector('.MComboBoxChevron').addEventListener('click', function () {
        if (Element.getAttribute('MCBDisabled') != 'true') {
            if (Element.querySelector('.MComboBoxItems').style.display == 'none') {
                FillComboBoxItems();
                Element.querySelector('.MComboBoxItems').style.display = 'flex';
                Element.querySelector('.MComboBoxChevron').style.transform = 'rotate(90deg)';
            } else {
                Element.querySelector('.MComboBoxItems').style.display = 'none';
                Element.querySelector('.MComboBoxChevron').style.transform = 'rotate(0)';
            }
        }
    });

    Element.querySelector('.MComboBoxBG').removeEventListener('click', null);
    Element.querySelector('.MComboBoxBG').addEventListener('click', function () {
        if (Element.getAttribute('MCBDisabled') != 'true') {
            if (Element.querySelector('.MComboBoxItems').style.display == 'none') {
                FillComboBoxItems();
                Element.querySelector('.MComboBoxItems').style.display = 'flex';
                Element.querySelector('.MComboBoxChevron').style.transform = 'rotate(90deg)';
            } else {
                Element.querySelector('.MComboBoxItems').style.display = 'none';
                Element.querySelector('.MComboBoxChevron').style.transform = 'rotate(0)';
            }
        }
    });

    Element.removeEventListener('focusout', null);
    Element.addEventListener('focusout', function (e) {

        if (Element.getAttribute('MCBDisabled') != 'true') {
            if (e.relatedTarget && e.relatedTarget.classList.contains('MComboBoxItem') != null) {
                setTimeout(() => {
                    const MCBValueChange = new CustomEvent("MCBValueChange", { detail: { MCBID: 'someValue', MCBValue: Element.querySelector('input').value } });
                    Element.dispatchEvent(MCBValueChange);
                }, 100);
            } else {

                Element.querySelector('.MComboBoxItems').style.display = 'none';
                Element.querySelector('.MComboBoxChevron').style.transform = 'rotate(0)';

                if (AllowNonListedInput === false) {
                    var MCBFilterdItemsArray = [];
                    var ItemsMatch = false;
                    MCBFilterdItemsArray = Element.querySelectorAll('.MComboBoxItem[style*="display: flex"]');
                    for (var i = 0; i <= MCBFilterdItemsArray.length - 1; i++) {
                        if (MCBFilterdItemsArray[i].innerHTML === Element.querySelector('input').value) {
                            ItemsMatch = true;
                        }
                    }
                    if (ItemsMatch === false) {
                        Element.querySelector('input').value = '';
                        MFilteredItems = Items;
                    }
                }
            }
        }
        window.removeEventListener('keydown', null);
    });

    var CurrentHighlight = 0;
    Element.querySelector('input').removeEventListener('keyup', null);
    Element.querySelector('input').addEventListener('keyup', function (e) {
        var MCBInputEvent = this;
        var ItemsMatch = false;
        MFilteredItems = Items;

        if (ItemsName === null) {
            for (var i = 0; i <= MFilteredItems.length - 1; i++) {
                if (Items[i] == MCBInputEvent.value) {
                    ItemsMatch = true;
                }
            }

            if (ItemsMatch == false) {

                MFilteredItems = Items.filter(function (item) {
                    if (item.toLowerCase() == MCBInputEvent.value.toLowerCase()) {
                        return item;
                    }
                });

                if (MFilteredItems.length > 0) {
                    MFilteredItems = Items;
                } else {
                    MFilteredItems = Items.filter(function (item) {
                        if (item.toLowerCase().indexOf(MCBInputEvent.value.toLowerCase()) > -1) {
                            return item;
                        }
                    });
                }
            } else {
                MFilteredItems = Items;
            }
        } else {
            for (var i = 0; i <= MFilteredItems.length - 1; i++) {
                if (Items[i][ItemsName] == MCBInputEvent.value) {
                    ItemsMatch = true;
                    Element.setAttribute('SelectionID', Items[i][ItemsID]);
                }
            }

            if (ItemsMatch == false) {
                Element.removeAttribute('SelectionID');
                MFilteredItems = Items.filter(function (item) {
                    if (item[ItemsName].toLowerCase() == MCBInputEvent.value.toLowerCase()) {
                        return item;
                    }
                });

                if (MFilteredItems.length > 0) {
                    MFilteredItems = Items;
                } else {
                    MFilteredItems = Items.filter(function (item) {
                        if (item[ItemsName].toLowerCase().indexOf(MCBInputEvent.value.toLowerCase()) > -1) {
                            return item;
                        }
                    });
                }
            } else {
                MFilteredItems = Items;
            }
        }

        FillComboBoxItems();

        var MaxHighlight = Element.querySelectorAll('.MComboBoxItems .MComboBoxItem').length;

        if (e.keyCode == 38) {
            if (CurrentHighlight > 1) {
                CurrentHighlight--;
            }

            if (Element.querySelectorAll('.MComboBoxItemHighlight').length != 0) {
                Element.querySelector('.MComboBoxItemHighlight').removeClass('MComboBoxItemHighlight');
            }
            Element.querySelector('.MComboBoxItem:nth-child(' + CurrentHighlight + ')').classList.add('MComboBoxItemHighlight');
            Element.querySelector('.MComboBoxItemHighlight').scrollIntoView(false);
        } else if (e.keyCode == 40) {
            if (CurrentHighlight < MaxHighlight) {
                CurrentHighlight++;
            }
            if (Element.querySelectorAll('.MComboBoxItemHighlight').length != 0) {
                Element.querySelector('.MComboBoxItemHighlight').removeClass('MComboBoxItemHighlight');
            }
            Element.querySelector('.MComboBoxItem:nth-child(' + CurrentHighlight + ')').classList.add('MComboBoxItemHighlight');
            Element.querySelector('.MComboBoxItemHighlight').scrollIntoView(false);
        } else if (e.keyCode == 13) {
            if (Element.querySelector('.MComboBoxItems').style.display != 'none') {
                if (CurrentHighlight != 0) {
                    Element.querySelector('input').value = Element.querySelector('.MComboBoxItem:nth-child(' + CurrentHighlight + ')').innerHTML;
                    Element.querySelector('.MComboBoxItems').style.display = 'none';
                    Element.querySelector('.MComboBoxChevron').style.transform = 'rotate(0)';
                    Element.querySelector('input').blur();
                }
            } else {
                Element.querySelector('input').style.display = 'flex';
                Element.querySelector('.MComboBoxChevron').style.transform = 'rotate(90deg)';
            }
        } else {
            CurrentHighlight = 0;
        }
    });

    function FillComboBoxItems() {
        var MCBFilteredItems = '';
        Element.querySelector('.MComboBoxItems').innerHTML = '';
        if (ItemsName === null) {
            for (var i = 0; i <= MFilteredItems.length - 1; i++) {
                MCBFilteredItems += '<div tabindex="-1" style="display: flex;" class="MComboBoxItem">' + MFilteredItems[i] + '</div>';
            }
        } else {
            if (ItemsID === null) {
                for (var i = 0; i <= MFilteredItems.length - 1; i++) {
                    MCBFilteredItems += '<div tabindex="-1" style="display: flex;" class="MComboBoxItem">' + MFilteredItems[i][ItemsName] + '</div>';
                }
            } else {
                for (var i = 0; i <= MFilteredItems.length - 1; i++) {
                    MCBFilteredItems += '<div tabindex="-1" style="display: flex;" class="MComboBoxItem" ItemID="' + MFilteredItems[i][ItemsID] + '">' + MFilteredItems[i][ItemsName] + '</div>';
                }
            }
        }

        Element.querySelector('.MComboBoxItems').innerHTML = MCBFilteredItems;

        var MCBItems = Element.querySelectorAll('.MComboBoxItem');
        MCBItems.forEach(function (e) {
            e.removeEventListener('click', null);
            e.addEventListener('click', function (event) {
                Element.querySelector('input').value = event.target.innerHTML;
                Element.querySelector('.MComboBoxItems').style.display = 'none';
                Element.querySelector('.MComboBoxChevron').style.transform = 'rotate(0)';
                if (event.target.hasAttribute('ItemID')) {
                    if (event.target.getAttribute('ItemID') == 0) {
                        Element.removeAttribute('SelectionID');
                    } else {
                        Element.setAttribute('SelectionID', event.target.getAttribute('ItemID'))
                    }
                }
            });
        });
    }
}
export function ShowLoading() {
    document.getElementById('LoadingModal').style.display = 'table';
}
export function HideLoading() {
    document.getElementById('LoadingModal').style.display = 'none';
}
export function ShowMessage(TheMessage) {
    document.getElementById('MessageModal').querySelector('.TheMessage').innerHTML = TheMessage;
    document.getElementById('MessageModal').style.display = 'table';
    document.querySelector('body').classList.add('ActiveModal');
    document.getElementById('MessageModal').classList.remove('out');
}
export function ShowChooseModal(Question, YesFunction, NoFunction) {
    var TheYesFunction = function () {
        document.getElementById('ChooseModal').querySelector('.ChooseModalYesBTN').removeEventListener('click', TheYesFunction);
        document.getElementById('ChooseModal').querySelector('.ChooseModalNoBTN').removeEventListener('click', TheNoFunction);
        YesFunction();
    };

    var TheNoFunction = function () {
        document.getElementById('ChooseModal').querySelector('.ChooseModalYesBTN').removeEventListener('click', TheYesFunction);
        document.getElementById('ChooseModal').querySelector('.ChooseModalNoBTN').removeEventListener('click', TheNoFunction);
        NoFunction();
    };

    document.getElementById('ChooseModal').querySelector('.ChooseModalYesBTN').removeEventListener('click', TheYesFunction);
    document.getElementById('ChooseModal').querySelector('.ChooseModalYesBTN').addEventListener('click', TheYesFunction);

    document.getElementById('ChooseModal').querySelector('.ChooseModalNoBTN').removeEventListener('click', TheNoFunction);
    document.getElementById('ChooseModal').querySelector('.ChooseModalNoBTN').addEventListener('click', TheNoFunction);

    document.getElementById('ChooseModal').querySelector('.ChooseModalQuestion').innerHTML = Question;
    document.getElementById('ChooseModal').style.display = 'table';
    document.querySelector('body').classList.add('ActiveModal');
    document.getElementById('ChooseModal').classList.remove('out');
}
export function ShowModal(TheModal) {
    TheModal.style.display = 'table';
    document.querySelector('body').classList.add('ActiveModal');
    TheModal.classList.remove('out');
}
export function HideModal(TheModal) {
    TheModal.classList.add('out');
    document.querySelector('body').classList.remove('ActiveModal');
    setTimeout(function () {
        TheModal.style.display = '';
    }, 700);
}