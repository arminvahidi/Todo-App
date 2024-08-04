const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButton = document.querySelectorAll(".filter-todos");
const complete = document.querySelectorAll(".complete");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const generateId = () => {
  const id = Math.round(
    Math.random() * Math.random() * Math.pow(10, 12)
  ).toString();
  return id;
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2500);
};

const displayTodos = (data) => {
  const todoList = data ? data : todos
  todosBody.innerHTML = "";
  if (!todoList.length) {
    todosBody.innerHTML = "<tr><td colspan=4>No task found!</td></tr>";
    return;
  }

  todoList.forEach((todo) => {
    todosBody.innerHTML += `
    <tr>
      <td id=td><p>${todo.task}</p></td>
      <td>${todo.date || "No Date"}</td>
      <td class=complete>${todo.completed ? "Completed" : "Pending"}</td>
      <td>
        <button onclick=editHandler(${todo.id})>Edit</button>
        <button onclick=toggleHandler("${todo.id}")>${
      todo.completed ? "Undo" : "Do"
    }</button>
        <button onclick=deleteItemHandler("${todo.id}")>Delete</button>
      </td>
    </tr>
    `;
  });
};

const saveToLacalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLacalStorage();
    displayTodos();
    showAlert("All todos cleard successfully", "success");
  } else {
    showAlert("There's nothing to clear", "error");
  }
};

const deleteItemHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLacalStorage();
  displayTodos();
  showAlert("Item Deleted Successfully", "success");
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  saveToLacalStorage();
  displayTodos();
  showAlert("todo status changed successfully", "success");
};

const addhandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  let todo = {
    id: generateId(),
    task,
    date,
    completed: false,
  };
  if (task) {
    todos.push(todo);
    saveToLacalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("todo added successfully", "success");
  } else {
    showAlert("Please enter a todo!", "error");
  }
};
const editHandler = (id) => {
  const todo = todos.find((todo) => +todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const confirmEdit = (event) => {
  const id = event.target.dataset.id;
  let todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  saveToLacalStorage();
  displayTodos();
  showAlert("data edited successfully", "success");
};
const filterHandler = (event) => {
  const matn = event.target.innerText;
  let filtered = null;
  if (matn === "Pending") {
    filtered = todos.filter((todo) => todo.completed === false);
  } else if (matn === "Completed") {
    filtered = todos.filter((todo) => todo.completed === true);
  } else {
    filtered = todos;
  }
  displayTodos(filtered)
};

editButton.addEventListener("click", confirmEdit);
deleteAllButton.addEventListener("click", deleteAllHandler);
window.addEventListener("load",() => displayTodos());
addButton.addEventListener("click", addhandler);
filterButton.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
