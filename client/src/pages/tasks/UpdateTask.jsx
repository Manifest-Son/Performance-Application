// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import TaskModal from '../../components/TaskModal';

// eslint-disable-next-line react/prop-types
const UpdateTask = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (values) => {
    // Handle task update logic here
    console.log('Updating task:', values);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Edit Task</button>
      <TaskModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialValues={task}
        onSubmit={handleSubmit}
        mode="update"
      />
    </>
  );
};

export default UpdateTask