globalThis.searchInput = document.querySelector("#search-input");
searchInput.dataset.showAll = "false";
//render -----------
function render() {
  const alphabet = [
    "A",
    "N",
    "B",
    "O",
    "C",
    "P",
    "D",
    "Q",
    "E",
    "R",
    "F",
    "S",
    "G",
    "T",
    "H",
    "U",
    "I",
    "V",
    "J",
    "W",
    "K",
    "X",
    "L",
    "Y",
    "M",
    "Z",
  ];

  const gridContainer = document.createElement("div");
  gridContainer.className = "grid-container";
  const firstCol = document.createElement("div");
  firstCol.className = "first_col";
  const secondCol = document.createElement("div");
  secondCol.className = "second_col";

  for (let i = 0; i < alphabet.length; i += 2) {
    firstCol.appendChild(createGridCell(alphabet[i]));
    secondCol.appendChild(createGridCell(alphabet[i + 1]));
  }
  gridContainer.appendChild(firstCol);
  gridContainer.appendChild(secondCol);
  document.querySelector(".contacts").appendChild(gridContainer);

  document.querySelectorAll(".grid-cell").forEach((e) => {
    const localStorageKey = e.id;
    addCardsCountToHTML(localStorageKey, e);
    cellClickListner(e);
  });
}

function createGridCell(letter) {
  const cell = document.createElement("div");
  cell.className = "grid-cell";
  const staticContent = document.createElement("div");
  staticContent.className = "grid-cell_static-content";
  staticContent.id = "static-content";
  const countLink = document.createElement("a");
  const letterLink = document.createElement("a");
  const card = document.createElement("div");

  countLink.className = "count";
  letterLink.className = "letter";
  card.className = "cards";

  letterLink.textContent = letter;
  cell.id = letter;

  staticContent.appendChild(letterLink);
  staticContent.appendChild(countLink);

  cell.appendChild(staticContent);
  cell.appendChild(card);

  return cell;
}

//Добавление количества контактов на данную букву и карточек в div
function addCardsCountToHTML(localStorageKey, cellHTML) {
  const a = cellHTML.querySelector(".count");
  if (localStorage.getItem(localStorageKey) !== null) {
    a.innerHTML = JSON.parse(localStorage.getItem(localStorageKey)).length;
    addCard(localStorageKey, cellHTML);
  }
}

render();

function cellClickListner(cellHTML) {
  cellHTML
    .querySelector("#static-content")
    .addEventListener("click", function () {
      cellHTML.classList.toggle("active");
    });
}

const uid = function (firstCharName) {
  return (
    firstCharName +
    Date.now().toString(36) +
    Math.random().toString(36).substr(2)
  );
};

function addContactLocalStorage(contact) {
  localStorage.setItem(
    contact.id.charAt(0),
    createContactsListData(contact.id.charAt(0), contact)
  );
}

function deleteContactLocalStorage(contact) {
  const contactDataKey = contact.id.charAt(0);
  const contactDataList = JSON.parse(localStorage.getItem(contactDataKey));
  for (obj of contactDataList) {
    if (obj.id == contact.id) {
      const newContactDataList = contactDataList.filter(
        (obj) => !(obj.id == contact.id)
      );
      if (newContactDataList.length == 0)
        return localStorage.removeItem(contactDataKey);
      else
        return localStorage.setItem(
          contactDataKey,
          JSON.stringify(newContactDataList)
        );
    }
  }
}

function addContactFromForm() {
  const inputContact = document.querySelectorAll(".contact-form_input");
  const contact = createContactObj(inputContact);
  addContact(contact);
}

