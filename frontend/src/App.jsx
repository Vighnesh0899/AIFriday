import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("API Error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>React + FastAPI Integration</h1>
      <h3>Backend Response:</h3>
      <p>{message}</p>
    </div>
  );
}

export default App;
