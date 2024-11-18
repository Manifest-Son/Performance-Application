// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styling/AssignTask.css";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  startDate: Yup.string().required("Start date is required").datetime(),
  completionDate: Yup.string().required("Completion Date is required."),
  priority: Yup.string().required("Priority is required."),
  notes: Yup.string().required(
    "Please include some information about the task being assigned. Eg Nature of work.",
  ),
});
// eslint-disable-next-line react/prop-types
const AssignTask = ({ isOpen, onClose }) => {
  const { userId } = useParams();
  // Manage the states trhough Zustand.
  const [lecturer, setLecturer] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  // const [formData, setFormData] = useState({ });
  const [loading, setLoading] = useState(true);
  const handleModalClick = (e) => {
    // Only close if clicking the overlay background, not modal content
    if (e.target.className === "modal-overlay") {
      onClose();
    }
  };
  const initialValues = {
    startDate: "",
    completionDate: "",
    priority: "medium",
    notes: "",
  };

  useEffect(() => {
    // Simulate API fetch for lecturer details and available tasks
    const fetchData = async () => {
      // Replace with actual API calls
      const mockLecturer = {
        id: userId,
        name: "Dr. Smith",
        role: "Senior Lecturer",
        department: "Computer Science",
        allowedTasks: ["research", "teaching", "supervision"],
      };

      const mockTasks = [
        { id: 1, title: "Research Paper Review", type: "research" },
        { id: 2, title: "Course Development", type: "teaching" },
        { id: 3, title: "Student Supervision", type: "supervision" },
      ];

      setLecturer(mockLecturer);
      setTasks(
        mockTasks.filter((task) =>
          mockLecturer.allowedTasks.includes(task.type),
        ),
      );
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const onSubmit = async (formData) => {
    const assignmentData = {
      lecturerId: userId,
      taskId: selectedTask,
      ...formData,
    };

    // Replace with actual API call
    console.log("Assigning task:", assignmentData);
  };

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit,
  });
  if (!isOpen) return null;

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="modal-overlay" onClick={handleModalClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Assign Task to {lecturer?.name}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        {/* Here we have the text to de displayed while refreshing */}
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="lecturer-info">
              <p>Role: {lecturer.role}</p>
              <p>Department: {lecturer.department}</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="task-assign-form">
              <div className="form-group">
                <label htmlFor="taskId">Select Task</label>
                <select
                  id="taskId"
                  value={selectedTask}
                  onChange={setSelectedTask(formik.handleChange)}
                  onBlur={formik.handleBlur}
                  required
                >
                  <option value="">Choose a task...</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="completionDate">Completion Date</label>
                <input
                  type="date"
                  id="completionDate"
                  name="completionDate"
                  value={formik.values.completionDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  min={formik.startDate}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
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
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows="4"
                />
              </div>

              <button type="submit" className="submit-button">
                Assign Task
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignTask;
