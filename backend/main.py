from fastapi import Depends, FastAPI, WebSocket, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json, httpx, language_tool_python
from models import BlogPost
from database import get_db
from schemas import BlogPostCreate, BlogPostRead, IntentResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

app = FastAPI()
tool = language_tool_python.LanguageTool('en-US')

connected_websockets = set()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5174",
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
      
        return IntentResponse(action="navigate", target="")
       
    
    if intent_name == "navigate_contact":
       

        return IntentResponse(action="navigate", target="contact")

        
    if intent_name == "navigate_about":
       
        return IntentResponse(action="navigate", target="about")
        
    if intent_name == "navigate_help" :

        return IntentResponse(action='open_help', target="help")
  
    if intent_name == "close_help" :

        return IntentResponse(action='close_help', target="help")

    if intent_name == "create_post":
        return IntentResponse(action='create_post', target="post")
    
    if intent_name == "save_post":
        return IntentResponse(action='save_post', target="post")
    
    if intent_name == "cancel_save":

        return IntentResponse(action="cancel_save", target="post")

    if intent_name == "set_title" :

        return IntentResponse(action="set_title", target="post")
    
    if intent_name == "scroll_up" :

        return IntentResponse(action="scroll_up", target="scroll")

    if intent_name == "scroll_down" :

        return IntentResponse(action="scroll_down", target="scroll")

    