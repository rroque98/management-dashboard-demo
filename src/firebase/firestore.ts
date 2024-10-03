import { db } from './config';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { Patient } from '../types';

/**
 * Adds a new patient to the Firestore database.
 * @param patient - The patient data to add.
 * @returns The ID of the newly created patient document.
 */
export const addPatientToFirestore = async (
  patient: Patient
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'patients'), patient);
    return docRef.id;
  } catch (e) {
    console.error('Error adding patient: ', e);
    throw e;
  }
};

/**
 * Retrieves all patients from the Firestore database.
 * @returns An array of Patient objects with their corresponding document IDs.
 */
export const getPatientsFromFirestore = async (): Promise<Patient[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'patients'));
    const patients: Patient[] = [];
    querySnapshot.forEach((doc) => {
      const patientData = doc.data() as Patient;
      patients.push({ ...patientData, id: doc.id });
    });
    return patients;
  } catch (e) {
    console.error('Error fetching patients: ', e);
    throw e;
  }
};

/**
 * Updates an existing patient's data in the Firestore database.
 * @param patientId - The ID of the patient document to update.
 * @param updatedPatient - The updated patient data.
 */
export const updatePatientInFirestore = async (
  patientId: string,
  updatedPatient: Patient
): Promise<void> => {
  try {
    const patientRef = doc(db, 'patients', patientId);
    await updateDoc(patientRef, updatedPatient);
  } catch (e) {
    console.error('Error updating patient: ', e);
    throw e;
  }
};
