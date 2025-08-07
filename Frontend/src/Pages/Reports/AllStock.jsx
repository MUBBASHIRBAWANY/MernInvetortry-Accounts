import React, { useEffect, useState } from 'react';
import { getDataFundtion } from '../../Api/CRUD Functions';
import { useDispatch } from 'react-redux';
import { fetchTotalProducts } from '../../Redux/Reducers/TotalProductsReducer';
import * as XLSX from 'xlsx';




const StockReport = () => {
  const [stockData, setStockData] = useState([])
  const [product, setProduct] = useState([])
  const [vendor, setVendor] = useState([])
  const [totalunit, setTotalUnit] = useState([])
  const [AllStore, setAllStore] = useState([])
  const [AllLocation, setLocation] = useState([])
  const dispatch = useDispatch()
  const getData = async () => {
    const data = await getDataFundtion('/TotalProduct')
    const vendor = await getDataFundtion('/vendor')
    const product = await getDataFundtion('/product')
    const store = await getDataFundtion('/Store')
    const location = await getDataFundtion("/location")
    setProduct(product.data)
    setVendor(vendor.data)
    setStockData(data.data)
    setAllStore(store.data)
    setLocation(location.data)
    dispatch(fetchTotalProducts(data.data))

  }
  const exportToExcel = () => {
    const excelData = stockData.map((item, index) => {
      const productItem = product.find(p => p._id === item.ProductName);
      const vendorItem = vendor.find(v => v.code === productItem?.mastercode.slice(0, 2));
      const store = AllStore.find(s => s._id === item.Store);
      const location = AllLocation.find(l => l._id === item.Location);
      const carton = Math.floor(item.TotalQuantity / (productItem?.BoxinCarton || 1));
      const boxes = Math.round(item.TotalQuantity % (productItem?.BoxinCarton || 1));

      return {
        '#': index + 1,
        Vendor: vendorItem?.VendorName,
        Store: store?.StoreName,
        Location: location?.LocationName,
        ProductCode: productItem?.mastercode,
        Product: productItem?.ProductName,
        SalesFlowRef: productItem?.salesFlowRef,
        Cartons: carton,
        Boxes: boxes,
        TotalBoxes: item.TotalQuantity,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'StockReport');
    XLSX.writeFile(workbook, `Stock_Report_${Date.now()}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["#", "Vendor", "Store", "Location", "Product Code", "Product", "SalesFlowRef", "Cartons", "Boxes", "Total Boxes"];
    const tableRows = [];

    stockData.forEach((item, index) => {
      const productItem = product.find(p => p._id === item.ProductName);
      const vendorItem = vendor.find(v => v.code === productItem?.mastercode.slice(0, 2));
      const store = AllStore.find(s => s._id === item.Store);
      const location = AllLocation.find(l => l._id === item.Location);
      const carton = Math.floor(item.TotalQuantity / (productItem?.BoxinCarton || 1));
      const boxes = Math.round(item.TotalQuantity % (productItem?.BoxinCarton || 1));

      tableRows.push([
        index + 1,
        vendorItem?.VendorName,
        store?.StoreName,
        location?.LocationName,
        productItem?.mastercode,
        productItem?.ProductName,
        productItem?.salesFlowRef,
        carton,
        boxes,
        item.TotalQuantity
      ]);
    });

    doc.text("Stock Report", 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 }
    });
    doc.save(`Stock_Report_${Date.now()}.pdf`);
  };

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="p-6 ">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📦 Stock Report</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <div className="mb-4 flex gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            onClick={exportToExcel}
          >
            📊 Export to Excel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
            onClick={exportToPDF}
          >
            📄 Export to PDF
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-left text-sm uppercase tracking-wider">
            <tr>
              <th className="px-[1%] py-3">#</th>
              <th className="px-[1%]   py-3">Store</th>
              <th className="px-[1%]   py-3">Location</th>
              <th className="px-[1%]   py-3">Product</th>
              <th className="px-[1%] py-3">Carton</th>

            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {stockData.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-[1%] py-4 font-medium text-gray-700">{index + 1}</td>
                <td className="px-[1%] py-4 text-blue-700">{AllStore.find((item1) => item1._id == item.Store)?.StoreName}</td>
                <td className="px-[1%] py-4 text-blue-700">{AllLocation.find((item1) => item1._id == item.Location)?.LocationName}</td>
                <td className="px-[1%] py-4 text-blue-700">{product.find((item1) => item1._id == item.ProductName)?.ProductName}</td>
                <td className="px-[1%] py-4 text-blue-700">{item.TotalQuantity}</td>
                

              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 text-gray-800 text-sm font-semibold">
            <tr>
              <td className="px-[1%] py-3" colSpan="2">Total Stock</td>
              <td className="px-[1%] py-3"></td>
              <td className="px-[1%] py-3"></td>
              <td className="px-[1%] py-3">
                {
                  stockData.reduce((acc, item) => {
                    const productItem = product.find((p) => p._id === item.ProductName);
                    const boxInCarton = productItem?.BoxinCarton || 1;
                    const cartons = Math.floor(item.TotalQuantity / boxInCarton);
                    return acc + cartons;
                  }, 0)
                }
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default StockReport;
