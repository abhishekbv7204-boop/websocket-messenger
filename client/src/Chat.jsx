import { useState, useEffect, useRef } from "react";
import { Send, Users, Circle, Clock } from "lucide-react";
import { format } from "date-fns";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const scrollRef = useRef();
  const typingTimeoutRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date().toISOString(),
      };

      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { room, username, typing: true });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    socket.on("room_data", (data) => {
      setUserCount(data.userCount);
    });

    socket.on("user_typing", (data) => {
      if (data.typing) {
        setTypingUser(data.username);
        setIsTyping(true);
        
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("room_data");
      socket.off("user_typing");
    };
  }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList, isTyping]);

  return (
    <div className="w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
      {/* Header */}
      <div className="bg-primary-600 px-6 py-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Room: {room}</h2>
            <div className="flex items-center gap-2 text-primary-100 text-xs">
              <Circle className="w-2 h-2 fill-green-400 text-green-400 animate-pulse" />
              {userCount} {userCount === 1 ? 'user' : 'users'} online
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-primary-200 block uppercase tracking-wider font-semibold">User</span>
          <span className="font-medium">{username}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messageList.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400 italic">
            No messages yet. Start the conversation!
          </div>
        )}
        
        {messageList.map((messageContent, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              username === messageContent.author ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-xs font-bold text-gray-500">
                {messageContent.author}
              </span>
              <span className="text-[10px] text-gray-400">
                {format(new Date(messageContent.time), "HH:mm")}
              </span>
            </div>
            
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
                username === messageContent.author
                  ? "bg-primary-600 text-white rounded-tr-none"
                  : "bg-white text-gray-700 rounded-tl-none border border-gray-200"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{messageContent.message}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-gray-400 italic animate-bounce ml-2">
            <Circle className="w-1 h-1 fill-gray-400" />
            {typingUser} is typing...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={currentMessage}
            placeholder="Type your message..."
            className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-gray-700"
            onChange={(event) => {
              setCurrentMessage(event.target.value);
              handleTyping();
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!currentMessage.trim()}
            className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full shadow-lg shadow-primary-200 transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
