'use strict';

(function employeeDirectory() {
    /* =============================================================================
                                    GLOBAL VARIABLES
    */ //===========================================================================

    // Main Div Sections  =========================================
    const employeeSection = document.querySelector('.employees');
    let profile = document.querySelector('.profile');
    let searchInput = document.querySelector('.search__input');
    // Modal variables  ===========================================
    const modal = document.querySelector('.modal');
    const close = document.querySelector('.close');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    // Variables to display the text content of the modal  ========
    let image = document.querySelector('.modal__profile__img');
    let name = document.querySelector('.profile__text--name');
    let username = document.querySelector('.profile__text--user');
    let email = document.querySelector('.profile__text--email');
    let cell = document.querySelector('.profile__text--cell');
    let address = document.querySelector('.profile__text--address');
    let birth = document.querySelector('.profile__text--birth');
    // To retain all JSON data list  ==============================
    let employees;
    // To retain single employee  =================================
    let employee;
    // Modal selected  ============================================
    let selected;
    // Array number of the 12 employees  ==========================
    let index;
    // Hide modal when loading page
    modal.style.display = 'none';

    /* =============================================================================
                                    HTTP REQUEST
    */ //===========================================================================
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = getEmployeesData;
    xhr.open('GET', 'https://randomuser.me/api/?results=12&nat=us,gb,au,nz');
    xhr.send();

    function getEmployeesData() {
        if (xhr.readyState === 4) {
            let data = JSON.parse(xhr.responseText);
            employees = data.results;
            // let index;
            for (let i = 0; i < employees.length; i++) {
                index = i;
                employee = employees[i];
                createEmployeeHtml(employee, index);
            }
        }
    };

    /* =============================================================================
                                    CREATE EMPLOYEE HTML
    */ //===========================================================================
    function createEmployeeHtml(employee, index) {
        let wrapperDiv = document.createElement('div');
        wrapperDiv.setAttribute('class', 'col-xs-12');
        wrapperDiv.classList.add('col-sm-6');
        wrapperDiv.classList.add('col-lg-4');
        wrapperDiv.classList.add('wrapper');

        let profileDiv = document.createElement('div');
        profileDiv.setAttribute('class', 'profile');
        // This data attribute is to track the div that should be displayed on the modal      
        profileDiv.setAttribute('data-select', index);

        let imageDiv = document.createElement('div');
        imageDiv.setAttribute('data-select', index);
        imageDiv.setAttribute('class', 'col-xs-5');

        let image = document.createElement('img');
        image.setAttribute('data-select', index);
        image.setAttribute('class', 'profile__img');
        image.setAttribute('src', employee.picture.large);

        let textDiv = document.createElement('div');
        textDiv.setAttribute('data-select', index);
        textDiv.setAttribute('class', 'col-xs-7');
        textDiv.classList.add('profile__textFrame');

        let name = document.createElement('p');
        name.setAttribute('data-select', index);
        name.setAttribute('class', 'profile__text');
        name.classList.add('profile__text--name');
        name.classList.add('name__search');
        name.textContent = employee.name.first + ' ' + employee.name.last;

        let user = document.createElement('p');
        user.setAttribute('data-select', index);
        user.setAttribute('class', 'profile__text');
        user.textContent = employee.login.username;

        let email = document.createElement('p');
        email.setAttribute('data-select', index);
        email.setAttribute('class', 'profile__text');
        email.classList.add('profile__text--email');
        email.textContent = employee.email;

        let city = document.createElement('p');
        city.setAttribute('data-select', index);
        city.setAttribute('class', 'profile__text');
        city.textContent = employee.location.city;

        textDiv.appendChild(name);
        textDiv.appendChild(user);
        textDiv.appendChild(email);
        textDiv.appendChild(city);
        imageDiv.appendChild(image);
        profileDiv.appendChild(imageDiv);
        profileDiv.appendChild(textDiv);
        wrapperDiv.appendChild(profileDiv);
        employeeSection.appendChild(wrapperDiv);
    }

    /* =============================================================================
                                          MODAL 
    */ //===========================================================================
    // Event to display modal
    employeeSection.addEventListener('click', (e) => {
        selected = e.target;
        index = selected.getAttribute('data-select');
        if (selected && index !== null) {
            createModal(employees, index);
        }
    });
    // Event to close the modal
    close.addEventListener('click', (e) => {
        close ? modal.style.display = 'none' : modal.style.display = 'block';
    });

    function createModal(employees, index) {
        // Split the birthdate and retain the 1st part only
        let date = employees[index].dob.split(' ')[0];
        // Change the text content as per JSON current data
        image.src = employees[index].picture.large;
        name.textContent = employees[index].name.first + ' ' + employees[index].name.last;
        username.textContent = employees[index].login.username;
        email.textContent = employees[index].email;
        cell.textContent = employees[index].cell;
        address.textContent = employees[index].location.street + ', ' + employees[index].location.city + ', ' + employees[index].location.state + ' ' + employees[index].location.postcode;
        birth.textContent = date;
        // Display modal
        modal.style.display = 'block';
    }

    /* =============================================================================
                                    PREV AND NEXT FOR MODAL
    */ //===========================================================================
    prev.addEventListener('click', prevOne);
    next.addEventListener('click', nextOne);

    function prevOne() {
        index--;
        // To avoid error if the user keeps clicking on prev even if it is the 1st modal
        if (index < 0) {
            index = 0;
        } else if (index >= 0) {
            createModal(employees, index);
        }
    }

    function nextOne() {
        index++;
        // To avoid error if the user keeps clicking on next even if it is the last modal
        if (index > 11) {
            index = 11;
        } else if (index <= 11) {
            createModal(employees, index);
        }
    }

    /* =============================================================================
                                    SEARCH
    */ //===========================================================================
    searchInput.addEventListener('keyup', searchEmployees);

    function searchEmployees() {
        // Select all employees DIVS
        let allEmployees = employeeSection.children;
        let searchValue = searchInput.value;

        for (let i = 0; i < allEmployees.length; i++) {
            // Select the employee DIV
            let employeeDiv = allEmployees[i];
            // Select the employee DATA
            let employee = employees[i];
            // Select full name
            let firstName = employee.name.first + ' ' + employee.name.last;
            // Select username
            let userName = employee.login.username;

            if (firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                userName.toLowerCase().includes(searchValue.toLowerCase())) {
                employeeDiv.style.display = 'block';
            } else {
                employeeDiv.style.display = 'none';
            }
        }
    }

})();