import React, { useEffect, useState } from "react";
import SellerSideBar from "../components/SellerSidebar/SellerSidebar";
import { MapPin, Phone } from "lucide-react";
import axios from "axios";
import API from "../api";

const SellerChangeMilkMan = () => {
  const [milkmanList, setMilkmanList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("user123"); // replace with real user selection

  // Get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error)
      );
    });
  };

  // Fetch milkmen from API
  useEffect(() => {
    const fetchMilkmen = async () => {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        const res = await API.get(
          `/api/auth/milkman/get-all/${latitude}/${longitude}`
        );

        if (res.status === 200) {
          console.log(res.data.milkmen);
          setMilkmanList(res.data.milkmen);
          setFilteredList(res.data.milkmen);
        } else {
          alert("Failed to fetch milkmen");
        }
      } catch (err) {
        console.error(err);
        alert("Location or fetch error");
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

    try {
      await API.post(`/api/change-milkman`, {
        userId: selectedUserId,
        milkManName,
      });
      alert("Milkman updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to assign milkman.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SellerSideBar />

      <div className="flex-1 p-6 mt-20 lg:ml-64">
        <div className="max-w-3xl mx-auto">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search milkman by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* List */}
          <div className="space-y-4">
            {filteredList.map((milkman, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white rounded-lg shadow p-4 hover:shadow-md transition duration-300"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
                    {milkman.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{milkman.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      Distance : {milkman.distance}
                    </div>

                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Phone className="w-4 h-4 mr-1" />
                      {milkman.phone || "N/A"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => assignMilkman(milkman.name)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerChangeMilkMan;
