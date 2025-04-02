import React, { useState, useEffect } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

const MilkmanSellMilk = () => {
  const [formData, setFormData] = useState({
    date: new Date(),
    enterCode: "",
    name: "",
    weight: "",
    rate: "",
  });

  const [productData, setProductData] = useState({
    date: new Date(),
    name: "",
    phone: "",
    deliveryAddress: "",
    code: "",
    item: "",
    quantity: "",
    price: "",
    paymentMode: "",
  });

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get(
          "/api/milkman/product/get-sellMilk-product"
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleMilkSubmit = async () => {
    setLoading(true);
    try {
      await API.post("/api/milk/sell-milk-anydate", formData);
      toast.success("Milk updated successfully");
      setFormData({ date: new Date(), enterCode: "", weight: "", rate: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleProductAdd = async () => {
    setLoading(true);
    if (
      !productData.name ||
      !productData.phone ||
      !productData.deliveryAddress ||
      !productData.code ||
      !productData.item ||
      !productData.quantity ||
      !productData.price ||
      !productData.paymentMode
    ) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }
    try {
      await API.post("/api/order/sell-milk-data-add", productData);
      toast.success("Product added successfully");
      setProductData({
        date: new Date(),
        name: "",
        phone: "",
        deliveryAddress: "",
        code: "",
        item: "",
        quantity: "",
        price: "",
        paymentMode: "",
      });
      setSelectedProduct(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <>
      <AdminNav />
      <ToastContainer />
      <div className="lg:ml-64 mt-20 p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-[#40A1CB]">Sell Milk</h3>
          <input
            type="text"
            placeholder="Enter Code"
            value={formData.enterCode}
            onChange={(e) =>
              setFormData({ ...formData, enterCode: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Weight"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Rate"
            value={formData.rate}
            onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleMilkSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Sell Milk"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-lg font-semibold text-[#40A1CB]">Add Product</h3>
          <input
            type="text"
            placeholder="Name"
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Phone"
            value={productData.phone}
            onChange={(e) =>
              setProductData({ ...productData, phone: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Delivery Address"
            value={productData.deliveryAddress}
            onChange={(e) =>
              setProductData({
                ...productData,
                deliveryAddress: e.target.value,
              })
            }
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Code"
            value={productData.code}
            onChange={(e) =>
              setProductData({ ...productData, code: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Item"
            value={productData.item}
            onChange={(e) =>
              setProductData({ ...productData, item: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={productData.quantity}
            onChange={(e) =>
              setProductData({ ...productData, quantity: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={productData.price}
            onChange={(e) =>
              setProductData({ ...productData, price: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Payment Mode"
            value={productData.paymentMode}
            onChange={(e) =>
              setProductData({ ...productData, paymentMode: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleProductAdd}
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Product"}
          </button>
        </div>
      </div>
    </>
  );
};

export default MilkmanSellMilk;
