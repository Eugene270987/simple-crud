'use strict';

const users = JSON.parse(localStorage.getItem('users')) || defaultUsers;

showInfo(users);

document.querySelector('#btnAdd input').addEventListener('click',  showAddUserForm);












