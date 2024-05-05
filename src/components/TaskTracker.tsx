import { useState, useEffect } from "react";
import axios from "axios";
import { AppBar, Toolbar } from "@mui/material";
import { Task } from "../types/Types";
import TodoItem from "./TodoItem";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AddIcon from "@mui/icons-material/Add";
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const TaskTracker = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filterCompleted, setFilterCompleted] = useState<boolean>(false);
  const [filterNot, setFilterNot] = useState<boolean>(false);

  useEffect(() => {
    fetchTasks();
  }, [filterCompleted, filterNot]);

  const fetchTasks = async () => {
    try {
      let response;
      if (filterCompleted)
        response = await axios.get(
          "https://jsonplaceholder.typicode.com/todos?completed=true"
        );
      else if (filterNot)
        response = await axios.get(
          "https://jsonplaceholder.typicode.com/todos?completed=false"
        );
      else
        response = await axios.get(
          "https://jsonplaceholder.typicode.com/todos"
        );

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async (title: string) => {
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/todos",
        {
          title,
          completed: false,
        }
      );
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com/todos/${taskId}`
      );
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskCompletion = async (taskId: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    setTasks(updatedTasks);
    console.log(tasks);
  };

  const editHandler = async (id: number, title: string) => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        title,
        completed: false,
      });

      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, title } : task
      );

      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !active || active.id === over.id) {
      return;
    }

    setTasks((tasks) => {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      const updatedTasks = arrayMove(tasks, oldIndex, newIndex);
      return [...updatedTasks]; // Ensure to return a new array to trigger re-rendering
    });
  };

  return (
    <div className="w-full mx-auto p-4 bg-slate-300">
      <AppBar position="static">
        <Toolbar>
          <h1 className="text-center">TASK TRACKER</h1>
        </Toolbar>
      </AppBar>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newTaskTitle.trim()) {
            addTask(newTaskTitle);
          }
        }}
        className="my-4 flex justify-center"
      >
        <textarea
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add.."
          className="border rounded px-2 py-1 mr-2 "
        />
        <button
          type="submit"
          className=" self-center mr-10 focus:outline-none text-white bg-green-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
        >
          <AddIcon className="text-black" />
        </button>

        <button
          className={`mr-4  ${filterNot ? "text-gray-500" : "text-green-500"}`}
          onClick={() => setFilterCompleted((prev) => !prev)}
          disabled={filterNot ? true : false}
        >
          <AddTaskIcon />
        </button>
        <button
          onClick={() => setFilterNot((prev) => !prev)}
          disabled={filterCompleted ? true : false}
          className={filterCompleted ? "text-gray-500" : "text-red-800"}
        >
          <AddTaskIcon />
        </button>
      </form>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((task: Task) => (
              <TodoItem
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                toggleTaskCompletion={toggleTaskCompletion}
                editHandler={editHandler}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default TaskTracker;
