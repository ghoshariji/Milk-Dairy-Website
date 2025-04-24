import React, { useEffect, useState, useRef } from "react";
import phoneImg from "./assets/phone.png";
import bg from "./assets/bg.png";
import milkbg from "./assets/milkbg.png";
import thought from "./assets/thought.png";
import iphone from "./assets/iphone.png";
import iphone14 from "./assets/Iphone14.png";
import line from "./assets/line.png";
import dot from "./assets/dot.png";
import phone12 from "./assets/mani.jpg";
import jarbg from "./assets/bg_bottom.png";
import milkwave from "./assets/milkwave.png";
import "../index.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import screen1 from "./assets/screen1.png";
import screen2 from "./assets/screen2.png";
import screen3 from "./assets/screen2.png";
import screen4 from "./assets/screen2.png";
import screen5 from "./assets/screen2.png";

import downloadIcon from "./assets/download.png";
import starIcon from "./assets/start.png";
import userIcon from "./assets/usergole.png";
import smileIcon from "./assets/happy.png";

import milkproduct from "./assets/milkproduct.png";
import client1 from "./assets/client1.png";
import { toast, ToastContainer } from "react-toastify";

import { motion, useInView } from "framer-motion";
import { ShoppingCart, Store, Truck } from "lucide-react";


import AOS from 'aos';
import 'aos/dist/aos.css';


import playstore from "./assets/play-store.svg";
import Navbar from "../components/Navbar/Navbar";
import AdPopup from "../components/Add/AddPopU[p";
import CouponComm from "../components/Coupon/CouponComm";
const LandingPage = () => {
  const screenshots = [screen1, screen2, screen3, screen4, screen5];

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 800,    // animation duration in ms
      once: false,      // ❗important: repeat every scroll
      mirror: true, 

    });
  }, []);
  const Card = ({ Icon, title, desc, delay }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: false, amount: 0.3 }}
        className="flex flex-col items-center px-4">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <Icon className="w-8 h-8 text-[#40A1CB]" />
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm text-center">{desc}</p>
      </motion.div>
    );
  };
  
  
  


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/get-in/add`,
        formData
      );
      toast.success("We will get back to you soon...");
      console.log("Response:", response.data);
      // Clear form
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Something went wrong. Try again!");
    }
  };
  const [ads, setAds] = useState([]);

  const fetchAds = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api/add/media`);
      const data = await res.json();

      const adsWithUrls = data.map((ad) => {
        if (ad.media && ad.media.data && ad.media.contentType) {
          const uint8Array = new Uint8Array(ad.media.data.data);
          const blob = new Blob([uint8Array], { type: ad.media.contentType });
          const mediaUrl = URL.createObjectURL(blob);
          return { ...ad, mediaUrl };
        } else {
          return { ...ad, mediaUrl: null }; // fallback if no media
        }
      });

      setAds(adsWithUrls);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <div className="font-sans">
      {/* Navbar */}
      <Navbar />
      <ToastContainer />
      {/* Hero Section */}

      <section id="home" className="relative px-6 md:px-10 py-16 md:py-20 bg-white overflow-hidden"
  style={{
    backgroundImage: `url(${bg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "top center",
  }}>
  <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
    
    {/* Animated Text Section */}
    <div
  className="lg:w-1/2 text-center lg:text-left z-10"
  data-aos="fade-up"
  data-aos-duration="800"
>
  <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
    <span className="text-[#40A1CB]">Milk</span> Delivery App
  </h1>
  <p className="text-gray-600 mt-4 max-w-md mx-auto lg:mx-0 text-base sm:text-lg">
    To stay ahead of the curve, serve your customers through an on-demand food delivery app.
  </p>

  <div className="flex flex-wrap items-center justify-center lg:justify-start mt-6 gap-4">
    <button
      className="text-white px-6 py-3 rounded-lg shadow transition hover:brightness-90"
      style={{ backgroundColor: "#40A1CB" }}
      onClick={() => navigate("/login")}
    >
      Get Started
    </button>
  </div>
</div>

{/* Animated Phone Image */}
<div
  className="lg:w-1/2 flex justify-center mb-10 lg:mb-0 z-10"
  data-aos="fade-left"
  data-aos-delay="200"
  data-aos-duration="800"
>
  <img
    src={phoneImg}
    alt="Phone Display"
    className="w-72 sm:w-80 md:w-[30rem] lg:w-[36rem]"
  />
</div>

  </div>

  {/* Bottom Milk Background */}
  <div
    className="absolute left-0 w-full"
    style={{
      bottom: 0,
      height: "478px",
      backgroundImage: `url(${milkbg})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "bottom center",
      zIndex: 1,
    }}></div>
