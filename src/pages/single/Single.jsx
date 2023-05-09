import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc, getDoc, updateDoc, collection, onSnapshot,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";


const Single = ({ title }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({});
  const { id } = useParams();
  const { restaurantId, productId } = useParams();

  const [file, setFile] = useState("");
  const [per, setPerc] = useState(null);

  const navigate = useNavigate();

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

  const fetchRestaurants = async () => {
    const unsub = onSnapshot(
      collection(db, "restaurants"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          const restaurant = { id: doc.id, ...doc.data() };
          list.push(restaurant);

        });
        setRestaurants(list);

      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  };


  const fetchCategory = async () => {
    try {
      const categoryRef = doc(db, "categories", id);
      const snapshot = await getDoc(categoryRef);
      if (snapshot.exists()) {
        setCategory(snapshot.data());
      } else {
        console.log("Category not found");
      }
    } catch (error) {
      console.error("Error fetching Category:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const productRef = doc(db, "restaurants", restaurantId, "products", productId);
      const snapshot = await getDoc(productRef);
      if (snapshot.exists()) {
        setProduct(snapshot.data());
        console.log(snapshot.data());
      } else {
        console.log("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (title === "Restaurant infos") {
      fetchRestaurant();
    } else if (title === "Product infos") {
      fetchProduct();
      fetchRestaurants();

    } else if (title === "Category infos") {
      fetchCategory();
    }
  }, [title]);




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      console.log(name);
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === "Product infos") {
      try {
        const restaurantRef = doc(db, "restaurants", restaurantId);
        const productRef = doc(restaurantRef, "products", productId);

        // Update the product
        await updateDoc(productRef, formData);
        navigate(-1)
        console.log(`Product with ID ${productId} updated successfully in restaurant with ID ${restaurantId}`);

      } catch (err) {
        console.log(`Error updating product with ID ${productId}: ${err}`);
      }

    } else if (title === "Restaurant infos") {
      //update restaurant collection
      try {
        const restaurantRef = doc(db, "restaurants", id);
        await updateDoc(restaurantRef, formData);
        navigate(-1)
      } catch (error) {
        console.error("Error updating restaurant:", error);
      }
    } else {
      //update category collection
      try {
        const categoryRef = doc(db, "categories", id);
        await updateDoc(categoryRef, formData);
        navigate(-1)
      } catch (error) {
        console.error("Error updating category:", error);
      }

    }

  };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <h1 className="title">{title}</h1>

            {restaurant && (
              <form onSubmit={handleSubmit}>
                <div className="item">
                  <img
                    src={formData.img || restaurant.img}
                    alt=""
                    className="itemImg"
                  />

                  <div className="leftpic">
                    <label htmlFor="imageInput">
                      <img
                        src={
                          "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                        }
                        alt=""
                      />
                    </label>
                    <input
                      type="file"
                      id="imageInput"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </div>
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
                        value={
                          formData.name !== undefined
                            ? formData.name
                            : restaurant?.name || ""
                        }
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
                  <button disabled={per !== null && per < 100} className="editButton" type="submit">Edit</button>

                </div>
              </form>
            )
            }

            {product && (
              <form onSubmit={handleSubmit}>
                <div className="item">
                  <img
                    src={formData.img || product.img}
                    alt=""
                    className="itemImg"
                  />

                  <div className="leftpic">
                    <label htmlFor="imageInput">
                      <img
                        src={
                          "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                        }
                        alt=""
                      />
                    </label>
                    <input
                      type="file"
                      id="imageInput"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </div>
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
                        value={
                          formData.name !== undefined
                            ? formData.name
                            : product?.name || ""
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="detailItem">
                      <label htmlFor="price" className="itemKey">
                        Price:
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        className="itemValue"
                        value={formData.price !== undefined ? formData.price : product?.price || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="detailItem">
                      <label htmlFor="category" className="itemKey">
                        Category:
                      </label>
                      <input
                        type="text"
                        name="category"
                        id="category"
                        className="itemValue"
                        value={formData.category !== undefined ? formData.category : product?.category || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="detailItem">
                      <label htmlFor="description" className="itemKey">
                        Description:
                      </label>
                      <input
                        type="text"
                        name="description"
                        id="description"
                        className="itemValue"
                        value={formData.description !== undefined ? formData.description : product?.description || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="detailItem">
                      <label htmlFor="restuarant" className="itemKey">
                        Restaurant:
                      </label>
                      <select
                        name="restaurant"
                        id="restaurant"
                        value={formData.restaurantName !== undefined ? formData.restaurantName : product?.restaurantName || ''}
                        onChange={handleInputChange}
                      >
                        {restaurants.map((restaurant) => (
                          <option key={restaurant.id} value={restaurant.name}>
                            {restaurant.name}
                          </option>
                        ))}

                      </select>
                    </div>


                    <div className="detailItem">
                      <label htmlFor="status" className="itemKey">
                        Status:
                      </label>
                      <select
                        name="status"
                        id="status"
                        value={formData.status !== undefined ? formData.status : product?.status || ''}
                        onChange={handleInputChange}
                      >
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                      </select>
                    </div>



                  </div>
                </div>
                <div >
                  <button disabled={per !== null && per < 100} className="editButton" type="submit">Edit</button>

                </div>
              </form>
            )
            }

            {category && (
              <form onSubmit={handleSubmit}>
                <div className="item">
                  <img
                    src={formData.img || category.img}
                    alt=""
                    className="itemImg"
                  />

                  <div className="leftpic">
                    <label htmlFor="imageInput">
                      <img
                        src={
                          "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                        }
                        alt=""
                      />
                    </label>
                    <input
                      type="file"
                      id="imageInput"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="details">
                    <div className="detailItem">
                      <label htmlFor="categoryName" className="itemKey">
                        Name:
                      </label>
                      <input
                        type="text"
                        name="categoryName"
                        id="categoryName"
                        className="itemValue"
                        value={
                          formData.categoryName !== undefined
                            ? formData.categoryName
                            : category?.categoryName || ""
                        }
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
                        value={formData.status !== undefined ? formData.status : category?.status || ''}
                        onChange={handleInputChange}
                      >
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                      </select>
                    </div>
                  </div>


                </div>
                <div >
                  <button disabled={per !== null && per < 100} className="editButton" type="submit">Edit</button>

                </div>
              </form>
            )
            }


          </div>
        </div>
      </div>


    </div>
  );

};

export default Single;