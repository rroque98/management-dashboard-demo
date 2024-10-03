import { db } from './config';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { CustomField } from '../types';

/**
 * Adds a new custom field to Firestore.
 * @param field - The custom field data excluding the ID.
 * @returns The newly created custom field document with ID.
 */
export const addCustomField = async (
  field: Omit<CustomField, 'id'>
): Promise<CustomField> => {
  const docRef = await addDoc(collection(db, 'customFields'), field);
  return { ...field, id: docRef.id };
};

/**
 * Retrieves all custom fields from Firestore.
 * @returns An array of CustomField objects.
 */
export const getAllCustomFields = async (): Promise<CustomField[]> => {
  const querySnapshot = await getDocs(collection(db, 'customFields'));
  const fields: CustomField[] = [];
  querySnapshot.forEach((doc) => {
    fields.push({ ...doc.data(), id: doc.id } as CustomField);
  });
  return fields;
};

/**
 * Retrieves a single custom field by ID.
 * @param fieldId - The ID of the custom field.
 * @returns The CustomField object.
 */
export const getCustomFieldById = async (
  fieldId: string
): Promise<CustomField> => {
  const fieldRef = doc(db, 'customFields', fieldId);
  const fieldSnap = await getDoc(fieldRef);
  if (fieldSnap.exists()) {
    return { ...fieldSnap.data(), id: fieldSnap.id } as CustomField;
  } else {
    throw new Error('Custom field not found');
  }
};

/**
 * Updates an existing custom field in Firestore.
 * @param field - The complete custom field data with ID.
 */
export const updateCustomField = async (field: CustomField): Promise<void> => {
  const fieldRef = doc(db, 'customFields', field.id);
  await updateDoc(fieldRef, {
    label: field.label,
    fieldType: field.fieldType,
    required: field.required,
  });
};

/**
 * Deletes a custom field from Firestore.
 * @param fieldId - The ID of the custom field to delete.
 */
export const deleteCustomField = async (fieldId: string): Promise<void> => {
  const fieldRef = doc(db, 'customFields', fieldId);
  await deleteDoc(fieldRef);
};
