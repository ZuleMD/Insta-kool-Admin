import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { restaurantColumns, productColumns, categoryColumns } from "../../datatablesource"; // import columns for both types
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Audio } from 'react-loader-spinner'


const useRenderCell = (title) => {
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        let path;
        if (title === "Products") {
          const restaurantId = params.row.restaurantId;
          path = `/${title.toLowerCase()}/${restaurantId}/${params.row.id}`;
        } else {
          path = `/${title.toLowerCase()}/${params.row.id}`;
        }
        return (
          <div className="cellAction">
            <Link key={params.row.id} to={path} style={{ textDecoration: "none" }}>
              <div className="viewButton">Edit</div>
            </Link>
          </div>
        );
      },
    },
  ];

  return actionColumn;
};


const Datatable = ({ title }) => {

  const [datar, setDataR] = useState([]);
  const [datap, setDataP] = useState([]);
  const [datac, setDataC] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  const actionColumn = useRenderCell(title);

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
        setDataR(list);
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
    const unsub = onSnapshot(collection(db, "categories"), (snapshot) => {
      const categoryList = [];
      snapshot.docs.forEach((doc) => {
        const category = { id: doc.id, ...doc.data() };
        categoryList.push(category);
      });
      setDataC(categoryList);
    });
    return () => {
      unsub();
    };
  }, []);



  useEffect(() => {
    // set columns based on title
    setColumns(title === "Products" ? productColumns.concat(actionColumn) : title === "Categories" ? categoryColumns.concat(actionColumn) : restaurantColumns.concat(actionColumn));
  }, [title]);



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
              rows={
                title === "Products" ? datap :
                  title === "Categories" ? datac :
                    datar}
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
