export  interface Transaction {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    transactionType: 'SELF-TRANSFER' | 'TRANSFER';
    timestamp: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    fromUserId: string;
    toUserId: string;
    fromUserEmail:string;
    toUserEmail:string;
}
