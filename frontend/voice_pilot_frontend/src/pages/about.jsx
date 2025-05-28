import React from 'react'

const About = () => {
  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-xl max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-6 text-center">
        About VoicePilot
      </h1>
      <div className="prose prose-slate max-w-none prose-p:text-slate-700 prose-headings:text-slate-800 space-y-4">
        <p>
          <strong>VoicePilot</strong> is an AI-powered blogging platform designed to simplify user interaction, automate content generation, and enhance accessibility through voice and smart intent recognition.
        </p>
        <p>
          The goal of this project is to explore how modern AI technologies can work together to make web experiences more intelligent, intuitive, and hands-free. Whether it’s generating articles using large language models or navigating pages with voice commands, VoicePilot aims to show what's possible when AI becomes your co-pilot online.
        </p>
        <p>
          Under the hood, the platform integrates a number of technologies:
        </p>
        <ul className="list-disc list-inside">
          <li><strong>React</strong> – for building a dynamic and responsive frontend</li>
          <li><strong>Tailwind CSS</strong> – for styling and layout</li>
          <li><strong>FastAPI</strong> – for a high-performance Python backend</li>
          <li><strong>PostgreSQL</strong> – to store and manage blog content</li>
          <li><strong>Rasa</strong> – to interpret and handle voice-based user intents</li>
          <li><strong>Browser Speech API</strong> – for capturing and processing voice commands</li>
          <li><strong>Google Gemini</strong> – to generate blog content from user topics</li>
        </ul>
        <p>
          VoicePilot is still evolving — more voice features are on the way, with the aim of enabling full site navigation and interaction through natural speech. The future of web engagement is hands-free, intelligent, and user-focused.
        </p>
        <p>
          Thank you for exploring this demo project. We hope it inspires new ideas about how AI can transform content creation and online experiences.
        </p>
      </div>
    </div>
  );
};

export default About;
