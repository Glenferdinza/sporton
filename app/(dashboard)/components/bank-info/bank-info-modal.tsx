import Button from "@/app/(landing)/components/ui/button";
import Modal from "../ui/modal";
import { useEffect, useState } from "react";
import { Bank } from "@/app/types";
import { createBank, updateBank } from "@/app/services/bank.service";
import { toast } from "react-toastify";

type TBankInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bank?: Bank | null;
};

const BankInfoModal = ({
  isOpen,
  onClose,
  onSuccess,
  bank,
}: TBankInfoModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (bank) {
        await updateBank(bank._id, formData);
        toast.success("Bank updated successfully");
      } else {
        await createBank(formData);
        toast.success("Bank created successfully");
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Failed to submit bank", error);
      toast.error("Failed to submit bank");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      bankName: "",
      accountNumber: "",
      accountName: "",
    });
    onClose();
  };

  useEffect(() => {
    if (bank) {
      setFormData({
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        accountName: bank.accountName,
      });
    }
  }, [bank]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={bank ? "Edit Bank Account" : "Add New Bank Account"}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 w-full">
          <div className="input-group-admin">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              placeholder="e. g. Mandiri, BCA, BRI"
              value={formData.bankName}
              onChange={(e) =>
                setFormData({ ...formData, bankName: e.target.value })
              }
            />
          </div>
          <div className="input-group-admin">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              placeholder="123124344234234"
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
            />
          </div>
          <div className="input-group-admin">
            <label htmlFor="accountName">Account Name / Holder</label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              placeholder="Holder Name as registered on the account"
              value={formData.accountName}
              onChange={(e) =>
                setFormData({ ...formData, accountName: e.target.value })
              }
            />
          </div>
        </div>
        <Button
          className="ml-auto mt-3 rounded-lg"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading
            ? "Loading..."
            : bank
            ? "Update Bank Account"
            : "Create Bank Account"}
        </Button>
      </div>
    </Modal>
  );
};

export default BankInfoModal;
