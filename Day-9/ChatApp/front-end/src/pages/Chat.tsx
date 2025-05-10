import React,{ useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/PotentialChat";
import ChatBox from "../components/chat/ChatBox";

interface User {
  _id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface Chat {
  _id: string;
  members: string[];
  // Add other chat properties as needed
}

interface ChatContextType {
  userChats: Chat[] | null;
  isUserChatsLoading: boolean;
  updateCurrentChat: (chat: Chat) => void;
}

const Chat = () => {
    const { user } = useContext(AuthContext) as { user: User | null };
    const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext) as ChatContextType;

    return (
        <Container>
            <Stack 
                direction="horizontal" 
                style={{
                    width: "100%", 
                    height: "4rem",
                    paddingTop: "1rem", 
                    alignItems: "center", 
                    paddingLeft: "1rem", 
                    borderRadius: "0.5rem", 
                    borderBottom: "1px solid rgb(100, 100, 100)",
                    borderTop: "1px solid rgb(100, 100, 100)", 
                    borderRight: "1px solid rgb(100, 100, 100)", 
                    borderLeft: "1px solid rgb(100, 100, 100)"
                }}
            >
                <p>Users</p>
                <div><PotentialChats/></div>
            </Stack>
            
            {userChats?.length && userChats.length > 0 ? (
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={4} style={{paddingTop:"1rem"}}>
                        {isUserChatsLoading && <p>Loading Chats...</p>}
                        {userChats?.map((chat: Chat, index: number) => (
                            <div 
                                key={index} 
                                onClick={() => updateCurrentChat(chat)}
                                style={{
                                    cursor: "pointer",
                                    borderRadius: "0.5rem",
                                    border: "1px solid rgb(100, 100, 100)"
                                }}
                            >
                                {user && <UserChat chat={chat} user={user} />}
                            </div>
                        ))}
                    </Stack>
                    <ChatBox />
                </Stack>
            ) : null}
        </Container>
    );
};
 
export default Chat;