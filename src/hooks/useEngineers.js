import { useState, useEffect } from 'react';

// const API_URL = import.meta.env.VITE_API_URL || 'https://omni-backend-8sfl.onrender.com';
const API_URL = 'http://localhost:3001';

export function useEngineers() {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/engineers`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => setEngineers(Array.isArray(data) ? data : []))
      .catch(() => setEngineers([]))
      .finally(() => setLoading(false));
  }, []);

  return { engineers, loading };
}
