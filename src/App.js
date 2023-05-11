import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, restaurantInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
function App() {
  const { darkMode } = useContext(DarkModeContext);

  const { currentUser } = useContext(AuthContext)

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<RequireAuth>
              <Home />
            </RequireAuth>} />
            <Route path="login" element={<Login />} />
            <Route path="restaurants">
              <Route index element={<RequireAuth>
                <List title="Restaurants" />
              </RequireAuth>} />
              <Route path=":id" element={
                <RequireAuth>
                  <Single title="Restaurant infos" />
                </RequireAuth>} />
              <Route
                path="new"
                element={<RequireAuth><New inputs={restaurantInputs} title="Add New Restaurant" /></RequireAuth>}
              />
            </Route>
            <Route path="products">
              <Route index element={<RequireAuth><List title="Products" /></RequireAuth>} />
              <Route path=":restaurantId/:productId" element={<RequireAuth><Single title="Product infos" /></RequireAuth>} />
              <Route
                path="new"
                element={<RequireAuth><New inputs={productInputs} title="Add New Product" /></RequireAuth>}
              />
            </Route>


            <Route path="categories">
              <Route index element={<RequireAuth><List title="Categories" /></RequireAuth>} />
              <Route path=":id" element={<RequireAuth><Single title="Category infos" /></RequireAuth>} />
              <Route
                path="new"
                element={<RequireAuth><New inputs={productInputs} title="Add New Category" /></RequireAuth>}
              />
            </Route>

            <Route path="orders">
              <Route index element={<RequireAuth><List title="Orders" /></RequireAuth>} />

            </Route>



          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
