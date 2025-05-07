import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

interface User {
  email: string;
  // Add other user properties here if needed
  // e.g., displayName: string;
  // uid: string;
}

interface UserAuthContext {
  logOut: () => Promise<void>;
  user: User | null;
}

const Home = () => {
  const { logOut, user } = useUserAuth() as UserAuthContext;
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred");
      }
    }
  };

  return (
    <>
      <div className="p-4 box mt-3 text-center">
        Hello Welcome <br />
        {user && user.email}
      </div>
      <div className="d-grid gap-2">
        <Button variant="primary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </>
  );
};

export default Home;