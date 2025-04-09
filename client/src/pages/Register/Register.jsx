import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Register = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    upiId: "",
    village: "",
    enterCode: "",
    subcriptionCode: "",
    password: "",
    userType: role,
    milkman: null,
  });

  const [milkmen, setMilkmen] = useState([]);
  const [filteredMilkmen, setFilteredMilkmen] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getLocationAndFetch = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `${
              import.meta.env.VITE_SERVER
            }/api/auth/milkman/get-all/${latitude}/${longitude}`
          );
          const data = await res.json();
          setMilkmen(data.milkmen);
          setFilteredMilkmen(data.milkmen);
        } catch (err) {
          setError("Failed to fetch milkmen.");
        }
      },
      () => setError("Unable to retrieve location.")
    );
  };
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported.");
        reject(new Error("Geolocation is not supported."));
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          resolve({ latitude, longitude, accuracy });
        },
        () => {
          setError("Unable to retrieve location.");
          reject(new Error("Unable to retrieve location."));
        }
      );
    });
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setToast("");
    setLoading(true);
    const location = await getCurrentLocation();
    const updatedForm = {
      ...form,
      location, // Add the location object containing latitude and longitude
    };
    const apiUrl =
      role === 'milkman'
        ? `${import.meta.env.VITE_SERVER}/api/auth/milkman/register`
        : `${import.meta.env.VITE_SERVER}/api/auth/user/register`;
    try {
      const res = await fetch(
        apiUrl,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedForm),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Registration failed");

      setToast("Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
        console.log("Error" + error)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationAndFetch();
  }, []);

  useEffect(() => {
    const filtered = milkmen.filter((milkman) =>
      milkman.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredMilkmen(filtered);
  }, [searchText]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">Register as {type}</h2>

        {error && <div className="text-red-500">{error}</div>}
        {toast && <div className="text-green-500">{toast}</div>}

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <input
            className="input"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            className="input"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            className="input"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <input
            className="input"
            name="upiId"
            placeholder="UPI ID"
            value={form.upiId}
            onChange={handleChange}
          />
          <input
            className="input"
            name="village"
            placeholder="Village"
            value={form.village}
            onChange={handleChange}
          />
          <input
            className="input"
            name="enterCode"
            placeholder="Referral Code"
            value={form.enterCode}
            onChange={handleChange}
          />
          <input
            className="input"
            name="subcriptionCode"
            placeholder="Subscription Code"
            value={form.subcriptionCode}
            onChange={handleChange}
          />

          {role !== "milkman" && (
            <div className="col-span-1 md:col-span-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600"
              >
                {form.milkman
                  ? `Selected: ${form.milkman.name}`
                  : "Select Milkman"}
              </button>
            </div>
          )}

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Register"}
            </button>
          </div>
        </form>
      </div>
      <div className="mb-4 flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Select Role:
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="customer"
              checked={role === "customer"}
              onChange={() => setRole("customer")}
              className="mr-2"
            />
            Customer
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="seller"
              checked={role === "seller"}
              onChange={() => setRole("seller")}
              className="mr-2"
            />
            Seller
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="milkman"
              checked={role === "milkman"}
              onChange={() => setRole("milkman")}
              className="mr-2"
            />
            Milkman
          </label>
        </div>
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-4 rounded-xl shadow-xl">
            <h3 className="text-lg font-bold mb-2">Select Milkman</h3>
            <input
              type="text"
              className="w-full border p-2 rounded mb-2"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredMilkmen.map((m) => (
                <div
                  key={m._id}
                  className="border p-2 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, milkman: m }));
                    setModalOpen(false);
                  }}
                >
                  {m.name}
                </div>
              ))}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
