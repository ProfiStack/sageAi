"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, ExternalLink, X, Loader2 } from "lucide-react";
import { useForm as useFormHook } from "react-hook-form";
import Footer from "@/CustomComponents/Footer/Footer";
import ReactMarkdown from "react-markdown";
import useAuthStore from "@/store/authStore";
import SettingsHeader from "../settingsHeader/settingsHeader";
import BeautyQuizPopup from "../Popups/QuizzPopup";
import {
  cn,
  isUserLoggedIn,
  incrementGuestMessageCount,
  resetGuestMessageCount,
} from "@/lib/utils";
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
import { setAuthToken, setLoginTimestamp } from "@/shared/utils/utils";
import { Api } from "@/shared/api/api";
import useFormToast from "../FormToast/FormToast";
import {
  WebSocketProvider,
  useWebSocketContext,
} from "@/app/providers/chatProvider";
import { useAmplitude } from "@/app/providers/amplitudeProvider";

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

function ConsultationChatComponent({ route, title, initialMessage }) {
  const { userId, isAuthenticated } = useAuthStore();
  const [message, setMessage] = useState("");
  const {
    messages,
    isTyping,
    isReady,
    sendMessage,
    setMessages,
    connectionStatus,
  } = useWebSocketContext();
  const { logEvent } = useAmplitude();
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const textareaRef = useRef(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { primaryToast, destructiveToast } = useFormToast();

  // Map route to chat type
  const getChatTypeFromRoute = (route) => {
    const routeTypeMap = {
      "trend-analysis": "trend_analysis",
      skincare: "skincare",
      "check-ingredients": "ingredient_checker",
      "treatment-planning": "treatment_planning",
    };
    return routeTypeMap[route] || route;
  };

  // Convert chat history to message format
  const convertHistoryToMessages = (historyData, currentChatType) => {
    if (!historyData || !historyData.history) return [];

    const relevantHistory = [...historyData.history];
    const convertedMessages = [];

    relevantHistory.forEach((historyItem, historyIndex) => {
      const responses = historyItem.response || [];
      responses.forEach((response, responseIndex) => {
        if (response.role === "user") {
          convertedMessages.push({
            id: `history-${historyIndex}-${responseIndex}-user`,
            sender: "User",
            content: response.content,
            timestamp: new Date(historyItem.timestamp),
            type: "sent",
            isFromHistory: true,
          });
        } else if (
          response.role === "system" &&
          response.content &&
          !response.content.startsWith("You are ")
        ) {
          convertedMessages.push({
            id: `history-${historyIndex}-${responseIndex}-system`,
            sender: "Consultant",
            content: response.content,
            timestamp: new Date(historyItem.timestamp),
            type: "received",
            isFromHistory: true,
          });
        }
      });
    });

    return convertedMessages.sort((a, b) => a.timestamp - b.timestamp);
  };

  // Load chat history
  const loadChatHistory = async () => {
    if (!userId && !route) return;
    setIsLoadingHistory(true);
    try {
      const historyData = await Api.client.getChatHistory(userId, {
        feature_type: route,
      });

      const currentChatType = getChatTypeFromRoute(route);
      const historyMessages = convertHistoryToMessages(
        historyData,
        currentChatType
      );
      const initialMsg = initialMessage
        ? {
            id: `initial-${Date.now()}`,
            sender: "Consultant",
            content: initialMessage,
            timestamp: new Date(),
            type: "received",
            isFromHistory: false,
          }
        : null;

      const allMessages = [];

      if (initialMsg) {
        allMessages.push(initialMsg);
      }

      if (historyMessages.length > 0) {
        allMessages.push(...historyMessages);
      }

      if (allMessages.length > 0) {
        setMessages(allMessages);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      if (initialMessage) {
        const initialMsg = {
          id: `initial-${Date.now()}`,
          sender: "Consultant",
          content: initialMessage,
          timestamp: new Date(),
          type: "received",
          isFromHistory: false,
        };
        setMessages([initialMsg]);
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const form = useFormHook({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setIsLoading(true);
    const loadProfile = async () => {
      try {
        const profileData = await Api.client.getProfile(userId);
        if (profileData?.name) {
          setUserName(profileData.name);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId, isAuthenticated]);

  async function onSubmit(values) {
    try {
      logEvent("Onboard Option Clicked", {
        click_value: "Sign Up",
        click_location: "Chat",
      });
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
      const transformedValues = {
        name: values.name,
        ...(isEmail ? { email: values.email } : { phone_number: values.email }),
      };
      const data = await Api.client.signIn(transformedValues);
      if (data.user_id) {
        await setLoginTimestamp(Date.now());
        await setAuthToken(data.user_id);
        window.localStorage.setItem("sagee_user_id", data.user_id);
        const store = useAuthStore.getState();
        store.setUserId(data.user_id);
        store.setToken(data.user_id);
        store.setIsAuthenticated(true);
        resetGuestMessageCount();
        setUserMessageCount(0);
        primaryToast({ description: "Login successful" });
        transferGuestQuizResults(data.user_id);
      }
    } catch (error) {
      destructiveToast(error.message);
    }
  }
  // Transfer guest quiz results to user profile
  const transferGuestQuizResults = async (userId) => {
    try {
      if (typeof window !== "undefined") {
        const guestQuizResults = localStorage.getItem(
          "sagee_guest_quiz_results"
        );

        if (guestQuizResults) {
          const { skin_type, concern } = JSON.parse(guestQuizResults);

          if (skin_type || concern) {
            // Update user profile with guest quiz results
            const updateData = {
              skin_type: skin_type || "",
              concern: concern || "",
            };

            await Api.client.updateProfile(updateData, userId);

            // Remove guest quiz results from localStorage
            localStorage.removeItem("sagee_guest_quiz_results");
          }
        }
      }
    } catch (error) {
      console.error("Error transferring guest quiz results:", error);
      // Don't block login if transfer fails
    }
  };

  const handleInitialMessage = () => {
    if (!userId && initialMessage && messages.length === 0) {
      const initialMsg = {
        id: `initial-${Date.now()}`,
        sender: "Consultant",
        content: initialMessage,
        timestamp: new Date(),
        type: "received",
        isFromHistory: false,
      };
      setMessages([initialMsg]);
    }
  };

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
    // Load message count from window.localStorage after mounting
    if (!isUserLoggedIn(userId)) {
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

  // Load chat history when component mounts or route changes
  useEffect(() => {
    if (isMounted && userId && route) {
      setMessages([]);
      loadChatHistory();
    }
  }, [userId, route, isMounted]);

  useEffect(() => {
    if (isMounted) {
      handleInitialMessage();
    }
  }, [isMounted, initialMessage, userId]);

  // Handle logout - reset to guest state
  useEffect(() => {
    if (isMounted && !isUserLoggedIn(userId)) {
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
      if (!isUserLoggedIn(userId)) {
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

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  // Add this function to reset height
  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "28px";
    }
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

  const handleSend = () => {
    if (!isReady) {
      console.warn("WebSocket not ready yet, skipping send");
      return;
    }

    if (!isUserLoggedIn(userId)) {
      const newCount = incrementGuestMessageCount();
      setUserMessageCount(newCount);
    }

    sendMessage({
      type: "message",
      content: message.trim(),
      sender:
        isAuthenticated && !isLoading && userName ? userName : "guest user",
      timestamp: new Date().toISOString(),
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender:
          isAuthenticated && !isLoading && userName ? userName : "guest user",
        content: message.trim(),
        timestamp: new Date(),
        type: "sent",
      },
    ]);
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSendMessage = () => {
    if (isUserLoggedIn(userId)) return true; // Logged in users can send unlimited messages
    return userMessageCount < 3; // Non-logged in users limited to 3 messages
  };

  // Add this useEffect to watch for message changes
  useEffect(() => {
    if (message === "") {
      resetTextareaHeight();
    }
  }, [message]);

  // Loading state
  if (!isMounted || isLoadingHistory) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col max-w-md mx-auto">
        <div className="sticky top-0 z-10 inset-0">
          <SettingsHeader title={title} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
            <div className="text-gray-500">
              {isLoadingHistory ? "Loading chat history..." : "Loading..."}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Connection status indicator
  const ConnectionIndicator = () => {
    if (isReady) return null;

    return (
      <div className="bg-orange-100 border-l-4 border-orange-500 p-3 mb-4">
        <div className="flex items-center">
          {connectionStatus === "disconnected" && (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-orange-500 mr-2" />
              <span className="text-sm text-orange-700">
                Connecting to consultant...
              </span>
            </>
          )}
          {connectionStatus === "error" && (
            <span className="text-sm text-red-700">
              Connection error. Retrying...
            </span>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col max-w-md mx-auto">
      <div className="sticky top-0 z-10 inset-0">
        <SettingsHeader title={title} />
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <ConnectionIndicator />

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
                {msg.type === "received"
                  ? "Consultant"
                  : isAuthenticated && !isLoading && userName
                    ? userName
                    : "guest user"}
              </div>
              <div
                className={`rounded-2xl overflow-x-hidden flex flex-wrap px-4 py-3 text-gray-800 text-sm leading-relaxed max-w-xs ${msg.type === "sent" ? "bg-yellow-100 rounded-tr-md" : "bg-green-100 rounded-tl-md"}`}
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

      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-[76px]  ">
        {!isUserLoggedIn(userId) && isMounted && (
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

        <div className="relative flex items-center space-x-3 bg-gray-100 rounded-[20px] px-4 min-h-[44px]">
          <textarea
            ref={textareaRef}
            type="text"
            placeholder={
              !isUserLoggedIn(userId) && isMounted && userMessageCount >= 3
                ? "Please log in to continue"
                : "Message"
            }
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={!canSendMessage() || !isReady}
            className="flex-1 bg-transparent border-none outline-none py-1 text-gray-700 placeholder-gray-500 disabled:opacity-50 resize-none overflow-hidden min-h-[28px] max-h-[200px]"
            rows={1}
            style={{
              height: "auto",
              minHeight: "28px",
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
          <button
            onClick={() => {
              handleSend();
              // Reset textarea height after sending
              resetTextareaHeight();
            }}
            disabled={
              !message.trim() ||
              connectionStatus !== "connected" ||
              !canSendMessage()
            }
            className="p-2 text-green-600 hover:bg-green-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Login Popup Modal */}
      {!isAuthenticated && userMessageCount >= 3 && (
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
    </div>
  );
}

export default ConsultationChatComponent;
