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
import SellerDash from "./Seller/SellerDash";
import SellerMilkRecord from "./Seller/SellerMilkRecord";
import SellerProducts from "./Seller/SellerProducts";
import SellerWalltet from "./Seller/SellerWalltet";
import SellerPaymentHistory from "./Seller/SellerPaymentHistory";
import SellerProfile from "./Seller/SellerProfile";
import SellerPayments from "./Seller/SellerPayments";
import SellerMilkMan from "./Seller/SellerMilkMan";
import SellerChangeMilkMan from "./Seller/SellerChangeMilkMan";
import SellerHelp from "./Seller/SellerHelp";
import CustomerDash from "./Customer/CustomerDash";
import CustomerMilkRecord from "./Customer/CustomerMilkRecord";
import CustomerProducts from "./Customer/CustomerProducts";
import CustomerWallet from "./Customer/CustomerWallet";
import CustomerPaymentHistory from "./Customer/CustomerPaymentHistory";
import CustomerProfile from "./Customer/CustomerProfile";
import CustomerPayments from "./Customer/CustomerPayments";
import CustomerMilkman from "./Customer/CustomerMilkman";
import CustomerChangeMilkMan from "./Customer/CustomerChangeMilkMan";
import CustomerHelp from "./Customer/CustomerHelp";
import CustomerAdvanceBook from "./Customer/CustomerAdvanceBook";
import Register from "./pages/Register/Register";
import CustomerCartPage from "./Customer/CustomerCartPage";
import CustomerCheckoutPage from "./Customer/CustomerCheckoutPage";
import CustomerSuccessPage from "./Customer/CustomerSuccessPage";
import ResetPassword from "./pages/ResetPassword";
import SuperAdminDash from "./SuperAdmin/SuperAdminDash";
import SuperAdminHelpPage from "./SuperAdmin/SuperAdminHelpPage";
import SuperAdminProfile from "./SuperAdmin/SuperAdminProfile";
import SuperAdminSubs from "./SuperAdmin/SuperAdminSubs";
import SuperAdminUserList from "./SuperAdmin/SuperAdminUserList";
import MilkManAdvanceBook from "./MilkMan/MilkManAdvanceBook";
import CustomerNotification from "./Customer/CustomerNotification";
import GetInTouch from "./SuperAdmin/GetInTouch";
import SuperAdminUserDet from "./SuperAdmin/SuperAdminUserDet";
import SuperAdminAddvertise from "./SuperAdmin/SuperAdminAddvertise";
import MilkManCustomerDetails from "./MilkMan/MilkManCustomerDetails";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/test" element={<Test />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/milkman-dashboard" element={<MilkManDashboard />} />
      <Route path="/milkman-add-category" element={<MilkManAddCategory />} />
      <Route path="/milkman-add-customer" element={<MilkManAddCustomer />} />
      <Route path="/milkman-buy-milk" element={<MilkManBuyMilk />} />
      <Route path="/milkman-customer" element={<MilkManCustomer />} />
      <Route path="/milkman-help" element={<MilkManHelpAndSupp />} />
      <Route path="/milkman-notification" element={<MilkmanNotific />} />
      <Route path="/milkman-advance-book" element={<MilkManAdvanceBook />} />
      <Route path="/milkman-products" element={<MilkManProducts />} />
      <Route path="/milkman-profile" element={<MilkManProfile />} />
      <Route path="/milkman-sell-milk" element={<MilkmanSellMilk />} />
      <Route path="/milkman-set-rate" element={<MilkManSetRate />} />
      <Route path="/milkman-subscription" element={<MilkManSubs />} />
      <Route path="/milkman-update-milk" element={<MilkManUpdateMilk />} />
      <Route path="/milkman-walltet" element={<MilkmanWallet />} />
      <Route path="/milkman-customer-details/:id" element={<MilkManCustomerDetails />} />




      <Route path="/admin-dashboard" element={<SuperAdminDash />} />
      <Route path="/admin-help-support" element={<SuperAdminHelpPage />} />
      <Route path="/admin-profile" element={<SuperAdminProfile />} />
      <Route path="/admin-subscription" element={<SuperAdminSubs />} />
      <Route path="/admin-user-list" element={<SuperAdminUserList />} />
      <Route path="/admin-get-in-touch" element={<GetInTouch />} />
      <Route path="/admin-user-details/:userId" element={<SuperAdminUserDet />} />
      <Route path="/admin-addvertisement" element={<SuperAdminAddvertise />} />







      <Route path="/seller-dashboard" element={<SellerDash />} />
      <Route path="/seller-milk-record" element={<SellerMilkRecord />} />
      <Route path="/seller-products" element={<SellerProducts />} />
      <Route path="/seller-wallet" element={<SellerWalltet />} />
      <Route
        path="/seller-payment-history"
        element={<SellerPaymentHistory />}
      />
      <Route path="/seller-profile" element={<SellerProfile />} />
      <Route path="/seller-payments" element={<SellerPayments />} />
      <Route path="/seller-milkman" element={<SellerMilkMan />} />
      <Route path="/seller-change-milkman" element={<SellerChangeMilkMan />} />
      <Route path="/seller-help" element={<SellerHelp />} />






      
      <Route path="/customer-dashboard" element={<CustomerDash />} />
      <Route path="/customer-milk-record" element={<CustomerMilkRecord />} />
      <Route path="/customer-products" element={<CustomerProducts />} />
      <Route path="/customer-wallet" element={<CustomerWallet />} />
      <Route
        path="/customer-payment-history"
        element={<CustomerPaymentHistory />}
      />
      <Route path="/customer-profile" element={<CustomerProfile />} />
      <Route path="/customer-payments" element={<CustomerPayments />} />
      <Route path="/customer-milkman" element={<CustomerMilkman />} />
      <Route path="/customer-notification" element={<CustomerNotification />} />
      <Route
        path="/customer-change-milkman"
        element={<CustomerChangeMilkMan />}
      />
      <Route path="/customer-help" element={<CustomerHelp />} />
      <Route path="/customer-advance-book" element={<CustomerAdvanceBook />} />
      <Route path="/customer-cart" element={<CustomerCartPage />} />
      <Route path="/customer-checkout" element={<CustomerCheckoutPage />} />
      <Route path="/customer-success" element={<CustomerSuccessPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
