import { useCallback, useEffect, useState } from 'react';
import { Patient } from '../types';
import { getPatients } from '../firebase/patients';

const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { patients, loading, error, refetch: fetchPatients };
};

export default usePatients;
