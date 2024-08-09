import { useState } from "react";
import { Calendar, Badge, Modal } from "antd";
import MoodItem from "./MoodItem";

const CalendarView = ({ moods }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const dateCellRender = (value) => {
    const date = value.format("YYYY-MM-DD");
    const moodsForDate = moods.filter(
      (mood) => mood.date.slice(0, 10) === date,
    );

    return (
      <ul className="events">
        {moodsForDate.map((mood) => (
          <li key={mood._id}>
            <Badge
              status={getMoodColor(mood.mood)}
              text={mood.mood}
              onClick={() => showMoodDetails(mood)}
            />
          </li>
        ))}
      </ul>
    );
  };

  const getMoodColor = (mood) => {
    switch (mood.toLowerCase()) {
      case "very sad":
        return "error";
      case "sad":
        return "warning";
      case "neutral":
        return "default";
      case "happy":
        return "processing";
      case "very happy":
        return "success";
      default:
        return "default";
    }
  };

  const showMoodDetails = (mood) => {
    setSelectedMood(mood);
    setModalVisible(true);
  };

  return (
    <div>
      <Calendar dateCellRender={dateCellRender} />
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={400}
      >
        {selectedMood && <MoodItem mood={selectedMood} />}
      </Modal>
    </div>
  );
};

export default CalendarView;
