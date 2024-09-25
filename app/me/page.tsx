"use client";
import { useRouter } from "next/navigation";
import { DecodedToken } from "../../interaface/DecodedToken";
import { decodeToken } from "react-jwt";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import Transactions from "@/components/Transactions";
import { useState } from "react";
import Accounts from "@/components/Accounts";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";

const ProfilePage = () => {
  const router = useRouter();
  let decodedToken: DecodedToken | null = null;
  const token = localStorage.getItem("authToken");

  const [showTransactions, setShowTransactions] = useState<boolean>(false);
  const [showAccounts, setShowAccounts] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (token === null) {
    toast.error("Invalid authentication, please relogin");
    router.push("/auth");
    localStorage.removeItem("authToken");
    return;
  }
  if (token !== null) {
    decodedToken = decodeToken(token);
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

  async function makeNewAccount() {
    try {
      setIsLoading(true);
      setShowAccounts(false);
      setShowTransactions(false);
      const res = await axios.post(
        "/api/user/accounts",
        {
          accountType: "Savings",
          balance: 1000,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(res.data);

      setShowTransactions(false);
      setShowAccounts(true);
    } catch (error) {
      const e = error as unknown as any;
      console.log(e.response.data);
      toast.error(e.response.data.error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getTransactionsPdf() {
    setIsLoading(true);
    setShowAccounts(false);
    setShowTransactions(false);
    try {
      const res = await axios.get("/api/user/transactions/pdf", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Important to handle binary data
      });
      // Create a new Blob object using the response data (PDF binary data)
      const blob = new Blob([res.data], { type: "application/pdf" });

      // Create a link element
      const link = document.createElement("a");

      // Set the download attribute with a file name
      link.href = URL.createObjectURL(blob);
      link.download = "transactions.pdf";

      // Append the link to the body (it won't be visible)
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up by removing the link element
      document.body.removeChild(link);
    } catch (error) {
      const e = error as unknown as any;
      console.log(e.response.data);
      toast.error(e.response.data.error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex flex-col w-full mx-8 h-full px-5">
      <div className="">
        {decodedToken !== null && <div>{decodedToken?.email}</div>}
        <div className="flex gap-x-4">
          <Button
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => {
              setShowTransactions(true);
              setShowAccounts(false);
            }}
          >
            Get all my transactions
          </Button>
          <Button
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => {
              setShowTransactions(false);
              setShowAccounts(true);
            }}
          >
            Get all my accounts
          </Button>
          <Button
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => {
              makeNewAccount();
            }}
          >
            Make a new account
          </Button>
          <Button
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => {
              router.push("/transactions");
            }}
          >
            Make a new transaction
          </Button>
          <Button
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => {
              getTransactionsPdf(); 
            }}
          >
            Get a pdf of my transactions
          </Button>
        </div>
        {showTransactions && <Transactions token={token} />}
        {showAccounts && !isLoading && <Accounts token={token} />}
        {isLoading && (
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
