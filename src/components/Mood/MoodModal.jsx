import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Rate, Button, Slider } from 'antd';
import moment from 'moment';

const MoodModal = ({ visible, onCreate, onCancel, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date: moment(initialValues.date),
        mood: ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'].indexOf(initialValues.mood) + 1,
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({ date: moment(), intensity: 1 });
    }
  }, [visible, initialValues, form]);

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
      mood: ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'][values.mood - 1],
    };
    onCreate(formattedValues);
  };

  return (
    <Modal
      visible={visible}
      title={initialValues ? "Edit Mood" : "Log Mood"}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Date is required' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="mood"
          label="Mood"
          rules={[{ required: true, message: 'Mood is required' }]}
        >
          <Rate
            character={({ index }) => {
              const emojis = ['😢', '😟', '😐', '😊', '😁'];
              return emojis[index];
            }}
          />
        </Form.Item>
        <Form.Item
          name="intensity"
          label="Intensity"
          rules={[{ required: true, message: 'Intensity is required' }]}
        >
          <Slider
            defaultValue={1}
            min={1}
            max={5}
            marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }}
            step={1}
          />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {initialValues ? "Update Mood" : "Log Mood"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MoodModal;