function addContact(contact) {
  const contactsDataKey = contact.id.charAt(0);
  const contactsDataList = JSON.parse(localStorage.getItem(contactsDataKey));
  //Проверка на наличие объекта в базе данных
  if (isArrIncludeObj(contactsDataList, contact)) {
    console.log("Объект уже есть в бд");
  } else {
    addContactLocalStorage(contact);
    //Добавление контакта вниз списка
    document
      .querySelector(`#${contactsDataKey}`)
      .querySelector(".cards")
      .appendChild(createCard(contact.id, contact));
    //Обновление количества контактов на букву
    const countHtml = document
      .querySelector(`#${contactsDataKey}`)
      .querySelector(".count");
    incrementCountHTML(countHtml);
  }
}

function incrementCountHTML(countHtml) {
  countHtml.innerHTML = Number(countHtml.innerHTML) + 1;
}
function decrementCountHTML(countHtml) {
  const count = Number(countHtml.innerHTML);
  if (count - 1 != 0) {
    countHtml.innerHTML = count - 1;
  } else countHtml.innerHTML = "";
}
function isArrIncludeObj(arr, obj) {
  if (arr !== null && obj !== null) {
    return arr.some((el) => {
      return isObjEqual(el, obj);
    });
  } else return false;
}

function isObjEqual(obj1, obj2) {
  newObj1 = { ...obj1, id: null };
  newObj2 = { ...obj2, id: null };
  return JSON.stringify(newObj1) === JSON.stringify(newObj2);
}

function createContactObj(inputData) {
  const contact = {};
  const contactKeys = ["Name", "Vacancy", "Phone"];
  inputData.forEach((inputData, index) => {
    contact[contactKeys[index]] = inputData.value;
  });
  contact["id"] = uid(contact.Name.charAt(0).toUpperCase());
  return contact;
}

function createContactsListData(contactsId, contact) {
  if (localStorage.getItem(contactsId) !== null) {
    const contactsDataList = JSON.parse(localStorage.getItem(contactsId));
    contactsDataList.push(contact);
    return JSON.stringify(contactsDataList);
  } else {
    return JSON.stringify([contact]);
  }
}

function clearContacts() {
  const countsHtml = document.querySelectorAll(".count");
  countsHtml.forEach((el) => el.replaceChildren());
  const cardsHtml = document.querySelectorAll(".cards");
  cardsHtml.forEach((el) => el.replaceChildren());
  localStorage.clear();
}

function addCard(key, el) {
  const localStorageData = JSON.parse(localStorage.getItem(key));
  localStorageData.forEach((obj) => {
    el.querySelector(".cards").appendChild(createCard(obj.id, obj));
  });
}

function createCard(id, obj) {
  let div = document.createElement("div");
  div.className = "card";
  div.id = id;
  div.innerHTML = `Name: ${obj.Name} </br> 
          Vacancy: ${obj.Vacancy} </br>
          Phone: ${obj.Phone} </br>
         <input type="button" class="btn" onclick="deleteContact(this.parentElement)" value="x"> </br>
         <input type="button" class="btn" onclick="editContact(this.parentElement)" value="edit">`;
  return div;
}

function findContactDataLocalStorage(contactId) {
  const contactDataKey = contactId.charAt(0);
  const contactDataList = JSON.parse(localStorage.getItem(contactDataKey));
  const contact = {};
  contactDataList.map((obj) => {
    if (obj.id == contactId) {
      contact.Name = obj.Name;
      contact.Vacancy = obj.Vacancy;
      contact.Phone = obj.Phone;
      contact.id = obj.id;
    }
  });
  return contact;
}

function deleteContact(contact) {
  deleteContactLocalStorage(contact);
  deleteContactHTML(contact.id);
}

function deleteContactHTML(contactId) {
  const elId = contactId.charAt(0);
  const countHtml = document.querySelector(`#${elId}`).querySelector(".count");
  const contactHtml = document.querySelectorAll(`#${contactId}`);
  contactHtml.forEach((el) => el.remove());
  decrementCountHTML(countHtml);
}

