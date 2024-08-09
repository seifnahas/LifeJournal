import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';

const GoalsModal = ({ visible, onCreate, onUpdate, onCancel, initialData }) => {
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        dueDate: initialData.dueDate ? new Date(initialData.dueDate) : null,
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
    >
      <Form form={form} layout="vertical" name="goal_form">
        <Form.Item
          name="title"
          label="Goal Title"
          rules={[{ required: true, message: 'Please input the goal title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Specific Description"
          rules={[{ required: true, message: 'Please input a specific description!' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="measurementCriteria"
          label="Measurement Criteria"
          rules={[{ required: true, message: 'Please input measurement criteria!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="relevance"
          label="Relevance"
          rules={[{ required: true, message: 'Please explain the relevance!' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: 'Please select the due date!' }]}
        >
          <DatePicker />
        </Form.Item>
        <div className="mb-4">
          <h4 className="mb-2">Tasks</h4>
          {tasks.map((task, index) => (
            <div key={index} className="flex mb-2">
              <Input
                value={task.description}
                onChange={(e) => updateTask(index, e.target.value)}
                placeholder="Task description"
                className="mr-2"
              />
              <Button onClick={() => removeTask(index)} danger>Remove</Button>
            </div>
          ))}
          <Button onClick={addTask} type="dashed" block>
            Add Task
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default GoalsModal;