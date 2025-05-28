from fastapi import Depends, FastAPI, WebSocket, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json, httpx, language_tool_python
from models import BlogPost
from database import get_db
from schemas import BlogPostCreate, BlogPostRead
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

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


@app.post("/blog")
async def create_blogpost(post: BlogPostCreate, db: AsyncSession = Depends(get_db)):
    new_post = BlogPost(
        title=post.title,
        content=post.content,
        summary=post.summary,
        author=post.author
    )
    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)
    return new_post

# get all blogposts
@app.get("/blog", response_model=list[BlogPostRead])
async def get_all_blogposts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BlogPost))
    posts = result.scalars().all()
    return posts

#  get blogpost by id
from fastapi import Path

@app.get("/blog/{post_id}", response_model=BlogPostCreate)
async def get_blogpost_by_id(post_id: int = Path(..., gt=0), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    post = result.scalars().first()
    if not post:
        raise HTTPException(status_code=404, detail="BlogPost not found")
    return post


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