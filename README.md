# Voice-Controlled AI Content Platform

## Overview

The **Voice-Controlled AI Content Platform** is a modern web application that enables users to create AI-generated blog posts through voice commands.
The platform leverages voice recognition to interpret user commands, integrates with Rasa for intent parsing, and uses Google Gemini for generating rich content. 
It supports secure user authentication via face recognition and stores data in PostgreSQL. The backend is powered by FastAPI, while the frontend is built with React.

## Features

- **Voice Command Input:** Users can control the site and generate content using natural voice commands.
- **AI-Generated Blog Posts:** Automatically generate blog posts based on user-specified topics using Gemini language model.
- **Face Recognition Authentication:** Secure login via facial recognition technology.
- **Intelligent Intent Parsing:** Rasa NLP handles understanding and processing user voice commands.
- **Full CRUD Operations:** Create, read, update, and delete blog posts stored in PostgreSQL.
- **Modern Tech Stack:** Built with React (frontend), FastAPI (backend), PostgreSQL (database), and Rasa (NLP).

## Tech Stack

| Technology      | Purpose                      |
|-----------------|------------------------------|
| React           | Frontend UI                  |
| FastAPI         | Backend API                  |
| PostgreSQL      | Database                    |
| Rasa            | NLP Intent Recognition       |
| Google Gemini   | AI Content Generation        |
| Face Recognition| Authentication               |


## Database Schema

```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create authors table
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

-- Create blogposts table
CREATE TABLE blogposts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  author VARCHAR(100) NOT NULL,
  view_id SERIAL UNIQUE
);
```
## Installation and Setup

### Clone the repository:

```bash
git clone https://github.com/yourusername/voice-controlled-ai-content-platform.git
cd voice-controlled-ai-content-platform
```
## Backend Setup:
### 1. move to backend file and create a python environment 
```bash
  cd backend
  python -m venv env
```
To activate the environment
```bash
env/Scripts/activate
```
### 2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### 3. Configure PostgreSQL database and apply [This Schema](#database-schema)

### 4. Run FastAPI server:
```bash
uvicorn main:app --reload
```

## Rasa Setup:
#### Note: rasa is not supported on latest python versions so its advisable to use 3.8 to 3.10
### 1. move to rasa_NLU file and create a python environment

```bash
  cd rasa_NLU
  python3.10 -m venv env 
```
To activate the environment
```bash
env/Scripts/activate
```
### 2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### 3. To run the rasa server use the command
```bash
rasa run --enable-api
```
## Frontend Setup:
### 1. Navigate to frontend directory and install dependencies:

```bash
cd frontend/voice_pilot_frontend
npm install
```
### 2. Run React app:
```bash
npm run dev
```
## Environment Variables:
Configure environment variables for API URLs, Rasa server, Gemini API keys, and Face Recognition service as required
- `VITE_GEMINI_API_KEY` - Your Google Gemini API key
- `DATABASE_URL` - PostgreSQL connection string
- `RASA_SERVER_URL` - URL of the Rasa NLP server


## Usage
- Use the voice command bar to control the app.
- Open the “Create New Blog Post” modal and input the topic by voice or text.
- The AI generates content automatically based on the topic.
- Authenticate securely via face recognition.
- Manage posts via the intuitive UI.

# Voice Pilot Project - Directory Structure
```
Voice Pilot project/
├── backend/
│   ├── env/
│   ├── pycache/
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
│
├── frontend/
│   └── voice_pilot_frontend/
│       ├── node_modules/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   │   ├── Alert.jsx
│       │   │   ├── AlertPopup.jsx
│       │   │   ├── CreatePostModal.jsx
│       │   │   ├── header.jsx
│       │   │   ├── HelpModal.jsx
│       │   │   ├── LoadingSpinner.jsx
│       │   │   ├── LoginForm.jsx
│       │   │   ├── PostCard.jsx
│       │   │   ├── PostList.jsx
│       │   │   ├── PostView.jsx
│       │   │   └── VoiceControlBar.jsx
│       │   ├── hooks/
│       │   ├── pages/
│       │   │   ├── about.jsx
│       │   │   ├── contact.jsx
│       │   │   ├── home.jsx
│       │   │   ├── LoginPage.jsx
│       │   │   └── PostDetail.jsx
│       │   ├── App.css
│       │   ├── App.jsx
│       │   ├── index.css
│       │   └── main.jsx
│       ├── .env
│       ├── .gitignore
│       ├── constants.js
│       ├── eslint.config.js
│       ├── geminiService.js
│       ├── index.html
│       ├── package-lock.json
│       ├── package.json
│       ├── README.md
│       └── vite.config.js
│
└── rasa_NLU/
    ├── .rasa/
    ├── actions/
    ├── data/
    │   ├── nlu.yml
    │   ├── rules.yml
    │   └── stories.yml
    ├── env/
    ├── models/
    ├── tests/
    ├── config.yml
    ├── credentials.yml
    ├── domain.yml
    └── endpoints.yml
```

## Contribution
Contributions are welcome! Please fork the repo and submit a pull request.



### License
MIT License © 2025 Ganjer Lawrence K





