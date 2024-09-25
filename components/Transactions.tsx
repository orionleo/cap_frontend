"use client";
import { Transaction } from "@/interaface/Transaction";
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

const Transactions = ({ token }: { token: string }) => {
  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/user/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { transactionLength, transactions } = res.data;
      setTransactionLength(transactionLength);
      setTransactions(transactions);
    })();
  }, [token]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionLength, setTransactionLength] = useState<number | null>(
    null
  );

  function formatDate(date: Date) {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format

    // Get the appropriate suffix for the day (st, nd, rd, th)
    const daySuffix = (d: number) => {
      if (d > 3 && d < 21) return "th"; // Special case for 11th-20th
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${daySuffix(
      day
    )} ${month}, ${year} ${hours}:${minutes}${ampm}`;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-[90%]">
      {transactionLength !== null ? (
        transactions.map((transaction) => {
          const timeStamp = new Date(transaction.timestamp);

          return (
            <div key={transaction.id} className="py-5">
              <Card>
                <CardHeader>
                  <CardTitle>{transaction.transactionType}</CardTitle>
                  <CardDescription>
                    From: {transaction.fromUserEmail}
                  </CardDescription>
                  <CardDescription>
                    To: {transaction.toUserEmail}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{formatDate(timeStamp)}</p>
                </CardContent>
                <CardFooter>
                  <p>{transaction.status}</p>
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

export default Transactions;
