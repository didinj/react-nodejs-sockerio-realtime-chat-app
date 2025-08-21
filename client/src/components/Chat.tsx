import { useState, useEffect } from "react";
import socket from "../socket";

interface Message {
  user: string;
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Listen for new messages
    socket.on("chat message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup when component unmounts
    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && username.trim()) {
      const msg: Message = { user: username, text: input };
      socket.emit("chat message", msg);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Username input */}
      {!username && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto border p-4 rounded bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <strong>{msg.user}: </strong>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded flex-1"
          disabled={!username}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-yellow px-4 py-2 rounded disabled:opacity-50"
          disabled={!username}
        >
          Send
        </button>
      </div>
    </div>
  );
}
