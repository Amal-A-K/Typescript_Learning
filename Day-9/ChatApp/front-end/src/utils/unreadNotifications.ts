// interface Notification {
//     isRead: boolean;
//     // Add other notification properties as needed
//     [key: string]: any;
//   }
// import Notification from "../components/chat/NotificationComponent";
import { Notification } from "../context/ChatContext";
  
  export const unreadNotificationsFunc = (notifications: Notification[]): Notification[] => {
    return notifications.filter((n) => n.isRead === false);
  };