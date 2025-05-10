import { useContext } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
// import { ChatContext } from "../../context/ChatContext";
// import { AuthContext } from "../../context/AuthContext";

interface User {
  _id: string;
  name: string;
}

interface OnlineUser {
  userId: string;
}

const PotentialChats: React.FC = () => {
  const { user } = useAuth();
  const {
    potentialChats,
    createChat,
    onlineUsers
  } = useChat();
  

  return (
    <>
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((u: User, index: number) => {
            const isOnline = onlineUsers?.some(
              (onlineUserId: string) => onlineUserId === u?._id
            );
            return (
              <div
                className="single-user"
                key={index}
                onClick={() => user?._id && createChat(user._id, u._id)}
              >
                {u.name}
                <span className={isOnline ? "user-online" : ""}></span>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default PotentialChats;
