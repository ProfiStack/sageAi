"use client";

import React, {
  createContext,
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import useAuthStore from "@/store/authStore";
import { Api } from "@/shared/api/api";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, route }) => {
  const { userId, token } = useAuthStore();

  const ws = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [isReady, setIsReady] = useState(false);

  // Loading state for history
  const loadingHistory = useRef(false);
  // Queue incoming messages while loading history
  const queuedMessages = useRef([]);

  const socketUrl =
    typeof window !== "undefined" && userId && route
      ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${process.env.NEXT_PUBLIC_BASE_URL}/ws/${route}/${userId}`
      : null;

  // Function to load chat history and set messages
  const loadHistory = useCallback(async () => {
    if (!token) return;

    loadingHistory.current = true;

    try {
      const historyData = await Api.client.getChatHistory(token);

      // Convert history data to messages format here or inside component if preferred
      // For demo, just set raw history or empty array
      const currentChatType = route; // or map route to type if needed

      // Simple conversion example (customize as per your logic)
      const convertedMessages = (historyData?.history || [])
        .filter((item) => item.type === currentChatType)
        .flatMap((item) =>
          (item.response || []).map((resp, idx) => ({
            id: `history-${item.id}-${idx}`,
            sender: resp.role === "user" ? "User" : "Consultant",
            content: resp.content,
            timestamp: new Date(item.timestamp),
            type: resp.role === "user" ? "sent" : "received",
            isFromHistory: true,
          }))
        );

      setMessages(convertedMessages);

      // After loading history, flush queued messages
      if (queuedMessages.current.length > 0) {
        setMessages((prev) => [...prev, ...queuedMessages.current]);
        queuedMessages.current = [];
      }
    } catch (error) {
      console.error("Error loading chat history in provider:", error);
      setMessages([]); // fallback
    } finally {
      loadingHistory.current = false;
    }
  }, [token, route]);

  useEffect(() => {
    if (!token || !route) return;

    let retryTimeout = null;

    const connect = () => {
      if (ws.current) {
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onerror = null;
        ws.current.onclose = null;
        ws.current.close();
        ws.current.close();
        ws.current = null;
      }

      ws.current = new WebSocket(socketUrl);

      ws.current.onopen = () => {
        setIsReady(true);
        setConnectionStatus("connected");
        queuedMessages.current.forEach((msg) =>
          ws.current.send(JSON.stringify(msg))
        );
        queuedMessages.current = [];
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
        setConnectionStatus("disconnected");
        setIsReady(false);
        setIsTyping(false);
        ws.current = null;
        retryTimeout = setTimeout(connect, 3000); // reconnect in 3s
      };

      ws.current.onerror = (err) => {
        setConnectionStatus("error");
        console.error("WebSocket error:", err);
        if (ws.current) {
          ws.current.close();
        }
      };
    };

    connect();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (ws.current) {
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onerror = null;
        ws.current.onclose = null;
        ws.current.close();
        ws.current = null;
      }
    };
  }, [token, route, socketUrl, loadHistory]);
  useEffect(() => {
    setMessages([]); // Clear messages on route change
    setIsTyping(false);
  }, [route]);

  // Send message helper
  const sendMessage = (msg) => {
    if (!msg) {
      console.warn("sendMessage called without msg");
      return;
    }
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket not ready, queuing message");
      queuedMessages.current.push(msg);
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        messages,
        isTyping,
        connectionStatus,
        sendMessage,
        isReady,
        loadHistory,
        setMessages, // expose cautiously if needed
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
