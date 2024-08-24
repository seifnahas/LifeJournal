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
      className="bg-gradient-to-r from-pink-100 to-blue-100 rounded-3xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-pink-100 to-blue-100 p-8 rounded-3xl">

      <Form form={form} layout="vertical" onFinish={onFinish} className="p-8 inter-font">
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Date is required' }]}
        >
            <DatePicker 
              style={{ width: '100%' }} 
              className="rounded-full border-2 border-gray-300 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 py-2 px-4"
            />
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
            className="text-2xl"
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
            className="mb-8"
          />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={4} className="rounded-xl border-2 border-gray-300 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 py-2 px-4" />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            className="bg-gradient-to-r from-pink-500 to-blue-500 border-0 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-blue-600 transition-colors"
          >
            {initialValues ? "Update Mood" : "Log Mood"}
          </Button>
        </Form.Item>
      </Form>
      </div>
    </Modal>
  );
};

export default MoodModal;