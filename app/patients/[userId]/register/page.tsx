import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import RegistrationForm from '@/components/forms/RegistrationForm'
import { getUser } from '@/lib/actions/patient.action'

import * as Sentry from '@sentry/nextjs'
import next from 'next'
const register =async ({params:{userId}}:SearchParamProps) => {
 const user=await getUser(userId);
 Sentry.metrics.set("user_view_register",user.name)
  return (
    
    <div className="flex h-screen max-h-screen">

    
    <section className="remove-scrollbar container ">
      <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
      <Image
         src="/assets/icons/logo-full.svg"
         height={1000}
         width={1000}
         alt="patient"
         className="mb-12 h-10 w-fit"
      />
      <RegistrationForm user={user}/>
      <p className="justify-items-end text-dark-600 xl:text-left">© 2024 CarePulse</p>
      
      </div>
    </section>
    <Image
    src="/assets/images/register-img.png"
    height={1000}
    width={1000}
    alt="patient"
    className="side-img max-w-[390px]"/>

   </div>
      )
}

export default register