"use client";
import { useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import Image from "next/image";

// test
export default function LoginPage() {
  const { data } = authClient.useSession();

  useEffect(() => {
    const email = data?.user?.email ?? "";
    if (!email) return;
    if (!email.endsWith("@wayne.edu")) {
      alert("Please enter your Wayne State email (@wayne.edu).");
      authClient.signOut();
      return;
    }

  }, [data]);

  return (
    <div className="w-full min-h-[calc(100dvh-56px)] flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 flex justify-center">
          <div className="bg-[#319795] p-3 rounded-md">
            <Image src="/Logologin.svg" alt="StudyRez Logo" width={64} height={64} priority />
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Sign in with your credentials
          </h1>
        </div>

        { }
        <div className="space-y-4">
          {/* <input
            type="email"
            placeholder="Your Email"
            className="w-full text-black rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#319795] focus:outline-none placeholder-gray-500" />
          <input
            type="password"
            placeholder="Password"
            className="w-full text-black rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#319795] focus:outline-none placeholder-gray-500" />
          { } */}
          {/* type="submit" */}
          <button

            className="w-full rounded-full bg-[#1A202C] py-3 text-sm font-medium text-white hover:bg-[#27736f]"
            onClick={() =>
              authClient.signIn.social({
                provider: "microsoft",
              })
            }
          >
            Sign In
          </button>
        </div>

        { }
        {/* <div className="mt-4 text-center">
          <a href="#" className="text-sm text-[#3182CE] hover:underline">
            Forgot password?
          </a>
        </div> */}
      </div>
    </div>
  );
}