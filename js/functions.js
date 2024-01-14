'use strict'
function showInfo (users) {
    for (let user of users) {
        showUserInfo(user);
    }
}
function showUserInfo (user) {
    const container = createElement('div', '#users', '', {className: 'user__container', 'data-user-id': user.id});
    createElement('div', container, user.id);
    createElement('div', container, user.name + ' ' + user.lastName);

    const actionsElement = createElement('div', container, '', {className: 'actions', 'data-id': user.id});

    createElement('input', actionsElement, '', {type: 'button', value: 'VIEW', 'data-type': 'view'}, {click: handleViewUserInfo});
    createElement('input', actionsElement, '', {type: 'button', value: 'EDIT', 'data-type': 'edit'}, {click: handleEditUserInfo});
    createElement('input', actionsElement, '', {type: 'button', value: 'DELETE', 'data-type': 'delete'}, {click: handleDeleteUser});
}
function showAddUserForm (user) {
    const parentElement = document.getElementById('container');

    const existingForm = parentElement.querySelector('form[id="form"]');

    if(!existingForm) {
        const userForm = createElement('form', parentElement, '', {id: 'form'});

        createElement('input', userForm, '', {name: 'login', id: 'login', type: 'text', placeholder: 'Enter your login: '});
        createElement('input', userForm, '', {name: 'password', id: 'password', type: 'text', placeholder: 'Enter your password: '});
        createElement('input', userForm, '', {name: 'name', id: 'name', type: 'text', placeholder: 'Enter your name: '});
        createElement('input', userForm, '', {name: 'lastName', id: 'lastName', type: 'text', placeholder: 'Enter your last name: '});
        createElement('input', userForm, '', {name: 'email', id: 'email', type: 'text', placeholder: 'Enter your e-mail: '});
        createElement('input', userForm, '', {name: 'age', id: 'age', type: 'text', placeholder: 'Enter your age: '});
        createElement('input', userForm, '', {name: 'phone', id: 'phone', type: 'text', placeholder: 'Enter your phone number: '});
        createElement('input', userForm, '', {name: 'card', id: 'card', type: 'text', placeholder: 'Enter your card number: '});
        createElement('input', userForm, '', {type: 'button', value: 'Save'}, {click: () => handleSaveUser()});
    }
}
function handleSaveUser() {
    const formElements = document.forms[0].elements;

    const login = formElements.login.value;
    const password = formElements.password.value;
    const name = formElements.name.value;
    const lastName = formElements.lastName.value;
    const email = formElements.email.value;
    const age = formElements.age.value;
    const phone = formElements.phone.value;
    const card = formElements.card.value;

    const user = {
        login: login,
        password: password,
        name: name,
        lastName: lastName,
        email: email,
        age: age,
        phone: phone,
        card: card,
        id: Date.now()
    };

    const validationResults = validate(user);

    if (Object.values(validationResults).every(result => result === true)) {
        saveUser(user);
        cleanElement('#container form');
    }
}

