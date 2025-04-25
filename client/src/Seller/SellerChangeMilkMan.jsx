import React, { useEffect, useState } from "react";
import { MapPin, Phone } from "lucide-react";
import API from "../api";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import SellerSideBar from "../components/SellerSidebar/SellerSidebar";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../components/Loader/Loader";
import Authentication from "../utils/Authentication";

const SellerChangeMilkMan = () => {
  const [milkmanList, setMilkmanList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("user123"); // replace with real user selection
  const [loading, setLoading] = useState(false);
  // Get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
          reject("Failed to retrieve location.");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  };

  // Fetch milkmen from API
  useEffect(() => {
    const fetchMilkmen = async () => {
      try {
        setLoading(true);
        const { latitude, longitude } = await getCurrentLocation();
        const res = await API.get(
          `/api/auth/milkman/get-all/${latitude}/${longitude}`
        );
        setLoading(false);
        if (res.status === 200) {
          setMilkmanList(res.data.milkmen);
          setFilteredList(res.data.milkmen);
        } else {
          setMilkmanList([]);
          setFilteredList([]);
        }
      } catch (err) {
        setLoading(false);

        console.error(err);
      }
    };

    fetchMilkmen();
  }, []);

  // Filter logic
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredList(milkmanList);
    } else {
      setFilteredList(
        milkmanList.filter((milkman) =>
          milkman.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, milkmanList]);

  // Assign milkman
  const assignMilkman = async (milkManName) => {
    if (!selectedUserId) {
      alert("Please select a user.");
      return;
    }
    setLoading(true);
    try {
      await API.post(`/api/change-milkman`, {
        userId: selectedUserId,
        milkManName,
      });
      setLoading(false);
      toast.success("Milkman updated successfully!");
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error("Failed to assign milkman.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer />
      <SellerSideBar />
      <Authentication />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <div className="flex-1 p-6 mt-20 lg:ml-64">
        <div className="max-w-3xl mx-auto">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search milkman by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
          />

          {/* List */}
          <div className="flex flex-col space-y-4">
            {filteredList.length > 0 ? (
              filteredList.map((milkman, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-lg shadow p-4"
                >
                  {/* Avatar + Info */}
                  <div className="flex items-start sm:items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#40A1CB] text-white flex items-center justify-center font-bold text-xl">
                      {milkman.name.charAt(0)}
                    </div>
                    <div className="ml-4 space-y-1">
                      <h3 className="text-lg font-semibold">{milkman.name}</h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>Distance: {milkman.distance}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Phone className="w-4 h-4 mr-1" />
                        <span>{milkman.phone || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Assign button */}
                  <button
                    onClick={() => assignMilkman(milkman.name)}
                    className="mt-4 sm:mt-0 bg-[#40A1CB] text-white px-5 py-2 rounded-lg hover:cursor-pointer transition self-end sm:self-center"
                  >
                    Assign
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No Milkman Found...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerChangeMilkMan;