</section>
      <AdPopup ads={ads} />

      {/* Unique Section */}
      <section
        className="relative px-6 py-24 bg-white"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
               <div className="relative z-10 max-w-6xl mx-auto text-center">
      <p className="text-[#40A1CB] text-sm mb-2 tracking-widest">Hallo Dairy</p>
      <h2 className="text-2xl sm:text-3xl font-bold mb-12">Why Are We Unique?</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <div data-aos="fade-up" data-aos-delay="0" className="transition duration-500 ease-in-out transform hover:scale-105">
          <Card
            Icon={ShoppingCart}
            title="We've Upped The Game."
            desc="We carry a variety of products through our unique vendors that you can't typically get delivered."
          />
        </div>

        <div data-aos="fade-up" data-aos-delay="200" className="transition duration-500 ease-in-out transform hover:scale-105">
          <Card
            Icon={Store}
            title="Order From Our Virtual Mall Of Local Stores"
            desc="Order from a large variety of local stores you like and trust for items you can't typically get delivered."
          />
        </div>

        <div data-aos="fade-up" data-aos-delay="400" className="transition duration-500 ease-in-out transform hover:scale-105">
          <Card
            Icon={Truck}
            title="Easy Access To Local Services"
            desc="Easy access to local services such as dry cleaning. We can pick it up and drop it off to make your life easier."
          />
        </div>
      </div>
    </div>

{/* VIDEO SECTION */}



      </section>

      <section className="relative px-6 md:px-10 py-16 md:py-20 bg-white overflow-hidden">
  <div className="max-w-6xl mx-auto text-center">
  <p
  className="text-[#40A1CB] text-sm tracking-widest mb-2"
  data-aos="fade-up"
  data-aos-duration="800"
>
  WATCH NOW
</p>

<h2
  className="text-4xl font-bold text-gray-900 mb-10"
  data-aos="fade-up"
  data-aos-delay="200"
  data-aos-duration="1000"
>
  Discover How It Works
</h2>


    {/* Video Container */}
    <div className="relative inline-block">
      <div className="relative aspect-w-16 aspect-h-9">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/your-video-id" // Replace with your actual video URL
          title="App Overview Video"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  </div>
