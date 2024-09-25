/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Input from "./Input";
import { decodeToken } from "react-jwt";
import { toast } from "react-hot-toast";
import { DecodedToken } from "@/interaface/DecodedToken";
import { useState } from "react";


const SelfTransactionForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("authToken");
  if (token !== null) {
    const decodedToken: DecodedToken | null = decodeToken(token);
    const now = new Date().getTime() / 1000;
    if (
      decodedToken &&
      decodedToken.exp > now &&
      decodedToken.email &&
      decodedToken.userId
    ) {
    } else {
      toast.error("Invalid authentication, please relogin");
      router.push("/auth");
      localStorage.removeItem("authToken");
    }
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      fromAccountId: "",
      toAccountId: "",
      amount: 0,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const { fromAccountId, toAccountId, amount } = data;

    console.log(fromAccountId, toAccountId, amount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Please enter a valid amount.");
      setIsLoading(false);
      return;
    }

    if (fromAccountId === toAccountId) {
      toast.error("The account ids are the same");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "/api/transactions/self",
        { fromAccountId, toAccountId, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res);
    } catch (error) {
      const e = error as unknown as any;
      console.log(e.response.data);
      toast.error(e.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        className="
        bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            id="fromAccountId"
            placeholder="From Account ID"
            label="From Account ID"
            type="text"
          />
          <div>
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              placeholder="To Account ID"
              id="toAccountId"
              label="To Account ID"
              type="text"
            />
          </div>
          <div>
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              placeholder="Amount"
              id="amount"
              label="Amount"
              type="number"
            />
          </div>
          <div className="flex items-center flex-col justify-center">
            <Button disabled={isLoading} type="submit">
              Transfer Money
            </Button>
          </div>
          <div
            className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
            underline cursor-pointer
          "
          >
            <div
              className="underline cursor-pointer"
              onClick={() => {
                router.push("/transactions");
              }}
            >
              Transfer to another user
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelfTransactionForm;
