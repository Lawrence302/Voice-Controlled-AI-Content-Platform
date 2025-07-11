import React, {useState, useEffect, useRef} from 'react'
import * as faceapi from "face-api.js";
import { useNavigate } from 'react-router-dom';

const LoginForm = ({setLoggedIn}) => {


    // Track if user is in login or registration mode (disables buttons)
    const [loginMode, setLoginMode] = useState(true); // 'login'
    const [registerMode, setRegisterMode] = useState(false)
     // UI text status for the user
    const [status, setStatus] = useState("Loading models...");
    // Track if the models have been loaded
    const [modelsLoaded, setModelsLoaded] = useState(false);

    // React ref to access the <video> element (webcam)
    const videoRef = useRef();
    const navigate = useNavigate()

    
    // Start the webcam using browser's getUserMedia API
    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
        videoRef.current.srcObject = stream; // stream video into <video>
        });
    };

    // Detect a single face and return the face descriptor (128-length vector)
    const getFaceDescriptor = async () => {
        const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

        return detection ? detection.descriptor : null;
    };

    // Averages multiple face descriptors into one (used during registration)
    const averageDescriptors = (descriptors) => {
        const avg = new Float32Array(128).fill(0); // create an empty descriptor

        // Sum all values in each position
        descriptors.forEach((desc) => {
        desc.forEach((val, i) => (avg[i] += val));
        });

        // Divide to get the average
        return avg.map((val) => val / descriptors.length);
    };

    // Registration flow
    const handleRegister = async () => {

        if (localStorage.getItem("userInfo")) {
            setStatus("🚫 Face already registered");
            setLoginMode(true)
            setRegisterMode(false)
            return;
        }


        setStatus("Registering: Look forward...");
        const descriptors = [];

        // Go through 3 prompts to capture face in different angles
        for (const direction of ["forward", "left", "right"]) {
        setStatus(`Look ${direction}...`);
        let captured = false;

        // Keep trying to capture until we get a face
        while (!captured) {
            const descriptor = await getFaceDescriptor();
            if (descriptor) {
            descriptors.push(descriptor);
            captured = true;
            setStatus(`Captured ${direction}`);
            await new Promise((res) => setTimeout(res, 1500)); // wait 1.5 sec between captures
            }
        }
        }
        
        // Average all 3 captured descriptors and store in localStorage
        const avgDescriptor = averageDescriptors(descriptors);
        localStorage.setItem("userInfo", JSON.stringify({ faceDescriptor: Array.from(avgDescriptor) , loggedIn: true }));

        setLoggedIn(true)
        setStatus("✅ Face registered successfully!");
        setRegisterMode(false); // allow buttons again
        navigate("/")
    };

    // Login flow
    const handleLogin = async () => {
    
        setStatus("Looking for your face...");
        const userInfo = localStorage.getItem("userInfo");

        // Stop if user hasn't registered yet
        if (!userInfo) {
            setStatus("❌ No face registered. Please register first.");
            setRegisterMode(true)
            setLoginMode(false)
            return;
        }

        const userData = JSON.parse(userInfo)

        if (userData.loggedIn){
            return
        }

        // getting the users stored face description code
        const storedDescriptor = new Float32Array(userData.faceDescriptor);
        let found = false;

        // Try for ~10 seconds (30 tries, 300ms each)
        for (let i = 0; i < 30; i++) {
            console.log("waiting for descroptor")
            const current = await getFaceDescriptor();

            if (current) {
                // Compare new face descriptor to stored one using Euclidean distance
                const dist = faceapi.euclideanDistance(current, storedDescriptor);
                console.log("Distance:", dist);

                // If distance is low enough, it's a match
                if (dist < 0.55) {
                setLoggedIn(true);
                setStatus("✅ Login successful!");
                found = true;
                navigate("/")
                break;
                }
        }

        await new Promise((res) => setTimeout(res, 300)); // wait before next try
        }

        if (!found) setStatus("❌ Face not recognized.");
        
    };

   

    // Load the face-api.js models once the component mounts
    useEffect(() => {
      const loadModels = async () => {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"), // for fast face detection
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"), // for detecting facial features
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"), // for creating face descriptors
        ]);
  
        setModelsLoaded(true);
        setStatus("Models loaded. Ready.");
       
      };
  
      loadModels();
    }, []);

    useEffect(()=>{
        if(videoRef.current && modelsLoaded){
             startVideo(); // Start the webcam
        }
    },[modelsLoaded, videoRef])

    return (
        <div style={{ textAlign: "center", padding: 20 }}>
        <h1 className='text-white text-2xl'> Face Recognition Login </h1>

        {/* Webcam stream */}
        <div className='flex justify-center items-center '>
            <video
                ref={videoRef}
                autoPlay
                muted
                width="640"
                height="480"
                style={{ borderRadius: 10 }}
            />
        </div>
        
        
        
        {/* Buttons */}
        <div style={{ marginTop: 20 }}>
            { registerMode && 
                <button onClick={handleRegister}>
                📷 Register Face
                </button>
            }
            {loginMode &&
                <button className=' cursor-pointer border outline-white px-4 rounded-sm text-white' onClick={handleLogin}>
                🔐 Login
                </button>}
        </div>

        {/* Status message */}
        <p style={{ marginTop: 20 }}>{status}</p>

        
        </div>
    )
}

export default LoginForm