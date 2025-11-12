import React, { createContext, useState, useEffect } from "react";
import run from "../config/gemini";
import { v4 as uuidv4 } from 'uuid'; // For unique IDs

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]); // Still used for displaying recent prompts in sidebar
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(""); // Still used for streaming response if needed
  const [chatSessions, setChatSessions] = useState([]); // Array of all chat sessions
  const [currentChatSessionId, setCurrentChatSessionId] = useState(null); // ID of the active chat session

  // Initialize a new chat session on component mount or when no session is active
  useEffect(() => {
    if (chatSessions.length === 0 || currentChatSessionId === null) {
      newChat();
    }
  }, []);

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput("");
    setResultData("");

    const newSessionId = uuidv4();
    const newSession = {
      id: newSessionId,
      title: "New Chat", // Default title, will be updated with first prompt
      messages: [],
    };
    setChatSessions((prev) => [...prev, newSession]);
    setCurrentChatSessionId(newSessionId);
  };

  const selectChatSession = (id) => {
    setCurrentChatSessionId(id);
    setShowResult(true); // Show result area when selecting a chat
    setLoading(false); // Ensure loading is false when switching
    setInput(""); // Clear input when switching
    // Optionally, set recentPrompt and resultData based on the selected chat's last message
    const selectedSession = chatSessions.find(session => session.id === id);
    if (selectedSession && selectedSession.messages.length > 0) {
      const lastUserMessage = selectedSession.messages.filter(msg => msg.role === 'user').pop();
      const lastGeminiMessage = selectedSession.messages.filter(msg => msg.role === 'gemini').pop();
      if (lastUserMessage) setRecentPrompt(lastUserMessage.text);
      if (lastGeminiMessage) setResultData(lastGeminiMessage.text);
    } else {
      setRecentPrompt("");
      setResultData("");
    }
  };

  const onSent = async (prompt) => {
    setLoading(true);
    setShowResult(true);
    setInput(""); // Clear input immediately

    let currentPrompt = prompt !== undefined ? prompt : input;
    setRecentPrompt(currentPrompt);

    // Update prevPrompts for sidebar display (first 18 chars of the first prompt in a session)
    setPrevPrompts((prev) => {
      const updatedPrevPrompts = [...prev];
      const currentSession = chatSessions.find(session => session.id === currentChatSessionId);
      if (currentSession && currentSession.messages.length === 0) {
        // Only add to prevPrompts if it's the first message of a new session
        updatedPrevPrompts.push({ id: currentChatSessionId, text: currentPrompt });
      }
      return updatedPrevPrompts;
    });

    // Add user's message to the current chat session
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === currentChatSessionId
          ? {
              ...session,
              title: session.title === "New Chat" ? currentPrompt.slice(0, 18) + "..." : session.title, // Update title with first prompt
              messages: [...session.messages, { role: "user", text: currentPrompt }],
            }
          : session
      )
    );

    // Add a placeholder for Gemini's response immediately
    const geminiPlaceholderId = uuidv4(); // Unique ID for the placeholder
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === currentChatSessionId
          ? {
              ...session,
              messages: [...session.messages, { id: geminiPlaceholderId, role: "gemini", text: "" }], // Placeholder
            }
          : session
      )
    );

    const response = await run(currentPrompt);

    // Update the placeholder with Gemini's actual response
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === currentChatSessionId
          ? {
              ...session,
              messages: session.messages.map(msg =>
                msg.id === geminiPlaceholderId ? { ...msg, text: response } : msg
              ),
            }
          : session
      )
    );

    setResultData(response); // Keep resultData for streaming response if needed
    setLoading(false);
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    input,
    setInput,
    showResult,
    loading,
    resultData,
    newChat,
    chatSessions, // Expose chatSessions
    currentChatSessionId, // Expose currentChatSessionId
    selectChatSession, // Expose selectChatSession
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
