import { Delete } from "@mui/icons-material";
import { useState } from "react";
import { Task } from "../types/Types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: number) => void;
  toggleTaskCompletion: (id: number) => void;
  editHandler: (id: number, textval: string) => void;
}

const TodoItem = ({
  task,
  deleteTask,
  toggleTaskCompletion,
  editHandler,
}: Props) => {
  const [editActive, setEditActive] = useState<boolean>(false);
  const [textVal, setTextVal] = useState<string>(task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`m-4 p-2 border rounded ${
        task.completed ? "bg-green-100" : "bg-red-400"
      }`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTaskCompletion(task.id)}
        className="mr-2"
      />
      {editActive ? (
        <textarea
          className="resize-y "
          value={textVal}
          onChange={(e) => setTextVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && textVal !== "") {
              editHandler(task.id, textVal);
              setEditActive(false);
            }
          }}
        />
      ) : (
        <span className={task.completed ? "bg-green" : "bg-red-400"}>
          {task.title}
        </span>
      )}
      <div className="flex mt-4 justify-between">
        <Delete
          onClick={() => deleteTask(task.id)}
          className="text-red-800 mr-4 sm:mr-0"
        ></Delete>
        <button
          className="uppercase text-cyan-500 items-center font-bold"
          onClick={() => setEditActive((prev) => !prev)}
        >
          {editActive ? "Done" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
