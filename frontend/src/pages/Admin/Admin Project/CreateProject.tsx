import { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../../context/AuthContext';

interface Resource {
  material: string;
  quantity: number;
}

interface Task {
  task_name: string;
  description: string;
  priority: string;
  actual_time: number;
  due_time: string;
  due_date: string;
  resources: Resource[];
}

interface ProjectFormData {
  target_name: string;
  start_date: string;
  end_date: string;
  description: string;
  tasks: Task[];
}

const priorities = ['Low', 'Medium', 'High'];

export const CreateProject = () => {
  const { materials } = useAuth();
  const { register, handleSubmit, control, setValue } = useForm<ProjectFormData>();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Watch for the current start date
  const startDate = useWatch({
    control,
    name: 'start_date',
  });

  const calculateOneWeekLater = (startDate: Date | null) => {
    if (!startDate) return null;
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 7);
    return newDate;
  };

  const onStartDateChange = (date: Date | null) => {
    if (date) {
      const endDate = calculateOneWeekLater(date);
      setValue('start_date', date.toISOString());
      setValue('end_date', endDate?.toISOString() ?? '');
    }
  };

  const onSubmit = (data: ProjectFormData) => {
    console.log('Form Submitted:', data);
  };

  const addTask = () => {
    if (tasks.length < 10) {
      setTasks([
        ...tasks,
        {
          task_name: '',
          description: '',
          priority: 'Low',
          actual_time: 0,
          due_time: '',
          due_date: '',
          resources: [{ material: '', quantity: 0 }],
        },
      ]);
    }
  };

  const addMaterialToTask = (taskIndex: number) => {
    const updatedTasks = [...tasks];
    if (updatedTasks[taskIndex].resources.length < 10) {
      updatedTasks[taskIndex].resources.push({
        material: '',
        quantity: 0,
      });
      setTasks(updatedTasks);
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const removeMaterialFromTask = (taskIndex: number, materialIndex: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].resources = updatedTasks[taskIndex].resources.filter((_, i) => i !== materialIndex);
    setTasks(updatedTasks);
  };

  return (
    <div className="w-full h-full bg-white p-3 rounded-md relative overflow-y-scroll">
      <h1 className="text-lg font-semibold">Create New Project</h1>
      <div className="p-6 bg-white rounded-md shadow-md max-w-6xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Project Information */}
          <div className="mb-2">
            <label className="block text-xs font-medium">Target Name</label>
            <input
              {...register('target_name', { required: true })}
              className="w-full border border-gray-300 p-2 rounded"
              type="text"
            />
          </div>
          <div className="flex gap-2">
            {/* Start Date */}
            <div className="mb-2">
              <label className="block text-xs font-medium">Start Date</label>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="w-full border border-gray-300 p-2 rounded"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => onStartDateChange(date)}
                  />
                )}
              />
            </div>

            {/* End Date */}
            <div className="mb-2">
              <label className="block text-xs font-medium">End Date</label>
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="w-full border border-gray-300 p-2 rounded"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date?.toISOString())}
                    readOnly
                  />
                )}
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-xs font-medium">Description</label>
            <textarea
              {...register('description', { required: true })}
              className="w-full border border-gray-300 p-2 rounded"
              rows={3}
            />
          </div>

          {/* Task Information */}
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          {tasks.map((task, taskIndex) => (
            <div key={taskIndex} className="mb-6 border p-4 rounded">
              <h3 className="text-lg font-semibold">Task {taskIndex + 1}</h3>

              {/* Task Name and Priority */}
              <div className="flex flex-wrap space-x-4">
                <div className="flex-1 mb-2">
                  <label className="block text-xs font-medium">Task Name</label>
                  <input
                    {...register(`tasks.${taskIndex}.task_name`, { required: true })}
                    className="w-full border border-gray-300 p-2 rounded"
                    type="text"
                  />
                </div>

                <div className="flex-1 mb-2">
                  <label className="block text-xs font-medium">Priority</label>
                  <select
                    {...register(`tasks.${taskIndex}.priority`, { required: true })}
                    className="w-full border border-gray-300 p-2 rounded"
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div className="mb-2">
                  <label className="block text-xs font-medium">Due Date</label>
                  <Controller
                    name={`tasks.${taskIndex}.due_date`}
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        className="w-full border border-gray-300 p-2 rounded"
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date?.toISOString())}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Task Description */}
              <div className="mb-2">
                <label className="block text-xs font-medium">Description</label>
                <textarea
                  {...register(`tasks.${taskIndex}.description`, { required: true })}
                  className="w-full border border-gray-300 p-2 rounded"
                  rows={2}
                />
              </div>

              {/* Actual Time and Due Time */}
              <div className="flex flex-wrap space-x-4">
                <div className="flex-1 mb-2">
                  <label className="block text-xs font-medium">Actual Time</label>
                  <input
                    {...register(`tasks.${taskIndex}.actual_time`, { required: true })}
                    className="w-full border border-gray-300 p-2 rounded"
                    type="number"
                    min="0"
                  />
                </div>

                <div className="flex-1 mb-2">
                  <label className="block text-xs font-medium">Due Time</label>
                  <input
                    {...register(`tasks.${taskIndex}.due_time`, { required: true })}
                    className="w-full border border-gray-300 p-2 rounded"
                    type="time"
                  />
                </div>
              </div>

              {/* Resource Section */}
              <div className="mb-2">
                <label className="block text-xs font-medium">Resources</label>
                {task.resources.map((resource, resourceIndex) => (
                  <div key={resourceIndex} className="flex gap-2 mb-2">
                    <select
                      {...register(`tasks.${taskIndex}.resources.${resourceIndex}.material`, { required: true })}
                      className="w-full border border-gray-300 p-2 rounded"
                    >
                      <option value="">Select Material</option>
                      {materials &&
                        materials.map((material) => (
                          <option key={material.material_name} value={material._id}>
                            {material.material_name}
                          </option>
                        ))}
                    </select>
                    <input
                      {...register(`tasks.${taskIndex}.resources.${resourceIndex}.quantity`, { required: true })}
                      className="w-full border border-gray-300 p-2 rounded"
                      type="number"
                      placeholder="Quantity"
                    />
                    <button
                      type="button"
                      onClick={() => removeMaterialFromTask(taskIndex, resourceIndex)}
                      className="text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addMaterialToTask(taskIndex)}
                  className="text-blue-500 text-xs mb-4"
                >
                  Add Material
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeTask(taskIndex)}
                className="text-red-500 text-xs"
              >
                Remove Task
              </button>
            </div>
          ))}

          {tasks.length < 10 && (
            <button
              type="button"
              onClick={addTask}
              className="text-blue-500 text-xs mb-4 mr-4"
            >
              Add Task
            </button>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
