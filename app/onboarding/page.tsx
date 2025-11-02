"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Onboarding() {
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter();
  const [school,setSchool] = useState("");

useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div>
      {step === 1 ? (
        <div className="w-full min-h-[calc(100dvh-56px)] flex items-center justify-center text-white"
          style={{ background: "linear-gradient(180deg,#4FD1C5,#319795)" }}
        >
          <div className="flex flex-col items-center gap-6">
            <Image src="/Logoonboarding.svg" alt="StudyRez" width={128} height={128} priority />

          </div>
        </div>

      ) : (
        <div className="w-full min-h-[calc(100dvh-56px)] flex items-center justify-center bg-[#319795]">
          <div className="w-full max-w-[420px] px-4">
            <div className="w-full flex flex-col items-center">
             <Image src="/Logologin.svg" alt="StudyRez" width={128} height={128} priority />

         <h1 className="mt-4 text-xl font-semibold text-gray-900 text-center">
            Select your school
         </h1>

          <div className="mt-6 w-full space-y-4">
            <input
              list="school-list"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Search schools"
              className="w-full text-black rounded-lg border border-gray-500 px-4 py-3 text-sm focus:border-[#319795] focus:outline-none bg-white placeholder-gray-500"
            />
            <datalist id="school-list" data-testid="school-list">
                <option value="Wayne State University"/>
            </datalist>

            <button
              type="button"
              onClick={() => router.push("/signin")}
              className="w-full rounded-full bg-[#1A202C] py-3 text-sm font-medium text-white hover:bg-[#2D3748]"
            >
              Continue
            </button>
           </div>
          </div>
         </div>
        </div>
       )}
    </div>
  );
}

