// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import TaskModal from "../../components/TaskModal";

const AddTask = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (values) => {
    // Handle task creation logic here
    console.log("Creating task:", values);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Add New Task</button>
      <TaskModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        mode="create"
      />
    </>
  );
};

export default AddTask;
