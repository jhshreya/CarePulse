"use server"
import { ID, Query } from "node-appwrite";
import {DATABASE_ID, ENDPOINT, PATIENT_COLLECTION_ID,PROJECT_ID,databases, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";
import {InputFile} from "node-appwrite/file"
import { BUCKET_ID } from "../appwrite.config";

export interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}


export const createUser = async (user: CreateUserParams)=> {
  try {
    console.log("Attempting to create user:", user); // Log user creation attempt

    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    console.log("New User Created:", newUser); // Log the newly created user
    return parseStringify(newUser) ;
  } catch (error: any) {
    console.error("Error creating user:", error); // Log the error for debugging

    if (error && error.code === 409) {
      console.log("User already exists, fetching existing user by email:", user.email); // Log user exists scenario
      const existingUser = await users.list([
        Query.equal('email', [user.email])
      ]);

      if (existingUser && existingUser.users.length > 0) {
        console.log("Existing User Found:", existingUser.users[0]); // Log existing user details
        return existingUser.users[0];
      } else {
        console.error("No existing user found with email:", user.email); // Log no existing user found
      }
    } else {
      console.error("Unhandled error during user creation:", error); // Log unhandled errors
    }

    return undefined; // Return undefined if user creation fails
  }
};

export const getUser=async(userId:string)=>{
  try{
  const user=await users.get(userId)
  return parseStringify(user);
  }
  catch(error){
  console.log(error);
  }
}
export const getPatient=async(userId:string)=>{
  try{
  const patients=await databases.listDocuments(
    DATABASE_ID!,
    PATIENT_COLLECTION_ID!,
    [
      Query.equal('userId', [userId])
    ]
  )
  return parseStringify(patients.documents[0]);
  }
  catch(error){
  console.log(error);
  }
}



export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
  console.log('registerPatient function called with:', { identificationDocument, ...patient });

  try {
    let file;
    if (identificationDocument) {
      console.log('Identification document provided:', identificationDocument);
      const blobFile = identificationDocument.get('blobFile');
      const fileName = identificationDocument.get('fileName');
      if (blobFile && fileName) {
        const inputFile = InputFile.fromBuffer(blobFile as Blob, fileName as string);
        console.log('inputFile created:', inputFile);
        file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        console.log('File created:', file);
      } else {
        console.error('Identification document missing blobFile or fileName');
      }
    } else {
      console.log('No identification document provided');
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!, 
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );
    console.log('New patient created:', newPatient);
    return parseStringify(newPatient);
  } catch (error) {
    console.error('Error in registerPatient:', error);
  }
};
