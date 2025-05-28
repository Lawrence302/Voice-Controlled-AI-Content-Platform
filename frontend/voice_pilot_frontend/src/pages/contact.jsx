import React from 'react'

const Contact = () => {
  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-xl max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-6 text-center">
        Get in Touch
      </h1>
      <div className="prose prose-slate max-w-none prose-p:text-slate-700 prose-headings:text-slate-800 space-y-4">
        <p>
          Welcome to <strong>VoicePilot</strong>, a prototype showcasing AI-enhanced blogging with automation and voice control at its core.
        </p>
        <p>
          If you're curious about the project, have feedback, or want to discuss how AI can streamline digital content experiences, we’d love to hear your thoughts.
        </p>

        <div className="p-4 border border-sky-200 rounded-lg bg-sky-50">
          <h2 className="text-xl font-semibold text-sky-700 mb-2">Feedback & Ideas</h2>
          <p>
            Since this is a demonstration project, formal support isn't available, but your feedback is welcome via the platform where you discovered this app (e.g., GitHub, portfolio, course, or tutorial page).
          </p>
        </div>

        <div className="p-4 border border-slate-200 rounded-lg">
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Demo Contact (Fictional)</h2>
          <p>
            For illustration purposes, you can imagine reaching us at:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li><strong>Email:</strong> contact@voicepilot.ai (Not a real email address)</li>
            <li><strong>Twitter:</strong> @VoicePilotAI (Fictional handle)</li>
          </ul>
        </div>

        <p>
          <strong>VoicePilot</strong> is built using a modern stack:
        </p>
        <ul className="list-disc list-inside">
          <li><strong>React & Tailwind CSS</strong> for the UI</li>
          <li><strong>FastAPI & PostgreSQL</strong> for the backend and data storage</li>
          <li><strong>Rasa</strong> for intent recognition from speech commands</li>
          <li><strong>Google Gemini</strong> for generating high-quality blog content</li>
          <li><strong>Web Speech API</strong> for voice-based navigation (in progress)</li>
        </ul>

        <p>
          As this platform evolves, we hope to expand on its voice-driven features and intelligent automation to further simplify blogging and user engagement.
        </p>
      </div>
    </div>
  );
};

export default Contact;
