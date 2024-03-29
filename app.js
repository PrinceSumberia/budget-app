//  BUDGET CONTROLLER
const budgetController = (function () {
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.precentage = -1;
        }

        calcPercentage(totalIncome) {
            if (totalIncome > 0) {
                this.precentage = Math.round(this.value / totalIncome * 100);
            } else {
                this.precentage = -1;
            }
        };

        getPercentage() {
            return this.precentage;
        };
    }


    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    const calculateTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach((element) => {
            sum += element.value;
        });
        data.totals[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        precentage: -1
    };

    return {
        addItem: (type, des, val) => {
            let newItem, ID;

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: (type, id) => {
            let ids = data.allItems[type].map((current) => {
                return current.id;
            });

            const index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: () => {
            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the precentage of income that we spent
            if (data.totals.inc > 0) {
                data.precentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.precentage = -1;
            }
        },

        calculatePercentages: () => {
            data.allItems.exp.forEach((element) => {
                element.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: () => {
            let allPerc = data.allItems.exp.map((element) => {
                return element.getPercentage();
            });
            return allPerc;
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                precentage: data.precentage
            };
        },

        testing: () => {
            console.log(data);
        }
    };
})();

// UI CONTROLLER
const UIController = (function () {
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        precentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    const formatNumber = (num, type) => {
        num = Math.abs(num);
        num = num.toFixed(2);
        const numSplit = num.split('.');

        let int = numSplit[0];
        let dec = numSplit[1];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    const nodeListForEach = (list, callback) => {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: (obj, type) => {
            let html, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="inc-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${formatNumber(
                    obj.value,
                    type
                )}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = `<div class="item clearfix" id="exp-${obj.id}"><div class="item__description" >${obj.description}</div><div class="right clearfix"><div class="item__value">${formatNumber(
                    obj.value,
                    type
                )}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
            }

            // Insert the HTML to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeEnd', html);
        },

        deleteListItem: (selectorID) => {
            const el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: () => {
            const fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            const fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach((element) => {
                element.value = '';
            });
            fieldsArray[0].focus();
        },

        displayBudget: (obj) => {
            let type;
            obj.budget > 0 ? (type = 'inc') : (type = 'exp');
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.precentage > 0) {
                document.querySelector(DOMstrings.precentageLabel).textContent = obj.precentage + '%';
            } else {
                document.querySelector(DOMstrings.precentageLabel).textContent = '---';
            }
        },

        displayPercentages: (percentages) => {
            const fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, (current, index) => {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.testing = '---';
                }
            });
        },

        displayMonth: () => {
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth();
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: () => {
            const fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue
            );
            nodeListForEach(fields, (cur) => {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    const updateBudget = () => {
        // Calculate the budget
        budgetCtrl.calculateBudget();

        // Return the budget
        let budget = budgetCtrl.getBudget();

        // Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    const updatePercentages = () => {
        // Calculate the percentages
        budgetCtrl.calculatePercentages();

        // Read percentages from the budget controller
        let percentages = budgetCtrl.getPercentages();

        // Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    const ctrlAddItem = () => {
        let input, newItem;

        // Get the field input data
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // Clear Fields
            UICtrl.clearFields();

            // Calculate and update the budget
            updateBudget();

            // Calculate and update percentages
            updatePercentages();
        }
    };

    const ctrlDeleteItem = (event) => {
        const itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            const splitID = itemID.split('-');
            const type = splitID[0];
            let id = parseInt(splitID[1]);

            // Delete the item from the data structure
            budgetCtrl.deleteItem(type, id);

            // Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // Update and show the new budget
            updateBudget();

            // Calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init: () => {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                precentage: 0
            });
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();
