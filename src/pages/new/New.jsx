import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [per, setPerc] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchRestaurants = async () => {
      const querySnapshot = await getDocs(collection(db, "restaurants"));
      const restaurantsData = [];
      querySnapshot.forEach((doc) => {
        restaurantsData.push({ id: doc.id, name: doc.data().name });
      });
      setRestaurants(restaurantsData);
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = [];
      querySnapshot.forEach((doc) => {
        categoriesData.push({ id: doc.id, name: doc.data().categoryName });
      });
      setCategories(categoriesData);
      console.log(categoriesData);
    };
    fetchCategories();
  }, []);


  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      console.log(name);
      const storageRef = ref(storage, file.name);
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
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  console.log(data);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };


  const handleAdd = async (e) => {
    e.preventDefault();

    if (title === "Add New Product") {
      try {
        const restaurantName = data.restaurantName;
        const querySnapshot = await getDocs(collection(db, "restaurants"));
        let restaurantRef;

        querySnapshot.forEach((doc) => {
          if (doc.data().name === restaurantName) {
            restaurantRef = doc.ref;
          }
        });

        if (!restaurantRef) {
          console.log("Restaurant not found");
          return;
        }

        const newProductRef = collection(restaurantRef, "products");
        await addDoc(newProductRef, {
          ...data,
          status: "active",
          timeStamp: serverTimestamp(),
        });

        navigate(-1);
      } catch (err) {
        console.log(err);
      }

    } else if (title == "Add New Category") {
      try {

        await addDoc(collection(db, 'categories'), {
          ...data,
          status: "active",
          timeStamp: serverTimestamp(),
        });
        navigate(-1)
      } catch (err) {
        console.log(err);
      }
    }
    else {
      try {

        await addDoc(collection(db, 'restaurants'), {
          ...data,
          status: "active",
          timeStamp: serverTimestamp(),
        });
        navigate(-1)
      } catch (err) {
        console.log(err);
      }
    }


  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {title === "Add New Category" && (
                <div className="formInput">
                  <label>Name</label>
                  <input
                    type="text"
                    id="categoryName" name="categoryName"
                    placeholder="Name"
                    onChange={handleInput}
                  />
                </div>)}

              {(title === "Add New Restaurant" || title === "Add New Product") && (
                inputs.map((input) => (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <input
                      id={input.id}
                      type={input.type}
                      placeholder={input.placeholder}
                      onChange={handleInput}
                    />
                  </div>
                ))
              )}

              {title === "Add New Restaurant" && (<div className="formInput">
                <label>Phone number</label>
                <PhoneInput
                  name="phone"
                  placeholder="Enter phone number"
                  value={data.phone}
                  onChange={(value) => setData({ ...data, phone: value })}
                />
              </div>)}



              {title === "Add New Product" && (

                <div className="formInput">
                  <label>Category</label>
                  <select id="category" name="category" onChange={handleInput}>
                    <option disabled selected value="">
                      Select a category
                    </option>
                    {categories.map((categorie) => (
                      <option key={categorie.id} value={categorie.name}>
                        {categorie.name}
                      </option>
                    ))}
                  </select>

                </div>



              )}
              {title === "Add New Product" && (
                <div className="formInput">
                  <label>Restaurant Name</label>
                  <select id="restaurantName" name="restaurantName" onChange={handleInput}
                  >
                    <option disabled selected value="">
                      Select a restaurant
                    </option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant.id} value={restaurant.name}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>

                </div>
              )}
              <button disabled={per !== null && per < 100} type="submit">
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;