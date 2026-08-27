import { useState, useEffect } from "react";
import { Plus, ShoppingCart, Filter } from "lucide-react";


import PageHeader from "../../components/ui/PageHeader";
import SearchInput from "../../components/ui/SearchInput";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import EmptyState from "../../components/ui/EmptyState";
import axios from "axios";



const emptyForm = {
  customer: "",
  products: [
    {
      product: "",
      quantity: 1,
    },
  ],
};

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const addProductRow = () => {
    setForm({
      ...form,
      products: [
        ...form.products,
        {
          product: "",
          quantity: 1,
        },
      ],
    });
  };
  const updateProduct = (index, field, value) => {
    const updated = [...form.products];

    updated[index][field] = value;

    setForm({
      ...form,
      products: updated,
    });
  };
  const deleteSale = async (saleId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/sales/delete/${saleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchSales();
    } catch (error) {
      console.log(error.response?.data);
    }
  };
  const removeProduct = (index) => {
    setForm({
      ...form,
      products: form.products.filter((_, i) => i !== index),
    });
  };
  const totalAmount = form.products.reduce((total, item) => {
    const product = products.find(
      (p) => p.name === item.product
    );

    if (!product) return total;

    return total + product.price * item.quantity;
  }, 0);
  const filtered = sales.filter((s) =>
    s.customer_name
      .toLowerCase()
      .includes(query.toLowerCase())
  );
  const fetchSales = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/sales/view",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSales(response.data.sales);
    } catch (error) {
      console.log(error.response?.data);
    }
  };
  useEffect(() => {
     fetchSales();
  fetchCustomers();
  fetchProducts();
  }, []);
  const viewSaleDetails = async (saleId, customerName) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/sales/view/${saleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSelectedSale({
        customer_name: customerName,
        products: response.data.products,
      });

      setDetailsOpen(true);
    } catch (error) {
      console.log(error.response?.data);
    }
  };
  const fetchCustomers = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/customers/view",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setCustomers(response.data.customers);
  } catch (error) {
    console.log(error.response?.data);
  }
};
const fetchProducts = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/products/products",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setProducts(response.data.products);
  } catch (error) {
    console.log(error.response?.data);
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const products = form.products.map((item) => ({
        product_id: Number(item.product),
        quantity: item.quantity,
      }));

      await axios.post(
        "http://localhost:3000/api/sales/create",
        {
          customer_id: Number(form.customer),
          sale_date: new Date().toISOString().slice(0, 10),
          products,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setModalOpen(false);
      setForm(emptyForm);
      fetchSales();

    } catch (error) {
      console.log(error.response?.data);
    }
  };
  return (
    <div>
      <PageHeader
        title="Sales"
        subtitle={`${sales.length} sales recorded`}
        action={
          <Button icon={Plus} onClick={() => setModalOpen(true)}>
            Add Sale
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search invoice, customer or product..."
          />


        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="No sales found"
            description="Try a different search term or filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">

                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Purchased Items</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Actions</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((sale) => (
                  <tr key={sale.sale_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900">
                      {sale.customer_name}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">
                      <button
                        onClick={() =>
                          viewSaleDetails(
                            sale.sale_id,
                            sale.customer_name
                          )
                        }
                        className="text-indigo-600 hover:underline"
                      >
                        View Products
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">
                      ₹{Number(sale.total_amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{sale.sale_date}</td>
                    <td className="px-5 py-3.5"> <button
                      onClick={() => deleteSale(sale.sale_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Sale">
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="block text-sm font-medium text-gray-700 mb-1.5">
              Customer
            </span>

            <select
              value={form.customer}
              onChange={(e) =>
                setForm({
                  ...form,
                  customer: e.target.value,
                })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Customer</option>

              {customers.map((c) => (
                <option
                  key={c.customer_id}
                  value={c.customer_id}
                >
                  {c.customer_name}
                </option>
              ))}
            </select>
          </label>
          <div className="space-y-4">
            {form.products.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-3"
              >
                <label className="block mb-3">
                  <span className="text-sm font-medium">
                    Product
                  </span>

                  <select
                    value={item.product}
                    onChange={(e) =>
                      updateProduct(
                        index,
                        "product",
                        e.target.value
                      )
                    }
                    className="w-full border rounded px-3 py-2 mt-1"
                  >
                    <option value="">
                      Select Product
                    </option>

                    {products.map((p) => (
                      <option
                        key={p.product_id}
                        value={p.product_id}
                      >
                        {p.product_name}
                      </option>
                    ))}
                  </select>
                </label>

                <FormField
                  label="Quantity"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateProduct(
                      index,
                      "quantity",
                      Number(e.target.value)
                    )
                  }
                />

                {item.product && (
                  <p className="text-sm text-gray-600 mt-2">
                    Price: ₹
                    {
                      products.find(
                        (p) => p.name === item.product
                      )?.price
                    }
                  </p>
                )}

                {form.products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-500 text-sm mt-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>


          <Button
            type="button"
            variant="secondary"
            onClick={addProductRow}
          >
            + Add Product
          </Button>

          <div className="mt-4 text-right font-semibold">
            Total Amount: ₹{totalAmount}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit">
              Add Sale
            </Button>

          </div></form>

      </Modal>
      <Modal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`${selectedSale?.customer_name}'s Purchases`}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Product</th>
              <th className="text-left py-2">Qty</th>
              <th className="text-left py-2">Price</th>
              <th className="text-left py-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {selectedSale?.products?.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
                <td>₹{item.subtotal}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="font-semibold">
              <td colSpan="3" className="pt-3">
                Grand Total
              </td>
              <td className="pt-3">
                ₹
                {selectedSale?.products
                  ?.reduce(
                    (total, item) =>
                      total + Number(item.subtotal),
                    0
                  )
                  .toLocaleString("en-IN")}
              </td>
            </tr>
          </tfoot>
        </table>
      </Modal>
    </div>
  );
}
