import { useEffect, useState } from "react";
import axios from "axios";

export default function HomePage() {
  const [user, setUser] = useState<{ fullName: string } | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("userName");

    if (name) {
      axios
        .get(
          `http://localhost:3000/api/user/name?name=${encodeURIComponent(name)}`
        )
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        });
    }
  }, []);

  return <div></div>;
}
