// eslint-disable-next-line no-unused-vars
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./TaskModal.css";

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  dueDate: Yup.date()
    .required("Due date is required")
    .min(new Date(), "Due date cannot be in the past"),
  priority: Yup.string()
    .oneOf(["low", "medium", "high"], "Invalid priority")
    .required("Priority is required"),
  status: Yup.string()
    .oneOf(["pending", "in-progress", "completed"], "Invalid status")
    .required("Status is required"),
});

// eslint-disable-next-line react/prop-types
const TaskModal = ({
  isOpen,
  onClose,
  initialValues,
  onSubmit,
  mode = "create",
}) => {
  const defaultValues = {
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    ...initialValues,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    await onSubmit(values);
    setSubmitting(false);
    onClose();
  };

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title">
              {mode === "create" ? "Create New Task" : "Update Task"}
            </h1>
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="task-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.title && formik.touched.title && (
                <div className="error-message">{formik.errors.title}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                rows="4"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.description && formik.touched.description && (
                <div className="error-message">{formik.errors.description}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className="form-input"
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.dueDate && formik.touched.dueDate && (
                <div className="error-message">{formik.errors.dueDate}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                className="form-select"
                value={formik.values.priority}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="submit-button"
            >
              {formik.isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                  ? "Create Task"
                  : "Update Task"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
