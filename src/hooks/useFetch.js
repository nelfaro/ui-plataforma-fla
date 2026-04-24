import { useState, useEffect } from 'react';
import api from '../services/api';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(url, options);
        
        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
        console.error(`Error fetching ${url}:`, err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (url) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
