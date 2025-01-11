import React, { useEffect, useState } from 'react'
import { useGetRecordsQuery } from '../../api/fakeApi';
import Pagination from './Paggination';

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
            <button className={`btn btn-outline-success me-2 ${!item?.isVisible ? "disabled" : ""}`} data-bs-toggle="modal" data-bs-target="#exampleModal" disabled={isUserView} onClick={() => setSelectedRowInfo({ isModal: true, rowData: item })}>
              <i className="fa-solid fa-pencil" />
            </button>
            <button className='btn btn-outline-primary me-2' disabled={isUserView} onClick={() => viewHandler(item?.name)}>
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
  function productTable() {
    return (
     <div className=''>
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
     </div>
    );
  }

  const getCardRenderer = (title, value) => {
    return (
      <div className='flex-25 pe-3 item'>
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
    <>
    <header className='header'> 
          <div className="toggle-container">
            <div className='d-flex align-items-center'>
              <div style={{ marginRight: "10px", color: "#fff" }}>Admin</div>
              <input type="checkbox" id="toggle" className="toggle-input" onChange={(e) => setIsUserView(e.target.checked)} />
              <label htmlFor="toggle" className="toggle-label" />
              <div style={{ marginLeft: "10px", color: "#fff" }}>User</div>
            </div>
          </div>
 
    </header>
      <div className='content-body'>
          <h1 className='text-white mb-4'>Inventory stats</h1>
        {/* {getSearch()} */}
        <div className='d-flex '>
          {getCardRenderer("total Product", currentRecords?.filter(item => item?.isVisible).length)}
          {getCardRenderer("total Store Value", ` $ ${getProductTotalPrice(currentRecords)}`)}
          {getCardRenderer("Out Of Stock", getOutOfStockProduct(currentRecords))}
          {getCardRenderer("No Of Category", getCategoryCount(currentRecords))}
        </div>
        {productTable()}
      </div>
      {selectedRowInfo?.isModal &&
        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Product</h1>
                  <h6>{selectedRowInfo?.rowData?.name}</h6>
                </div>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="d-flex">
                  <div className="flex-50 pe-1">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Category 
                      </label>
                      <input
                        className="form-control"
                        value={selectedRowInfo?.rowData?.category}
                        placeholder="Enter name"
                        onChange={(e) => setSelectedRowInfo(prev => ({ ...prev, rowData: { ...prev.rowData, category: e.target.value } }))}
                      />
                    </div>
                  </div>
                  <div className="flex-50 ps-1">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Price  
                      </label>
                      <input
                        className="form-control"
                        value={selectedRowInfo?.rowData?.price}
                        placeholder="Enter price"
                        onChange={(e) => setSelectedRowInfo(prev => ({ ...prev, rowData: { ...prev.rowData, price: e.target.value } }))}
                      />
                    </div>
                  </div>
                  <div className="flex-50 pe-1">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Quantity 
                      </label>
                      <input
                        className="form-control"
                        value={selectedRowInfo?.rowData?.quantity}
                        placeholder="Enter quantity"
                        onChange={(e) => setSelectedRowInfo(prev => ({ ...prev, rowData: { ...prev.rowData, quantity: e.target.value } }))}
                      />
                    </div>
                  </div>
                  <div className="flex-50 ps-1">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Value  
                      </label>
                      <input
                        className="form-control"
                        value={selectedRowInfo?.rowData?.value}
                        placeholder="Enter value"
                        onChange={(e) => setSelectedRowInfo(prev => ({ ...prev, rowData: { ...prev.rowData, value: e.target.value } }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-text text-waring" data-bs-dismiss="modal" onClick={() => setSelectedRowInfo({ isModal: false, rowData: {} })}>Cancel</button>
                <button type="button" className="btn  btn-secondary" data-bs-dismiss="modal" onClick={()=>updateHandler()}>Save </button>
              </div>
            </div>
          </div>
        </div>

      }
    </>
  )
}