function editContact(el) {
  console.log(el.parentElement.parentElement);
  const modal = document.querySelector("#modal_edit");
  modal.style.display = "block";
  const name = modal.querySelector("#name-input");
  const vacancy = modal.querySelector("#vacancy-input");
  const phone = modal.querySelector("#phone-input");

  const contactId = el.id;
  const contact = findContactDataLocalStorage(contactId);

  name.value = contact.Name;
  vacancy.value = contact.Vacancy;
  phone.value = contact.Phone;

  const form = modal.querySelector("#contact-form");
  form.replaceWith(form.cloneNode(true));
  const freshForm = modal.querySelector("#contact-form");

  freshForm.addEventListener("submit", function (event) {
    event.preventDefault();
    saveEditContact(
      freshForm.querySelector("#name-input"),
      freshForm.querySelector("#vacancy-input"),
      freshForm.querySelector("#phone-input"),
      contact,
      modal
    );
  });

  modal.querySelector("#close").onclick = function () {
    form.replaceWith(form.cloneNode(true));
    modal.style.display = "none";
  };
}

function saveEditContact(name, vacancy, phone, contact, modal) {
  const newContact = {
    Name: name.value,
    Vacancy: vacancy.value,
    Phone: phone.value,
    id: contact.id.replace(/^./, name.value.charAt(0).toUpperCase()),
  };
  deleteContact(contact);
  addContact(newContact);
  if (searchInput.dataset.showAll == "true") {
    showAllContacts();
  } else {
    search(searchInput.value);
  }
  modal.style.display = "none";
}

function editContactHtml(contact, newContact) {
  const oldCards = document.querySelectorAll(`#${contact.id}`);
  oldCards.forEach((el) => {
    el.innerHTML = createCard(newContact.id, newContact).innerHTML;
  });
}

function showAllContacts() {
  searchInput.value = "";
  searchInput.dataset.showAll = "true";
  const searchHtml = document.querySelector(".search");
  const cardsHtml = searchHtml.querySelector(".cards");
  cardsHtml.replaceChildren();
  cardsHtml.style.display = "block";
  Object.entries(localStorage).forEach(([key, value]) => {
    addCard(key, searchHtml);
  });
}

//Поиск
document
  .querySelector(".modal_search-input")
  .addEventListener("input", function (event) {
    search(event.target.value);
  });

function search(inputValue) {
  searchInput.dataset.showAll = "false";
  const div = document.querySelector(".search").querySelector(".cards");
  div.replaceChildren();
  const contactsDataListJSON = localStorage.getItem(
    inputValue.charAt(0).toUpperCase()
  );
  if (contactsDataListJSON !== null) {
    JSON.parse(contactsDataListJSON).map((obj) => {
      if (obj.Name.toUpperCase().includes(inputValue.toUpperCase())) {
        div.appendChild(createCard(obj.id, obj));
      }
    });
  }
}
function searchContacts() {
  const modal = document.querySelector("#modal_search");
  modal.style.display = "block";
  const close = modal.querySelector("#close");
  close.onclick = function () {
    modal.style.display = "none";
  };
}

window.onclick = function (event) {
  const modal_edit = document.querySelector("#modal_edit");
  const modal_search = document.querySelector("#modal_search");
  if (event.target == modal_search) {
    modal_search.style.display = "none";
    modal_search.querySelector(".cards").replaceChildren();
    modal_search.querySelector(".modal_search-input").value = "";
  }
  if (event.target == modal_edit) {
    modal_edit.style.display = "none";
  }
};

//Проверка ввода в input form
function setupValidation(inputId) {
  const input = document.querySelectorAll(`#${inputId}`);

  input.forEach((input) => {
    input.title = "Please enter at least 3 Latin characters";
    input.addEventListener("input", function () {
      const value = this.value.trim();

      if (value === "") {
        this.title = "Empty input";
        return;
      }

      if (value.length < 3) {
        this.title = "Please enter at least 3 characters";
        return;
      }

      if (!/^[A-Za-z]+$/.test(value)) {
        this.title = "Invalid value: Only English letters allowed";
        return;
      }
    });
  });
}

setupValidation("vacancy-input");
setupValidation("name-input");
