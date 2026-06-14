import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://omni-backend-8sfl.onrender.com';

export function useFAQ() {
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/faq`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => setFaq(Array.isArray(data) ? data : []))
      .catch(() => setFaq([]))
      .finally(() => setLoading(false));
  }, []);

  return { faq, loading };
}
