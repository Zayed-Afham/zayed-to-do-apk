import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-cb282-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const particularDB = "shoppingList";

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, `${particularDB}`);

const input = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const shoppingListUl = document.getElementById("shopping-list");

addButton.addEventListener("click", () => {
  let inputValue = input.value.trim();

  if (inputValue !== "") {
    // console.log(inputValue);
    push(shoppingListInDB, inputValue);
    clearInputValue();
  } else {
    alert("Empty To Do List will not be added");
    clearInputValue();
  }
});

onValue(shoppingListInDB, (snapshot) => {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearList();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      // let currentItemID = currentItem[0];
      // let currentItemValue = currentItem[1];
      addItemsToList(currentItem);
    }
  } else {
    shoppingListUl.innerHTML = "No items here...";
  }
});

function clearList() {
  shoppingListUl.innerHTML = "";
}
function clearInputValue() {
  input.value = "";
}

function addItemsToList(item) {
  // shoppingListUl.innerHTML += `<li>${takenValue}</li>`;
  let itemID = item[0];
  let itemValue = item[1];
  let newLi = document.createElement("li");
  newLi.textContent = itemValue;
  newLi.addEventListener("dblclick", () => {
    let conformed = confirm("Do you want to delete this item?");
    if (conformed) {
      let exatLocationOfItemInDB = ref(database, `${particularDB}/${itemID}`);
      remove(exatLocationOfItemInDB);
    }
  });
  shoppingListUl.append(newLi);
}
window.addEventListener("offline", () => {
  const container = document.querySelector(".container");
  container.lastElementChild.innerHTML = `<b>Sorry, No internet connection😓</b>`;
});
window.addEventListener("online", () => window.location.reload());

if (shoppingListUl.innerHTML == "") {
  shoppingListUl.innerHTML = "Fetching data, please wait...";
}
