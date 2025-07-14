# Futurense EdTech AI Chatbot

An AI-powered chatbot web application designed for educational institutions and learners, inspired by Google NotebookLM functionality but offering real-time, dynamic interactions.

---

## ✅ Project Overview

- Built using ReactJS (Frontend) + FastAPI (Backend).
- Utilizes LangChain, OpenAI GPT, FAISS, and HuggingFace Embeddings.
- Supports file upload (PDF, TXT) and link ingestion for knowledge base creation.
- Real-time question-answering chatbot with chat history and summary features.

---

## 📌 Features

- Upload PDF/Text documents to train chatbot responses.
- Upload external URLs for content ingestion.
- Ask contextual questions with dynamic responses.
- Retrieve conversation summaries.
- Frontend toggle button for chatbot interface.

---

## 🚀 Tech Stack

| Layer        | Technology                       |
|--------------|----------------------------------|
| Frontend     | ReactJS, Chat UI Kit             |
| Backend      | FastAPI, Uvicorn                 |
| AI Model     | OpenAI GPT via LangChain         |
| Embeddings   | HuggingFace Transformers         |
| Vector Store | FAISS                             |
| Deployment   | Vercel (Frontend), Render/AWS (Backend) |

---

## 🗂️ API Endpoints (FastAPI)

| Endpoint       | Method | Description                 |
|----------------|--------|----------------------------|
| `/greet/`      | GET    | Initial greeting message   |
| `/upload/`     | POST   | Upload document file       |
| `/upload_link/`| POST   | Upload external URL        |
| `/ask/`        | POST   | Ask a question             |
| `/summary/`    | GET    | Get conversation summary   |

---

## 📸 UI Screens

- Chatbot button toggle  
- Chat interface with message history  
- File upload and link upload inputs  
- Summary retrieval button  

---

## 🛠️ Setup Instructions

### Backend

1. Clone the repository and navigate to the backend directory.
2. Install Python dependencies:
pip install -r requirements.txt

markdown
Copy
Edit
3. Run the FastAPI server:
uvicorn main:app --reload

markdown
Copy
Edit

### Frontend

1. Navigate to the frontend ReactJS directory.
2. Install dependencies:
npm install

markdown
Copy
Edit
3. Start the React app:
npm run dev

yaml
Copy
Edit

---

## ✨ Additional Notes

- Explored and validated similar functionality using Google NotebookLM by uploading personal data, observing summarization, and knowledge organization features before developing this chatbot project.
