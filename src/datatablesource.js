export const restaurantColumns = [
  {
    field: "restaurant",
    headerName: "Restaurant",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          {params.row.name}
        </div>
      );
    },
  },
  {
    field: "address",
    headerName: "Address",
    width: 200,
  },

  {
    field: "phone",
    headerName: "Phone number",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];


export const productColumns = [
  {
    field: "name",
    headerName: "Name",
    width: 200,
  },
  {
    field: "category",
    headerName: "Category",
    width: 160,
  },
  {
    field: "price",
    headerName: "Price",
    width: 120,
  },
  {
    field: "description",
    headerName: "Description",
    width: 250,
  },
  {
    field: "restaurant",
    headerName: "Restaurant",
    width: 250,
  },
  {
    field: "img",
    headerName: "Image",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="product image" />
        </div>
      );
    },
  },
];
