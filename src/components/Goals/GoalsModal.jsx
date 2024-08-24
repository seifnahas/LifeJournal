import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import moment from 'moment';


const GoalsModal = ({ visible, onCreate, onUpdate, onCancel, initialData }) => {
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        dueDate: initialData.dueDate ? moment(initialData.dueDate) : null,  // Convert to moment object
      });
      setTasks(initialData.tasks || []);
    } else {
      form.resetFields();
      setTasks([]);
    }
  }, [initialData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const goalData = {
        ...values,
        tasks: tasks,
      };
      console.log('Submitting goal data:', goalData); // Add this line
      if (initialData) {
        onUpdate(initialData._id, goalData);
      } else {
        onCreate(goalData);
      }
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const addTask = () => {
    setTasks([...tasks, { description: '', completed: false }]);
  };

  const removeTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const updateTask = (index, description) => {
    const newTasks = [...tasks];
    newTasks[index].description = description;
    setTasks(newTasks);
  };

  return (
    <Modal
    visible={visible}
    title={initialData ? "Edit Goal" : "Create New Goal"}
    okText={initialData ? "Update" : "Create"}
    cancelText="Cancel"
    onCancel={onCancel}
    onOk={handleOk}
    className="bg-gradient-to-r from-pink-100 to-blue-100 rounded-3xl overflow-hidden"
    okButtonProps={{className:"bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"}}
    cancelButtonProps={{className:"bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"}}
  >
    <Form form={form} layout="vertical" name="goal_form" className="p-8 inter-font">
      <Form.Item
        name="title"
        label="Goal Title"
        rules={[{ required: true, message: 'Please input the goal title!' }]}
      >
        <Input className="rounded-full border-2 border-gray-300 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 py-2 px-4" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Specific Description"
        rules={[{ required: true, message: 'Please input a specific description!' }]}
      >
        <Input.TextArea className="rounded-xl border-2 border-gray-300 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 py-2 px-4" />
      </Form.Item>
        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: 'Please select the due date!' }]}
        >
          <DatePicker className="w-full rounded-full border-2 border-gray-300 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 py-2 px-4" />
        </Form.Item>
        <div className="mb-4">
          <h4 className="mb-2">Tasks</h4>
          {tasks.map((task, index) => (
            <div key={index} className="flex mb-2">
              <Input
                value={task.description}
                onChange={(e) => updateTask(index, e.target.value)}
                placeholder="Task description"
                className="mr-2 rounded-full border-2 border-gray-300 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 py-2 px-4"
              />
              <Button onClick={() => removeTask(index)} danger className="rounded-full">Remove</Button>
            </div>
          ))}
          <Button onClick={addTask} type="dashed" block className="rounded-full">
            Add Task
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default GoalsModal;