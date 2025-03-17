"use client";

import React, { useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const ChatWithWtfPDF: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    setLoading(true);

    // Append the user's message to the chat history
    const userMessage: ChatMessage = { role: "user", text: query };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();

      // Append the bot's reply to the chat history
      const botMessage: ChatMessage = {
        role: "assistant",
        text: data.response || "No response found",
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        text: "There was an error processing your request.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    }
    setQuery("");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
      <h2>Chat with Groq Bot</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "8px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "16px",
        }}
      >
        {chatHistory.map((msg, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            <strong>{msg.role === "user" ? "You:" : "Bot:"}</strong> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          style={{ flex: 1, marginRight: "8px", padding: "8px" }}
        />
        <button onClick={handleSend} disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatWithWtfPDF;
