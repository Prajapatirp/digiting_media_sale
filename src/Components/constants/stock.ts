export const stock = [
  {
    stock_type: "Cement",
    total: 5,
    used: 2,
    ramaining: 3,
    status: "Active",
  },
  {
    stock_type: "Sand",
    total: 11,
    used: 6,
    ramaining: 5,
    status: "Block",
  },
  {
    stock_type: "Iron rods",
    total: 3,
    used: 1,
    ramaining: 2,
    status: "Active",
  },
  {
    stock_type: "Stones",
    total: 9,
    used: 6,
    ramaining: 3,
    status: "Active",
  },
  {
    stock_type: "Wood",
    total: 8,
    used: 8,
    ramaining: 1,
    status: "Block",
  },
  {
    stock_type: "Paint",
    total: 9,
    used: 3,
    ramaining: 6,
    status: "Active",
  },
  {
    stock_type: "PoP",
    total: 20,
    used: 3,
    ramaining: 17,
    status: "Active",
  },
  {
    stock_type: "Wires",
    total: 7,
    used: 2,
    ramaining: 5,
    status: "Block",
  },
  {
    stock_type: "Tiles",
    total: 3,
    used: 2,
    ramaining: 1,
    status: "Active",
  },
  {
    stock_type: "Stairs",
    total: 1,
    used: 0,
    ramaining: 1,
    status: "Active",
  },
];

export const stockType = [
      { label: "Select Stock Type", value: null },
      { label: "Sand", value: 1},
      { label: "Bricks", value: 2 },
      { label: "Cement", value: 3 },
      { label: "painting", value: 4 },
      { label: "Sand", value: 5 },
];

export const stockLabels = {
  projectName: "Project Name",
  title: "Stock",
  stockHeader: "Material Procurement",
  stockHeaderAccessor: "stock_type",
  totalHeader: "Total",
  totalAccessor: "total_quantity",
  usedHeader: "Used",
  usedAccessor: "used_quantity",
  remainingHeader: "Remaining",
  remainingAccessor: "remaining_quantity",
  actionHeader: "Action",
  stockType: "Material Procurement",
  usedQuantity: "Used Quantity",
  date: "Date",
  remarks: "Remarks",
  submit: "Submit",
  cancel: "cancel",
  quantityReceived: "Quantity received",
  receivedQuantity: "Received quantity",
  acceptedQuantity: "Accepted quantity",
  addStockDetail: "Add stock detail",
  editStockDetail: "Edit stock detail",
  addUsedStock: 'Add Used Stock',
  editUsedStock: 'Edit Used Stock',
  updateStock: 'Update Stock',
  back:'Back',
  viewPdf: 'View PDF',
  ProjectManager: 'Project Manager',
  stockTypeReports:'Stock Report',
  expanseReports:'Expense Report',
};

export const stockTypeLabels = {
  serialName: "Sr.No",
  title : "Material Procurement",
  stockTypeName: "Material Procurement Name",
  stockName:"Material Procurement"
};

export const stockTypeKeys = {
  StockTypeName: "stock_type_name",
  id: "id"
};