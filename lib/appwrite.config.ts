import * as sdk from 'node-appwrite';

export const {PROJECT_ID,API_KEY,DATABASE_ID,PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID,APPOINTMENT_COLLECTION_ID,
NEXT_PUBLIC_BUCKET_ID:BUCKET_ID,
NEXT_PUBLIC_ENDPOINT:ENDPOINT}=process.env;

const client=new sdk.Client()
   .setEndpoint('https://cloud.appwrite.io/v1')
   .setProject('6696c1fc000c722a1b50')
   .setKey('c53b503e110cf9940790f3a94eba380336ab0ce6f2e5c9f57cf27ce672c0a054c94353b59aea9652fc5ba5be6241479a82403918422fb650185eb55ffe13659d155e0ef41e33b55a8a67ef4702b79dec0504dfc76ad70618b135a064f8aeef077b31bdfc71352e28b46d3ff1e4099d5ef94fbe0d256730ded2ee8e0658dab798')


export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);