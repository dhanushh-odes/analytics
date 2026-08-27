import { useState, useEffect } from "react";
import { Plus, Tags, Pencil, Trash2 } from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import EmptyState from "../../components/ui/EmptyState";
import axios from "axios";


const emptyForm = { name: "", };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories/view`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCategories(
        response.data.categories.map((category) => ({
          id: category.cat_id,
          name: category.category_name,
          products: Number(category.products),
        }))
      );
      console.log(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/categories/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchCategories();

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong";

      alert(message);

      console.error(
        "Failed to delete category:",
        error.response?.data || error
      );
    }
  };
  
  const openEditModal = (category) => {
    setEditingId(category.id);

    setForm({
      name: category.name,
    });

    setModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) return;

    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/categories/update/${editingId}`,
          {
            category_name: form.name,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/categories/create`,
          {
            category_name: form.name,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      fetchCategories();

      setForm(emptyForm);
      setEditingId(null);
      setModalOpen(false);

    } catch (error) {
      console.error(error.response?.data || error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };
  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categories used to organize products`}
        action={
          <Button icon={Plus} onClick={openAddModal}>
            Add Category
          </Button>
        }
      />

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={Tags}
            title="No categories yet"
            description="Create a category to start organizing your products."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Tags size={16} className="text-indigo-600" strokeWidth={2} />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-semibold text-gray-900 mt-3">
                {category.name}
              </h3>


              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-700">
                  {category.products} products
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
          setForm(emptyForm);
        }}
        title={editingId ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit}>
          <FormField
            label="Category name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Electronics"
            required
          />

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? "Save Changes" : "Add Category"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
