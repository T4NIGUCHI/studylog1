import { useState } from "react";
import "./styles.css";

export const App = () => {
  const [records, setRecords] = useState([]);
  const [inputTitle, setTitle] = useState("");
  const [inputTime, setTime] = useState("");
  const [error, setError] = useState("");

  const handleInputTitle = (event) => {
    setTitle(event.target.value);
    if (inputTitle === !"" && inputTime === !"") {
      setError("");
    }
  };

  const handleInputTime = (event) => {
    if (/^\d*$/.test(event.target.value)) {
      setTime(event.target.value);
      if (inputTitle === !"" && inputTime === !"") {
        setError("");
      }
    }
  };

  const handleSetRecords = () => {
    if (inputTitle === "" || inputTime === "") {
      setError("入力されていない項目があります");
    } else {
      const newRecord = { title: inputTitle, time: inputTime };
      setRecords([...records, newRecord]);
      setTitle("");
      setTime("");
      setError("");
    }
  };

  const sumTime = records.reduce(
    (sum, records) => sum + parseInt(records.time, 10),
    0
  );

  return (
    <div className="App">
      <>
        <div>
          学習内容 <input value={inputTitle} onChange={handleInputTitle} />
          <p />
          学習時間 <input value={inputTime} onChange={handleInputTime} />
          時間
        </div>

        <div>
          入力されている学習内容:{inputTitle}
          <p />
          入力されている時間:{inputTime}
          <p />
          <button onClick={handleSetRecords}>登録</button>
          <p>{error}</p>
        </div>
        <div>
          <ul>
            {records.map((records, index) => (
              <li key={index}>
                {records.title} {records.time}時間
              </li>
            ))}
          </ul>
        </div>
        <p>合計時間：{sumTime}/1000(h)</p>
      </>
    </div>
  );
};
