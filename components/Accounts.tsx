"use client";
import { Account } from "@/interaface/Account";
import React, { useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";

const Accounts = ({ token }: { token: string }) => {
  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/user/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      setAccounts(data);
    })();
  }, [token]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-[90%]">
      {accounts.length > 0 ? (
        accounts.map((account) => {
          return (
            <div key={account.id} className="py-5">
              <Card>
                <CardHeader>
                  <CardTitle>{account.accountType}</CardTitle>
                  <CardDescription>User: {account.userEmail}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Account Number: {account.accountNumber}</p>
                </CardContent>
                <CardFooter>
                  <p>Account Balance: {account.balance}</p>
                </CardFooter>
              </Card>
            </div>
          );
        })
      ) : (
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
  );
};

export default Accounts;
