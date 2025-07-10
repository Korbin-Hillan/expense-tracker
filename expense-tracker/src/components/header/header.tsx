import logo from "../../assets/logo.png";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedName = localStorage.getItem("userName");
      setUserName(updatedName);
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events (for same-tab changes)
    window.addEventListener("userLogin", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogin", handleStorageChange);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    setUserName(null);
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-black">
      <div className="flex items-center">
        <img
          src={logo}
          alt="Expense Tracker Logo"
          className="inline-block mr-3 h-8 w-8 rounded-lg"
        />
        <Button
          label="Expense Tracker"
          className="text-white text-2xl font-bold"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="flex items-center space-x-4">
        {userName ? (
          <>
            <span className="text-white text-lg">Hello, {userName}</span>
            <Button
              label="Logout"
              className="text-white text-lg"
              onClick={handleLogout}
            />
          </>
        ) : (
          <Button
            label="Sign In"
            className="text-lg text-white"
            onClick={() => navigate("/login")}
          />
        )}
      </div>
    </header>
  );
}
