import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a UUID (version 4).
 * @returns {string} A unique UUID string.
 */
export const generateUUID = (): string => {
  return uuidv4();
};
