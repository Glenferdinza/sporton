"use client";

import TransactionTable from "../../components/transactions/transaction-table";
import TransactiontModal from "../../components/transactions/transaction-modal";
import { useEffect, useState } from "react";
import { Transaction } from "@/app/types";
import { getAllTransactions } from "@/app/services/transaction.service";

const TransactionManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    try {
      const data = await getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-bold text-2xl">Transaction Management</h1>
          <p className="opacity-50">
            Verify incoming payments and manage orders.
          </p>
        </div>
      </div>
      <TransactionTable
        transactions={transactions}
        onViewDetails={handleViewDetails}
      />
      <TransactiontModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchTransactions}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionManagement;
