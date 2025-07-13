import { useState } from "react";
import { Button } from "primereact/button";
import { LuEyeOff, LuEye } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ general?: string }>({});
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

    if (!email || !password) {
      setErrors({ general: "Email and password are required" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://expense-tracker-gqth.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userName", data.name);
        navigate("/");
      } else {
        setErrors({ general: data.message || "Login failed" });
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
          label={isLoading ? "Logging in..." : "LOGIN"}
          type="submit"
          disabled={isLoading}
          className={`bg-blue-500 hover:bg-blue-600 text-white mt-4 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />

        {errors.general && (
          <p className="text-red-500 text-sm mt-2">{errors.general}</p>
        )}
        <Button
          label="Register"
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white mt-2"
          onClick={() => navigate("/register")}
        />
      </form>
    </div>
  );
}
