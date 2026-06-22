import { v4 as uuidv4 } from "uuid";
import "./style.css";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

const STORAGE_KEY = "todos";

function saveTodos(): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(todos)
  );
}

function loadTodos(): Todo[] {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as Todo[];
  } catch {
    return [];
  }
}

const todos: Todo[] = loadTodos();

let searchTerm = "";
let filterMode: "all" | "active" | "completed" = "all";
let sortMode: "newest" | "oldest" | "az" | "za" = "newest";

function getVisibleTodos(): Todo[] {
  let result = [...todos];

  if (searchTerm) {
    result = result.filter(todo =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  switch (filterMode) {
    case "active":
      result = result.filter(todo => !todo.completed);
      break;

    case "completed":
      result = result.filter(todo => todo.completed);
      break;
  }

  switch (sortMode) {
    case "newest":
      result.sort((a, b) => b.createdAt - a.createdAt);
      break;

    case "oldest":
      result.sort((a, b) => a.createdAt - b.createdAt);
      break;

    case "az":
      result.sort((a, b) => a.text.localeCompare(b.text));
      break;

    case "za":
      result.sort((a, b) => b.text.localeCompare(a.text));
      break;
  }

  return result;
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: {
    text?: string;
    className?: string;
    onClick?: () => void;
  } = {}
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);

  if (options.text) el.textContent = options.text;
  if (options.className) el.className = options.className;
  if (options.onClick) el.addEventListener("click", options.onClick);

  return el;
}

function render(): void {
  const app = document.getElementById("app")!;
  app.innerHTML = "";

  const title = createElement("h1", {
    text: "Todo List 1.0"
  });

  const input = document.createElement("input");
  input.placeholder = "Add a task...";

  const addButton = createElement("button", {
    text: "Add",
    onClick: () => {
      const text = input.value.trim();

      if (!text) return;

      todos.push({
        id: uuidv4(),
        text,
        completed: false,
        createdAt: Date.now()
      });

      saveTodos();
      render();
    }
  });

  const controls = createElement("div");
  controls.className = "controls";

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      addButton.click();
    }
  });

  controls.append(input, addButton);

  const searchInput = document.createElement("input");
  searchInput.placeholder = "Search...";
  searchInput.value = searchTerm;

  searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value;
    render();
  });

  const filterSelect = document.createElement("select");

  [
    ["all", "All"],
    ["active", "Active"],
    ["completed", "Completed"]
  ].forEach(([value, text]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;

    if (value === filterMode) {
      option.selected = true;
    }

    filterSelect.appendChild(option);
  });

  filterSelect.addEventListener("change", () => {
    filterMode = filterSelect.value as typeof filterMode;
    render();
  });

  const sortSelect = document.createElement("select");

  [
    ["newest", "Newest"],
    ["oldest", "Oldest"],
    ["az", "A-Z"],
    ["za", "Z-A"]
  ].forEach(([value, text]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;

    if (value === sortMode) {
      option.selected = true;
    }

    sortSelect.appendChild(option);
  });

  sortSelect.addEventListener("change", () => {
    sortMode = sortSelect.value as typeof sortMode;
    render();
  });

  const clearButton = createElement("button", {
    text: "Clear All",
    onClick: () => {
      todos.length = 0;

      saveTodos();
      render();
    }
  });

  const toolbar = createElement("div");
  toolbar.className = "toolbar";

  toolbar.append(
    searchInput,
    filterSelect,
    sortSelect,
    clearButton
  );

  const list = createElement("ul");

  getVisibleTodos().forEach(todo => {
    const item = createElement("li");

    const leftSide = createElement("div");
    leftSide.className = "todo-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;

      saveTodos();
      render();
    });

    const text = createElement("span", {
      text: todo.text
    });

    if (todo.completed) {
      text.classList.add("completed");
    }

    const editButton = createElement("button", {
      text: "Edit",
      onClick: () => {
        const newText = prompt(
          "Edit todo",
          todo.text
        );

        if (
          newText !== null &&
          newText.trim()
        ) {
          todo.text = newText.trim();

          saveTodos();
          render();
        }
      }
    });

    const deleteButton = createElement("button", {
      text: "Delete",
      onClick: () => {
        const index = todos.findIndex(
          t => t.id === todo.id
        );

        if (index >= 0) {
          todos.splice(index, 1);

          saveTodos();
          render();
        }
      }
    });

    leftSide.append(
      checkbox,
      text
    );
    const actions = createElement("div");
    actions.className = "todo-actions";

    actions.append(
      editButton,
      deleteButton
    );

    item.append(
      leftSide,
      actions
    );

    list.appendChild(item);
  });

  app.append(
    title,
    controls,
    toolbar,
    list
  );
}

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App container not found");
}

render();