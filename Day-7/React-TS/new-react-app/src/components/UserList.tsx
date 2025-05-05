import React from 'react';
import UserCard from './UserCard';
import { User } from '../types/user';
import '../styles/UserList.css';

interface UserCardLists{
    users:User[];
}

const UserList:React.FC<UserCardLists> = ({users}) => {
  return (
    <div className='userList'>
        <h1>User List</h1>
        {users.map((user,index)=>(
            <UserCard key={index} user={user}/>
        ))}
    </div>
  )
}

export default UserList;