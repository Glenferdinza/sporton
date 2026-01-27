import Button from "@/app/(landing)/components/ui/button";
import Modal from "../ui/modal";
import ImageUploadPreview from "../ui/image-upload-preview";
import { useEffect, useState } from "react";
import { Category } from "@/app/types";
import {
  createCategory,
  updateCategory,
} from "@/app/services/category.service";
import { toast } from "react-toastify";

type TCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | null;
};

const CategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}: TCategoryModalProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      if (imageFile) {
        data.append("image", imageFile);
      }

      if (category) {
        await updateCategory(category._id, data);
        toast.success("Category updated successfully");
      } else {
        await createCategory(data);
        toast.success("Category created successfully");
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Failed to submit category", error);
      toast.error("Failed to submit category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
    });
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
      });
      setImagePreview(category.imageUrl);
    }
  }, [category]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={category ? "Edit Category" : "Add New Category"}
    >
      <div className="flex flex-col gap-6">
        <div className="flex gap-7">
          <div className="min-w-50">
            <ImageUploadPreview
              label="Category Image"
              value={imagePreview}
              onChange={(file) => {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }}
            />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="input-group-admin">
              <label htmlFor="categoryName">Category Name</label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                placeholder="e. g. Running"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="input-group-admin">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                rows={4}
                placeholder="Category Details..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>
            </div>
          </div>
        </div>
        <Button
          className="ml-auto mt-3 rounded-lg"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading
            ? "Loading..."
            : category
            ? "Update Category"
            : "Create Category"}
        </Button>
      </div>
    </Modal>
  );
};

export default CategoryModal;
