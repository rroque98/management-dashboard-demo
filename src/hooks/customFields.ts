import { useCallback, useEffect, useState } from 'react';
import { CustomField } from '../types';
import { getAllCustomFields } from '../firebase/customFields';

const useCustomFields = () => {
  const [customFields, setCustomFields] = useState<CustomField[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomFields = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fields = await getAllCustomFields();
      setCustomFields(fields);
    } catch (err) {
      console.error('Error fetching custom fields:', err);
      setError(
        'Failed to load custom fields. Please refresh the page and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomFields();
  }, [fetchCustomFields]);
  return { customFields, loading, error, refetch: fetchCustomFields };
};

export default useCustomFields;
