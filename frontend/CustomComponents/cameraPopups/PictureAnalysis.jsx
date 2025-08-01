"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence for exit animations
import {
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ScanFace,
  X, // Import the X icon for closing
} from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function PictureAnalysisPopup({ open, setOpen, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const croppedRef = useRef(null); // Keep the ref for internal use
  const faceLandmarkerRef = useRef(null);
  const router = useRouter(); // Initialize useRouter

  const [isReady, setIsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false); // Controls the main detection loop (active analysis)
  const [countdown, setCountdown] = useState(0); // 0 means no countdown, 1-3 active
  const countdownTimeoutRef = useRef(null); // To store the timeout ID for clearing
  const [isImageCaptured, setIsImageCaptured] = useState(false); // State to show/hide cropped image
  const [faceUp, setFaceUp] = useState(false);
  const [faceDown, setFaceDown] = useState(false);
  const [faceRight, setFaceRight] = useState(false);
  const [faceLeft, setFaceLeft] = useState(false);
  const [brightnessMessage, setBrightnessMessage] = useState(""); // New state for brightness feedback

  const [allCurrentChecksPass, setAllCurrentChecksPass] = useState(false);
  const [isYawOff, setIsYawOff] = useState(false);
  const [isPitchOff, setIsPitchOff] = useState(false);

  const lastFaceCenterRef = useRef({ x: null, y: null });
  // Ref to control detection frequency
  const lastDetectionTimeRef = useRef(0);
  const detectionInterval = 100; // Run detection every 100ms (approx 10 FPS for analysis)

  // --- Helper Functions for Checks (No Change from previous version for logic) ---
  const calculateHeadPose = useCallback((landmarks) => {
    if (!landmarks || landmarks.length < 400) {
      return {
        yaw: 0,
        pitch: 0,
        roll: 0,
        isGoodPose: false,
        reason: "Insufficient landmarks for pose.",
        isYawOff: false, // Default to false if not enough landmarks
        isPitchOff: false, // Default to false if not enough landmarks
      };
    }
    const noseTip = landmarks[1];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const mouthLeft = landmarks[61];
    const mouthRight = landmarks[291];

    if (!noseTip || !leftEye || !rightEye || !mouthLeft || !mouthRight) {
      return {
        yaw: 0,
        pitch: 0,
        roll: 0,
        isGoodPose: false,
        reason: "Missing key pose landmarks.",
        isYawOff: false,
        isPitchOff: false,
      };
    }
    const eyeLineMidX = (leftEye.x + rightEye.x) / 2;
    const eyeLineMidY = (leftEye.y + rightEye.y) / 2;
    const mouthLineMidX = (mouthLeft.x + mouthRight.x) / 2;
    const mouthLineMidY = (mouthLeft.y + mouthRight.y) / 2;

    const noseOffsetFromEyeCenter = noseTip.x - eyeLineMidX;
    const eyeDistance = Math.sqrt(
      Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2)
    );
    let yawDeg = 0;
    if (eyeDistance > 0) {
      yawDeg = (noseOffsetFromEyeCenter / eyeDistance) * 30;
    }

    const noseToEyeDist = Math.sqrt(
      Math.pow(noseTip.x - eyeLineMidX, 2) +
        Math.pow(noseTip.y - eyeLineMidY, 2)
    );
    const noseToMouthDist = Math.sqrt(
      Math.pow(noseTip.x - mouthLineMidX, 2) +
        Math.pow(noseTip.y - mouthLineMidY, 2)
    );
    let pitchDeg = 0;
    if (noseToEyeDist + noseToMouthDist > 0) {
      const verticalRatio = noseToEyeDist / (noseToEyeDist + noseToMouthDist);
      pitchDeg = (0.5 - verticalRatio) * 60;
    }

    const deltaY = rightEye.y - leftEye.y;
    const deltaX = rightEye.x - leftEye.x;
    const rollRad = Math.atan2(deltaY, deltaX);
    const rollDeg = rollRad * (180 / Math.PI);

    const MAX_YAW_ABS = 2;
    const MAX_PITCH_ABS = 2;
    const MAX_ROLL_ABS = 10;

    const isGoodPose =
      Math.abs(yawDeg) < MAX_YAW_ABS &&
      Math.abs(pitchDeg) < MAX_PITCH_ABS &&
      Math.abs(rollDeg) < MAX_ROLL_ABS;

    let reason = "";
    if (Math.abs(yawDeg) >= MAX_YAW_ABS) reason += "Face sideways. ";
    if (Math.abs(pitchDeg) >= MAX_PITCH_ABS) reason += "Looking up/down. ";
    if (Math.abs(rollDeg) >= MAX_ROLL_ABS) reason += "Head tilted. ";
    if (reason === "") reason = "Good pose.";

    return {
      yaw: yawDeg.toFixed(2),
      pitch: pitchDeg.toFixed(2),
      roll: rollDeg.toFixed(2),
      isGoodPose,
      reason,
      isYawOff: Math.abs(yawDeg) >= MAX_YAW_ABS,
      isPitchOff: Math.abs(pitchDeg) >= MAX_PITCH_ABS,
    };
  }, []);

  const checkFaceCentering = useCallback(
    (detection, videoWidth, videoHeight) => {
      if (!detection || !detection.boundingBox) {
        return {
          isCentered: false,
          reason: "No face detected for centering check.",
        };
      }
      const box = detection.boundingBox;
      const canvasCenterX = videoWidth / 2;
      const canvasCenterY = videoHeight / 2;
      const faceCenterX = box.originX + box.width / 2;
      const faceCenterY = box.originY + box.height / 2;
      const distance = Math.sqrt(
        Math.pow(faceCenterX - canvasCenterX, 2) +
          Math.pow(faceCenterY - canvasCenterY, 2)
      );
      const tolerance = Math.min(videoWidth, videoHeight) * 0.1;
      const isCentered = distance < tolerance;
      return {
        isCentered,
        reason: isCentered ? "Face is centered." : "Face not centered enough.",
      };
    },
    []
  );

  const checkFaceBrightness = useCallback((detection, ctx) => {
    if (!detection || !detection.boundingBox) {
      return {
        isGoodBrightness: false,
        reason: "No face detected for brightness check.",
      };
    }
    const box = detection.boundingBox;
    const safeOriginX = Math.max(0, box.originX);
    const safeOriginY = Math.max(0, box.originY);
    const safeWidth = Math.min(box.width, ctx.canvas.width - safeOriginX);
    const safeHeight = Math.min(box.height, ctx.canvas.height - safeOriginY);

    if (safeWidth <= 0 || safeHeight <= 0) {
      return {
        isGoodBrightness: false,
        reason: "Invalid face bounding box for brightness check.",
      };
    }

    const faceImageData = ctx.getImageData(
      safeOriginX,
      safeOriginY,
      safeWidth,
      safeHeight
    );
    const faceData = faceImageData.data;

    let totalBrightness = 0;
    let pixelCount = 0;

    for (let i = 0; i < faceData.length; i += 4) {
      const r = faceData[i];
      const g = faceData[i + 1];
      const b = faceData[i + 2];
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      totalBrightness += luminance;
      pixelCount++;
    }

    const avgBrightness = pixelCount > 0 ? totalBrightness / pixelCount : 0;
    const minBrightness = 70;
    const maxBrightness = 210;
    const isGoodBrightness =
      avgBrightness >= minBrightness && avgBrightness <= maxBrightness;

    let reason = "";
    if (avgBrightness < minBrightness) {
      reason = "Lighting is insufficient.";
    } else if (avgBrightness > maxBrightness) {
      reason = "Lighting is too intense.";
    } else {
      reason = "";
    }
    return { isGoodBrightness, reason };
  }, []);

  const checkFaceVisibility = useCallback((detection) => {
    if (!detection || !detection.boundingBox) {
      return { isVisible: false, reason: "No face detected for visibility." };
    }
    const minFaceAreaRatio = 0.05;
    const videoArea =
      videoRef.current.videoWidth * videoRef.current.videoHeight;
    const faceArea = detection.boundingBox.width * detection.boundingBox.height;
    const isReasonablySized = faceArea / videoArea > minFaceAreaRatio;
    const hasSufficientKeypoints = (detection.keypoints?.length || 0) > 400;

    const isVisible = isReasonablySized && hasSufficientKeypoints;
    let reason = "";
    if (!isReasonablySized)
      reason += "Face too small or partially out of frame. ";
    if (!hasSufficientKeypoints)
      reason += "Too few landmarks detected (face possibly covered). ";
    if (reason === "") reason = "Face appears visible.";
    return {
      isVisible,
      reason: isVisible ? "Face is clearly visible." : reason,
    };
  }, []);

  // --- processDetections function ---
  const processDetections = useCallback(
    (detections) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!video || !canvas || !ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const canvasCenterX = canvas.width / 2;
      const canvasCenterY = canvas.height / 2;
      const radiusX = Math.min(canvas.width, canvas.height) * 0.2;
      const radiusY = Math.min(canvas.width, canvas.height) * 0.25;

      const NEUTRAL_PITCH_GUIDE_OFFSET_Y = radiusY * 0.2; // ** <<< ADJUST THIS VALUE CAREFULLY >>> **

      // The actual Y-coordinate where the horizontal guide line should be drawn.
      const targetHorizontalLineY =
        canvasCenterY + NEUTRAL_PITCH_GUIDE_OFFSET_Y;

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing

      // --- APPLY HORIZONTAL FLIP HERE ---
      ctx.save(); // Save the current canvas state
      ctx.translate(canvas.width, 0); // Move the origin to the right edge
      ctx.scale(-1, 1); // Flip horizontally

      // Now draw the video, which will be flipped
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // After drawing the initial flipped video, apply blur and draw the oval mask
      ctx.filter = "blur(8px)";
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.filter = "none"; // Reset filter

      // --- START OVAL CLIP FOR UNBLURRED AREA AND DOTTED LINES ---
      ctx.save(); // Save again before clipping for the unblurred oval and dotted lines
      ctx.beginPath();
      ctx.ellipse(
        canvasCenterX,
        canvasCenterY,
        radiusX,
        radiusY,
        0,
        0,
        2 * Math.PI
      );
      ctx.clip(); // All subsequent drawing will be clipped to this oval

      // Draw the unblurred video content inside the oval
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      let allChecksPassForFrame = true;
      let faceBoundingBox = null;
      const reasonsForFailure = [];
      let poseResult = {
        isGoodPose: false,
        yaw: 0,
        pitch: 0,
        isYawOff: false,
        isPitchOff: false,
      };
      let currentBrightnessMessage = ""; // Initialize for this frame

      if (detections.faceLandmarks && detections.faceLandmarks.length > 0) {
        const landmarks = detections.faceLandmarks[0];
        if (landmarks.length > 0) {
          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;
          landmarks.forEach((p) => {
            // Adjust landmark coordinates for the flip.
            minX = Math.min(minX, (1 - p.x) * video.videoWidth); // Flipped X
            minY = Math.min(minY, p.y * video.videoHeight);
            maxX = Math.max(maxX, (1 - p.x) * video.videoWidth); // Flipped X
            maxY = Math.max(maxY, p.y * video.videoHeight);
          });
          faceBoundingBox = {
            originX: minX,
            originY: minY,
            width: maxX - minX,
            height: maxY - minY,
          };

          // Update lastFaceCenterRef only if a face is clearly detected (still useful for other context)
          lastFaceCenterRef.current.x =
            faceBoundingBox.originX + faceBoundingBox.width / 2;
          lastFaceCenterRef.current.y =
            faceBoundingBox.originY + faceBoundingBox.height / 2;
        }
      }

      // Perform checks
      if (!faceBoundingBox) {
        reasonsForFailure.push("No face detected.");
        allChecksPassForFrame = false;
        // If no face, reset pose indicators to false to hide lines
        setIsYawOff(false);
        setIsPitchOff(false);
        setBrightnessMessage(""); // No face, no brightness message
      } else {
        const centeringResult = checkFaceCentering(
          { boundingBox: faceBoundingBox },
          canvas.width,
          canvas.height
        );
        if (!centeringResult.isCentered) {
          reasonsForFailure.push(centeringResult.reason);
          allChecksPassForFrame = false;
        }

        const brightnessResult = checkFaceBrightness(
          { boundingBox: faceBoundingBox },
          ctx
        );
        if (!brightnessResult.isGoodBrightness) {
          reasonsForFailure.push(brightnessResult.reason);
          allChecksPassForFrame = false;
          currentBrightnessMessage = brightnessResult.reason; // Set brightness message
        } else {
          currentBrightnessMessage = ""; // Clear message if brightness is good
        }
        setBrightnessMessage(currentBrightnessMessage); // Update state

        poseResult = calculateHeadPose(detections.faceLandmarks[0]);
        if (!poseResult.isGoodPose) {
          reasonsForFailure.push(poseResult.reason);
          allChecksPassForFrame = false;
        }
        // Update pose states for drawing dotted lines if a face is detected
        setIsYawOff(poseResult.isYawOff);
        setIsPitchOff(poseResult.isPitchOff);

        const visibilityResult = checkFaceVisibility({
          boundingBox: faceBoundingBox,
          keypoints: detections.faceLandmarks[0],
        });
        if (!visibilityResult.isVisible) {
          reasonsForFailure.push(visibilityResult.reason);
          allChecksPassForFrame = false;
        }
      }

      setAllCurrentChecksPass(allChecksPassForFrame);
      // --- Corrected Face Direction State Logic ---
      const yaw = parseFloat(poseResult.yaw);
      const pitch = parseFloat(poseResult.pitch);

      let newFaceLeft = false;
      let newFaceRight = false;
      let newFaceUp = false;
      let newFaceDown = false;

      // Yaw: Left/Right (from camera's perspective)
      if (yaw > 2) {
        newFaceLeft = true;
      } else if (yaw < -2) {
        newFaceRight = true;
      }

      // Pitch: Up/Down
      if (pitch > 2) {
        newFaceUp = true;
      } else if (pitch < -2) {
        newFaceDown = true;
      }

      setFaceLeft(newFaceLeft);
      setFaceRight(newFaceRight);
      setFaceUp(newFaceUp);
      setFaceDown(newFaceDown);

      // --- Draw Dotted Lines for Pose Correction (INSIDE THE CLIP, STATIC AT CENTER) ---
      // These lines will now be confined to the oval and be static relative to the oval.
      if (!allChecksPassForFrame && !isImageCaptured && faceBoundingBox) {
        // Only show if checks fail, not captured, and a face is detected
        ctx.strokeStyle = "#F5F5F5"; // Or any color you prefer for guidance
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dotted line: 5 pixels on, 5 pixels off

        // Draw horizontal line if head is pitched up/down (Pitch Off)
        if (isPitchOff) {
          ctx.beginPath();
          ctx.moveTo(canvasCenterX - radiusX, targetHorizontalLineY); // Draw within the oval's horizontal bounds
          ctx.lineTo(canvasCenterX + radiusX, targetHorizontalLineY);
          ctx.stroke();
        }

        // Draw vertical line if head is yawed left/right (Yaw Off)
        if (isYawOff) {
          ctx.beginPath();
          ctx.moveTo(canvasCenterX, canvasCenterY - radiusY); // Draw within the oval's vertical bounds
          ctx.lineTo(canvasCenterX, canvasCenterY + radiusY);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]); // Reset line dash to solid for other drawings

      // --- RESTORE THE OVAL CLIP ---
      ctx.restore(); // Restore to remove the clip applied earlier for the unblurred oval and dotted lines

      // --- Restore the initial horizontal flip ---
      ctx.restore(); // Restore the initial state, undoing the main horizontal flip for subsequent drawings (like messages, oval stroke outside clip)

      // 5. Draw the oval stroke (This will be drawn outside the clip, but in the correct flipped context)
      ctx.beginPath();
      ctx.ellipse(
        canvasCenterX,
        canvasCenterY,
        radiusX,
        radiusY,
        0,
        0,
        2 * Math.PI
      );
      ctx.strokeStyle = allChecksPassForFrame ? "green" : "#F5F5F5";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 7. Draw countdown text
      if (countdown > 0) {
        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        const text = `Hold still for ${countdown}`;
        const textY = canvasCenterY - radiusY - 20;

        ctx.strokeText(text, canvasCenterX, textY);
        ctx.fillText(text, canvasCenterX, textY);
      }

      // Add Brightness Message
      if (brightnessMessage) {
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "white"; // A noticeable color for alerts
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        // Position it just above the oval, below the countdown if it exists
        const brightnessTextY =
          countdown > 0
            ? canvasCenterY - radiusY - 50
            : canvasCenterY - radiusY - 20;

        ctx.strokeText(brightnessMessage, canvasCenterX, brightnessTextY);
        ctx.fillText(brightnessMessage, canvasCenterX, brightnessTextY);
      }
    },
    [
      calculateHeadPose,
      checkFaceCentering,
      checkFaceBrightness,
      checkFaceVisibility,
      countdown,
      isImageCaptured,
      isPitchOff,
      isYawOff,
      brightnessMessage, // Add brightnessMessage to dependencies
    ]
  );

  // --- Model Loading and Camera Setup ---
  useEffect(() => {
    // Only load model and start camera if the popup is open
    if (!open) {
      // Clean up resources if popup is closed
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current);
        countdownTimeoutRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null; // Clear the stream
      }
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
        faceLandmarkerRef.current = null; // Clear the landmarker
      }
      setIsReady(false);
      setIsCapturing(false);
      setIsImageCaptured(false);
      setCountdown(0);
      setAllCurrentChecksPass(false);
      setFaceDown(false);
      setFaceUp(false);
      setFaceLeft(false);
      setFaceRight(false);
      setIsPitchOff(false);
      setIsYawOff(false);
      lastFaceCenterRef.current = { x: null, y: null };
      return;
    }

    const loadFaceLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });
        faceLandmarkerRef.current = landmarker;

        setIsReady(true);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          setIsCapturing(true);
          setIsImageCaptured(false);
        };
      } catch (error) {
        console.error("Error loading model or camera:", error);
        // Optionally, close the popup or show an error message to the user
        setOpen(false);
      }
    };

    loadFaceLandmarker();

    return () => {
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current);
        countdownTimeoutRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
        faceLandmarkerRef.current = null;
      }
    };
  }, [open, setOpen]); // Depend on 'open' to re-run effect when popup state changes

  // --- Analysis Loop ---
  useEffect(() => {
    if (!isReady || !isCapturing || !open) return; // Also check 'open' here

    let animationFrameId;

    const detectFace = async () => {
      const video = videoRef.current;
      const landmarker = faceLandmarkerRef.current;

      if (landmarker && video && video.readyState === 4) {
        const now = performance.now();
        if (now - lastDetectionTimeRef.current >= detectionInterval) {
          lastDetectionTimeRef.current = now;
          const detections = landmarker.detectForVideo(video, now);
          processDetections(detections);
        } else {
          // Redraw the canvas even when not detecting to maintain smoothness
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (canvas && ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // --- APPLY HORIZONTAL FLIP HERE ---
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            ctx.filter = "blur(8px)";
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.filter = "none";

            // --- START OVAL CLIP FOR UNBLURRED AREA AND DOTTED LINES ---
            ctx.save();
            const canvasCenterX = canvas.width / 2;
            const canvasCenterY = canvas.height / 2;
            const radiusX = Math.min(canvas.width, canvas.height) * 0.2;
            const radiusY = Math.min(canvas.width, canvas.height) * 0.25;

            // --- DOTTED LINE CALCULATION (MUST MATCH processDetections) ---
            const NEUTRAL_PITCH_GUIDE_OFFSET_Y = radiusY * 0.2; // ** <<< ADJUST THIS VALUE CAREFULLY >>> **
            const targetHorizontalLineY =
              canvasCenterY + NEUTRAL_PITCH_GUIDE_OFFSET_Y;

            ctx.beginPath();
            ctx.ellipse(
              canvasCenterX,
              canvasCenterY,
              radiusX,
              radiusY,
              0,
              0,
              2 * Math.PI
            );
            ctx.clip(); // All subsequent drawing will be clipped to this oval

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Redraw Dotted Lines based on stored state to prevent flicker
            if (
              !allCurrentChecksPass &&
              !isImageCaptured &&
              lastFaceCenterRef.current.x !== null // Ensure a face was previously detected
            ) {
              ctx.strokeStyle = "#F5F5F5";
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);

              if (isPitchOff) {
                ctx.beginPath();
                ctx.moveTo(canvasCenterX - radiusX, targetHorizontalLineY); // Draw within the oval's horizontal bounds
                ctx.lineTo(canvasCenterX + radiusX, targetHorizontalLineY);
                ctx.stroke();
              }

              if (isYawOff) {
                ctx.beginPath();
                ctx.moveTo(canvasCenterX, canvasCenterY - radiusY); // Draw within the oval's vertical bounds
                ctx.lineTo(canvasCenterX, canvasCenterY + radiusY);
                ctx.stroke();
              }
            }
            ctx.setLineDash([]); // Reset line dash

            // --- RESTORE THE OVAL CLIP ---
            ctx.restore();

            // --- Restore the initial horizontal flip ---
            ctx.restore();

            // Redraw the oval stroke outside the clip
            ctx.beginPath();
            ctx.ellipse(
              canvasCenterX,
              canvasCenterY,
              radiusX,
              radiusY,
              0,
              0,
              2 * Math.PI
            );
            ctx.strokeStyle = allCurrentChecksPass ? "green" : "#F5F5F5";
            ctx.lineWidth = 2;
            ctx.stroke();

            if (countdown > 0) {
              ctx.font = "bold 28px sans-serif";
              ctx.fillStyle = "white";
              ctx.strokeStyle = "black";
              ctx.lineWidth = 2;
              ctx.textAlign = "center";
              ctx.textBaseline = "bottom";
              const text = `Hold still for ${countdown}`;
              const textY = canvasCenterY - radiusY - 20;

              ctx.strokeText(text, canvasCenterX, textY);
              ctx.fillText(text, canvasCenterX, textY);
            }
            // Add Brightness Message for redraws as well
            if (brightnessMessage) {
              ctx.font = "bold 20px sans-serif";
              ctx.fillStyle = "white";
              ctx.strokeStyle = "black";
              ctx.lineWidth = 3;
              ctx.textAlign = "center";
              const brightnessTextY =
                countdown > 0
                  ? canvasCenterY - radiusY - 50
                  : canvasCenterY - radiusY - 20;

              ctx.strokeText(brightnessMessage, canvasCenterX, brightnessTextY);
              ctx.fillText(brightnessMessage, canvasCenterX, brightnessTextY);
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(detectFace);
    };

    animationFrameId = requestAnimationFrame(detectFace);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    isReady,
    isCapturing,
    open, // Add open as a dependency
    processDetections,
    countdown,
    allCurrentChecksPass,
    isYawOff,
    isPitchOff,
    brightnessMessage,
  ]);

  // --- EFFECT 1: Countdown Initiation / Reset ---
  useEffect(() => {
    if (countdownTimeoutRef.current) {
      clearTimeout(countdownTimeoutRef.current);
      countdownTimeoutRef.current = null;
    }

    if (
      allCurrentChecksPass &&
      countdown === 0 &&
      isCapturing &&
      !isImageCaptured
    ) {
      setCountdown(3);
    } else if (!allCurrentChecksPass && countdown > 0) {
      setCountdown(0);
    }
  }, [allCurrentChecksPass, isCapturing, isImageCaptured, countdown]);

  // --- EFFECT 2: Countdown Decrement & Capture ---
  useEffect(() => {
    if (countdown > 1 && isCapturing && !isImageCaptured) {
      countdownTimeoutRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (
      countdown === 1 &&
      isCapturing &&
      !isImageCaptured &&
      allCurrentChecksPass
    ) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const croppedCanvas = croppedRef.current;
      const landmarker = faceLandmarkerRef.current;

      if (landmarker && video && video.readyState === 4) {
        const detections = landmarker.detectForVideo(video, performance.now());
        if (detections.faceLandmarks && detections.faceLandmarks.length > 0) {
          const landmarks = detections.faceLandmarks[0];
          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;
          landmarks.forEach((p) => {
            // The canvas context has already handled the flip for drawing.
            minX = Math.min(minX, p.x * video.videoWidth);
            minY = Math.min(minY, p.y * video.videoHeight);
            maxX = Math.max(maxX, p.x * video.videoWidth);
            maxY = Math.max(maxY, p.y * video.videoHeight);
          });
          const faceBoundingBox = {
            originX: minX,
            originY: minY,
            width: maxX - minX,
            height: maxY - minY,
          };

          const ctx = canvas.getContext("2d");
          const finalCentering = checkFaceCentering(
            { boundingBox: faceBoundingBox },
            canvas.width,
            canvas.height
          );
          const finalBrightness = checkFaceBrightness(
            { boundingBox: faceBoundingBox },
            ctx
          );
          const finalPose = calculateHeadPose(landmarks);
          const finalVisibility = checkFaceVisibility({
            boundingBox: faceBoundingBox,
            keypoints: landmarks,
          });

          if (
            finalCentering.isCentered &&
            finalBrightness.isGoodBrightness &&
            finalPose.isGoodPose &&
            finalVisibility.isVisible
          ) {
            const croppedCtx = croppedCanvas.getContext("2d");
            // Set cropped canvas dimensions to the fixed desired output size
            croppedCanvas.width = 300; // Fixed width
            croppedCanvas.height = 400; // Fixed height

            // Calculate scaling factors
            const scaleX = croppedCanvas.width / faceBoundingBox.width;
            const scaleY = croppedCanvas.height / faceBoundingBox.height;
            const scale = Math.min(scaleX, scaleY); // Use smaller scale to fit whole face

            // Calculate position to draw the face centered within the new fixed size canvas
            const newWidth = faceBoundingBox.width * scale;
            const newHeight = faceBoundingBox.height * scale;
            const offsetX = (croppedCanvas.width - newWidth) / 2;
            const offsetY = (croppedCanvas.height - newHeight) / 2;

            croppedCtx.drawImage(
              canvas,
              faceBoundingBox.originX, // Source X
              faceBoundingBox.originY, // Source Y
              faceBoundingBox.width, // Source Width
              faceBoundingBox.height, // Source Height
              offsetX, // Destination X
              offsetY, // Destination Y
              newWidth, // Destination Width
              newHeight // Destination Height
            );

            setIsCapturing(false);
            setIsImageCaptured(true);
            setCountdown(0);

            // Log image data to console
            const imageData = croppedCanvas.toDataURL("image/jpeg");
            if (imageData) {
              onCapture(imageData); // send image back to main page
            }
          } else {
            setCountdown(0);
            setIsCapturing(true);
            setIsImageCaptured(false);
          }
        } else {
          setCountdown(0);
          setIsCapturing(true);
          setIsImageCaptured(false);
        }
      }
    }

    return () => {
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current);
        countdownTimeoutRef.current = null;
      }
    };
  }, [
    countdown,
    isCapturing,
    isImageCaptured,
    allCurrentChecksPass,
    calculateHeadPose,
    checkFaceCentering,
    checkFaceBrightness,
    checkFaceVisibility,
    router, // Add router to dependencies
  ]);

  const handleClose = () => {
    setOpen(false);
    // Reset all states when the popup is closed
    setIsReady(false);
    setIsCapturing(false);
    setIsImageCaptured(false);
    setCountdown(0);
    setFaceUp(false);
    setFaceDown(false);
    setFaceRight(false);
    setFaceLeft(false);
    setAllCurrentChecksPass(false);
    setIsYawOff(false);
    setIsPitchOff(false);
    lastFaceCenterRef.current = { x: null, y: null };
  };

  // Main render for the popup component
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 "
          onClick={handleClose} // Close when clicking outside modal content
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative bg-white bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 shadow-lg rounded-xl overflow-hidden flex flex-col items-center justify-center px-6 space-y-4 max-w-lg w-full"
            style={{ width: "350px", minHeight: "550px" }} // Adjusted dimensions for the popup
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 z-10"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Skin Analysis
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Ensure your face is well-lit and centered within the oval.
            </p>

            {/* Video/Canvas Container */}
            <div
              className="relative bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
              style={{ width: "350px", height: "430px" }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute w-full h-full object-cover transition-opacity duration-300 ${
                  isCapturing ? "opacity-100" : "opacity-0"
                }`}
              ></video>
              <canvas
                ref={canvasRef}
                className={`absolute w-full h-full transition-opacity duration-300 ${
                  isCapturing ? "opacity-100" : "opacity-0"
                }`}
              ></canvas>
              {/* This canvas is now only for capturing the image data, not for display */}
              <canvas ref={croppedRef} className="hidden"></canvas>

              {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white text-lg">
                  Loading camera and model...
                </div>
              )}

              {/* Directional Guides */}
              {isCapturing && (
                <>
                  {/* Down Arrow */}
                  {faceUp && (
                    <motion.div
                      key="arrow-down"
                      initial={{ y: "-20%", opacity: 0 }} // Start above center, invisible
                      animate={{
                        y: ["-20%", "0%", "-20%"],
                        opacity: [0, 1, 0],
                      }} // Move down and up, fade in/out
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                      className="absolute flex items-center justify-center pointer-events-none"
                      style={{
                        top: "27%",
                        left: "45%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <ChevronsDown
                        size={35}
                        className="text-[#F5F5F5] drop-shadow-xl"
                      />
                    </motion.div>
                  )}

                  {/* Up Arrow */}
                  {faceDown && (
                    <motion.div
                      key="arrow-up"
                      initial={{ y: "20%", opacity: 0 }} // Start below center, invisible
                      animate={{ y: ["20%", "0%", "20%"], opacity: [0, 1, 0] }} // Move up and down, fade in/out
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                      className="absolute flex items-center justify-center pointer-events-none"
                      style={{
                        bottom: "27%",
                        left: "45%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <ChevronsUp
                        size={35}
                        className="text-[#F5F5F5] drop-shadow-xl"
                      />
                    </motion.div>
                  )}

                  {/* right Arrow */}
                  {faceLeft && (
                    <motion.div
                      key="arrow-left"
                      initial={{ x: "-20%", opacity: 0 }} // Start to the left, invisible
                      animate={{
                        x: ["-20%", "0%", "-20%"],
                        opacity: [0, 1, 0],
                      }} // Move right and left, fade in/out
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                      className="absolute flex items-center justify-center pointer-events-none"
                      style={{
                        left: "35%",
                        top: "50.5%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <ChevronsRight
                        size={35}
                        className="text-[#F5F5F5] drop-shadow-xl"
                      />
                    </motion.div>
                  )}

                  {/* left Arrow */}
                  {faceRight && (
                    <motion.div
                      key="arrow-right"
                      initial={{ x: "20%", opacity: 0 }} // Start to the right, invisible
                      animate={{ x: ["20%", "0%", "20%"], opacity: [0, 1, 0] }} // Move left and right, fade in/out
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                      className="absolute flex items-center justify-center pointer-events-none"
                      style={{
                        right: "35%",
                        top: "50.5%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <ChevronsLeft
                        size={35}
                        className="text-[#F5F5F5] drop-shadow-xl"
                      />
                    </motion.div>
                  )}
                </>
              )}
            </div>
            {/* The rest of the UI (messages and buttons) that are removed */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
