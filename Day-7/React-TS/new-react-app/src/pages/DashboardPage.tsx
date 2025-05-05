import React from 'react';
import UserList from '../components/UserList'; // Import UserList

interface User {
  name: string;
  age: number;
  email: string;
}

const DashboardPage = () => {
  const users: User[] = [
    { name: 'John Doe', age: 30, email: 'john.doe@example.com' },
    { name: 'Jane Smith', age: 25, email: 'jane.smith@example.com' },
    { name: 'Bob Johnson', age: 40, email: 'bob.johnson@example.com' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 ">Dashboard</h1>
      <UserList users={users} />  {/* Use UserList component */}
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default DashboardPage;
