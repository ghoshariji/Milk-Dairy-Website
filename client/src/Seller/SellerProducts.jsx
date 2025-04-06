import React from 'react';
import SellerSideBar from '../components/SellerSidebar/SellerSidebar';

const products = [
  {
    id: 1,
    name: 'Kachi Ghaani Khal',
    brand: 'Kesar Bhog',
    price: '1800/-',
    image: '/images/product1.jpg',
  },
  {
    id: 2,
    name: 'Kachi Ghaani Khal',
    brand: 'Kesar Bhog',
    price: '1800/-',
    image: '/images/product2.jpg',
  },
  {
    id: 3,
    name: 'Kachi Ghaani Khal',
    brand: 'Kesar Bhog',
    price: '1800/-',
    image: '/images/product3.jpg',
  },
  {
    id: 4,
    name: 'Kachi Ghaani Khal',
    brand: 'Kesar Bhog',
    price: '1800/-',
    image: '/images/product4.jpg',
  },
];

const SellerProducts = () => {
  return (
    <div className="flex">
      <SellerSideBar />

      <div className="lg:ml-64 w-full mt-20 p-4 bg-gray-100 min-h-screen">
        <h2 className="text-xl font-semibold mb-4">Your Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition duration-200"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-3">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-sm text-gray-700">{product.price}</p>
                <p className="text-xs text-gray-500">{product.brand}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;
