import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase を初期化
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);
console.log('Firebase Config:', firebaseConfig);
// ここから React のコード
import { useState, useEffect } from "react";
import "./styles.css";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const App = () => {
  const [records, setRecords] = useState([]);
  const [inputTitle, setTitle] = useState("");
  const [inputTime, setTime] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('study-record') 
          .select('title, time');

        if (error) {
          console.error("Error fetching data:", error);
        } else {
          setRecords(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, []);

  const handleInputTitle = (event) => {
    setTitle(event.target.value);
    if (inputTitle !== "" && inputTime !== "") {
      setError("");
    }
  };

  const handleInputTime = (event) => {
    if (/^\d*$/.test(event.target.value)) {
      setTime(event.target.value);
      if (inputTitle !== "" && inputTime !== "") {
        setError("");
      }
    }
  };

  const handleSetRecords = async () => {
    if (inputTitle === "" || inputTime === "") {
      setError("入力されていない項目があります");
    } else {
      const newRecord = { title: inputTitle, time: inputTime };
      const { error } = await supabase
        .from('study-record') 
        .insert([newRecord]);

      if (error) {
        console.error("Error inserting data:", error);
      } else {
        setRecords([...records, newRecord]);
        setTitle("");
        setTime("");
        setError("");
      }
    }
  };

  const handleDeleteRecord = async (record) => {
    const { error } = await supabase
      .from('study-record')
      .delete()
      .eq('title', record.title)
      .eq('time', record.time);

    if (error) {
      console.error("Error deleting record:", error);
    } else {
      const updatedRecords = records.filter(item => item !== record);
      setRecords(updatedRecords);
    }
  };

  const sumTime = records.reduce((sum, record) => sum + parseInt(record.time, 10), 0);

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div className="App">
      <>
        <div>
          学習内容 <input value={inputTitle} onChange={handleInputTitle} />
          <p />
          学習時間 <input value={inputTime} onChange={handleInputTime} /> 時間
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
            {records.map((record, index) => (
              <li key={index}>
                {record.title} {record.time}時間
                <button onClick={() => handleDeleteRecord(record)}>削除</button>
              </li>
            ))}
          </ul>
        </div>

        <p>合計時間：{sumTime}時間</p>
      </>
    </div>
  );
};
