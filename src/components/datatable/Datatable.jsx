import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { restaurantColumns, productColumns } from "../../datatablesource"; // import columns for both types
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Audio } from 'react-loader-spinner'


const Datatable = ({ title }) => {
  const [data, setData] = useState([]);
  const [datap, setDataP] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "restaurants"), // change collection based on title
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          const restaurant = { id: doc.id, ...doc.data() };
          list.push(restaurant);

          // Get the products subcollection for this restaurant
          const productsRef = collection(db, "restaurants", doc.id, "products");
          const productsUnsub = onSnapshot(productsRef, (productsSnapShot) => {
            const productList = [];
            productsSnapShot.docs.forEach((productDoc) => {
              const product = { id: productDoc.id, ...productDoc.data(), restaurantId: doc.id };
              productList.push(product);
            });
            setDataP(prevState => ([...prevState, ...productList]));

          });
        });
        setData(list);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);



  useEffect(() => {
    // set columns based on title
    setColumns(title === "Products" ? productColumns.concat(actionColumn) : restaurantColumns.concat(actionColumn));
  }, [title]);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link key={params.row.id} to={`/${title.toLowerCase()}/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Edit</div>
            </Link>
          </div>
        );
      },
    },
  ];


  return (

    <div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "70px" }}>

          <Audio
            height="80"
            width="80"
            radius="9"
            color="green"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
          />
        </div>
      )
        : (
          <div className="datatable">
            <div className="datatableTitle">
              {title}
              <Link to={`/${title.toLowerCase()}/new`} className="link">
                Add New
              </Link>
            </div>
            <DataGrid
              className="datagrid"
              rows={title === "Products" ? datap : data}
              columns={columns}
              pageSize={9}
              rowsPerPageOptions={[9]}
              checkboxSelection
            />
          </div>

        )}
    </div>
  );

};

export default Datatable;
