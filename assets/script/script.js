
// Get references to DOM elements
const taskInput = document.getElementById("inputTask");
const taskList = document.querySelector(".added_tasks");
const clearButton = document.querySelector(".clear");

// Initialize tasks array from Local Storage or create an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to display tasks in the UI, including timestamps
function displayTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = "list-group-item";
    taskItem.id = "taskItem" + index;

    // Check if the task is completed and add the "completed" class
    if (task.completed) {
        taskItem.classList.add("completed");
      } else {
        taskItem.classList.remove("completed");
      }

    const completionTime = task.completedTimestamp ? new Date(task.completedTimestamp) : null;
    const startTime = new Date(task.timestamp);

    const timeDifference = completionTime ? completionTime - startTime : null;

    taskItem.innerHTML = `
      <div class="tasklist widget-content p-0">
        <div class="widget-content-wrapper">
          <div class="widget-content-left flex2">
            <div class="widget-heading">
              <p><strike id="strike${index}" class="strike-none">${task.text}</strike></p>
            </div>
            <div class="widget-subheading">
              <p class="settime">Created at: ${task.timestamp}</p>
              ${completionTime ? `<p class="settime">Completed at: ${task.completedTimestamp}</p>` : ""}
              ${timeDifference ? `<p class="settime">Time Taken: ${calculateTimeTaken(timeDifference)}</p>` : ""}
            </div>
          </div>
          <div class="widget-content-right">
          <button class="border-0 btn" onclick="editTask(${index})">
          <span><i class="fa fa-edit"></i></span> <!-- Edit button -->
        </button>
            <button class="border-0 btn" onclick="toggleTaskCompletion(${index})">
              <i id="checked${index}" class="fa fa-check"></i>
            </button>
            <button class="border-0 btn" onclick="deleteTask(${index})">
              <span><i class="fa fa-trash"></i></span>
            </button>
          </div>
        </div>
      </div>
    `;

    taskList.appendChild(taskItem);


  });
}
function editTask(index) {
    const newTaskText = prompt("Edit task:", tasks[index].text);
    
    if (newTaskText !== null) { // Check if the user clicked Cancel
      tasks[index].text = newTaskText;
      displayTasks();
      saveTasksToLocalStorage();
    }
  }
function calculateTimeTaken(timeDifference) {
  const minutes = Math.floor(timeDifference / 60000);
  const seconds = Math.floor((timeDifference % 60000) / 1000);
  return `${minutes} minutes and ${seconds} seconds`;
}

// Function to add a new task with timestamp
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const timestamp = new Date().toLocaleString(); // Get the current timestamp
    tasks.push({ text: taskText, completed: false, timestamp: timestamp, completedTimestamp: null });
    taskInput.value = "";
    displayTasks();
    saveTasksToLocalStorage();
  }
}
// Function to show a message for a specified duration
function showMessage(messageText, duration) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = messageText;
    messageDiv.style.display = "block";
    
    setTimeout(() => {
      messageDiv.style.display = "none";
    }, duration);

  }
// Function to toggle task completion status and change background color
function toggleTaskCompletion(index) {
  const taskItem = document.querySelector(`#taskItem${index}`);
  
  if (!tasks[index].completed) {
    // If the task was uncompleted, mark it as completed
    tasks[index].completed = true;
    if (!tasks[index].completedTimestamp) {
      // Only set the completed timestamp if it's not already set
      tasks[index].completedTimestamp = new Date().toLocaleString(); // Set completed timestamp
    }
    taskItem.classList.add("completed"); // Add the "completed" class
    const timeDifference = new Date(tasks[index].completedTimestamp) - new Date(tasks[index].timestamp);
    const minutes = Math.floor(timeDifference / 60000);
    const seconds = Math.floor((timeDifference % 60000) / 1000);
    const message = `Congratulations! You completed the task in ${minutes} minutes and ${seconds} seconds.`;
    showMessage(message, 3000); // Show the message for 5 seconds

  } else {
    // If the task was completed, mark it as uncompleted
    tasks[index].completed = false;
    tasks[index].completedTimestamp = null; // Clear completed timestamp
    taskItem.classList.remove("completed"); // Remove the "completed" class
  }
  
  saveTasksToLocalStorage(); // Update Local Storage with the changes
  setTimeout(() => { document.location.reload(); }, 3000);

}
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

// Function to delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  displayTasks();
  saveTasksToLocalStorage();
}

// Function to clear all tasks
function clearAllTasks() {
  tasks = [];
  displayTasks();
  saveTasksToLocalStorage();
}

// Function to save tasks to Local Storage
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Event listener to load tasks from Local Storage and display them when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // Load tasks from Local Storage
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    // Display the tasks, including their completed status
    displayTasks();
  });

// Event listener for adding a new task
document.querySelector(".addtask button").addEventListener("click", addTask);

// Event listener for clearing all tasks
clearButton.addEventListener("click", clearAllTasks);
