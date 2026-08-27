import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import SearchInput from "../../components/ui/SearchInput";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import EmptyState from "../../components/ui/EmptyState";
import axios from "axios";

const emptyForm = { name: "", category: "", price: "", stock: "" };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
  setEditingId(product.id);

  setForm({
    name: product.name,
    category: product.categoryId,
    price: product.price,
    stock: product.stock,
  });

  setModalOpen(true);
};

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchProducts(); // refresh list

    } catch (error) {
      console.error(
        "Failed to delete product:",
        error.response?.data || error
      );
    }
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
        }))
      );
    } catch (error) {
      console.error(error);
      console.log(response.data);
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/products`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.products);
      setProducts(
        response.data.products.map((product) => ({
          id: product.product_id,
          name: product.product_name,
          categoryId: product.category_of_product_id,
          categoryName: product.category_name,
          price: product.product_price,
          stock: product.quantity,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchProducts();

    fetchCategories();
  }, []);
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !form.name ||
    !form.category ||
    !form.price ||
    !form.stock
  ) {
    return;
  }

  try {
    if (editingId) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/products/update/${editingId}`,
        {
          product_name: form.name,
          product_price: Number(form.price),
          category_of_product_id: Number(form.category),
          quantity: Number(form.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } else {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/create`,
        {
          product_name: form.name,
          product_price: Number(form.price),
          category_of_product_id: Number(form.category),
          quantity: Number(form.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }

    fetchProducts();

    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(false);

  } catch (error) {
    console.error(
      error.response?.data || error
    );
  }
};  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products in your catalog`}
        action={
          <Button icon={Plus} onClick={openAddModal}>
            Add Product
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search products or category..."
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products found"
            description="Try a different search term or add a new product."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{product.categoryName}</td>
                    <td className="px-5 py-3.5 text-gray-700">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      {product.stock === 0 ? (
                        <Badge tone="danger">Out of stock</Badge>
                      ) : product.stock < 10 ? (
                        <Badge tone="warning">{product.stock} left</Badge>
                      ) : (
                        <Badge tone="success">{product.stock} in stock</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Product" : "Add Product"}
      >
        <form onSubmit={handleSubmit}>
          <FormField
            label="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Laptop"
            required
          />
          <label className="block mb-4">
            <span className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </span>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select category</option>

              {categories.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <FormField
            label="Price (₹)"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0"
          />
          <FormField
            label="Stock quantity"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="0"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingId ? "Save Changes" : "Add Product"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
