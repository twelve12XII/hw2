document.querySelectorAll("table td").forEach((e) =>
  e.addEventListener("click", function () {
    addCard(this);
  })
);

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

function SearchContacts() {
  console.log("search");
}

function addCard(tdEl) {
  const key = tdEl.innerHTML;
  const localStorageData = JSON.parse(localStorage.getItem(key));
  localStorageData.forEach((obj) => {
    tdEl.after(createCard(obj));
  });
}

function createCard(obj) {
  let div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `Name: ${obj.Name} </br> 
          Vacancy: ${obj.Vacancy} </br>
          Phone: ${obj.Phone}`;
  return div;
}
