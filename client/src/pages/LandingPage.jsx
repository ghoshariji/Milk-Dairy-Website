import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { FaStore, FaTruck, FaTools } from "react-icons/fa";
import Phone from "../image/Phone.jpeg";
import PhoneImage from "../image/PhoneImage.png";
import Footer from "../components/Footer/Footer";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const screenshots = [
  "/images/screen1.png",
  "/images/screen2.png",
  "/images/screen3.png",
  "/images/screen4.png",
  "/images/screen5.png",
];

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="container mx-auto px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center mt-25">
        {/* Left Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-5xl font-extrabold text-gray-800 leading-tight">
            <span className="text-[#40A1CB]">Milk</span> Delivery App
          </h2>
          <p className="mt-4 text-gray-500 max-w-md">
            To stay ahead of the curve, serve your customers through an
            on-demand food delivery app.
          </p>
          <button className="mt-6 px-6 py-3 bg-[#40A1CB] text-white font-semibold rounded-lg shadow-lg hover:bg-green-700">
            Get Started
          </button>
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-12 md:mt-0 relative">
          <img
            src="/images/phones.png"
            alt="Milk Delivery App"
            className="w-2/3 md:w-3/5 lg:w-1/2"
          />
        </div>
      </div>

      {/* Milk Splash Background */}
      <div className="absolute bottom-0 left-0 w-full">
        <img
          src="/images/milk-splash.png"
          alt="Milk Splash"
          className="w-full h-auto"
        />
      </div>

      <section className="relative bg-gray-100 py-16 px-6 text-center">
        <h3 className="text-[#40A1CB] uppercase text-sm tracking-widest">
          Lotus Ipsum
        </h3>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">
          Why Are We Unique?
        </h2>

        {/* Unique Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto">
          <div className="p-6 flex flex-col items-center">
            <FaStore className="text-[#40A1CB] text-4xl mb-3" />
            <h4 className="font-semibold text-lg">We've Upped The Game.</h4>
            <p className="text-gray-600 mt-2">
              We carry a variety of products through our unique website for
              touch cost, typically not delivered.
            </p>
          </div>
          <div className="p-6 flex flex-col items-center">
            <FaTruck className="text-[#40A1CB] text-4xl mb-3" />
            <h4 className="font-semibold text-lg">
              Order From Our Virtual Mall
            </h4>
            <p className="text-gray-600 mt-2">
              Deliver your local needs from our local stores, typically fast
              delivery.
            </p>
          </div>
          <div className="p-6 flex flex-col items-center">
            <FaTools className="text-[#40A1CB] text-4xl mb-3" />
            <h4 className="font-semibold text-lg">
              Easy Access To Local Services
            </h4>
            <p className="text-gray-600 mt-2">
              Easy access to local services such as AC fixing, cleaning, and
              more.
            </p>
          </div>
        </div>

        {/* Torn Paper Effect */}
        <div className="absolute bottom-0 left-0 w-full h-10 bg-white"></div>
      </section>

      {/* The Innovative Way To Shop Section */}
      <section className="bg-gray-900 text-white py-16 px-6 relative text-center">
        <h3 className="text-gray-400 uppercase text-sm tracking-widest">
          The Innovative Way To Shop
        </h3>
        <p className="text-lg mt-2 max-w-3xl mx-auto">
          We’re here to redefine the way you shop with an improved shopping
          experience.
        </p>

        {/* Mobile Image & Play Store Button */}
        <div className="flex flex-col md:flex-row items-center justify-center mt-8 space-y-6 md:space-x-8">
          <img
            src={Phone}
            width={200}
            height={400}
            alt="App Screenshot"
            className="rounded-lg shadow-lg"
          />
          <button className="bg-[#40A1CB] text-white px-6 py-3 rounded-lg flex items-center space-x-2 shadow-md">
            <FaStore className="text-xl" />
            <span>Download on Google Play</span>
          </button>
        </div>

        {/* Torn Paper Effect */}
        <div className="absolute bottom-0 left-0 w-full h-10 bg-white"></div>
      </section>

      <section className="bg-gray-100 py-12 px-4">
        {/* Features Header */}
        <div className="text-center">
          <p className="text-[#40A1CB] uppercase font-semibold">Features</p>
          <h2 className="text-3xl font-bold">Awesome Features</h2>
        </div>

        {/* Features Content */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
          {/* Left Side Features */}
          <div className="space-y-6 text-right">
            {[...Array(3)].map((_, index) => (
              <div key={index}>
                <h3 className="font-bold text-lg">Near By Stores</h3>
                <p className="text-gray-600">
                  Discover Local Stores Based on Your GPS Location
                </p>
              </div>
            ))}
          </div>

          {/* Center Image */}
          <div>
            <img
              src={PhoneImage}
              alt="Mobile App"
              className="w-48 md:w-64 shadow-lg"
            />
          </div>

          {/* Right Side Features */}
          <div className="space-y-6 text-left">
            {[...Array(3)].map((_, index) => (
              <div key={index}>
                <h3 className="font-bold text-lg">Near By Stores</h3>
                <p className="text-gray-600">
                  Discover Local Stores Based on Your GPS Location
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* App Download Section */}
        <div className="text-center mt-16">
          <p className="text-[#40A1CB] uppercase font-semibold">Lorem Ipsum</p>
          <h2 className="text-3xl font-bold">App Download</h2>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto">
          {[
            "1000 App Downloads",
            "2000 Happy Clients",
            "400 Active Accounts",
            "200 Total App Rates",
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <p className="text-[#40A1CB] font-bold text-2xl">
                {stat.split(" ")[0]}
              </p>
              <p className="text-gray-600">
                {stat.split(" ").slice(1).join(" ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 bg-gray-50">
        <div className="text-center">
          <h3 className="text-[#40A1CB] font-semibold">SCREENSHOTS</h3>
          <h2 className="text-2xl font-bold">App Screenshots</h2>
        </div>
        <div className="max-w-5xl mx-auto mt-6">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {screenshots.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`App Screenshot ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 items-center gap-6">
        <div>
          <h4 className="text-[#40A1CB] uppercase text-sm font-semibold">
            Reviews
          </h4>
          <h2 className="text-3xl font-bold mb-4">Client Reviews</h2>
          <p className="text-gray-600 mb-4">
            Love This App!! I’m Looking Forward For Them To Add More Of My
            Favorite Stores So I Can Use Them More Often. Lorem Ipsum is simply
            dummy text of the printing and typesetting industry.
          </p>
          <div className="flex items-center gap-3">
            <img
              src="https://via.placeholder.com/50"
              alt="Reviewer"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h4 className="font-semibold">Alhlolal</h4>
              <p className="text-gray-500 text-sm">
                Finally A Great App With Variety
              </p>
            </div>
          </div>
        </div>
        <div>
          <img
            src="https://via.placeholder.com/300"
            alt="Dairy Products"
            className="w-full rounded-lg"
          />
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="bg-cover bg-center py-16 px-6 flex flex-col-reverse md:flex-row items-center md:items-start"
        style={{
          backgroundImage: "url('https://via.placeholder.com/800x400')",
        }}
      >
        {/* Left Side - Image */}
        <div className="md:w-1/2 w-full flex justify-center">
          <img
            src={PhoneImage}
            alt="Milk and Dairy Products"
            className="w-full max-w-sm rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side - Contact Form */}
        <div className="md:w-2/5 w-full bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-[#40A1CB] uppercase text-sm font-semibold">
            Contact Us
          </h4>
          <h2 className="text-3xl font-bold mb-4">Get In Touch With Us!</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border rounded-md"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border rounded-md"
            />
            <textarea
              placeholder="Your Message"
              className="w-full p-3 border rounded-md"
            ></textarea>
            <button className="bg-[#40A1CB] text-white px-6 py-2 rounded-md hover:bg-[#40A1CB]">
              Send Now
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
