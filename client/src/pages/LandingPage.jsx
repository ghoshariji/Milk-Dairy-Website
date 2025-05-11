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
import { ShoppingCart, Truck, Star } from "lucide-react";
import { FaFacebookF, FaInstagram, FaGooglePlusG, FaYoutube } from "react-icons/fa";

import { FaArrowUp } from "react-icons/fa";

import milkproduct from "./assets/milkproduct.png";
import client1 from "./assets/client1.png";
import { toast, ToastContainer } from "react-toastify";

import { motion, useInView } from "framer-motion";
import { Store } from "lucide-react";

import AOS from "aos";
import "aos/dist/aos.css";

import playstore from "./assets/play-store.svg";
import Navbar from "../components/Navbar/Navbar";
import AdPopup from "../components/Add/AddPopU[p";
import CouponComm from "../components/Coupon/CouponComm";
import Footer from "../components/Footer/Footer";

const clientReviews = [
  {
    name: "Allhalal",
    reviewTitle: "Finally A Great App With Variety",
    reviewText:
      "Love The App! I'm Looking Forward For Them To Add More Of My Favorite Stores So I Can Use Them More Often. Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry’s Standard Dummy Text Ever Since The 1500s.",
    image: "path/to/client1.jpg", // replace with actual image path
  },
  {
    name: "Rajesh Kumar",
    reviewTitle: "Excellent Experience!",
    reviewText:
      "The app is amazing! It provides an easy way to shop for groceries, and the delivery is super fast. I highly recommend it to all my friends and family.",
    image: "path/to/client2.jpg", // replace with actual image path
  },
  {
    name: "Priya Sharma",
    reviewTitle: "Loved the user interface!",
    reviewText:
      "I’ve been using the app for a few weeks now, and it’s been a delightful experience. It’s super user-friendly, and the variety of products is great.",
    image: "path/to/client3.jpg", // replace with actual image path
  },
  {
    name: "Ravi Mehta",
    reviewTitle: "Great Customer Service",
    reviewText:
      "Customer support was really helpful when I had an issue with my order. The app is easy to navigate, and the service is top-notch.",
    image: "path/to/client4.jpg", // replace with actual image path
  },
];
const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const screenshots = [screen1, screen2, screen3, screen4, screen5];
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Function to handle next/prev button click
  const handleArrowClick = (direction) => {
    if (direction === "next") {
      setCurrentReviewIndex((prevIndex) =>
        prevIndex === clientReviews.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setCurrentReviewIndex((prevIndex) =>
        prevIndex === 0 ? clientReviews.length - 1 : prevIndex - 1
      );
    }
  };
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 800, // animation duration in ms
      once: false, // ❗important: repeat every scroll
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
        className="flex flex-col items-center px-4"
      >
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

  const [showButton, setShowButton] = useState(false);

  // Function to handle scroll and show/hide the button
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  // Function to scroll back to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="font-sans">
      {/* Navbar */}
      <Navbar />
      <ToastContainer />
      {/* Hero Section */}

      <section
        id="home"
        className="relative px-10 bg-white overflow-hidden"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between min-h-screen px-4 sm:px-8 md:px-16 lg:px-24">
          {/* Animated Text Section */}
          <div
            className="w-full lg:w-1/2 text-center lg:text-left z-10"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <p className="text-[50px] sm:text-[60px] md:text-[80px] lg:text-[80px] xl:text-[70px] font-bold leading-tight">
              <span className="text-[#40A1CB]">Milk</span> Delivery App
            </p>

            <p className="text-gray-600 mt-6 max-w-md sm:max-w-lg md:max-w-xl mx-auto lg:mx-0 text-base sm:text-lg md:text-xl">
              To stay ahead of the curve, serve your customers through an
              on-demand food delivery app.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start mt-8 gap-6">
              <button
                className="text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-lg transition hover:brightness-90 text-base sm:text-lg"
                style={{ backgroundColor: "#40A1CB" }}
                onClick={() => navigate("/login")}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Animated Phone Image */}
          <div
            className="w-full lg:w-1/2 flex justify-center mb-10 lg:mb-0 z-10"
            data-aos="fade-left"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            <img
              src={phoneImg}
              alt="Phone Display"
              className="w-60 sm:w-80 md:w-[28rem] lg:w-[34rem] xl:w-[40rem]"
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
          }}
        ></div>
      </section>
      <AdPopup ads={ads} />

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#40A1CB] text-white p-4 hover:cursor-pointer rounded-full shadow-lg transition-all hover:bg-[#3690b5]"
          style={{ zIndex: 999 }} // Ensure it stays on top of other elements
        >
          <FaArrowUp className="w-6 h-6" />
        </button>
      )}

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
          <p className="text-[#40A1CB] text-lg font-bold mb-2 tracking-widest">
            Hallo Dairy
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-12">
            Why Are We Unique?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            <div
              data-aos="fade-up"
              data-aos-delay="0"
              className="transition duration-500 ease-in-out transform hover:scale-105"
            >
              <Card
                Icon={ShoppingCart}
                title="Revolutionizing Dairy Management"
                desc="With our cutting-edge Milkman app, we provide fresh, premium-quality dairy products sourced directly from trusted vendors. Experience seamless delivery, personalized milk management, and an extensive product catalog, all tailored to your needs. From farm to table, we ensure you get only the best."
              />
            </div>
            {/* Card 1 */}
            <div
              data-aos="fade-up"
              data-aos-delay="0"
              className="transition duration-500 ease-in-out transform hover:scale-105"
            >
              <Card
                Icon={ShoppingCart}
                title="Revolutionizing Dairy Management"
                desc="With our cutting-edge Milkman app, enjoy premium-quality dairy products from trusted farms. Seamless delivery, personalized milk schedules, and a wide product range — all at your fingertips."
              />
            </div>

            {/* Card 2 */}
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="transition duration-500 ease-in-out transform hover:scale-105"
            >
              <Card
                Icon={Truck}
                title="Fast & Fresh Delivery"
                desc="Our smart logistics ensure your milk and dairy essentials arrive fresh and on time every day. Real-time tracking, flexible delivery slots, and zero-hassle service guaranteed."
              />
            </div>

            {/* Card 3 */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="transition duration-500 ease-in-out transform hover:scale-105"
            >
              <Card
                Icon={Star}
                title="Premium Quality Assurance"
                desc="Every drop of milk is tested and quality-checked before it reaches you. Trust in our farm-to-home promise for the purest, healthiest, and tastiest dairy experience."
              />
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="transition duration-500 ease-in-out transform hover:scale-105"
            >
              <Card
                Icon={Store}
                title="Shop Your Favorite Local Stores Anytime, Anywhere"
                desc="Browse and order from a wide variety of trusted local stores, bringing unique and hard-to-find items directly to your doorstep. Support your community while enjoying the convenience of home delivery – it's the best of both worlds!"
              />
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="transition duration-500 ease-in-out transform hover:scale-105"
            >
              <Card
                Icon={Truck}
                title="Hassle-Free Access to Local Services"
                desc="Need dry cleaning or other local services? We’ve got you covered. Simply schedule a pick-up and drop-off, and we'll take care of the rest – making life easier, one service at a time."
              />
            </div>
          </div>
        </div>

        {/* VIDEO SECTION */}
      </section>

      {/* Bottom Banner Section */}
      <section
        className="relative w-full h-auto lg:h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${thought})` }}
      >
        {/* Overlay */}
        <div className="relative z-10 px-6 lg:px-10 flex flex-col lg:flex-row items-center lg:items-start justify-between h-full pt-10 lg:pt-20">
          {/* Left Content */}
          <div className="max-w-xl text-white text-center lg:text-left mt-15 lg:ml-10 lg:mt-24">
            <h1 className="text-5xl text-[#40A1CB] lg:text-5xl font-bold mb-6">
              The Innovative Way To Shop
            </h1>
            <p className="text-base lg:text-lg mb-6">
              Get exclusive access to local stores, personalized
              recommendations, and convenient home delivery – all at your
              fingertips. Join today and start shopping smarter!
            </p>

            {/* Google Play Button + Social Icons in one row */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 mt-6">
              {/* Google Play Button */}
              <a
                href="https://play.google.com/store/apps/details?id=com.yourapp.dairy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={playstore}
                  alt="Get it on Google Play"
                  className="w-40"
                />
              </a>

              {/* Social Icons */}
              <motion.div
                className="flex space-x-4 text-[#40A1CB] text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <motion.a
                  href="#"
                  className="hover:scale-110 transition duration-300 hover:cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                >
                  <FaFacebookF size={28} className="cursor-pointer transition" />
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/foxteach_offical/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition duration-300 hover:cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                >
                  <FaInstagram size={28} className="cursor-pointer transition" />
                </motion.a>
                <motion.a
                  href="mailto:official.foxteach@gmail.com"
                  className="hover:scale-110 transition duration-300 hover:cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                >
                  <FaYoutube size={30} className="cursor-pointer transition" />
                </motion.a>
              </motion.div>
            </div>
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
        <p className="text-[#40A1CB] text-lg font-bold tracking-widest mb-2">
          FEATURES
        </p>
        <h2 className="text-4xl font-bold text-gray-900 mb-10">
          Awesome Features
        </h2>

        {/* Mobile & Tab view: Horizontal scrollable timeline above phone */}
        <div className="block lg:hidden">
          <div className="relative w-full overflow-x-auto px-4 mb-10">
            <div className="flex items-start space-x-10 min-w-[600px] relative pb-10">
              {/* Horizontal Line */}
              <motion.img
                src={line}
                alt="line"
                className="absolute top-4 left-0 right-0 w-full h-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
              />

              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center min-w-[180px] relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.2, duration: 1 }}
                >
                  <motion.img
                    src={dot}
                    alt="dot"
                    className="w-4 h-4 mb-3 z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
                  />
                  <h3 className="text-md font-semibold mb-1 text-gray-900">
                    {
                      [
                        "Fast Delivery",
                        "Milk Management",
                        "Nearby Stores",
                        "Full Security",
                        "Mobile & App Features",
                        "Contact Support",
                      ][i]
                    }
                  </h3>
                  <p className="text-sm text-gray-600 text-center px-2">
                    {
                      [
                        "Get your orders delivered faster with our optimized delivery system.",
                        "Easily manage your milk deliveries with our intuitive system.",
                        "Discover nearby stores based on your GPS location for convenience.",
                        "Enjoy full security with encrypted transactions and data protection.",
                        "Access essential features like tracking, ordering, and updates through our mobile app.",
                        "Need help? Our dedicated support team is here to assist you anytime.",
                      ][i]
                    }
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Phone image in center */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <img src={iphone14} alt="Phone" className="w-64 sm:w-72" />
          </motion.div>
        </div>

        {/* Desktop layout: Original vertical version */}
        <div className="hidden lg:flex justify-center items-start gap-10 mt-16 relative">
          {/* LEFT TEXT */}
          <motion.div
            className="relative flex flex-col items-end gap-16 pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <img
              src={line}
              alt="line"
              className="absolute left-full ml-5 top-0 h-full"
            />
            {[0, 1, 2].map((i) => (
              <motion.img
                key={i}
                src={dot}
                alt="dot"
                className="absolute left-full ml-[0.8rem] w-4 h-4"
                style={{ top: `calc(${i * 33.3}% + 20px)` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
              />
            ))}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="text-right max-w-xs"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.3, duration: 1 }}
              >
                <h3 className="text-lg font-bold text-gray-900">
                  {["Fast Delivery", "Milk Management", "Nearby Stores"][i]}
                </h3>
                <p className="text-sm text-gray-600">
                  {
                    [
                      "Get your orders delivered faster with our optimized delivery system.",
                      "Easily manage your milk deliveries with our intuitive system.",
                      "Discover nearby stores based on your GPS location for convenience.",
                    ][i]
                  }
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CENTER IMAGE */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <img
              src={iphone14}
              alt="iPhone Preview"
              className="w-64 md:w-72 lg:w-80"
            />
          </motion.div>

          {/* RIGHT TEXT */}
          <motion.div
            className="relative flex flex-col items-start gap-16 pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <img
              src={line}
              alt="line"
              className="absolute right-full mr-5 top-0 h-full"
            />
            {[0, 1, 2].map((i) => (
              <motion.img
                key={i}
                src={dot}
                alt="dot"
                className="absolute right-full mr-[0.8rem] w-4 h-4"
                style={{ top: `calc(${i * 33.3}% + 20px)` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
              />
            ))}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="text-left max-w-xs"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.3, duration: 1 }}
              >
                <h3 className="text-lg font-bold text-gray-900">
                  {
                    [
                      "Full Security",
                      "Mobile & App Features",
                      "Contact Support",
                    ][i]
                  }
                </h3>
                <p className="text-sm text-gray-600">
                  {
                    [
                      "Enjoy full security with encrypted transactions and data protection.",
                      "Access essential features like tracking, ordering, and updates through our mobile app.",
                      "Need help? Our dedicated support team is here to assist you anytime.",
                    ][i]
                  }
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        className="bg-white pt-2 pb-16 px-6 md:px-14 text-center"
        id="coupon"
      >
        <CouponComm />
      </section>
      <section className="relative px-6 md:px-10 py-16 md:py-20 bg-white overflow-hidden" id="yt">
        <div className="max-w-6xl mx-auto text-center">
          <p
            className="text-[#40A1CB] text-lg font-bold tracking-widest mb-2"
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
          <div className="relative inline-block w-full max-w-6xl mx-auto">
            <div className="relative" style={{ paddingTop: "20.25%" }}>
              {" "}
              {/* 16:9 aspect ratio */}
              <iframe
                className="absolute top-0 left-0 w-full h-full"
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
      {/* App Stats Section */}
      <section
        className="bg-white pt-2 pb-16 px-6 md:px-14 text-center"
        id="about"
      >
        <p className="text-[#40A1CB] text-lg font-bold tracking-widest mb-2">
          Hallo Dairy
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">App Insights</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {/* Box 1: App Downloads */}
          <motion.div
            className="bg-white shadow-xl rounded-lg px-6 py-6 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition duration-300 ease-in-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            data-aos="fade-up"
          >
            <div className="bg-[#40A1CB] p-4 rounded-full mb-4">
              <i className="fas fa-download text-white text-3xl"></i>{" "}
              {/* Font Awesome download icon */}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">1,000+</h3>
            <p className="text-gray-600 text-sm">App Downloads</p>
          </motion.div>

          {/* Box 2: Happy Clients */}
          <motion.div
            className="bg-white shadow-xl rounded-lg px-6 py-6 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition duration-300 ease-in-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            data-aos="fade-up"
          >
            <div className="bg-[#40A1CB] p-4 rounded-full mb-4">
              <i className="fas fa-smile-beam text-white text-3xl"></i>{" "}
              {/* Font Awesome smile icon */}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">2,000+</h3>
            <p className="text-gray-600 text-sm">Happy Clients</p>
          </motion.div>

          {/* Box 3: Active Accounts */}
          <motion.div
            className="bg-white shadow-xl rounded-lg px-6 py-6 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition duration-300 ease-in-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            data-aos="fade-up"
          >
            <div className="bg-[#40A1CB] p-4 rounded-full mb-4">
              <i className="fas fa-users text-white text-3xl"></i>{" "}
              {/* Font Awesome users icon */}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">400+</h3>
            <p className="text-gray-600 text-sm">Active Accounts</p>
          </motion.div>

          {/* Box 4: Total App Ratings */}
          <motion.div
            className="bg-white shadow-xl rounded-lg px-6 py-6 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition duration-300 ease-in-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            data-aos="fade-up"
          >
            <div className="bg-[#40A1CB] p-4 rounded-full mb-4">
              <i className="fas fa-star text-white text-3xl"></i>{" "}
              {/* Font Awesome star icon */}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">200+</h3>
            <p className="text-gray-600 text-sm">Total App Ratings</p>
          </motion.div>
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
              <button className="p-2 rounded-full bg-white border border-gray-300   hover:cursor-pointer hover:bg-gray-100 transition">
                <span className="text-[#40A1CB] text-lg">&larr;</span>
              </button>
              <button className="p-2 rounded-full bg-[#40A1CB] hover:cursor-pointer transition">
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative z-10 w-full max-w-md mx-auto p-6 md:p-12 md:ml-auto md:mr-16 bg-white rounded-2xl shadow-xl mt-10 md:mt-0"
        >
          <motion.p
            variants={childVariants}
            className="text-sm text-[#40A1CB] font-medium mb-2"
          >
            Contact Us
          </motion.p>
          <motion.h2
            variants={childVariants}
            className="text-2xl font-bold text-gray-800 mb-6"
          >
            Get In Touch With Us!
          </motion.h2>
          <motion.form className="space-y-4" onSubmit={handleSubmit}>
            <motion.input
              variants={childVariants}
              whileFocus={{ scale: 1.02 }}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
            />
            <motion.input
              variants={childVariants}
              whileFocus={{ scale: 1.02 }}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
            />
            <motion.textarea
              variants={childVariants}
              whileFocus={{ scale: 1.02 }}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB] h-28"
            ></motion.textarea>
            <motion.button
              variants={childVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#40A1CB] text-white px-6 py-2 rounded-md hover:cursor-pointer transition"
            >
              Send Now
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Background Jar Image for Desktop */}
        <motion.div
          className="hidden md:block absolute inset-0 bg-cover bg-right bg-no-repeat z-0"
          style={{ backgroundImage: `url(${jarbg})`, backgroundSize: "cover" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5 }}
        ></motion.div>

        {/* Background Jar Image for Mobile (below form) */}
        <motion.img
          src={jarbg}
          alt="Milk Jar"
          className="block md:hidden w-full object-cover mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />

        {/* Milk Wave Image at Bottom */}
        <motion.img
          src={milkwave}
          alt="Milk Wave"
          className="absolute bottom-0 w-full z-10"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          viewport={{ once: true }}
        />
      </section>
    </div>
  );
};

export default LandingPage;
