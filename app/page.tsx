"use client";

import { RowNav } from "@/components/landing/RowNav";
import { Header } from "@/components/landing/Header";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from "react";
import localFont from 'next/font/local'

const sevenSegment = localFont({src: '../assets/fonts/SevenSegment.ttf'})
const zeyada = localFont({src: '../assets/fonts/Zeyada-Regular.ttf',})
export default function Page() {
  const { setProfile } = useAuthContext();
  useEffect(() => {
    // if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
      setProfile({
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
       });
    //}
  }, [setProfile]);

  return (
    <div className="w-full" style={{
        backgroundImage: 'repeating-linear-gradient(#ccc 0 2px, transparent 1px 80px), repeating-linear-gradient(90deg, #ccc 0 2px, transparent 1px 80px)', 
        objectFit:"fill"
      }}>
      <div className="flex flex-col min-h-screen">
        <div className="lg:flex">
          <Header></Header>
        </div> 

        <div className="text-[12rem] pt-32 flex items-baseline justify-center">
          <p className={sevenSegment.className}>CODE</p>
          <p className={zeyada.className}>BOARD</p>
        </div>

        <div>
          <RowNav />
        </div>

      </div>
    </div>
  );
}
