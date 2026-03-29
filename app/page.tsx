"use client";

import { RowNav } from "@/components/landing/RowNav";
import Image from "next/image";
import title from "@/app/title.png";
import { Header } from "@/components/landing/Header";

export default function Page() {
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
