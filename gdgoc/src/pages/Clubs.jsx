import { useEffect, useState } from "react";
import { getClubs } from "../firebase/firestore";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      const data = await getClubs();
      setClubs(data);
    };
    fetchClubs();
  }, []);

  return (
    <div>
      <h2>Clubs</h2>
      {clubs.length === 0 && <p>No clubs found</p>}

      {clubs.map((club) => (
        <div
          key={club.id}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            margin: "12px 0",
            borderRadius: "8px",
          }}
        >
          <h3>{club.name}</h3>
          <p>{club.description}</p>
          <small>{club.category}</small>
        </div>
      ))}
    </div>
  );
}
