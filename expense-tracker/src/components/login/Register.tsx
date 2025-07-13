import { useState } from "react";
import { Button } from "primereact/button";
import { LuEyeOff, LuEye } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setShowPassword(!showPassword);
    setType(showPassword ? "password" : "text");
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!email || !name || !password) {
      setErrors({ general: "All fields are required" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://expense-tracker-gqth.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userName", data.name);
      } else {
        setErrors({ general: data.message || "Registration failed" });
      }
    } catch (err) {
      setErrors({ general: "Network error. Please try again." + err });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-11/12">
      <form onSubmit={handleSubmit} className="gap-2 flex flex-col">
        <label htmlFor="email">Email</label>
        <input
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border-2 text-black w-full px-3 py-2"
        />

        <label htmlFor="name">Name</label>
        <input
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white border-2 text-black w-full px-3 py-2"
        />

        <label htmlFor="password">Password</label>
        <div className="relative w-full">
          <input
            type={type}
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="bg-white border-2 text-black w-full pr-10 px-3 py-2"
          />
          <span
            className="absolute right-3 top-2 cursor-pointer"
            onClick={handleToggle}
          >
            {showPassword ? <LuEye size={20} /> : <LuEyeOff size={20} />}
          </span>
        </div>

        <Button
          label="CREATE ACCOUNT"
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white mt-4"
        />
        <Button
          label="Already have an account? Login"
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white mt-2"
          onClick={() => navigate("/login")}
        />
      </form>
    </div>
  );
}
