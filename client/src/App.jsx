import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Test from "./pages/Test";
import NotFoundPage from "./pages/NotFound/Notfound";
import Login from "./pages/Login/Login";
import "react-toastify/dist/ReactToastify.css";
import MilkManDashboard from "./MilkMan/MilkManDashboard";
import MilkManAddCategory from "./MilkMan/MilkManAddCategory";
import MilkManAddCustomer from "./MilkMan/MilkManAddCustomer";
import MilkManBuyMilk from "./MilkMan/MilkManBuyMilk";
import MilkManCustomer from "./MilkMan/MilkManCustomer";
import MilkManHelpAndSupp from "./MilkMan/MilkManHelpAndSupp";
import MilkmanNotific from "./MilkMan/MilkmanNotific";
import MilkManProducts from "./MilkMan/MilkManProducts";
import MilkManProfile from "./MilkMan/MilkManProfile";
import MilkmanSellMilk from "./MilkMan/MilkmanSellMilk";
import MilkManSetRate from "./MilkMan/MilkManSetRate";
import MilkManSubs from "./MilkMan/MilkManSubs";
import MilkManUpdateMilk from "./MilkMan/MilkManUpdateMilk";
import MilkmanWallet from "./MilkMan/MilkmanWallet";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/test" element={<Test />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Test />} />
      <Route path="/milkman-dashboard" element={<MilkManDashboard />} />
      <Route path="/milkman-add-category" element={<MilkManAddCategory />} />
      <Route path="/milkman-add-customer" element={<MilkManAddCustomer />} />
      <Route path="/milkman-buy-milk" element={<MilkManBuyMilk />} />
      <Route path="/milkman-customer" element={<MilkManCustomer />} />
      <Route path="/milkman-help" element={<MilkManHelpAndSupp />} />
      <Route path="/milkman-notofication" element={<MilkmanNotific />} />
      <Route path="/milkman-products" element={<MilkManProducts />} />
      <Route path="/milkman-profile" element={<MilkManProfile />} />
      <Route path="/milkman-sell-milk" element={<MilkmanSellMilk />} />
      <Route path="/milkman-set-rate" element={<MilkManSetRate />} />
      <Route path="/milkman-subscription" element={<MilkManSubs />} />
      <Route path="/milkman-update-milk" element={<MilkManUpdateMilk />} />
      <Route path="/milkman-walltet" element={<MilkmanWallet />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