function validate() {
    const userLoginInputs = document.querySelectorAll('input[name="login"]');
    const userPasswordInputs = document.querySelectorAll('input[name="password"]');
    const userNameInputs = document.querySelectorAll('input[name="name"]');
    const userLastNameInputs = document.querySelectorAll('input[name="lastName"]');
    const userEmailInputs = document.querySelectorAll('input[name="email"]');
    const userAgeInputs = document.querySelectorAll('input[name="age"]');
    const userPhoneInputs = document.querySelectorAll('input[name="phone"]');
    const userCardInputs = document.querySelectorAll('input[name="card"]');

    const loginRegex = /^[a-z0-9]{3,15}$/g;
    const passwordRegex = /^[a-z0-9]{3,15}$/g;
    const nameRegex = /^[A-Za-z]+$/g;
    const lastNameRegex = /^[A-Za-z]+(?:-[A-Za-z]+)*$/g;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z]+\.[A-Za-z]{2,}$/g;
    const ageRegex = /^(?:1[89]|[2-9]\d)$/g;
    const phoneRegex = /^0\d{2}-\d{3}-\d{2}-\d{2}$/g;
    const cardRegex = /^(\d{4}-){3}\d{4}$/g;

    return {
        login: validOrNot(userLoginInputs, checkInput, loginRegex, 'Fill in your login correctly!'),
        password: validOrNot(userPasswordInputs, checkInput, passwordRegex, 'Fill in your password correctly!'),
        name: validOrNot(userNameInputs, checkInput, nameRegex, 'Fill in your name correctly!'),
        lastName: validOrNot(userLastNameInputs, checkInput, lastNameRegex, 'Fill in your last name correctly!'),
        email: validOrNot(userEmailInputs, checkInput, emailRegex, 'Fill in your email correctly!'),
        age: validOrNot(userAgeInputs, checkInput, ageRegex, 'Fill in your age correctly!'),
        phone: validOrNot(userPhoneInputs, checkInput, phoneRegex, 'Fill in your phone correctly!'),
        card: validOrNot(userCardInputs, checkInput, cardRegex, 'Fill in your card correctly!'),
    }
}
function checkInput(input, regEx) {
    const inputValue = input.value;
    const result = inputValue.match(regEx);
    return  Boolean(result);
}
function validOrNot(inputs, checkField, regEx, content) {
    let isValid = true;
    for (let input of inputs) {
        if (!checkField(input, regEx)) {
            showMessage(input, 'error__message', content);
            isValid = false;
        } else {
            deleteMessage(input, 'error__message');
        }
    }
    return isValid;
}

function showMessage(element, className, errorMessage) {
    element.classList.add(className);
    element.placeholder = errorMessage;
    element.value = '';
}
function deleteMessage(element, className) {
    element.classList.remove(className);
}

function saveUser(newUser) {
    users.push(newUser);
    updateStorage();
    showUserInfo(newUser);
}
function getUserId (event) {
    return event.target.parentNode.getAttribute('data-id');
}
function handleDeleteUser(event) {
    const userId = getUserId(event);
    handleDeleteOrNot(userId);
}
function deleteUserById (id) {
    const indexToRemove = users.findIndex(user => user.id == id);
    users.splice(indexToRemove, 1);
    removeElement(`div[data-user-id="${id}"]`);
    updateStorage();
}
function updateStorage () {
    localStorage.setItem('users', JSON.stringify(users));
}
function handleDeleteOrNot(userId) {
    const modal = createElement('div', '#users', '', {className: 'modal__open'})
    createElement('h1', modal, 'Do you really want to delete your account?', {className: 'modal__title'});

    const buttonContainer = createElement('div', modal, '', {className: 'button__container'})
    createElement('input', buttonContainer, '', {type: 'button', value: 'NO', 'data-type': 'deny'}, {click: () => {removeElement(modal);}});
    createElement('input', buttonContainer, '', {type: 'button', value: 'YES', 'data-type': 'accept'}, {click: () => {removeElement(modal); deleteUserById(userId)}});
}

function handleEditUserInfo(event) {
    const userId = getUserId(event);
    const user = users.find(user => user.id == userId);
    if (user) {
        showAddUserForm(user);
    }
}

function handleViewUserInfo (event) {
    const userId = getUserId(event);
    showTable(userId);
}
function showTable(userId) {
    const parentSelector = document.getElementById('users');
    const user = users.find(user => user.id == userId);

    if (!user) {
        return;
    }

    const currentInfos = document.querySelectorAll('.table__container');

    currentInfos.forEach(currentInfo => {
        removeElement(currentInfo);
    });

    const gridContainer = createElement('div', parentSelector, '', { className: 'table__container' });

    const userAttributes = [
        'Login',
        'Password',
        'Name',
        'Last Name',
        'Email',
        'Age',
        'Phone',
        'Card'
    ];

    userAttributes.forEach((attribute) => {
        createElement('h2', gridContainer, `${attribute}: `);

        if (attribute === 'Last Name') {
            createElement('p', gridContainer, user.lastName);
        } else {
            createElement('p', gridContainer, user[attribute.toLowerCase()]);
        }
    });

    createElement('input', gridContainer, '', { type: 'button', value: 'CLOSE', className: 'btn__close', 'data-type': 'close' }, { click: () => removeElement(gridContainer) });
}

