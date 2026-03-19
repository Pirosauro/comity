import type { FunctionComponent } from "react";

import { useEffect, useState } from "react";

export const User: FunctionComponent = () => {
  const [user, setUser] = useState<string>("Guest");
  const [loading, setLoading] = useState(true);

  const fetchUserData = () => {
    console.log("Fetching user data...");
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("John Doe");
      }, 10000); // 10 seconds delay to simulate a slow network request
    });
  };

  const fetchUser = async () => {
    try {
      const response = await fetchUserData();

      console.log("User data fetched:", response);
      setUser(response);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <>{loading ? <div>Loading user data...</div> : <div>Welcome, {user}!</div>}</>;
};

export default User;
