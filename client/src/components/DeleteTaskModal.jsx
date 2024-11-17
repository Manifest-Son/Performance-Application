// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import './DeleteTaskModal.css';

// eslint-disable-next-line react/prop-types
const DeleteTaskModal = ({ isOpen, onClose, task, onDelete }) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      await onDelete(task.id);
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-backdrop" onClick={onClose}></div>
      <div className="delete-modal-container">
        <div className="delete-modal-content">
          <div className="delete-modal-header">
            <h2 className="delete-modal-title">Delete Task</h2>
            <button className="delete-close-button" onClick={onClose}>×</button>
          </div>

          <div className="delete-modal-body">
            <p className="delete-confirmation-message">
              Are you sure you want to delete this task?
            </p>
            <div className="delete-task-details">
              <p><strong>Title:</strong> {task.title}</p>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Status:</strong> {task.status}</p>
            </div>
          </div>

          <div className="delete-modal-footer">
            <button 
              className="delete-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="delete-confirm-button"
              onClick={handleDelete}
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
DeleteTaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteTaskModal;