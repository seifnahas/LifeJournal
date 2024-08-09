import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, Checkbox } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';

const ToDoModal = ({ visible, onUpdate, onCreate, onCancel, initialData }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        dueDate: moment(initialData.dueDate)
      });
    } else {
      reset({});
    }
  }, [initialData, reset]);

  const onFinish = (values) => {
    if (initialData) {
      onUpdate(initialData._id, values);
    } else {
      onCreate(values);
    }
  };

  return (
    <Modal
      visible={visible}
      title={initialData ? "Edit ToDo" : "Add New ToDo"}
      onCancel={onCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit(onFinish)}>
        <Form.Item
          label="Due Date"
          required
          validateStatus={errors.dueDate ? 'error' : ''}
          help={errors.dueDate && "Due Date is required"}
        >
          <Controller
            name="dueDate"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <DatePicker {...field} style={{ width: '100%' }} />}
          />
        </Form.Item>
        <Form.Item
          label="Title"
          required
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title && "Title is required"}
        >
          <Controller
            name="title"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Input {...field} placeholder="Enter task title" />}
          />
        </Form.Item>
        <Form.Item label="Description">
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input.TextArea {...field} placeholder="Enter task description (optional)" />}
          />
        </Form.Item>
        <Form.Item>
          <Controller
            name="completed"
            control={control}
            render={({ field }) => (
              <Checkbox {...field} checked={field.value}>
                Completed
              </Checkbox>
            )}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {initialData ? "Update ToDo" : "Add ToDo"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ToDoModal;