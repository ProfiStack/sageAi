"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  X,
} from "lucide-react";
import useFormToast from "../FormToast/FormToast";
import CameraPermissionModal from "../Popups/CameraPermission";

export default function PictureAnalysisPopup({
  open,
  setOpen,
  onCapture,
  loading,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const croppedRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const { destructiveToast } = useFormToast();

  const [isReady, setIsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false); // Controls the main detection loop (active analysis)
  const [countdown, setCountdown] = useState(0);
  const countdownTimeoutRef = useRef(null);
  const [isImageCaptured, setIsImageCaptured] = useState(false);
  const [faceUp, setFaceUp] = useState(false);
  const [faceDown, setFaceDown] = useState(false);
  const [faceRight, setFaceRight] = useState(false);
  const [faceLeft, setFaceLeft] = useState(false);
  const [brightnessMessage, setBrightnessMessage] = useState("");
  const [distanceMessage, setDistanceMessage] = useState("");

  const [allCurrentChecksPass, setAllCurrentChecksPass] = useState(false);
  const [isYawOff, setIsYawOff] = useState(false);
  const [isPitchOff, setIsPitchOff] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);

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
    const minBrightness = 90;
    const maxBrightness = 180;
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
      if (faceBoundingBox) {
        const faceArea = faceBoundingBox.width * faceBoundingBox.height;
        const radiusX = Math.min(canvas.width, canvas.height) * 0.2;
        const radiusY = Math.min(canvas.width, canvas.height) * 0.25;
        const circleArea = Math.PI * radiusX * radiusY;
        const fillRatio = faceArea / circleArea;

        if (fillRatio < 0.99) {
          // tweak this number to make stricter
          setDistanceMessage("Move closer to fill the circle");
          allChecksPassForFrame = false; // prevent picture capture
        } else {
          setDistanceMessage(""); // face is big enough
        }
      }

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
      brightnessMessage,
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
            facingMode: "user",
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
        destructiveToast(error.message);
        if (error.message === "Permission denied") {
          setCameraPermission(true);
        }
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
  }, [open]); // Depend on 'open' to re-run effect when popup state changes

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

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.filter = "none";

            // --- START OVAL CLIP FOR UNBLURRED AREA AND DOTTED LINES ---
            ctx.save();
            const canvasCenterX = canvas.width / 2;
            const canvasCenterY = canvas.height / 2;
            const radiusX = Math.min(canvas.width, canvas.height) * 0.2;
            const radiusY = Math.min(canvas.width, canvas.height) * 0.25;

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

            // --- RESTORE THE OVAL CLIP ---
            ctx.restore();

            // --- Restore the initial horizontal flip ---
            ctx.restore();
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
          const PADDING = 0.2;

          const faceBoundingBox = {
            originX: Math.max(0, minX - (maxX - minX) * PADDING),
            originY: Math.max(0, minY - (maxY - minY) * PADDING),
            width: Math.min(
              canvas.width - minX,
              (maxX - minX) * (1 + 2 * PADDING)
            ),
            height: Math.min(
              canvas.height - minY,
              (maxY - minY) * (1 + 2 * PADDING)
            ),
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

            const imageData = croppedCanvas.toDataURL("image/jpeg");
            if (imageData) {
              onCapture(imageData); // send image back to main page

              //  Turn off the camera automatically after capture
              if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject
                  .getTracks()
                  .forEach((track) => track.stop());
                videoRef.current.srcObject = null;
              }
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
  ]);

  const handleClose = () => {
    //  Turn off the camera automatically after capture
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
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
  return loading ? (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <div className="flex flex-col items-center">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          width={60}
          height={60}
        >
          <defs>
            <linearGradient
              id="greenYellowGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stop-color="#D4B038" />
              <stop offset="50%" stop-color="#D4B038" />
              <stop offset="50%" stop-color="#02331E" />
              <stop offset="100%" stop-color="#02331E" />
            </linearGradient>
          </defs>

          <path
            fill="url(#greenYellowGradient)"
            d="M20.27,4.74a4.93,4.93,0,0,1,1.52,4.61,5.32,5.32,0,0,1-4.1,4.51,5.12,5.12,0,0,1-5.2-1.5,5.53,5.53,0,0,0,6.13-1.48A5.66,5.66,0,0,0,20.27,4.74ZM12.32,11.53a5.49,5.49,0,0,0-1.47-6.2A5.57,5.57,0,0,0,4.71,3.72,5.17,5.17,0,0,1,9.53,2.2,5.52,5.52,0,0,1,13.9,6.45,5.28,5.28,0,0,1,12.32,11.53ZM19.2,20.29a4.92,4.92,0,0,1-4.72,1.49,5.32,5.32,0,0,1-4.34-4.05A5.2,5.2,0,0,1,11.6,12.5a5.6,5.6,0,0,0,1.51,6.13A5.63,5.63,0,0,0,19.2,20.29ZM3.79,19.38A5.18,5.18,0,0,1,2.32,14a5.3,5.3,0,0,1,4.59-4,5,5,0,0,1,4.58,1.61,5.55,5.55,0,0,0-6.32,1.69A5.46,5.46,0,0,0,3.79,19.38ZM12.23,12a5.11,5.11,0,0,0,3.66-5,5.75,5.75,0,0,0-3.18-6,5,5,0,0,1,4.42,2.3,5.21,5.21,0,0,1,.24,5.92A5.4,5.4,0,0,1,12.23,12ZM11.76,12a5.18,5.18,0,0,0-3.68,5.09,5.58,5.58,0,0,0,3.19,5.79c-1,.35-2.9-.46-4-1.68A5.51,5.51,0,0,1,11.76,12ZM23,12.63a5.07,5.07,0,0,1-2.35,4.52,5.23,5.23,0,0,1-5.91.2,5.24,5.24,0,0,1-2.67-4.77,5.51,5.51,0,0,0,5.45,3.33A5.52,5.52,0,0,0,23,12.63ZM1,11.23a5,5,0,0,1,2.49-4.5,5.23,5.23,0,0,1,5.81-.06,5.3,5.3,0,0,1,2.61,4.74A5.56,5.56,0,0,0,6.56,8.06,5.71,5.71,0,0,0,1,11.23Z"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              dur="1.5s"
              values="0 12 12;360 12 12"
              repeatCount="indefinite"
            />
          </path>
        </svg>

        <p className="font-medium text-[#02331E]">
          {" "}
          Almost there,we’ll have your personalised tips in a sec
        </p>
      </div>
    </div>
  ) : (
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
                <div className="absolute inset-0 flex items-center justify-center bg-[#FAFAFA] bg-opacity-75 text-white text-lg">
                  <motion.div
                    className="absolute w-full h-0.5 bg-yellow-400"
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <Camera size={30} color="black" />
                </div>
              )}

              {isCapturing && countdown > 0 && (
                <p className="absolute font-semibold text-[17px] top-10 text-white [text-shadow:_0_0_3px_#000,_0_0_5px_#000]">
                  Hold still for {countdown}
                </p>
              )}

              {(isCapturing && faceDown) ||
              faceUp ||
              faceRight ||
              faceLeft > 0 ? (
                <p className="absolute font-semibld text-[17px] top-10 text-white [text-shadow:_0_0_3px_#000,_0_0_5px_#000]">
                  Follow the arrows to adjust your face
                </p>
              ) : (
                <p className="absolute font-semibold text-[17px] top-10 text-white [text-shadow:_0_0_3px_#000,_0_0_5px_#000]">
                  {brightnessMessage || distanceMessage}
                </p>
              )}
              {isCapturing &&
                !faceDown &&
                !faceUp &&
                !faceRight &&
                !faceLeft &&
                !brightnessMessage &&
                !distanceMessage &&
                countdown === 0 && (
                  <p className="absolute font-semibold text-[17px] top-10 text-white [text-shadow:_0_0_3px_#000,_0_0_5px_#000]">
                    Face is not centered
                  </p>
                )}

              {isCapturing && (
                <div
                  className="relative z-50 rounded-full border-2 border-white pointer-events-none"
                  style={{
                    width: "200px",
                    height: "250px",
                    borderRadius: "50%",
                  }}
                >
                  {/* Dotted Lines */}
                  {isPitchOff && (
                    <div
                      className="absolute w-full flex justify-start border-t-2 border-dotted border-white opacity-80"
                      style={{
                        top: "50%",
                        left: "0%",
                        right: "10%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}

                  {isYawOff && (
                    <div
                      className="absolute h-full border-l-2 border-dotted border-white opacity-80"
                      style={{
                        left: "50%",
                        top: "0%",
                        bottom: "10%",
                        transform: "translateX(-50%)",
                      }}
                    />
                  )}

                  {/* Directional Guides Container - Now properly positioned */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Down Arrow */}
                    {faceUp && (
                      <motion.div
                        key="arrow-down"
                        initial={{ y: "-20%", opacity: 0 }}
                        animate={{
                          y: ["-20%", "0%", "-20%"],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                        className="absolute pointer-events-none z-50"
                        style={{
                          top: "0%", // Position from top of circle
                          left: "41%",
                          transform: "translateX(-50%)", // Center horizontally
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
                        initial={{ y: "20%", opacity: 0 }}
                        animate={{
                          y: ["20%", "0%", "20%"],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                        className="absolute pointer-events-none z-50"
                        style={{
                          bottom: "0%", // Position from top of circle
                          left: "41%",
                          transform: "translateX(-50%)", // Center horizontally
                        }}
                      >
                        <ChevronsUp
                          size={35}
                          className="text-[#F5F5F5] drop-shadow-xl"
                        />
                      </motion.div>
                    )}

                    {/* Right Arrow */}
                    {faceLeft && (
                      <motion.div
                        key="arrow-right"
                        initial={{ x: "-20%", opacity: 0 }}
                        animate={{
                          x: ["-20%", "0%", "-20%"],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                        className="absolute pointer-events-none z-50"
                        style={{
                          top: "43%",
                          left: "0%", // Position from left of circle
                          transform: "translateY(-50%)", // Center vertically
                        }}
                      >
                        <ChevronsRight
                          size={35}
                          className="text-[#F5F5F5] drop-shadow-xl"
                        />
                      </motion.div>
                    )}

                    {/* Left Arrow */}
                    {faceRight && (
                      <motion.div
                        key="arrow-left"
                        initial={{ x: "20%", opacity: 0 }}
                        animate={{
                          x: ["20%", "0%", "20%"],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                        className="absolute pointer-events-none z-50"
                        style={{
                          top: "43%",
                          right: "0%", // Position from left of circle
                          transform: "translateY(-50%)", // Center vertically
                        }}
                      >
                        <ChevronsLeft
                          size={35}
                          className="text-[#F5F5F5] drop-shadow-xl"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* The rest of the UI (messages and buttons) that are removed */}
          </motion.div>
        </motion.div>
      )}
      <CameraPermissionModal
        isOpen={cameraPermission}
        setIsOpen={setCameraPermission}
      />
    </AnimatePresence>
  );
}
