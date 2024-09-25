"use client";
import SelfTransactionForm from "@/components/SelfTransactionForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import React from "react";

const SelfTransactionPage = () => {
  const router = useRouter();
  return (
    <div className="p-8">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" onClick={()=>{router.push("/me")}} className="cursor-pointer" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <SelfTransactionForm />
    </div>
  );
};

export default SelfTransactionPage;
