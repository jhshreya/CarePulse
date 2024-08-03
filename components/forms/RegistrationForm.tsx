"use client"
 import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.action";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "@/components/FileUploader";

const RegistrationForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);
    let formData;
    console.log("Form Values:", values); // Log form values
    if (values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });
      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
      console.log("Form Data:", formData); // Log form data
    }

    try {
      const patientData = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
        treatmentConsent: values.treatmentConsent,
        disclosureConsent: values.disclosureConsent,
      };

      console.log("Patient Data:", patientData); // Log patient data
      // @ts-ignore
      const newPatient = await registerPatient(patientData);
      if (newPatient) {
        console.log("Patient Registered:", newPatient); // Log successful registration
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.error("Registration Error:", error); // Log any errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome👋</h1>
          <p className="text-dark-700">
            Let us know more about yourself
          </p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <CustomFormField 
          fieldType={FormFieldType.INPUT} 
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="john doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
          id="name"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.INPUT} 
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
            id="email"
          />

          <CustomFormField 
            fieldType={FormFieldType.PHONE_INPUT} 
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-456"
            id="phone"
          />   
        </div>
        
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.DATE_PICKER} 
            control={form.control}
            name="birthDate"
            label="Date of Birth"
            placeholder="Select your date of birth"
            id="birthDate"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup className="flex h-11 gap-6 xl:justify between" onValueChange={field.onChange} defaultValue={field.value}>
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />  
        </div>
       
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.INPUT} 
            control={form.control}
            name="address"
            label="Address"
            placeholder="14th street, New York"
            id="address"
          />

          <CustomFormField 
            fieldType={FormFieldType.INPUT} 
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
            id="occupation"
          />  
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.INPUT} 
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian Name"
            id="emergencyContactName"
          />

          <CustomFormField 
            fieldType={FormFieldType.PHONE_INPUT} 
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="(555) 123-456"
            id="emergencyContactNumber"
          />     
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        <CustomFormField 
          fieldType={FormFieldType.SELECT} 
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a physician"
          id="primaryPhysician"
        > 
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer gap-2">
                <Image
                  src={doctor.image}
                  height={32}
                  width={32}
                  alt={doctor.name}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField> 

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.INPUT} 
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="Bluecross Blueshield"
            id="insuranceProvider"
          />

          <CustomFormField 
            fieldType={FormFieldType.INPUT} 
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="ABC12345"
            id="insurancePolicyNumber"
          />      
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.TEXTAREA} 
            control={form.control}
            name="allergies"
            label="Allergies"
            placeholder="Enter your allergies here"
            id="allergies"
          />    

          <CustomFormField 
            fieldType={FormFieldType.TEXTAREA} 
            control={form.control}
            name="currentMedication"
            label="Current Medication"
            placeholder="Enter your current medications here"
            id="currentMedication"
          />    
        </div>

        <CustomFormField 
          fieldType={FormFieldType.TEXTAREA} 
          control={form.control}
          name="familyMedicalHistory"
          label="Family Medical History"
          placeholder="Enter your family medical history here"
          id="familyMedicalHistory"
        />

        <CustomFormField 
          fieldType={FormFieldType.TEXTAREA} 
          control={form.control}
          name="pastMedicalHistory"
          label="Past Medical History"
          placeholder="Enter your past medical history here"
          id="pastMedicalHistory"
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification</h2>
          </div>
        </section>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.SELECT} 
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select an Identification Type"
            id="identificationType"
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                <div className="flex cursor-pointer gap-2">
                  <p>{type}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>    

          <CustomFormField 
            fieldType={FormFieldType.INPUT} 
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="Enter your identification number here"
            id="identificationNumber"
          />    
        </div>
        <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned copy of identification document"
             id="identificationDocument"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange}/>
              </FormControl>
            )}
          />    

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent</h2>
          </div>
        </section>

        <CustomFormField 
          fieldType={FormFieldType.CHECKBOX} 
          control={form.control}
          name="privacyConsent"
          label="Privacy Consent"
          id="privacyConsent"
        />  

        <CustomFormField 
          fieldType={FormFieldType.CHECKBOX} 
          control={form.control}
          name="treatmentConsent"
          label="Treatment Consent"
          id="treatmentConsent"
        />  

        <CustomFormField 
          fieldType={FormFieldType.CHECKBOX} 
          control={form.control}
          name="disclosureConsent"
          label="Disclosure Consent"
          id="disclosureConsent"
        />  

        <SubmitButton 
          isLoading={isLoading} 
        >continue</SubmitButton>
      </form>
    </Form>
  );
};

export default RegistrationForm;
