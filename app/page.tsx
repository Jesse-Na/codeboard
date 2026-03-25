"use client";

import { RowNav } from "@/components/landing/RowNav";
import Image from "next/image";
import title from "@/app/title.png";
import { Header } from "@/components/landing/Header";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Page() {
  const { setProfile } = useAuthContext();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
      setProfile({
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
      });
    }
  }, [setProfile]);

  return (
    <div>
      <div className="lg:flex">
        <Header></Header>
      </div>
      <div className="flex flex-col py-32">
        <div className="flex w-full justify-center items-center">
          <Image src={title} alt="CodeBoard" />
        </div>
        <div>
          <RowNav />
        </div>
      </div>
    </div>
  );
}
