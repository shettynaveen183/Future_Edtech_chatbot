from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
import uvicorn
from langchain_community.document_loaders import UnstructuredFileLoader, PyPDFLoader, WebBaseLoader
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.memory import ConversationBufferMemory
from langchain_openai import ChatOpenAI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

OPENAI_API_KEY = "sk-proj-(using_openAI_api_key_I_used_my_own_key)"
chat_history = []
chat_answers = []
vector_store = None

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, temperature=0)
memory = ConversationBufferMemory(output_key="output")

def load_document(file_path, file_type):
    if file_type == "pdf":
        loader = PyPDFLoader(file_path)
    else:
        loader = UnstructuredFileLoader(file_path)
    return loader.load()

def extract_content(ai_message):
    if hasattr(ai_message, "content"):
        return ai_message.content
    if isinstance(ai_message, dict) and "content" in ai_message:
        return ai_message["content"]
    if isinstance(ai_message, str):
        return ai_message
    return str(ai_message)

@app.get("/greet/")
def greet():
    prompt = "Greet the student who just joined the EdTech chatbot."
    try:
        greeting = llm.invoke(prompt)
        greeting = extract_content(greeting)
        print("Greeting sent.")
        return {"greeting": greeting}
    except Exception as e:
        print(f"Error generating greeting: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file_type = file.filename.split('.')[-1].lower()
        docs = load_document(file_path, file_type)
        global vector_store
        vector_store = FAISS.from_documents(docs, embeddings)
        print(f"File '{file.filename}' uploaded and indexed.")
        return {"message": "File uploaded and indexed."}
    except Exception as e:
        print(f"Error uploading file: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/upload_link/")
async def upload_link(request: Request):
    try:
        data = await request.json()
        url = data.get("url")
        if not url:
            return JSONResponse(content={"error": "No URL provided."}, status_code=400)
        loader = WebBaseLoader(url)
        docs = loader.load()
        global vector_store
        vector_store = FAISS.from_documents(docs, embeddings)
        print(f"Link '{url}' loaded and indexed.")
        return {"message": "Link loaded and indexed."}
    except Exception as e:
        print(f"Error uploading link: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/ask/")
def ask_question(question: str = Form(...)):
    if vector_store is None:
        print("No document or link uploaded yet.")
        return JSONResponse(content={"answer": "No document or link uploaded yet."}, status_code=400)
    try:
        chat_history.append(question)
        docs = vector_store.similarity_search(question)
        context = "\n".join([doc.page_content for doc in docs])
        previous_conversation = memory.load_memory_variables({})
        prompt = f"Context:\n{context}\n\nPrevious Conversation:\n{previous_conversation}\n\nQuestion: {question}\nAnswer:"
        answer = llm.invoke(prompt)
        answer = extract_content(answer)
        memory.save_context({"input": question}, {"output": answer})
        chat_answers.append(answer)
        print(f"Question asked: {question}\nAnswer: {answer}")
        return {"answer": answer}
    except Exception as e:
        print(f"Error answering question: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/summary/")
def get_summary():
    if not chat_history:
        return {"summary": "No questions asked yet."}
    qa_pairs = "\n".join([f"Q: {q}\nA: {a}" for q, a in zip(chat_history, chat_answers)])
    prompt = f"Here is the conversation between the student and the bot:\n{qa_pairs}\n\nProvide a helpful summary or advice for the student based on this conversation."
    try:
        summary = llm.invoke(prompt)
        summary = extract_content(summary)
        print("Summary generated.")
        return {"summary": summary}
    except Exception as e:
        print(f"Error generating summary: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/")
def read_root():
    return {"message": "EdTech API is running."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)