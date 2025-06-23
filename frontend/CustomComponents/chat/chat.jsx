"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Footer from "@/CustomComponents/Footer/Footer";

export default function ConsultationChat({ route, title }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const getUserId = () => {
    let uid = localStorage.getItem("sagee_user_id");
    if (!uid) {
      uid = `user-${Date.now()}`;
      localStorage.setItem("sagee_user_id", uid);
    }
    return uid;
  };
  // WebSocket connection
  useEffect(() => {
    // Connect to WebSocket server (adjust URL as needed)
    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket(
          `ws://localhost:8000/ws/chat/${getUserId()}`
        );

        ws.current.onopen = () => {
          console.log("WebSocket connected");
          setConnectionStatus("connected");
        };

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log(data);
          if (data.type === "typing") {
            setIsTyping(true);
          } else if (data.type === "typing_stop") {
            setIsTyping(false);
          } else if (data.type === "message") {
            const newMessage = {
              id: Date.now(),
              sender: data.sender || "Dr. Willow",
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
          // Attempt to reconnect after 3 seconds
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

    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (
      message.trim() &&
      ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      // Add user message to chat
      const userMessage = {
        id: Date.now(),
        sender: "Olivia",
        content: message.trim(),
        timestamp: new Date(),
        type: "sent",
      };
      setMessages((prev) => [...prev, userMessage]);

      // Send message through WebSocket
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

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "disconnected":
        return "bg-red-500";
      case "error":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <ArrowLeft className="w-6 h-6 text-gray-700" />
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-1">
            <div
              className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}
            ></div>
            <span className="text-xs text-gray-500 capitalize">
              {connectionStatus}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-green-600 text-sm font-medium mr-2">
            SageAI
          </span>
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-green-600 rounded-sm transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
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
                className={`rounded-2xl px-4 py-3 text-gray-800 text-sm leading-relaxed max-w-xs ${
                  msg.type === "sent"
                    ? "bg-yellow-100 rounded-tr-md"
                    : "bg-green-100 rounded-tl-md"
                }`}
              >
                {msg.content}
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

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 mb-1">
                Dr. Willow
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

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-3">
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            // disabled={connectionStatus !== 'connected'}
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || connectionStatus !== "connected"}
            className="p-2 text-green-600 hover:bg-green-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Footer />
    </div>
  );
}
