import { useState, useRef, useEffect } from "react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import "./App.css"; // Import the new styles

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [transcript, setTranscript] = useState("");
  
  const mediaRecorderRef = useRef(null);
  const deepgramConnectionRef = useRef(null);

  const startRecording = async () => {
    setTranscript("");
    setStatus("Requesting microphone...");

    try {
      const apiKey = "01e88aa229bbfdbec2fa5f6fbca6fd7857036f48"; 
      const deepgram = createClient(apiKey);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setStatus("Connecting...");

      const connection = deepgram.listen.live({
        model: "nova-2",
        language: "en-US",
        smart_format: true,
      });

      deepgramConnectionRef.current = connection;

      connection.on(LiveTranscriptionEvents.Open, () => {
        setStatus("Listening...");
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        });

        mediaRecorder.start(250);
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const newText = data.channel.alternatives[0].transcript;
        if (newText) setTranscript((prev) => prev + " " + newText);
      });

      connection.on(LiveTranscriptionEvents.Error, (err) => {
        console.error(err);
        setStatus("Error: " + err.message);
      });

      setIsRecording(true);

    } catch (err) {
      console.error(err);
      setStatus("Microphone access denied");
    }
  };

  const stopRecording = () => {
    setStatus("Processing...");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (deepgramConnectionRef.current) {
      deepgramConnectionRef.current.finish();
      deepgramConnectionRef.current = null;
    }
    setIsRecording(false);
    setStatus("Ready");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    setStatus("Copied to clipboard!");
    setTimeout(() => setStatus(isRecording ? "Listening..." : "Ready"), 2000);
  };

  useEffect(() => {
    return () => stopRecording();
  }, []);

  return (
    <div className="container">
      <h1>Wispr Clone</h1>
      <div className="status-badge">Status: {status}</div>

      <button 
        className={`record-btn ${isRecording ? 'recording' : ''}`}
        onClick={isRecording ? stopRecording : startRecording}
        title={isRecording ? "Stop Recording" : "Start Recording"}
      >
        {isRecording ? "⏹" : "🎙️"}
      </button>

      <div className="transcript-card">
        <h3>
          Transcript
          {transcript && (
            <button className="copy-btn" onClick={copyToClipboard}>
              COPY TEXT
            </button>
          )}
        </h3>
        <div className="transcript-text">
          {transcript || "Click the microphone to start speaking..."}
        </div>
      </div>
    </div>
  );
}

export default App;