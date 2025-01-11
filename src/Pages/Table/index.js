import React, { useEffect, useState } from 'react'
import { useGetRecordsQuery } from '../../api/fakeApi';
import Pagination from './Pagination';

export default function Table() {
  const [data, setData] = useState([])
  const [dataFilter, setDataFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [selectedRowInfo, setSelectedRowInfo] = useState({ isModal: false, rowData: {} })

  const [isUserView, setIsUserView] = useState(false);
  const { data: getAllRecords, isFetching: isGetAllRecordsFetching } = useGetRecordsQuery(undefined, { refetchOnReconnect: true, refetchOnMountOrArgChange: true })

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(data.length / recordsPerPage)

  useEffect(() => {
    if (!isGetAllRecordsFetching && getAllRecords) {
      setData(getAllRecords?.map(item => ({ ...item, isVisible: true })))
    }
  }, [isGetAllRecordsFetching, getAllRecords])

  const handleDelete = (id) => {
    const updatedData = data.filter(item => item.name !== id);
    setData(updatedData);
  };

  const viewHandler = (name) => {
    const updatedData = data.map(item =>
      item.name === name ? { ...item, isVisible: !item.isVisible } : item
    );
    setData(updatedData);
  };

  const getTableHeader = () => {
    return (
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Value</th>
        <th>Action</th>
      </tr>
    )
  }

  const productRow = currentRecords?.filter(item =>
    item?.name.toLowerCase().includes(dataFilter) ||
    item.email.toString().includes(dataFilter)
  )?.map(item => {
    return (
      <tr key={item?.name}>
        <td>{item?.name}</td>
        <td >{item?.category}</td>
        <td>{item?.price}</td>
        <td >{item?.quantity}</td>
        <td>{item?.value}</td>
        <td>
          <div className=''>
            <button className={`btn btn-outline-success me-2 ${!item?.isVisible ? "disabled" : ""}`} disabled={isUserView} onClick={() => setSelectedRowInfo({ isModal: true, rowData: item })}>
              <i className="fa-solid fa-pencil" />
            </button>
            <button className='btn btn-outline-primary me-2 data-bs-toggle="modal' disabled={isUserView} onClick={() => viewHandler(item?.name)}>
              <i className={item?.isVisible ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"} />
            </button>
            <button className='btn btn-outline-danger' disabled={isUserView} onClick={() => handleDelete(item?.name)}>
              <i className="fa fa-trash" />
            </button>
          </div>
        </td>
      </tr>
    )
  })
  const tablePagination = () => {
    return (
      <div style={{ padding: "10px", boxShadow: "0px -1px 4px rgba(0, 0, 0, 0.3)" }}>
        <Pagination
          nPages={nPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

      </div>
    )
  }

  const searchHandler = (event) => {
    const searchData = event?.target?.value?.toLowerCase();
    setDataFilter(searchData)
  }

  // const getSearch = () => {

  //   return (
  //     <div style={{ margin: "20px" }}>
  //       <input type='tex' placeholder='search ...' value={dataFilter} onChange={(event) => searchHandler(event)} />
  //     </div>
  //   )
  // }

  function productTable() {
    return (
      <div className='table-wrapper'>
        <div className='table-parent'>
          <table >
            <thead>
              {getTableHeader()}
            </thead>
            <tbody>{productRow}</tbody>
          </table>
        </div>
        {tablePagination()}
      </div>
    );
  }

  const getCardRenderer = (title, value) => {
    return (
      <div className='flex-25 me-1'>
        <div className='card custom-card'>
          <div className='card-body'>
            <i className="fa-solid fa-check"></i>
            <div className='info'>
              <h6>{title}</h6>
              <h3>{value}</h3>
            </div>
          </div>
        </div>
      </div>
    )
  }


  const getProductTotalPrice = (data) => {
    return data.reduce((total, item) => {
      if (item?.isVisible) {
        const value = parseFloat(item.value.replace("$", "")) || 0;
        return total + value;
      }
      return total;
    }, 0);
  };

  const getOutOfStockProduct = (data) => {
    return data?.filter(item => item?.quantity === 0 && item?.isVisible)?.length;
  };

  function getCategoryCount(items) {
    const categories = [];
    items.forEach(item => {
      if (item?.isVisible && !categories.includes(item.category)) {
        categories.push(item.category);
      }
    });
    return categories.length;
  }

  const updateHandler = () => {
    const updatedData = data.map(item =>
      item.name === selectedRowInfo.rowData.name
        ? { ...item, ...selectedRowInfo.rowData }
        : item
    );
    setData(updatedData);
    setSelectedRowInfo({ isModal: false, rowData: {} });
  };
  return (
    <div className='content-body'>
      <div className='header'>
        <div className="toggle-container">
          <div style={{ display: 'flex', justifyContent: "end" }}>
            <div style={{ marginRight: "10px", color: "#fff" }}>Admin</div>
            <input type="checkbox" id="toggle" className="toggle-input" onChange={(e) => setIsUserView(e.target.checked)} />
            <label htmlFor="toggle" className="toggle-label" />
            <div style={{ marginLeft: "10px", color: "#fff" }}>User</div>
          </div>
        </div>
        <h1 style={{ color: "#fff" }}>Inventory stats</h1>
      </div>
      {/* {getSearch()} */}
      <div className='d-flex'>
        {getCardRenderer("total Product", currentRecords?.filter(item => item?.isVisible).length)}
        {getCardRenderer("total Store Value", ` $ ${getProductTotalPrice(currentRecords)}`)}
        {getCardRenderer("Out Of Stock", getOutOfStockProduct(currentRecords))}
        {getCardRenderer("No Of Category", getCategoryCount(currentRecords))}
      </div>
      {productTable()}

      {selectedRowInfo?.isModal ?
        <div className="modal-overlay">
          <div className="modal-content">
            <h1>Edit Product</h1>
            <h6>{selectedRowInfo?.rowData?.name}</h6>
            <div className="">
              <div className="flex-50">
                <div className="">
                  <label htmlFor="name" className="">
                    Category<span className="text-danger">*</span> :
                  </label>
                  <input
                    className=""
                    value={selectedRowInfo?.rowData?.category}
                    placeholder="Enter name"
                    onChange={(e) => setSelectedRowInfo(prev => ({ ...prev, rowData: { ...prev.rowData, category: e.target.value } }))}
                  />
                </div>
              </div>
              <div className="flex-50">
                <div className="">
                  <label htmlFor="name" className="">
                    Price <span className="text-danger">*</span> :
                  </label>
                  <input
                    className=""
                    value={selectedRowInfo?.rowData?.price}
                    placeholder="Enter price"
                    onChange={(e) => setSelectedRowInfo(prev => ({ ...prev, rowData: { ...prev.rowData, price: e.target.value } }))}
                  />
                </div>
              </div>
              <div className="flex-50">
                <div className="">
                  <label htmlFor="name" className="">
                    Quantity <span className="text-danger">*</span> :
                  </label>
                  <input
                    className=""
                    value={selectedRowInfo?.rowData?.quantity}
                    placeholder="Enter quantity"
                    onChange={(e) => setSelectedRowInfo(prev => ({ ...prev, rowData: { ...prev.rowData, quantity: e.target.value } }))}
                  />
                </div>
              </div>
              <div className="flex-50">
                <div className="">
                  <label htmlFor="name" className="">
                    Value <span className="text-danger">*</span> :
                  </label>
                  <input
                    className=""
                    value={selectedRowInfo?.rowData?.value}
                    placeholder="Enter value"
                    onChange={(e) => setSelectedRowInfo(prev => ({ ...prev, rowData: { ...prev.rowData, value: e.target.value } }))}
                  />
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedRowInfo({ isModal: false, rowData: {} })}>Close</button>
            <button onClick={updateHandler}>Save</button>
          </div>
        </div>
        : ""}

    </div>
  )
}
