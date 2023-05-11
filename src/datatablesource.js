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
    headerName: "Product",
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
    field: "restaurantName",
    headerName: "Restaurant",
    width: 250,
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


export const categoryColumns = [
  {
    field: "categoryName",
    headerName: "Category",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          {params.row.categoryName}
        </div>
      );
    },

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






export const orderColumns = [
  {
    field: "order",
    headerName: "Order",
    width: 500,
    renderCell: (params) => {
      const products = params.row.products;
      if (!Array.isArray(products) || products.length === 0) {
        return <div className="cellWithImg">No products</div>;
      }
      const productNames = products.map(
        (product) => `${product.product.name} (quantity: ${product.quantity})`
      );
      const namesWithSeparator = productNames.join(" / ");
      return <div className="cellWithImg">{namesWithSeparator}</div>;
    },
  },
  {
    field: "price",
    headerName: "Price",
    width: 120,
    valueGetter: (params) => {
      const products = params.row.products;
      if (!Array.isArray(products) || products.length === 0) {
        return 0;
      }
      let totalPrice = 0;
      products.forEach((product) => {
        const price = product?.product?.price || 0;
        const quantity = product?.quantity || 0;
        totalPrice += price * quantity;
      });
      return totalPrice;
    },
  },
  {
    field: "email",
    headerName: "User email",
    width: 250,
    valueGetter: (params) => params.row.user?.email || "",
  },
  {
    field: "address",
    headerName: "Address",
    width: 250,
    valueGetter: (params) => params.row.user?.address || "",
  },
  {
    field: "restaurantName",
    headerName: "Restaurant",
    width: 250,
    valueGetter: (params) => params.row.products?.[0]?.product?.restaurantName || "",
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

