"use client";

import Button from "@/app/(landing)/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import BankInfoList from "../../components/bank-info/bank-info-list";
import BankInfoModal from "../../components/bank-info/bank-info-modal";
import { Bank } from "@/app/types";
import { deleteBank, getAllBanks } from "@/app/services/bank.service";
import DeleteModal from "../../components/ui/delete-modal";
import { toast } from "react-toastify";

const BankInfoManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [bankToDelete, setBankToDelete] = useState<string>("");

  const fetchBanks = async () => {
    try {
      const data = await getAllBanks();
      setBanks(data);
    } catch (error) {
      console.error("Failed to fetch banks", error);
    }
  };

  const handleEdit = (bank: Bank) => {
    setSelectedBank(bank);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setBankToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bankToDelete) return;
    try {
      await deleteBank(bankToDelete);
      toast.success("Bank deleted successfully");
      fetchBanks();
      setIsDeleteModalOpen(false);
      setBankToDelete("");
    } catch (error) {
      console.error("Failed to delete bank", error);
      toast.error("Failed to delete bank");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBank(null);
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-bold text-2xl">Bank Info Management</h1>
          <p className="opacity-50">
            Manage destination accounts for customer transfers.
          </p>
        </div>
        <Button className="rounded-lg" onClick={() => setIsModalOpen(true)}>
          <FiPlus size={24} />
          Add Bank Account
        </Button>
      </div>
      <BankInfoList banks={banks} onEdit={handleEdit} onDelete={handleDelete} />
      <BankInfoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchBanks}
        bank={selectedBank}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBankToDelete("");
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default BankInfoManagement;
