import React, { createContext, useCallback, useEffect, useState, useContext, ReactNode } from "react";
import { getRequest, postRequest, baseUrl } from "../utils/services";
import { io, Socket } from "socket.io-client";

// Define types for your data structures
interface User {
  _id: string;
  name: string;
  // Add other user properties as needed
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date | string;
  // Add other message properties as needed
}

interface Chat {
  _id: string;
  members: string[];
  // Add other chat properties as needed
}

export interface Notification {
  _id: string;
  senderId: string;
  isRead: boolean;
  date?: Date | string;
  // Add other notification properties as needed
}

interface ErrorResponse {
  error: boolean;
  message: string;
  // Add other error properties as needed
}

interface ChatContextType {
  userChats: Chat[] | null;
  isUserChatsLoading: boolean;
  userChatsError: ErrorResponse | null;
  potentialChats: User[];
  createChat: (firstId: string, secondId: string) => Promise<void>;
  updateCurrentChat: (chat: Chat) => void;
  messages: Message[] | null;
  newMessage: Message | null; // extra added to solve the error
  isMessagesLoading: boolean;
  messagesError: ErrorResponse | null;
  currentChat: Chat | null;
  sendTextMessage: (
    textMessage: string,
    sender: User,
    currentChatId: string,
    setTextMessage: (text: string) => void
  ) => Promise<void>;
  onlineUsers: string[];
  notifications: Notification[];
  allUsers: User[];
  markAllAsRead: (notifications: Notification[]) => void;
  markNotificationAsRead: (
    n: Notification,
    userChats: Chat[],
    user: User,
    notifications: Notification[]
  ) => void;
  markThisUserNotificationAsRead: (
    thisUserNotifications: Notification[],
    notifications: Notification[]
  ) => void;
}

