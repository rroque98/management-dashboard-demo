import { db } from './config';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { Patient } from '../types';

/**
 * Adds a new patient to the Firestore database.
 * @param patient - The patient data to add.
 * @returns The ID of the newly created patient document.
 */
export const addPatient = async (
  patient: Omit<Patient, 'id'>
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
export const getPatients = async (): Promise<Patient[]> => {
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
 * Retrieves a patient by ID from Firestore.
 * @param patientId - The ID of the patient.
 * @returns The patient data with ID.
 */
export const getPatientById = async (patientId: string): Promise<Patient> => {
  const patientRef = doc(db, 'patients', patientId);
  const patientSnap = await getDoc(patientRef);
  if (patientSnap.exists()) {
    return { ...patientSnap.data(), id: patientSnap.id } as Patient;
  } else {
    throw new Error('Patient not found');
  }
};

/**
 * Updates an existing patient's data in Firestore.
 * @param patient - The complete patient data with ID.
 */
export const updatePatient = async (patient: Patient): Promise<void> => {
  const patientRef = doc(db, 'patients', patient.id);
  await updateDoc(patientRef, {
    firstName: patient.firstName,
    middleName: patient.middleName,
    lastName: patient.lastName,
    dob: patient.dob,
    status: patient.status,
    addresses: patient.addresses,
    customFieldValues: patient.customFieldValues,
  });
};
