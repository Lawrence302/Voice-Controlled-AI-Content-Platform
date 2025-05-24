from fastapi import FastAPI, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
import json, httpx, language_tool_python


app = FastAPI()
tool = language_tool_python.LanguageTool('en-US')

connected_websockets = set()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5005"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {"messsage":"welcome to fastAPI backend"}


@app.post("/voice-command")
async def voice_command(request: Request):
    data = await request.json()
    print("reciived voice command: ", data)
    raw_text = data.get("text")
    # corrected text
    text = tool.correct(raw_text)
    # text = raw_text
    # getting intent from rasa
    async with httpx.AsyncClient() as client:
        rasa_response = await client.post(
            "http://localhost:5005/model/parse",
            json={
                "text": text
            }
        )

        intent_data = rasa_response.json()
        intent_name = intent_data.get("intent", {}).get("name")
        print("the intent is : ", intent_name)

    # setting actions for various intents
    if intent_name == "navigate_home":
        message = {
            "action": "navigate",
            "target": ""
        }
        # send message to all clients
        for ws in connected_websockets.copy():
            try:
                await ws.send_text(json.dumps(message))
            except Exception as e:
                print("error sending ws message",e)
    
    if intent_name == "navigate_contact":
        message = {
            "action": "navigate",
            "target": "contact"
        }
        # send message to all clients
        for ws in connected_websockets.copy():
            try:
                await ws.send_text(json.dumps(message))
            except Exception as e:
                print("error sending ws message",e)
        
    if intent_name == "navigate_about":
        message = {
            "action": "navigate",
            "target": "about"
        }
        # send message to all clients
        for ws in connected_websockets.copy():
            try:
                await ws.send_text(json.dumps(message))
            except Exception as e:
                print("error sending ws message",e)
        
    
    return {"status": "ok"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_websockets.add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            await websocket.send_text(f"message text ws: {data}")
    except Exception as e:
        print("Websocket connection closed",e)
    finally:
        connected_websockets.remove(websocket)