interface ChatProviderProps {
  children: ReactNode;
  user: User | null;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({ children, user }: ChatProviderProps) => {
  const [userChats, setUserChats] = useState<Chat[] | null>(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState<ErrorResponse | null>(null);
  const [potentialChats, setPotentialChats] = useState<User[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<ErrorResponse | null>(null);
  const [sendTextMessageError, setSendTextMessageError] = useState<ErrorResponse | null>(null);  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Define types for socket event handlers
  type OnlineUsersResponse = string[];
  type MessageResponse = Message;
  type NotificationResponse = Notification;
  // Initialize socket
  useEffect(() => {
    if (!user?._id) return; 

    const newSocket = io("http://localhost:3002", {
      withCredentials: true,
      transports: ['websocket'] as ('websocket' | 'polling')[],
      path: "/socket.io/",
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 60000,
      autoConnect: true,
      forceNew: true
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully:', newSocket.id);
    });    newSocket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error.message);
    });

    newSocket.on('disconnect', (reason: string) => {
      console.log('Socket disconnected:', reason);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  // Add online users
  useEffect(() => {
    if (socket === null || !user?._id) return;
    
    socket.emit("addNewUser", user._id);    socket.on("getOnlineUsers", (res: OnlineUsersResponse) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user]);

  // Send message
  useEffect(() => {
    if (socket === null || !newMessage || !currentChat) return;

    const recipientId = currentChat.members.find((id) => id !== user?._id);
    if (recipientId) {
      socket.emit("sendMessage", { ...newMessage, recipientId });
    }
  }, [newMessage, socket, currentChat, user]);

  // Receive message & notification
  useEffect(() => {
    if (socket === null) return;    socket.on("getMessage", (res: MessageResponse) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => (prev ? [...prev, res] : [res]));
    });

    socket.on("getNotification", (res: NotificationResponse) => {
      if (!currentChat) {
        setNotifications((prev) => [res, ...prev]);
        return;
      }

      const isChatOpened = currentChat.members.some((id) => id === res.senderId);
      if (isChatOpened) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  // Fetch potential chats
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest<User[]>(`${baseUrl}/users`);
      if (response.error) {
        return console.log("Error fetching users", response);
      }

      const pChats = response.data?.filter((u) => {
        if (!user?._id || u._id === user._id) return false;
        
        let isChatCreated = false;
        if (userChats) {
          isChatCreated = userChats.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });

      setPotentialChats(pChats as User[]);
      setAllUsers(response as User[]);
    };

    getUsers();
  }, [userChats, user]);

  // Fetch user chats
  useEffect(() => {
    const getUserChats = async () => {
      if (!user?._id) return;

      setIsUserChatsLoading(true);
      setUserChatsError(null);
      
      try {
        const response = await getRequest<Chat[]>(`${baseUrl}/chats/${user._id}`);
        setIsUserChatsLoading(false);
        
        if (response.error) {
          return setUserChatsError(response as ErrorResponse);
        }
        
        setUserChats(response as Chat[]);
      } catch (error) {
        setIsUserChatsLoading(false);
        setUserChatsError({ error: true, message: "Failed to fetch chats" });
      }
    };

    getUserChats();
  }, [user, notifications]);

  // Fetch messages
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat?._id) return;

      setIsMessagesLoading(true);
      setMessagesError(null);
      
      try {
        const response = await getRequest<Message[]>(`${baseUrl}/messages/${currentChat._id}`);
        setIsMessagesLoading(false);
        
        if (response.error) {
          return setMessagesError(response as ErrorResponse);
        }
        
        setMessages(response as Message[]);
      } catch (error) {
        setIsMessagesLoading(false);
        setMessagesError({ error: true, message: "Failed to fetch messages" });
      }
    };

    getMessages();
  }, [currentChat, user]);

  const sendTextMessage = useCallback(
    async (
      textMessage: string,
      sender: User,
      currentChatId: string,
      setTextMessage: (text: string) => void
    ) => {
      if (!textMessage) return console.log("Type a message to send");
      if (!currentChatId || !sender?._id) return;

      try {
        const response = await postRequest<Message>(`${baseUrl}/messages`, 
          JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage
          })
        );

        if (response.error) {
          return setSendTextMessageError(response as ErrorResponse);
        }

        setNewMessage(response as Message);
        setMessages((prev) => (prev ? [...prev, response as Message] : [response as Message]));
        setTextMessage("");
      } catch (error) {
        setSendTextMessageError({ error: true, message: "Failed to send message" });
      }
    },
    []
  );

  const createChat = useCallback(async (firstId: string, secondId: string) => {
    try {
      const response = await postRequest<Chat>(`${baseUrl}/chats`, 
        JSON.stringify({ firstId, secondId })
      );

      if (response.error) {
        return console.log("Error creating chat", response);
      }

      setUserChats((prev) => (prev ? [...prev, response as Chat] : [response as Chat]));
    } catch (error) {
      console.log("Error creating chat", error);
    }
  }, []);

  const updateCurrentChat = useCallback((chat: Chat) => {
    setCurrentChat(chat);
  }, []);

  const markAllAsRead = useCallback((notifications: Notification[]) => {
    const mNotifications = notifications.map((n) => ({
      ...n,
      isRead: true
    }));
    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n: Notification, userChats: Chat[], user: User, notifications: Notification[]) => {
      if (!user?._id) return;

      // Find chat to open
      const desiredChat = userChats?.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        return chat.members.every((member) => chatMembers.includes(member));
      });

      // Mark notification as read
      const mNotifications = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...el, isRead: true };
        }
        return el;
      });

      if (desiredChat) {
        updateCurrentChat(desiredChat);
      }
      setNotifications(mNotifications);
    },
    [updateCurrentChat]
  );

  const markThisUserNotificationAsRead = useCallback(
    (thisUserNotifications: Notification[], notifications: Notification[]) => {
      const mNotifications = notifications.map((el) => {
        const notification = thisUserNotifications.find((n) => n.senderId === el.senderId);
        return notification ? { ...notification, isRead: true } : el;
      });
      setNotifications(mNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        newMessage, // extra added to solve the error
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllAsRead,
        markNotificationAsRead,
        markThisUserNotificationAsRead
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for using the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};