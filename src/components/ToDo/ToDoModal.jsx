import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, Checkbox, Select } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';

const { Option } = Select;

const tagOptions = [
  { value: 'Urgent', label: 'Urgent', color: 'red' },
  { value: 'High Priority', label: 'High Priority', color: 'orange' },
  { value: 'Work', label: 'Work', color: 'blue' },
  { value: 'Personal', label: 'Personal', color: 'pink' },
  { value: 'Health & Fitness', label: 'Health & Fitness', color: 'green' },
  { value: 'Long-term', label: 'Long-term', color: 'fuchsia' },
  { value: 'Shopping', label: 'Shopping', color: 'purple' },
];

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

        <Form.Item
          label="Tag"
          required
          validateStatus={errors.tag ? 'error' : ''}
          help={errors.tag && "Tag is required"}
        >
          <Controller
            name="tag"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field} placeholder="Select a tag">
                {tagOptions.map(tag => (
                  <Option key={tag.value} value={tag.value}>
                    <span style={{ color: tag.color }}>{tag.label}</span>
                  </Option>
                ))}
              </Select>
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