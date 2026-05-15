import { useState, useEffect } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
import { MessageSquare, User, DoorOpen } from "lucide-react";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", { room, username });
      setShowChat(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {!showChat ? (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01]">
          <div className="bg-primary-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-primary-100">Join a room to start chatting</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" /> Your Username
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                onChange={(event) => setUsername(event.target.value)}
                onKeyPress={(event) => event.key === "Enter" && joinRoom()}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <DoorOpen className="w-4 h-4" /> Room ID
              </label>
              <input
                type="text"
                placeholder="e.g. 1234"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                onChange={(event) => setRoom(event.target.value)}
                onKeyPress={(event) => event.key === "Enter" && joinRoom()}
              />
            </div>

            <button
              onClick={joinRoom}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-200 transform transition-all active:scale-95"
            >
              Join Room
            </button>
          </div>
          
          <div className="p-4 bg-gray-50 text-center text-xs text-gray-400 border-t">
            Built with React & Socket.IO
          </div>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
