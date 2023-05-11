import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import { RestaurantOutlined } from "@mui/icons-material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { AuthContext } from "../../context/AuthContext"


const Sidebar = () => {
  const { dispatch: darkModeDispatch } = useContext(DarkModeContext);
  const { dispatch: authDispatch } = useContext(AuthContext);

  const handleLogout = () => {
    authDispatch({ type: "LOGOUT" });
  };

  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Insta-kool</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className="title">LISTS</p>

          <Link to="/restaurants" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Restaurants</span>
            </li>
          </Link>

          <Link to="/products" style={{ textDecoration: "none" }}>
            <li>
              <RestaurantOutlined className="icon" />
              <span>Products</span>
            </li>
          </Link>

          <Link to="/categories" style={{ textDecoration: "none" }}>
            <li>
              <MenuOpenIcon className="icon" />
              <span>Categories</span>
            </li>
          </Link>
          <Link to="/orders" style={{ textDecoration: "none" }}>
            <li>
              <LocalShippingIcon className="icon" />
              <span>Orders</span>
            </li>
          </Link>


          <p className="title">USER</p>
          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          <li>
            <ExitToAppIcon className="icon" />
            <span onClick={handleLogout}>Logout</span>
          </li>
          <p className="title">MODE</p>
          <li>
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => darkModeDispatch({ type: "TOGGLE" })}
            />
          </li>
        </ul>
      </div>

    </div>
  );
};

export default Sidebar;