</section>

      {/* Bottom Banner Section */}
      <section
        className="relative w-full h-auto lg:h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${thought})` }}
      >
        {/* Overlay */}

        <div className="relative z-10 px-6 lg:px-10 flex flex-col lg:flex-row items-center lg:items-start justify-between h-full pt-10 lg:pt-20">
          {/* Left Content */}
          <div className="max-w-xl text-white text-center lg:text-left mt-20">
            <h1 className="text-3xl text-[#40A1CB] lg:text-4xl font-bold mb-6">
              The Innovative Way To Shop
            </h1>
            <p className="text-base lg:text-lg mb-6">
              When You Join Deliver2e You Will Enjoy Our New And Improved Way Of
              Shopping Through Our Virtual Mall Experience
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=com.yourapp.dairy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={playstore}
                alt="Get it on Google Play"
                className="w-40 mx-auto lg:mx-0 mt-4"
              />
            </a>
          </div>

          {/* Phone Image (responsive placement) */}
          <div className="mt-10 lg:mt-0 lg:ml-10 relative w-60 h-[400px] lg:w-80 lg:h-[500px]">
            {/* Inner background in screen */}
            <img
              src={thought}
              alt="Background inside phone"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-[40px] z-0"
            />
            {/* iPhone Frame */}
            <img
              src={phone12}
              alt="iPhone Frame"
              className="absolute top-0 left-0 w-full h-full z-10"
            />
          </div>
        </div>
      </section>

      {/* FEATURES section */}

      {/* FEATURES section */}
      <section className="bg-white pt-24 pb-10 text-center relative">
        <p className="text-[#40A1CB] text-sm tracking-widest mb-2">FEATURES</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-10">
          Awsome Features
        </h2>

        {/* Mobile & Tab view: Horizontal scrollable timeline above phone */}
        <div className="block lg:hidden">
          <div className="relative w-full overflow-x-auto px-4 mb-10">
            <div className="flex items-start space-x-10 min-w-[600px] relative pb-10">
              {/* Horizontal Line */}
              <img
                src={line}
                alt="line"
                className="absolute top-4 left-0 right-0 w-full h-1"
              />

              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[180px] relative"
                >
                  <img src={dot} alt="dot" className="w-4 h-4 mb-3 z-10" />
                  <h3 className="text-md font-semibold mb-1 text-gray-900">
                    Near By Stores
                  </h3>
                  <p className="text-sm text-gray-600 text-center px-2">
                    Discover Local Stores Based On Your GPS Location
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Phone image in center */}
          <div className="flex justify-center">
            <img src={iphone14} alt="Phone" className="w-64 sm:w-72 " />
          </div>
        </div>

        {/* Desktop layout: Original vertical version */}
        <div className="hidden lg:flex justify-center items-start gap-10 mt-16 relative">
          {/* LEFT TEXT */}
          <div className="relative flex flex-col items-end gap-16 pt-12">
            <img
              src={line}
              alt="line"
              className="absolute left-full ml-5 top-0 h-full"
            />
            {[0, 1, 2].map((i) => (
              <img
                key={i}
                src={dot}
                alt="dot"
                className="absolute left-full ml-[0.8rem] w-4 h-4"
                style={{ top: `calc(${i * 33.3}% + 20px)` }}
              />
            ))}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-right max-w-xs">
                <h3 className="text-lg font-bold text-gray-900">
                  Near By Stores
                </h3>
                <p className="text-sm text-gray-600">
                  Discover Local Stores Based On Your GPS Location
                </p>
              </div>
            ))}
          </div>

          {/* CENTER IMAGE */}
          <div className="relative z-10">
            <img
              src={iphone14}
              alt="iPhone Preview"
              className="w-64 md:w-72 lg:w-80"
            />
          </div>

          {/* RIGHT TEXT */}
          <div className="relative flex flex-col items-start gap-16 pt-12">
            <img
              src={line}
              alt="line"
              className="absolute right-full mr-5 top-0 h-full"
            />
            {[0, 1, 2].map((i) => (
              <img
                key={i}
                src={dot}
                alt="dot"
                className="absolute right-full mr-[0.8rem] w-4 h-4"
                style={{ top: `calc(${i * 33.3}% + 20px)` }}
              />
            ))}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-left max-w-xs">
                <h3 className="text-lg font-bold text-gray-900">
                  Near By Stores
                </h3>
                <p className="text-sm text-gray-600">
                  Discover Local Stores Based On Your GPS Location
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section
        className="bg-white pt-2 pb-16 px-6 md:px-14 text-center"
        id="coupon"
      >
        <CouponComm />
      </section>


      {/* App Stats Section */}
      <section
        className="bg-white pt-2 pb-16 px-6 md:px-14 text-center"
        id="about"
      >
        <p className="text-[#40A1CB] text-sm tracking-widest mb-2">
          LOREM IPSUM
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">App Download</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {/* Box 1 */}
          <div className="bg-white shadow rounded-lg px-6 py-4 flex flex-col items-center">
            <div className="bg-[#40A1CB] p-3 rounded-full mb-4">
              <img src={downloadIcon} alt="Download" className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">1000</h3>
            <p className="text-gray-600 text-sm">App Downloads</p>
          </div>

          {/* Box 2 */}
          <div className="bg-white shadow rounded-lg px-6 py-4 flex flex-col items-center">
            <div className="bg-[#40A1CB] p-3 rounded-full mb-4">
              <img src={smileIcon} alt="Happy" className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">2000</h3>
            <p className="text-gray-600 text-sm">Happy Clients</p>
          </div>

          {/* Box 3 */}
          <div className="bg-white shadow rounded-lg px-6 py-4 flex flex-col items-center">
            <div className="bg-[#40A1CB] p-3 rounded-full mb-4">
              <img src={userIcon} alt="User" className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">400</h3>
            <p className="text-gray-600 text-sm">Active Accounts</p>
          </div>

          {/* Box 4 */}
          <div className="bg-white shadow rounded-lg px-6 py-4 flex flex-col items-center">
            <div className="bg-[#40A1CB] p-3 rounded-full mb-4">
              <img src={starIcon} alt="Star" className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">200</h3>
            <p className="text-gray-600 text-sm">Total App Rates</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          {/* Left Side: Text + Client */}
          <div className="text-left">
            <p className="text-[#40A1CB] text-sm tracking-widest mb-2">
              REVIEWS
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Client Reviews
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Love The App! I'm Looking Forward For Them To Add More Of My
              Favorite Stores So I Can Use Them More Often. Lorem Ipsum Is
              Simply Dummy Text Of The Printing And Typesetting Industry. Lorem
              Ipsum Has Been The Industry’s Standard Dummy Text Ever Since The
              1500s.
            </p>

            {/* Client Info */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={client1}
                alt="Client"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="text-[#40A1CB] font-semibold">Allhalal</h4>
                <p className="text-gray-500 text-sm">
                  Finally A Great App With Variety
                </p>
              </div>
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition">
                <span className="text-[#40A1CB] text-lg">&larr;</span>
              </button>
              <button className="p-2 rounded-full bg-[#40A1CB] hover:bg-green-600 transition">
                <span className="text-white text-lg">&rarr;</span>
              </button>
            </div>
          </div>

          {/* Right Side: Milk Image */}
          <div className="flex justify-center">
            <img
              src={milkproduct}
              alt="Milk Products"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative w-full min-h-screen bg-gray-100 overflow-hidden flex flex-col md:flex-row items-center justify-center"
      >
        {/* Contact Form Container */}
        <div className="relative z-10 w-full max-w-md mx-auto p-6 md:p-12 md:ml-auto md:mr-16 bg-white rounded-2xl shadow-xl mt-10 md:mt-0">
          <p className="text-sm text-[#40A1CB] font-medium mb-2">Contact Us</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Get In Touch With Us!
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB] h-28"
            ></textarea>
            <button
              type="submit"
              className="bg-[#40A1CB] text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Send Now
            </button>
          </form>
        </div>
        {/* Background Jar Image for Desktop */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-right bg-no-repeat z-0"
          style={{
            backgroundImage: `url(${jarbg})`,
            backgroundSize: "cover",
          }}
        ></div>

        {/* Background Jar Image for Mobile (below form) */}
        <img
          src={jarbg}
          alt="Milk Jar"
          className="block md:hidden w-full object-cover mt-8"
        />

        {/* Milk Wave Image at Bottom */}
        <img
          src={milkwave}
          alt="Milk Wave"
          className="absolute bottom-0 w-full z-10"
        />
      </section>
    </div>
  );
};

export default LandingPage;
