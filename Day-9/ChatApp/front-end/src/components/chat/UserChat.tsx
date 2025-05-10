import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/avatar.svg";
import { useChat,Notification } from "../../context/ChatContext";
import { ChatContext } from "../../context/ChatContext";
import React, { useContext } from "react";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

interface User {
  _id: string;
  name: string;
  email: string;
}

// import { Notification } from "../../context/ChatContext";

interface Message {
  text: string;
  createdAt: string;
}

interface Chat {
  _id: string;
  members: string[];
}

interface Props {
  chat: Chat;
  user: User;
}

const UserChat: React.FC<Props> = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  // const context = useContext(ChatContext);

  // const onlineUsers = context?.onlineUsers || [];
  // const notifications = context?.notifications || [];
  // const markThisUserNotificationAsRead = context?.markThisUserNotificationAsRead || (() => {});

  const {
    onlineUsers = [],
    notifications = [],
    markThisUserNotificationAsRead = () => {}
  } = useChat();

  const { latestMessage } = useFetchLatestMessage(chat);

  const isOnline = onlineUsers.some((userId: string) =>
    userId === recipientUser?._id
  );

  const unreadNotification = unreadNotificationsFunc(notifications);
  const thisUserNotifications = unreadNotification.filter(
    (n) => n?.senderId === recipientUser?._id
  );

  const truncateText = (text: string): string => {
    let shortText = text.substring(0, 20);
    if (text.length > 20) {
      shortText += "...";
    }
    return shortText;
  };

  const handleClick = () => {
    if (thisUserNotifications.length !== 0) {
      markThisUserNotificationAsRead(thisUserNotifications, notifications);
    }
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card aligin-items-center p-2 justify-content-between"
      role="button"
      style={{ cursor: "pointer", borderRadius: "0.5rem" }}
      onClick={handleClick}
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} height="35px" alt="avatar" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">
            {latestMessage?.text && (
              <span>{truncateText(latestMessage?.text)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">
          {latestMessage?.createdAt &&
            moment(latestMessage.createdAt).calendar(null, {
              sameDay: "dddd DD/MM/YYYY h:mm a",
              nextDay: "dddd DD/MM/YYYY h:mm a",
              nextWeek: "dddd DD/MM/YYYY h:mm a",
              lastDay: "dddd DD/MM/YYYY h:mm a",
              lastWeek: "dddd DD/MM/YYYY h:mm a",
              sameElse: "dddd DD/MM/YYYY h:mm a"
            })}
        </div>
        <div
          className={
            thisUserNotifications.length > 0
              ? "this-user-notifications"
              : ""
          }
        >
          {thisUserNotifications.length > 0
            ? thisUserNotifications.length
            : ""}
        </div>
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

export default UserChat;