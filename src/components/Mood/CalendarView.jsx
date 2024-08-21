import React, { useState } from "react";
import { Calendar, Badge, Modal } from "antd";
import MoodItem from "./MoodItem";

const CalendarView = ({ moods }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const dateCellRender = (value) => {
    const date = value.format("YYYY-MM-DD");
    const moodsForDate = moods.filter(
      (mood) => mood.date.slice(0, 10) === date
    );

    return (
      <ul className="events">
        {moodsForDate.map((mood) => (
          <li key={mood._id} onClick={() => showMoodDetails(mood)}>
            <Badge
              className="cursor-pointer"
              status={getMoodColor(mood.mood)}
              text={<span className="text-xs">{mood.mood}</span>}
            />
          </li>
        ))}
      </ul>
    );
  };

  const getMoodColor = (mood) => {
    switch (mood.toLowerCase()) {
      case "very sad": return "error";
      case "sad": return "warning";
      case "neutral": return "default";
      case "happy": return "processing";
      case "very happy": return "success";
      default: return "default";
    }
  };

  const showMoodDetails = (mood) => {
    setSelectedMood(mood);
    setModalVisible(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Calendar
        dateCellRender={dateCellRender}
        className="custom-calendar"
      />
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={400}
      >
        {selectedMood && <MoodItem mood={selectedMood} />}
      </Modal>
      <style jsx global>{`
        .custom-calendar .ant-picker-calendar-date-today {
          border-color: #e879f9;
        }
        .custom-calendar .ant-picker-calendar-date-value {
          color: #1f2937;
        }
        .custom-calendar .ant-picker-calendar-date:hover {
          background: #fce7f3;
        }
        .custom-calendar .ant-badge-status-text {
          color: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;