import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

interface User {
  _id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface Chat {
  members: string[];
  // Add other chat properties as needed
}

interface ErrorResponse {
  error: boolean;
  message: string;
  // Add other error properties as needed
}

interface FetchRecipientResult {
  recipientUser: User | null;
  error: ErrorResponse | null;
  isRecipientUserLoading: boolean;
}

export const useFetchRecipientUser = (chat: Chat | null, user: User | null): FetchRecipientResult => {
    const [recipientUser, setRecipientUser] = useState<User | null>(null);
    const [isRecipientUserLoading, setIsRecipientUserLoading] = useState(false);
    const [error, setError] = useState<ErrorResponse | null>(null);

    const recipientId = chat?.members?.find((id) => id !== user?._id);

    useEffect(() => {
        const getUser = async () => {
            setError(null);
            if (!recipientId) {
                setRecipientUser(null);
                return;
            }

            setIsRecipientUserLoading(true);
            try {
                const response = await getRequest<User>(`${baseUrl}/users/find/${recipientId}`);
                
                if (response.error) {
                    setError({
                        error:true,
                        message:response.message || "Unknown error"
                    });
                    setRecipientUser(null);
                } else {
                    setRecipientUser({
                        _id:response.data?._id || "",
                        name:response?.data?.name || "Unknown",
                        email:response?.data?.email || "",
                    });
                }
            } catch (err) {
                setError({ 
                    error: true, 
                    message: "Failed to fetch recipient user" 
                });
                setRecipientUser(null);
            } finally {
                setIsRecipientUserLoading(false);
            }
        };

        getUser();
    }, [recipientId]);

    return { recipientUser, error, isRecipientUserLoading };
};