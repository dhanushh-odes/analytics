import { useState, useEffect } from "react";
import { Plus, Users, Mail, Phone, MapPin } from "lucide-react";
import axios from "axios";

import PageHeader from "../../components/ui/PageHeader";
import SearchInput from "../../components/ui/SearchInput";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import EmptyState from "../../components/ui/EmptyState";
const emptyForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
};





export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const openEditModal = (customer) => {
    setEditingId(customer.id);

    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
    });

    setModalOpen(true);
  };
  const filtered = customers.filter(
    (customer) =>
      customer.name
        ?.toLowerCase()
        .includes(query.toLowerCase()) ||
      customer.email
        ?.toLowerCase()
        .includes(query.toLowerCase())
  );
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/customers/view`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCustomers(
        response.data.customers.map((customer) => ({
          id: customer.customer_id,
          name: customer.customer_name,
          email: customer.customer_email,
          phone: customer.phone_number,
          city: customer.city,

          totalOrders: Number(customer.total_orders),
          totalSpent: Number(customer.total_spent),
        }))
      );
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  useEffect(() => {

    fetchCustomers();
  }, []);
  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };
  const handleDelete = async (customerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/customers/delete/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Refresh customer list
      fetchCustomers();

    } catch (error) {
      console.error("Failed to delete customer:", error);

      alert(
        error.response?.data?.message ||
        "Failed to delete customer"
      );
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.city) {
      setError("Please fill all fields");
      return;
    }

    try {
      setError("");

      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/customers/update/${editingId}`,
          {
            customer_name: form.name,
            customer_email: form.email,
            phone_number: form.phone,
            city: form.city,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/customers/create`,
          {
            customer_name: form.name,
            customer_email: form.email,
            phone_number: form.phone,
            city: form.city,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      fetchCustomers();

      setForm(emptyForm);
      setEditingId(null);
      setModalOpen(false);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        (editingId
          ? "Failed to update customer"
          : "Failed to add customer")
      );
    }
  };


  return (
    <div>

      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customers in your workspace`}
        action={
          <Button
            icon={Plus}
            onClick={openAddModal}
          >
            Add Customer
          </Button>
        }
      />


      <div className="bg-white rounded-xl border border-gray-200">


        <div className="px-5 py-4 border-b border-gray-200">

          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by name or email..."
          />

        </div>



        {filtered.length === 0 ? (

          <EmptyState
            icon={Users}
            title="No customers found"
            description="Add a new customer."
          />

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="text-left text-xs font-medium text-gray-500 uppercase border-b">

                  <th className="px-5 py-3">
                    Customer
                  </th>

                  <th className="px-5 py-3">
                    Contact
                  </th>

                  <th className="px-5 py-3">
                    City
                  </th>

                  <th className="px-5 py-3">
                    Orders
                  </th>

                  <th className="px-5 py-3">
                    Total Spent
                  </th>
                  <th className="px-5 py-3">
                    Actions
                  </th>
                </tr>

              </thead>



              <tbody>

                {filtered.map((customer) => (

                  <tr
                    key={customer.id}
                    className="border-b hover:bg-gray-50"
                  >


                    <td className="px-5 py-3">

                      <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">

                          {customer.name.charAt(0)}

                        </div>


                        <span className="font-medium">

                          {customer.name}

                        </span>

                      </div>

                    </td>



                    <td className="px-5 py-3">

                      <div className="flex gap-2">

                        <Mail size={14} />

                        {customer.email}

                      </div>


                      <div className="flex gap-2 mt-1 text-gray-500">

                        <Phone size={14} />

                        {customer.phone}

                      </div>


                    </td>



                    <td className="px-5 py-3">

                      <div className="flex gap-2">

                        <MapPin size={14} />

                        {customer.city}

                      </div>

                    </td>



                    <td className="px-5 py-3">

                      {customer.totalOrders}

                    </td>



                    <td className="px-5 py-3">

                      ₹{customer.totalSpent.toLocaleString("en-IN")}

                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        >
                          Delete
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
        title="Add Customer"
      >

        <form onSubmit={handleSubmit}>


          <FormField

            label="Full name"

            value={form.name}

            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }

            placeholder="John Doe"

            required

          />



          <FormField

            label="Email"

            type="email"

            value={form.email}

            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }

            placeholder="john@gmail.com"

            required

          />



          <FormField

            label="Phone"

            value={form.phone}

            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value
              })
            }

            placeholder="9876543210"

            required

          />



          <FormField

            label="City"

            value={form.city}

            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value
              })
            }

            placeholder="Chennai"

            required

          />



          {error && (

            <p className="text-sm text-red-600 mt-2">

              {error}

            </p>

          )}



          <div className="flex justify-end gap-2 mt-4">


            <Button

              type="button"

              variant="secondary"

              onClick={() => setModalOpen(false)}

            >

              Cancel

            </Button>



            <Button type="submit">

              Add Customer

            </Button>


          </div>


        </form>


      </Modal>


    </div>
  );
}