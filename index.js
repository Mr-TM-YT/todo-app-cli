#!/usr/bin/env node
import * as p from "@clack/prompts";
import chalk from "chalk";
import { readFile, writeFile } from "fs/promises";

async function main() {
  p.intro(chalk.red("Welcome to my to-do app"));
  let todos = await readFile("db.json", "utf8")
    .then((data) => {
      return JSON.parse(data);
    })
    .catch(() => {
      console.log(
        `${chalk.yellow.italic.bold("│\n│  There's no db.json file found\n│")}`,
      );
      return [];
    });

  p.note(
    `
Add: Adds a new todo item
Remove: Removes a todo item 
List: Lists all of the todo items
Exit: Exits the program
`,
    "How to use",
  );
  await mainMenu(todos);

  p.outro("'Kay thx bye");
}

async function mainMenu(todos) {
  let choice = await p.select({
    message: "What do you want to do?",
    options: [
      {
        label: `${chalk.green("Add")} a To-Do`,
        value: "add",
      },
      {
        label: `${chalk.red("Remove")} a To-do`,
        value: "remove",
      },
      {
        label: `${chalk.cyan("List")} To-Dos`,
        value: "list",
      },
      {
        label: `${chalk.yellow("Exit")} the To-Do app`,
        value: "exit",
      },
    ],
  });

  if (choice === "add") {
    await addTodo(todos);
  } else if (choice === "list") {
    if (todos.length <= 0) {
      console.log(`${chalk.red.bold.italic("│  You don't have any to-dos")}`);
    }
    todos.forEach((element, index) =>
      console.log(`${chalk.cyan("│")}  ${index + 1}: ${element}`),
    );
  } else if (choice === "remove") {
    if (todos.length <= 0) {
      console.log(`${chalk.red("│  You don't have any todos")}`);
    } else {
      await removeTodo(todos);
    }
  } else if (choice === "exit") {
    await writeFile("db.json", JSON.stringify(todos), "utf8");
    return;
  }
  await mainMenu(todos);
}

async function addTodo(todos) {
  await p
    .text({
      message: "What to add?",
      placeholder: "Clean",
      defaultValue: "Clean",
    })
    .then((answer) => todos.push(answer.toString()));
}

async function removeTodo(todos) {
  function turnTodosIntoCoiceObject(arr) {
    let choices = [];
    arr.forEach((element, index) => {
      choices.push({ label: element, value: index });
    });
    return choices;
  }

  await p
    .select({
      message: "What to remove",
      options: turnTodosIntoCoiceObject(todos),
    })
    .then((toRemove) => todos.splice(toRemove, 1));
}

main();
