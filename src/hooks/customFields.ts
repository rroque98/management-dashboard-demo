import { useEffect, useState } from 'react';
import { CustomField } from '../types';
import { getAllCustomFields } from '../firebase/customFields';

const useCustomFields = () => {
  const [customFields, setCustomFields] = useState<CustomField[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomFields = async () => {
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
    };
    fetchCustomFields();
  }, []);
  return { customFields, loading, error };
};

export default useCustomFields;
