import { useState, useEffect } from 'react';

// const API_URL = import.meta.env.VITE_API_URL || 'https://omni-backend-8sfl.onrender.com';
const API_URL = 'http://localhost:3001'

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/services`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return { services, loading };
}
