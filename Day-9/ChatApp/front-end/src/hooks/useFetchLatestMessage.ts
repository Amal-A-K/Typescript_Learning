import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/services";

interface Message {
  _id: string;
  text: string;
  senderId: string;
  createdAt: string | Date;
}

interface Chat {
  _id: string;
}

interface FetchLatestMessageResult {
  latestMessage: Message | null;
}

export const useFetchLatestMessage = (chat: Chat | null): FetchLatestMessageResult => {
    const { newMessage, notifications } = useChat();
    const [latestMessage, setLatestMessage] = useState<Message | null>(null);

    useEffect(() => {
        const getMessages = async () => {
            if (!chat?._id) {
                setLatestMessage(null);
                return;
            }

            try {
                const response = await getRequest<Message[]>(`${baseUrl}/messages/${chat._id}`);

                if (response.error) {
                    console.log("Error getting messages", response);
                    setLatestMessage(null);
                    return;
                }

                // Check if response.data exists and has messages
                if (response.data && response.data.length > 0) {
                    const lastMessage = response.data[response.data.length - 1];
                    setLatestMessage(lastMessage);
                } else {
                    setLatestMessage(null);
                }
            } catch (error) {
                console.log("Error fetching messages:", error);
                setLatestMessage(null);
            }
        };

        getMessages();
    }, [chat, newMessage, notifications]);

    return { latestMessage };
};