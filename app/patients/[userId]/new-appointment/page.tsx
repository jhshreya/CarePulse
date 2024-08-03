import AppointmentForm from "@/components/forms/AppointmentForm";
import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";
import Link from "next/link";
import { userAgent } from "next/server";
import { getPatient } from "@/lib/actions/patient.action";
import * as Sentry from '@sentry/nextjs'

export default async function NewAppointment({params:{userId}}:SearchParamProps) {
    const patient =await getPatient(userId);
    Sentry.metrics.set("user_view_new-appointment",patient.name);
   return(
     <div className="flex h-screen max-h-screen">

      {/*otp verification*/}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
        <Image
           src="/assets/icons/logo-full.svg"
           height={1000}
           width={1000}
           alt="patient"
           className="mb-12 h-10 w-fit"
        />
       <AppointmentForm userId={userId} patientId={patient?.$id} type="create"/>
        <p className="copyright mt-10 py-12">© 2024 CarePulse</p>
        <Link href="/?admin=true" className="text-green-500" >
             Admin
        </Link>
        </div>
      </section>
      <Image
      src="/assets/images/appointment-img.png"
      height={1000}
      width={1000}
      alt="appointment"
      className="side-img absolute, top-0, bottom-0 left-0 max-w-[390px] bg-bottom"/>

     </div>
        )
}
