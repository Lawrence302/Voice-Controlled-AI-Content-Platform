import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const transcriptRef = useRef('');
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const recognitionRef = useRef(null);
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);

  // Check for browser support
  const isSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

  // WebSocket setup
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/ws');

      ws.onopen = () => console.log('✅ WebSocket connected.');

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          console.log('📩 WebSocket message received:', msg);
          if (msg.action === 'navigate') {
            navigate(`/${msg.target}`);
          }
        } catch (e) {
          console.error('❌ Invalid JSON from WebSocket:', e);
        }
      };

      ws.onerror = (err) => console.error('❌ WebSocket error:', err);

      ws.onclose = () => {
        console.warn('⚠️ WebSocket closed. Reconnecting...');
        setTimeout(connectWebSocket, 2000); // Reconnect
      };

      socketRef.current = ws;
    };

    connectWebSocket();

    return () => {
      socketRef.current?.close();
    };
  }, [navigate]);

  // Start recognition
  const startListening = () => {
    if (!isSupported) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('🎤 Listening started');
      setListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
      transcriptRef.current = finalTranscript;
    };

    recognition.onerror = (event) => {
      console.error('❌ Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      console.log('🛑 Listening ended');
      setListening(false);

      const finalTranscript = transcriptRef.current.trim();
      if (finalTranscript) {
        console.log('📤 Sending transcript to backend:', finalTranscript);
        fetch('http://localhost:8000/voice-command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: finalTranscript })
        }).catch(err => console.error("❌ Failed to send voice command:", err));
      }
    };

    recognition.start();
  };

  // Stop recognition manually
  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/about'>About</Link></li>
        <li><Link to='/contact'>Contact</Link></li>
      </ul>

      <button onClick={toggleListening}>
        🎙️ {listening ? 'Stop Listening' : 'Start Voice Command'}
      </button>

      {listening && <p><strong>Listening:</strong> {transcript}</p>}
    </div>
  );
};

export default Header;
