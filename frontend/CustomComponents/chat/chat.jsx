"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, ExternalLink, Loader2 } from "lucide-react";
import Footer from "@/CustomComponents/Footer/Footer";
import ReactMarkdown from "react-markdown";
import useAuthStore from "@/store/authStore";
import SettingsHeader from "../settingsHeader/settingsHeader";
import { cn, isUserLoggedIn, incrementGuestMessageCount } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Api } from "@/shared/api/api";
import { useWebSocketContext } from "@/app/providers/chatProvider";

function ConsultationChatComponent({ route, title, initialMessage }) {
  const { token, isAuthenticated } = useAuthStore();
  const [message, setMessage] = useState("");
  const {
    messages,
    isTyping,
    isReady,
    sendMessage,
    setMessages,
    connectionStatus,
  } = useWebSocketContext();
  const [isMounted, setIsMounted] = useState(false);
  const textareaRef = useRef(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Map route to chat type
  const getChatTypeFromRoute = (route) => {
    const routeTypeMap = {
      "trend-analysis": "trend_analysis",
      skincare: "skincare",
      "check-ingredients": "ingredient_checker",
      "treatment-planning": "treatment_planning",
      makeup: "makeup",
      "makeup-tools": "makeup_tools",
      "makeup-looks": "makeup_looks",
      "makeup-products": "makeup_products",
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
          !response.content.startsWith("You are ") && !response.content.includes("Sagee")
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
    if (!token && !route) return;
    setIsLoadingHistory(true);
    try {
      const historyData = await Api.client.getChatHistory(token, {
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

  useEffect(() => {
    setIsLoading(true);
    const loadProfile = async () => {
      try {
        const profileData = await Api.client.getProfile(token);
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
  }, [token, isAuthenticated]);

  const handleInitialMessage = () => {
    if (!token && initialMessage && messages.length === 0) {
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

  // Load chat history when component mounts or route changes
  useEffect(() => {
    if (isMounted && token && route) {
      setMessages([]);
      loadChatHistory();
    }
  }, [token, route, isMounted]);

  useEffect(() => {
    if (isMounted) {
      handleInitialMessage();
    }
  }, [isMounted, initialMessage, token]);

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

    if (!isUserLoggedIn(token)) {
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
        <div className="relative flex items-center space-x-3 bg-gray-100 rounded-[20px] px-4 min-h-[44px]">
          <textarea
            ref={textareaRef}
            type="text"
            placeholder="Message"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={!isReady}
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
            disabled={!message.trim() || connectionStatus !== "connected"}
            className="p-2 text-green-600 hover:bg-green-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ConsultationChatComponent;
