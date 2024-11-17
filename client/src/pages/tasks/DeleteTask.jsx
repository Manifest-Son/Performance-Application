// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import DeleteTaskModal from '../../components/DeleteTaskModal';

// eslint-disable-next-line react/prop-types
const DeleteTask = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (taskId) => {
    try {
      // Add your delete logic here
      // Example:
      // await deleteTask(taskId);
      console.log('Deleting task:', taskId);
      
      // You might want to refresh the task list or update the UI after deletion
    } catch (error) {
      console.error('Failed to delete task:', error);
      // Handle error (show error message, etc.)
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="delete-task-button"
      >
        Delete Task
      </button>

      <DeleteTaskModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        task={task}
        onDelete={handleDelete}
      />
    </>
  );
};

export default DeleteTask;