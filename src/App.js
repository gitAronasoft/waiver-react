// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// import Index from "./pages/firstsetp";
// import NewCustomerForm from "./pages/NewCustomerForm";
// import ExistingCustomerLogin from "./pages/ExistingCustomerLogin";
// import Optverified from "./pages/otpverified";
// import ConfirmCustomerInfo from "./pages/ConfirmCustomerInfo";
// import RuleReminder from "./pages/RuleReminder";
// import WaiverCompleteScreen from "./pages/WaiverCompleteScreen";
// import Signature from "./pages/signature";
// import AllDone from "./pages/AllDone";
// import LoginAdmin from "./pages/admin/login";
// import Home from "./pages/admin/home";
// import History from "./pages/admin/History";
// import ClientProfilePage from "./pages/admin/ClientProfilePage";



// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/admin/login" element={<LoginAdmin />} />
//         <Route path="/admin/home" element={<Home />} />
//         <Route path="/admin/history" element={<History />} />
//         <Route path="/admin/client-profile/:id" element={<ClientProfilePage />} />
//         <Route path="/" element={<Index />} />
//         <Route path="/new-customer" element={<NewCustomerForm />} />
//         <Route path="/existing-customer" element={<ExistingCustomerLogin />} />
//         <Route path="/opt-verified" element={<Optverified />} />
//         <Route path="/confirm-info" element={<ConfirmCustomerInfo />} />
//         <Route path="/signature" element={<Signature />} />
//         <Route path="/rules" element={<RuleReminder />} />
//         <Route path="/complete" element={<WaiverCompleteScreen />} />
//         <Route path="/all-done" element={<AllDone />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Index from "./pages/firstsetp";
import NewCustomerForm from "./pages/NewCustomerForm";
import ExistingCustomerLogin from "./pages/ExistingCustomerLogin";
import Optverified from "./pages/otpverified";
import ConfirmCustomerInfo from "./pages/ConfirmCustomerInfo";
import RuleReminder from "./pages/RuleReminder";
import WaiverCompleteScreen from "./pages/WaiverCompleteScreen";
import Signature from "./pages/signature";
import AllDone from "./pages/AllDone";
import StarRating from "./pages/StarRatingPage";
import Feedback from "./pages/FeedbackPage";
import LoginAdmin from "./pages/admin/login";
import Home from "./pages/admin/home";
import History from "./pages/admin/History";
import ClientProfilePage from "./pages/admin/ClientProfilePage";
import ForgotPasswordForm from "./pages/admin/forgetPassword";
import ResetPasswordForm from "./pages/admin/ResetPassword";
import ChangePassword from "./pages/admin/ChangePassword";
import StaffList from "./pages/admin/StaffList";
import AddStaff from "./pages/admin/AddStaff";
import UpdateStaff from "./pages/admin/UpdateStaff";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminFeedbackPage from "./pages/admin/AdminFeedbackPage";

import AdminPrivateRoute from "./pages/components/AdminPrivateRoute"; // ✅ Import this

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Public Route */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        
          <Route path="admin/forgot-password" element={<ForgotPasswordForm />} />
         	<Route path="/admin/reset-password" element={<ResetPasswordForm />} />

        {/* ✅ Protected Admin Routes */}
        <Route
          path="/admin/home"
          element={
            <AdminPrivateRoute>
              <Home />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/history"
          element={
            <AdminPrivateRoute>
              <History />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/client-profile/:id"
          element={
            <AdminPrivateRoute>
              <ClientProfilePage />
            </AdminPrivateRoute>
          }
        />
         <Route
          path="admin/change-password"
          element={
            <AdminPrivateRoute>
              <ChangePassword />
            </AdminPrivateRoute>
          }
        />
      

         <Route
          path="admin/staff-list"
          element={
            <AdminPrivateRoute>
              <StaffList />
            </AdminPrivateRoute>
          }
        />

           <Route
          path="admin/add-staff"
          element={
            <AdminPrivateRoute>
              <AddStaff />
            </AdminPrivateRoute>
          }
        />
        
           <Route
          path="admin/update-staff/:id"
          element={
            <AdminPrivateRoute>
              <UpdateStaff />
            </AdminPrivateRoute>
          }
        />

         <Route
          path="admin/update-profile"
          element={
            <AdminPrivateRoute>
              <AdminProfile />
            </AdminPrivateRoute>
          }
        />

          <Route
          path="admin/feedback-list"
          element={
            <AdminPrivateRoute>
              <AdminFeedbackPage />
            </AdminPrivateRoute>
          }
        />



        {/* Public User Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/new-customer" element={<NewCustomerForm />} />
        <Route path="/existing-customer" element={<ExistingCustomerLogin />} />
        <Route path="/opt-verified" element={<Optverified />} />
        <Route path="/confirm-info" element={<ConfirmCustomerInfo />} />
        <Route path="/signature" element={<Signature />} />
        <Route path="/rules" element={<RuleReminder />} />
        <Route path="/complete" element={<WaiverCompleteScreen />} />
        <Route path="/all-done" element={<AllDone />} />
        <Route path="/rate/:id" element={<StarRating />} />
        <Route path="/feedback/:id" element={<Feedback />} />
      </Routes>
    </Router>
  );
}

export default App;

