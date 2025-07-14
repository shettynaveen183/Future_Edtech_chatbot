import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "react-chat-elements/dist/main.css";
import { MessageList, Input, Button } from "react-chat-elements";

export default function ChatbotToggle() {
  const [showChatbot, setShowChatbot] = useState(false);
  const toggleChatbot = () => setShowChatbot(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".chatbot-window") && !event.target.closest(".chatbot-toggle-button")) {
        setShowChatbot(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "linear-gradient(to right, #f4f4f4, #e0e0e0)", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#4A90E2" }}>Futurense EdTech</h1>
        <p style={{ maxWidth: "700px", margin: "0 auto", color: "#555" }}>
          We provide cutting-edge educational solutions powered by AI. Learn smarter, faster, and better with our tailored learning systems.
        </p>
      </header>
      <section style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
          <img src="https://img.freepik.com/premium-vector/education-innovative-online-e-learning-concept-webinar-knowledge-online-training-courses-robotic-hand-touching-digital-interface_127544-1215.jpg" alt="EdTech" style={{ width: "300px", borderRadius: "12px" }} />
          <img src="https://media.istockphoto.com/id/862661268/photo/the-student-life.jpg?s=612x612&w=0&k=20&c=CAh6DqO_QnmuPkgvfb963q-TEEnRKd0HOl8oU3YotsU=" alt="Learning" style={{ width: "300px", borderRadius: "12px" }} />
          <img src="https://t4.ftcdn.net/jpg/13/07/27/17/360_F_1307271770_OoRIgqw1q6IXEygbbtg856zENn0rl7UM.jpg" alt="Online Class" style={{ width: "300px", borderRadius: "12px" }} />
        </div>
        
        <h2>Empowering Students & Institutions & Our Clients</h2>
        <p>From personalized tutoring to administrative automation, our AI tools are here to help your institution thrive in the digital era.</p>
        <img src="https://sesipl.com/sites/default/files/portfolio-images/Infosys%2C%20Chennai.jpg" alt="EdTech" style={{ width: "200px", borderRadius: "15px" }} />
          <img src="https://i.insider.com/4c9a30627f8b9a1e41f60100?width=800&format=jpeg&auto=webp" alt="Learning" style={{ width: "200px", borderRadius: "15px" }} />
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMJPJlNVzxP2tcfmpbvjZjpKoCzWkqU53d8w&s" alt="Online Class" style={{ width: "250px", borderRadius: "15px" }} />
      </section>
      {showChatbot && <ChatbotApp />}
      <button onClick={toggleChatbot} className="chatbot-toggle-button" style={{ position: "fixed", bottom: 20, right: 20, background: "#f1f3f5ff", borderRadius: "50%", width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(0,0,0,0.3)", cursor: "pointer", zIndex: 1000 }}>
        <img src="https://www.shutterstock.com/image-vector/happy-robot-3d-ai-character-600nw-2464455965.jpg" alt="Chatbot Icon" style={{ width: 45, height: 40 }} />
      </button>
    </div>
  );
}

function ChatbotApp() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [summary, setSummary] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/greet/").then(res => {
      const text = res.data?.greeting || "Welcome!";
      setMessages([{ position: "left", type: "text", text }]);
    }).catch(() => {
      setMessages([{ position: "left", type: "text", text: "Welcome!" }]);
    });
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMessage = { position: "right", type: "text", text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    try {
      const formData = new FormData();
      formData.append("question", inputValue);
      const res = await axios.post("http://127.0.0.1:8000/ask/", formData);
      const botMessage = { position: "left", type: "text", text: res.data?.answer || "No response." };
      setMessages(prev => [...prev, botMessage]);
      setInputValue("");
    } catch {
      setMessages(prev => [...prev, { position: "left", type: "text", text: "Error fetching answer." }]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await axios.post("http://127.0.0.1:8000/upload/", formData);
  };

  const handleLinkUpload = async () => {
    if (!link) return;
    await axios.post("http://127.0.0.1:8000/upload_link/", { url: link });
  };

  const handleSummary = async () => {
    const res = await axios.get("http://127.0.0.1:8000/summary/");
    setSummary(res.data?.summary || "No summary.");
    setMessages(prev => [...prev, { position: "left", type: "text", text: `Summary: ${res.data?.summary}`, backgroundColor: "#4A90E2", color: "white" }]);
  };

  return (
    <div className="chatbot-window" style={{ position: "fixed", bottom: 100, right: 20, width: "400px", background: "white", borderRadius: "12px", boxShadow: "0 0 15px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", overflow: "hidden", transition: "transform 0.3s ease-in-out", zIndex: 999 }}>
      <div style={{ padding: "10px", background: "#4A90E2", color: "white", textAlign: "center" }}>
        <h3>Futurense EdTech Chatbot</h3>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px", maxHeight: "400px" }}>
  <MessageList className='message-list' lockable={true} toBottomHeight={'100%'} dataSource={messages} />
</div>
      </div>
      <div style={{ padding: "10px", borderTop: "1px solid #eee" }}>
        <Input
          placeholder="Type your message..."
          multiline={false}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          rightButtons={<Button color="white" backgroundColor="#4A90E2" text="Send" onClick={handleSend} />}
        />
        <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
          <input type="file" onChange={e => setFile(e.target.files[0])} style={{ flex: 1 }} />
          <Button text="Upload" onClick={handleFileUpload} backgroundColor="#7B61FF" color="white" />
        </div>
        <div style={{ marginTop: "5px", display: "flex", gap: "5px", alignItems: "center" }}>
          <input type="text" value={link} onChange={e => setLink(e.target.value)} placeholder="Paste URL..." style={{ width: "60%", padding: "8px" }} />
          <Button text="Submit" onClick={handleLinkUpload} backgroundColor="#FF7F50" color="white" />
        </div>
        <div style={{ marginTop: "10px" }}>
          <Button text="Get Summary" onClick={handleSummary} backgroundColor="#FFBB33" color="white" style={{ width: "100%", transition: "background 0.3s ease" }} />
        </div>
      </div>
    </div>
  );
}
