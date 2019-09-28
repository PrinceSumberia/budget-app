//  BUDGET CONTROLLER
const budgetController = (function () { })();

// UI CONTROLLER
const UIController = (function () {
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
    };

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        getDOMStrings: () => {
            return DOMstrings;
        }
    };
})();

// GLOBAL APP CONSTROLLER
const controller = (function (budgetCtrl, UICtrl) {
    const setupEventListeners = () => {
        const DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    const ctrlAddItem = () => {
        let input = UICtrl.getInput();
    };

    return {
        init: () => {
            console.log('Application has started.');
            setupEventListeners();
        }
    };
})(budgetController, UIController);


controller.init();