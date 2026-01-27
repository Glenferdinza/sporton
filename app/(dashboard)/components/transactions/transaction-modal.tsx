import Button from "@/app/(landing)/components/ui/button";
import Modal from "../ui/modal";
import Image from "next/image";
import priceFormatter from "@/app/utils/price-formatter";
import { FiCheck, FiX } from "react-icons/fi";
import { Transaction } from "@/app/types";
import { updateTransactionStatus } from "@/app/services/transaction.service";
import { toast } from "react-toastify";
import { useState } from "react";
import { getImageUrl } from "@/app/lib/api";

type TTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: Transaction | null;
};

const TransactionModal = ({
  isOpen,
  onClose,
  onSuccess,
  transaction,
}: TTransactionModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async (status: "paid" | "rejected") => {
    if (!transaction) return;
    setIsLoading(true);
    try {
      await updateTransactionStatus(transaction._id, status);
      toast.success(`Transaction ${status === "paid" ? "approved" : "rejected"} successfully`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update transaction status", error);
      toast.error("Failed to update transaction status");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Transactions">
      <div className="flex gap-6">
        <div>
          <h4 className="font-semibold text-sm mb-2">Payment Proof</h4>
          <Image
            src={getImageUrl(transaction.paymentProof)}
            alt="payment proof"
            width={200}
            height={401}
            className="rounded-lg object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Order Details</h4>
          <div className="bg-gray-100 rounded-md flex flex-col gap-2.5 p-4  text-sm mb-5">
            <div className="flex justify-between font-medium">
              <div className="opacity-50">Date</div>
              <div className="text-right">{formatDate(transaction.createdAt)}</div>
            </div>
            <div className="flex justify-between font-medium">
              <div className="opacity-50">Customer</div>
              <div className="text-right">{transaction.customerName}</div>
            </div>
            <div className="flex justify-between font-medium">
              <div className="opacity-50">Contact</div>
              <div className="text-right">{transaction.customerContact}</div>
            </div>
            <div className="flex justify-between gap-10 font-medium">
              <div className="opacity-50 whitespace-nowrap">
                Shipping Address
              </div>
              <div className="text-right">
                {transaction.customerAddress}
              </div>
            </div>
          </div>

          <h4 className="font-semibold text-sm mb-2">Items Purchased</h4>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {transaction.purchasedItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-2 flex items-center gap-2"
              >
                <div className="bg-gray-100 rounded aspect-square w-8 h-8">
                  <Image
                    src={getImageUrl(item.productId.imageUrl)}
                    width={30}
                    height={30}
                    alt="product image"
                  />
                </div>
                <div className="font-medium text-sm">{item.productId.name}</div>
                <div className="font-medium ml-auto text-sm">
                  {item.qty} units
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between  text-sm mt-6">
            <h4 className="font-semibold">Total </h4>
            <div className="text-primary font-semibold">
              {priceFormatter(Number(transaction.totalPayment))}
            </div>
          </div>
          {transaction.status === "pending" && (
            <div className=" flex justify-end gap-5 mt-12">
              <Button
                className="text-primary! bg-primary-light! rounded-md"
                size="small"
                onClick={() => handleStatusUpdate("rejected")}
                disabled={isLoading}
              >
                <FiX size={20} />
                Reject
              </Button>
              <Button
                className="text-white! bg-[#50C252]! rounded-md"
                size="small"
                onClick={() => handleStatusUpdate("paid")}
                disabled={isLoading}
              >
                <FiCheck size={20} />
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TransactionModal;
