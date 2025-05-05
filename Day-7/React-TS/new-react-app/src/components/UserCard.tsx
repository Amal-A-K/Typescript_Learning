import React from 'react';
import { User } from '../types/user';
import '../styles/UserCard.css';

interface UserCardProps{
    user:User;
}

const UserCard:React.FC<UserCardProps> = ({user}) => {
  return (
    <div className='userCard'>
        <h1>{user.name}</h1>
        <p>Age : {user.age}</p>
        <p>Email : {user.email}</p>
    </div>
  )
}

export default UserCard;