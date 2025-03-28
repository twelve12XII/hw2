document.querySelectorAll("table td").forEach((e) => {
  const localStorageKey = e.querySelector(".letter").innerHTML;
  addCardsCountToHTML(e, localStorageKey);
  //Обработчик клика на букву в списке
  e.querySelector(".letter").addEventListener("click", function () {
    showCard(e);
  });
});

function addCardsCountToHTML(e, localStorageKey) {
  const a = document.createElement("a");
  a.className = "count";
  let div = document.createElement("div");
  div.className = "cards hide";
  e.appendChild(a);
  e.appendChild(div);
  e.classList.add(`${localStorageKey}`); //Добавление класса для td по букве алфавита
  //Добавление количества контактов на данную букву и карточек в div
  if (localStorage.getItem(localStorageKey) !== null) {
    a.innerHTML = JSON.parse(localStorage.getItem(localStorageKey)).length;
    addCard(e, e.querySelector(".letter").innerHTML);
  }
}

function showCard(el) {
  if (el.querySelector(".count").innerHTML !== "") {
    if (el.querySelector(".cards").classList.contains("hide")) {
      el.querySelector(".cards").classList.remove("hide");
    } else {
      el.querySelector(".cards").classList.add("hide");
    }
  }
}

function AddContact() {
  const inputData = document.querySelectorAll(".addContact-form_input");
  const contact = createContact(inputData);
  const localStorageKey = contact.Name.charAt(0).toUpperCase();
  //Проверка на наличие объекта в базе данных
  if (
    isArrIncludeObj(JSON.parse(localStorage.getItem(localStorageKey)), contact)
  ) {
    console.log("Объект уже есть в бд");
  } else {
    localStorage.setItem(
      localStorageKey,
      createLocalStorageData(localStorageKey, contact)
    );
    //Добавление контакта вниз списка
    document
      .querySelector(`.${localStorageKey}`)
      .querySelector(".cards")
      .appendChild(createCard(contact));
    //Обновление количества контактов на букву
    const countEl = document
      .querySelector(`.${localStorageKey}`)
      .querySelector(".count");
    countEl.innerHTML = Number(countEl.innerHTML) + 1;
  }
}

function isArrIncludeObj(arr, obj) {
  if (arr !== null && obj !== null) {
    return arr.some((el) => {
      return isObjEqual(el, obj);
    });
  } else return false;
}

function isObjEqual(obj1, obj2) {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  } else {
    return false;
  }
}

function createContact(inputData) {
  const contact = {};
  const contactKeys = ["Name", "Vacancy", "Phone"];
  inputData.forEach((inputData, index) => {
    contact[contactKeys[index]] = inputData.value;
  });
  return contact;
}
function createLocalStorageData(localStorageKey, contact) {
  const newLocalStorageData = [];
  if (localStorage.getItem(localStorageKey) !== null) {
    const localStorageData = JSON.parse(localStorage.getItem(localStorageKey));
    newLocalStorageData.push(...localStorageData);
    newLocalStorageData.push(contact);
  } else {
    newLocalStorageData.push(contact);
  }
  return JSON.stringify(newLocalStorageData);
}

function ClearContacts() {
  localStorage.clear();
}

function addCard(el, key) {
  const localStorageData = JSON.parse(localStorage.getItem(key));
  localStorageData.forEach((obj) => {
    el.querySelector(".cards").appendChild(createCard(obj));
  });
}

function createCard(obj) {
  let div = document.createElement("div");
  div.className = "card";
  div.dataset.value = JSON.stringify(obj);
  div.innerHTML = `Name: ${obj.Name} </br> 
          Vacancy: ${obj.Vacancy} </br>
          Phone: ${obj.Phone} </br>
         <input type="button" onclick="deleteContact(this)" value="x"> </br>
         <input type="button" onclick="editContact()" value="edit">`;
  return div;
}

function deleteContact(el) {
  deleteContactHTML(el);
  const contact = JSON.parse(el.parentElement.dataset.value);
  const localStorageKey = contact.Name.charAt(0).toUpperCase();
  const localStorageData = JSON.parse(localStorage.getItem(localStorageKey));
  for (obj of localStorageData) {
    if (isObjEqual(obj, contact)) {
      return localStorage.setItem(
        localStorageKey,
        JSON.stringify(
          localStorageData.filter((obj) => !isObjEqual(obj, contact))
        )
      );
    }
  }
}

function deleteContactHTML(el) {
  el.parentElement.parentElement.parentElement.querySelector(
    ".count"
  ).innerHTML =
    Number(
      el.parentElement.parentElement.parentElement.querySelector(".count")
        .innerHTML
    ) - 1;
  el.parentElement.parentElement.removeChild(el.parentElement);
}
function editContact() {
  console.log("edit");
}

function showAllContacts() {
  document.querySelector(".modal-content").querySelector(".cards").innerHTML =
    "";
  Object.entries(localStorage).forEach(([key, value]) => {
    console.log(key, value); // выводит: ключ и соответствующее строковое значение
    addCard(document.querySelector(".modal-content"), key);
  });
}

//Поиск
document
  .querySelector(".modal_search")
  .addEventListener("input", function (event) {
    const div = document
      .querySelector(".modal-content")
      .querySelector(".cards");
    div.innerHTML = "";
    if (
      localStorage.getItem(event.target.value.charAt(0).toUpperCase()) !== null
    ) {
      JSON.parse(
        localStorage.getItem(event.target.value.charAt(0).toUpperCase())
      ).map((obj) => {
        if (obj.Name.toUpperCase().includes(event.target.value.toUpperCase())) {
          div.appendChild(createCard(obj));
        }
      });
    }
  });

function SearchContacts() {
  console.log("search");
  const modal = document.querySelector("#modal");
  modal.style.display = "block";
  const close = document.querySelector(".close");
  close.onclick = function () {
    modal.style.display = "none";
  };
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.querySelector(".modal-content").querySelector(".cards").innerHTML =
      "";
    document.querySelector(".modal_search").value = "";
  }
};
