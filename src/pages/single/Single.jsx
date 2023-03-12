import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import List from "../../components/table/Table";

const Single = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurantRef = doc(db, "restaurants", id);
        const snapshot = await getDoc(restaurantRef);
        if (snapshot.exists()) {
          setRestaurant(snapshot.data());
        } else {
          console.log("Restaurant not found");
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const restaurantRef = doc(db, "restaurants", id);
      await updateDoc(restaurantRef, formData);
      navigate(-1)
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };



  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <h1 className="title">Information</h1>
            {restaurant && (
              <form onSubmit={handleSubmit}>
                <div className="item">
                  <img src={restaurant.img} alt="" className="itemImg" />
                  <div className="details">
                    <div className="detailItem">
                      <label htmlFor="name" className="itemKey">
                        Name:
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="itemValue"
                        value={formData.name !== undefined ? formData.name : restaurant?.name || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="detailItem">
                      <label htmlFor="phone" className="itemKey">
                        Phone:
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="itemValue"
                        value={formData.phone !== undefined ? formData.phone : restaurant?.phone || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="detailItem">
                      <label htmlFor="address" className="itemKey">
                        Address:
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        className="itemValue"
                        value={formData.address !== undefined ? formData.address : restaurant?.address || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="detailItem">
                      <label htmlFor="status" className="itemKey">
                        Status:
                      </label>
                      <select
                        name="status"
                        id="status"
                        value={formData.status !== undefined ? formData.status : restaurant?.status || ''}
                        onChange={handleInputChange}
                      >
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                      </select>
                    </div>



                  </div>
                </div>
                <div >
                  <button className="editButton" type="submit">Edit</button>

                </div>
              </form>
            )}
          </div>
        </div>
      </div>


    </div>
  );

};

export default Single;