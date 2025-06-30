"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, ExternalLink, X } from "lucide-react";
import { useForm as useFormHook } from "react-hook-form";
import Footer from "@/CustomComponents/Footer/Footer";
import ReactMarkdown from "react-markdown";
import useAuthStore from "@/store/authStore";
import SettingsHeader from "../settingsHeader/settingsHeader";
import BeautyQuizPopup from "../quizzPopup/QuizzPopup";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { setAuthToken } from "@/shared/utils/utils";
import { Api } from "@/shared/api/api";
import useFormToast from "../FormToast/FormToast";
import ThanksPopup from "../thanksPopup/thanksPopup";

const formSchema = z.object({
  email: z.string().refine(
    (value) => {
      // Email regex pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Phone regex pattern (supports various formats)
      const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;

      return (
        emailPattern.test(value) ||
        phonePattern.test(value.replace(/[\s\-\(\)]/g, ""))
      );
    },
    {
      message: "Please enter a valid email address or phone number.",
    }
  ),
});

export default function ConsultationChat({ route, title, initialMessage }) {
  const { userId } = useAuthStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [showBeautyQuiz, setShowBeautyQuiz] = useState(false);
  const [showThanksPopup, setShowThanksPopup] = useState(false);
  const [quizResults, setQuizResults] = useState({
    skin_type: "",
    concern: "",
  });
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const { primaryToast, destructiveToast } = useFormToast();

  const form = useFormHook({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      const data = await Api.client.signIn(values);
      if (data.user_id) {
        useAuthStore.getState().setUserId(data.user_id);
        await setAuthToken(data.user_id);
        window.localStorage.setItem("sagee_user_id", data.user_id);
        setShowLoginPopup(false);
        primaryToast({ description: "Login successful" });
      }
    } catch (error) {
      destructiveToast(error.message);
    }
  }

  // Function to check if user is logged in - FIXED VERSION
  const isUserLoggedIn = () => {
    // Return false if we're on server side
    if (typeof window === "undefined") return false;

    // Check if userId exists in Zustand store
    if (userId) return true;

    // Check window.localStorage for user ID, but make sure it's not just a guest ID
    const storedUserId = window.localStorage.getItem("sagee_user_id");
    const authToken =
      window.localStorage.getItem("authToken") ||
      document.cookie.includes("authToken");

    // Only consider logged in if we have both a user ID and auth token
    if (storedUserId && authToken && !storedUserId.startsWith("user-")) {
      return true;
    }

    return false;
  };

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
    // Load message count from window.localStorage after mounting
    if (!isUserLoggedIn()) {
      const savedCount = window.localStorage.getItem(
        "sagee_guest_message_count"
      );
      if (savedCount) {
        setUserMessageCount(parseInt(savedCount, 10));
      }
    } else {
      // Clear the count when user is logged in
      window.localStorage.removeItem("sagee_guest_message_count");
      setUserMessageCount(0);
    }
  }, [userId]);

  useEffect(() => {
    // Handle initial message when component mounts
    if (initialMessage && messages.length === 0) {
      const initialMsg = {
        id: Date.now(),
        sender: "Consultant",
        content: initialMessage,
        timestamp: new Date(),
        type: "received",
      };

      // Add the initial message immediately
      setMessages([initialMsg]);
    }
  }, [initialMessage, messages.length]);

  // Handle logout - reset to guest state
  useEffect(() => {
    if (isMounted && !isUserLoggedIn()) {
      // User is not logged in, ensure guest message count is loaded
      const savedCount = window.localStorage.getItem(
        "sagee_guest_message_count"
      );
      if (savedCount) {
        setUserMessageCount(parseInt(savedCount, 10));
      } else {
        setUserMessageCount(0);
      }
    }
  }, [userId, isMounted]);

  // Save message count to window.localStorage whenever it changes
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      if (!isUserLoggedIn()) {
        window.localStorage.setItem(
          "sagee_guest_message_count",
          userMessageCount.toString()
        );
      } else {
        // Clear the count when user logs in
        window.localStorage.removeItem("sagee_guest_message_count");
        setUserMessageCount(0);
      }
    }
  }, [userMessageCount, userId, isMounted]);

  // Check user profile and determine if beauty quiz is needed
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!isMounted) return;
      if (userId) {
        // User is logged in - check their profile
        try {
          const profileData = await Api.client.getProfile(userId);
          // Check if user has skin_type and concern
          const hasValidSkinType =
            profileData?.skin_type && profileData.skin_type !== "Unknown";
          const hasValidConcern =
            profileData?.concern && profileData.concern !== "Unknown";

          if (!hasValidSkinType || !hasValidConcern) {
            setShowBeautyQuiz(true);
          } else {
            console.log("User has complete profile, no quiz needed");
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          // If we can't load profile, show quiz to be safe
          setShowBeautyQuiz(true);
        }
      } else {
        // User is not logged in - check localStorage for guest quiz results
        const guestQuizResults = localStorage.getItem(
          "sagee_guest_quiz_results"
        );
        const hasShownThanks = localStorage.getItem(
          "sagee_has_shown_thanks_popup"
        );

        if (!guestQuizResults) {
          setShowBeautyQuiz(true);
        } else {
          // Guest has completed quiz, show thanks popup with their results
          const results = JSON.parse(guestQuizResults);
          setQuizResults(results);
          // Only show thanks popup if we haven't shown it yet (check localStorage flag)
          if (!hasShownThanks) {
            setShowThanksPopup(true);
            localStorage.setItem("sagee_has_shown_thanks_popup", "true");
          }
        }
      }
    };

    checkUserProfile();
  }, [userId, isMounted]);

  // Handle saving guest quiz results when user logs in
  useEffect(() => {
    const saveGuestQuizResults = async () => {
      if (userId && isMounted) {
        const guestQuizResults = localStorage.getItem(
          "sagee_guest_quiz_results"
        );
        if (guestQuizResults) {
          try {
            const results = JSON.parse(guestQuizResults);
            const updateData = {
              skin_type: results.skin_type,
              concern: results.concern,
            };

            await Api.client.updateProfile(updateData, userId);

            // Clear guest quiz results from localStorage
            localStorage.removeItem("sagee_guest_quiz_results");
            localStorage.removeItem("sagee_has_shown_thanks_popup");

            // Update local profile state
            setQuizResults(results);
          } catch (error) {
            console.error("Error saving guest quiz results:", error);
          }
        }
      }
    };

    saveGuestQuizResults();
  }, [userId, isMounted]);

  const getUserId = () => {
    let uid = window.localStorage.getItem("sagee_user_id");
    if (!uid) {
      uid = `user-${Date.now()}`;
      window.localStorage.setItem("sagee_user_id", uid);
    }
    return uid;
  };

  // Function to detect and format URLs in text
  const formatMessageContent = (content) => {
    // Regex to detect URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split content by URLs while keeping the URLs
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
          >
            {part}
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      }
      return part;
    });
  };

  // Function to detect if content contains image URLs
  const detectImages = (content) => {
    const imageRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))/gi;
    return content.match(imageRegex) || [];
  };

  // Function to render message content with images and links
  const renderMessageContent = (content) => {
    const images = detectImages(content);

    if (images.length > 0) {
      // Remove image URLs from text content
      let textContent = content;
      images.forEach((img) => {
        textContent = textContent.replace(img, "").trim();
      });

      return (
        <div className="space-y-3">
          {/* Render text content with links if any */}
          {textContent && (
            <div className="leading-relaxed">
              {formatMessageContent(textContent)}
            </div>
          )}

          {/* Render images */}
          {images.map((imageUrl, index) => (
            <div key={index} className="space-y-2">
              <img
                src={imageUrl}
                alt={`Shared image ${index + 1}`}
                className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
                style={{ maxHeight: "300px" }}
                onError={(e) => {
                  e.target.style.display = "none";
                  // Show fallback link if image fails to load
                  const fallbackLink = document.createElement("a");
                  fallbackLink.href = imageUrl;
                  fallbackLink.target = "_blank";
                  fallbackLink.rel = "noopener noreferrer";
                  fallbackLink.className =
                    "text-blue-600 hover:text-blue-800 underline";
                  fallbackLink.textContent = "View Image";
                  e.target.parentNode.appendChild(fallbackLink);
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    // If no images, just format text with links
    return (
      <div className="leading-relaxed">{formatMessageContent(content)}</div>
    );
  };

  useEffect(() => {
    // Don't connect WebSocket on server side
    if (typeof window === "undefined") return;

    const connectWebSocket = () => {
      try {
        const userId = getUserId();
        if (!userId) return;
        ws.current = new WebSocket(`ws://${process.env.NEXT_PUBLIC_BASE_URL}/ws/${route}/${userId}`);

        ws.current.onopen = () => {
          setConnectionStatus("connected");
        };

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "typing") {
            setIsTyping(true);
          } else if (data.type === "typing_stop") {
            setIsTyping(false);
          } else if (data.type === "message") {
            const newMessage = {
              id: Date.now(),
              sender: data.sender || "Consultant",
              content: data.content,
              timestamp: new Date(),
              type: "received",
            };
            setMessages((prev) => [...prev, newMessage]);
            setIsTyping(false);
          }
        };

        ws.current.onclose = () => {
          console.log("WebSocket disconnected");
          setConnectionStatus("disconnected");
          setTimeout(connectWebSocket, 3000);
        };

        ws.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          setConnectionStatus("error");
        };
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
        setConnectionStatus("error");
      }
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [route]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (
      message.trim() &&
      ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      // Check if user is logged in
      if (!isUserLoggedIn()) {
        const newCount = userMessageCount + 1;
        setUserMessageCount(newCount);

        // If user has sent 3 messages, show login popup
        if (newCount >= 3) {
          setShowLoginPopup(true);
          return;
        }
      }

      const userMessage = {
        id: Date.now(),
        sender: "Olivia",
        content: message.trim(),
        timestamp: new Date(),
        type: "sent",
      };
      setMessages((prev) => [...prev, userMessage]);

      ws.current.send(
        JSON.stringify({
          type: "message",
          content: message.trim(),
          sender: "user",
          timestamp: new Date().toISOString(),
        })
      );

      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const canSendMessage = () => {
    if (isUserLoggedIn()) return true; // Logged in users can send unlimited messages
    return userMessageCount < 3; // Non-logged in users limited to 3 messages
  };

  // Handle beauty quiz completion
  const handleQuizCompletion = (results) => {
    console.log("Beauty quiz completed with results:", results);
    setQuizResults(results);
    setShowBeautyQuiz(false);
    setShowThanksPopup(true);
    localStorage.setItem("sagee_has_shown_thanks_popup", "true");
  };

  // Handle thanks popup close
  const handleThanksPopupClose = () => {
    console.log("Thanks popup closed");
    setShowThanksPopup(false);
  };

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col max-w-md mx-auto">
        <div className="sticky top-0 z-10 inset-0">
          <SettingsHeader title={title} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col max-w-md mx-auto">
      <div className="sticky top-0 z-10 inset-0">
        <SettingsHeader title={title} />
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "sent" ? "justify-end" : "items-start"} space-x-3`}
          >
            {msg.type === "received" && (
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
              </div>
            )}

            <div
              className={`flex-1 ${msg.type === "sent" ? "flex flex-col items-end" : ""}`}
            >
              <div
                className={`text-sm font-medium mb-1 ${msg.type === "sent" ? "text-orange-500 mr-2" : "text-gray-900"}`}
              >
                {msg.sender}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 text-gray-800 text-sm leading-relaxed max-w-xs ${msg.type === "sent" ? "bg-yellow-100 rounded-tr-md" : "bg-green-100 rounded-tl-md"}`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {msg.type === "sent" && (
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 mb-1">
                Consultant
              </div>
              <div className="bg-green-100 rounded-2xl rounded-tl-md px-4 py-3 text-gray-600 text-sm italic flex items-center space-x-1">
                <span>Typing</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 p-4 sticky inset-0  ">
        {!isUserLoggedIn() && isMounted && (
          <div className="mb-3 text-center">
            <span className="text-sm text-gray-600">
              Messages: {userMessageCount}/3
            </span>
            {userMessageCount >= 3 && (
              <p className="text-xs text-red-500 mt-1">
                Please log in to continue chatting
              </p>
            )}
          </div>
        )}

        <div className="flex  items-center space-x-3 bg-gray-100 rounded-full px-4 py-3">
          <input
            type="text"
            placeholder={
              !isUserLoggedIn() && isMounted && userMessageCount >= 3
                ? "Please log in to continue"
                : "Message"
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!canSendMessage() || connectionStatus !== "connected"}
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={
              !message.trim() ||
              connectionStatus !== "connected" ||
              !canSendMessage()
            }
            className="p-2 text-green-600 hover:bg-green-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Login Popup Modal */}
      {showLoginPopup && (
        <div className="fixed inset-0   flex items-end bottom-[78px] justify-center z-50">
          <div className=" bg-white p-6 w-full">
            <div className="text-center mb-3">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col w-full"
                >
                  <div className="flex flex-col gap-2 w-full">
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="mb-3  rounded-[8px] border-[#02331E66] border w-full text-[#363636] "
                                placeholder="Email or Phone Number (starts with eg +123)"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />{" "}
                    </div>
                  </div>

                  <Button
                    className={cn(
                      "flex justify-center text-[16px] w-full py-5 font-semibold bg-[#02331E] text-white rounded-[24px] hover:bg-[#02331E]"
                    )}
                    type="submit"
                  >
                    Sign Up
                  </Button>
                </form>
              </Form>

              <div className="w-full py-2 px-4 text-[#02331E] mt-3 rounded-[10px] bg-[#E8F0F2] text-start">
                Free signup to unlock message
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <BeautyQuizPopup
        isOpen={showBeautyQuiz}
        setIsOpen={setShowBeautyQuiz}
        onComplete={handleQuizCompletion}
      />
      <ThanksPopup
        isOpen={showThanksPopup}
        onClose={handleThanksPopupClose}
        skinType={quizResults.skin_type || "combination"}
        skinConcern={quizResults.concern || "acne and dark spots"}
      />
    </div>
  );
}
