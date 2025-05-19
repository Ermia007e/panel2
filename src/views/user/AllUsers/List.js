import { Fragment, useState, useEffect, memo } from 'react'
import { columns as columnsFactory } from './data'
import ExpandableTable from './data'
import { fetchData, deleteUser } from './store'
import { useSelector, useDispatch } from 'react-redux'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle, Input, Label, Row, Col } from 'reactstrap'
import DeleteModal from './DeleteModal'
import AccessModal from './AccessModal'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

const useDarkMode = () => {
  const skin = useSelector(state => state.layout?.skin)
  return skin === 'dark'
}

const DEFAULT_NAME = "نام‌ناشناخته"
const DEFAULT_LASTNAME = "ناشناخته"

const DataTableServerSide = () => {
  const darkMode = useDarkMode()
  const dispatch = useDispatch()
  const store = useSelector(state => state.dataTables)
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [searchValue, setSearchValue] = useState('')

  // state for delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // state for access modal
  const [accessModalOpen, setAccessModalOpen] = useState(false)
  const [accessUser, setAccessUser] = useState(null)

  useEffect(() => {
    window.handleDeleteUser = (user) => {
      setSelectedUser(user)
      setDeleteModalOpen(true)
    }
    window.handleAccessUser = (user) => {
      setAccessUser(user)
      setAccessModalOpen(true)
    }
    window.handleEditUser = (user) => {
      window.location.href = `/users/edit/${user.id}`
    }
    return () => {
      window.handleDeleteUser = null
      window.handleAccessUser = null
      window.handleEditUser = null
    }
  }, [])

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser.id))
      setDeleteModalOpen(false)
      setSelectedUser(null)
    }
  }
  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setSelectedUser(null)
  }

  const handleAccessClose = () => {
    setAccessModalOpen(false)
    setAccessUser(null)
  }

  useEffect(() => {
    dispatch(fetchData({
      page: currentPage,
      perPage: rowsPerPage,
      q: searchValue
    }))
  }, [dispatch, currentPage, rowsPerPage, searchValue])

  const handleFilter = e => {
    setSearchValue(e.target.value)
    setCurrentPage(1)
    dispatch(fetchData({
      page: 1,
      perPage: rowsPerPage,
      q: e.target.value
    }))
  }

  const handlePagination = page => {
    const newPage = page.selected + 1
    setCurrentPage(newPage)
    dispatch(fetchData({
      page: newPage,
      perPage: rowsPerPage,
      q: searchValue
    }))
  }

  const handlePerPage = e => {
    const value = parseInt(e.target.value)
    setRowsPerPage(value)
    setCurrentPage(1)
    dispatch(fetchData({
      page: 1,
      perPage: value,
      q: searchValue
    }))
  }

  const CustomPagination = () => {
    const count = Math.ceil((store?.total || 0) / rowsPerPage)
    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={handlePagination}
        pageClassName='page-item'
        breakClassName='page-item'
        nextLinkClassName='page-link'
        pageLinkClassName='page-link'
        breakLinkClassName='page-link'
        previousLinkClassName='page-link'
        nextClassName='page-item next-item'
        previousClassName='page-item prev-item'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
        }
      />
    )
  }

  const dataToRender = () => {
    if (store && store.data && store.data.length) {
      return store.data
        .map(user => ({
          ...user,
          fName: user.fname?.trim() || DEFAULT_NAME,
          lName: user.lname?.trim() || DEFAULT_LASTNAME,
          fullName: `${user.fname?.trim() || DEFAULT_NAME} ${(user.lname?.trim() || DEFAULT_LASTNAME)}`
        }))
        .filter(user =>
          user.fName.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.lName.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.fullName.toLowerCase().includes(searchValue.toLowerCase())
        )
    }
    return []
  }

  const columns = [
    ...columnsFactory(navigate),
    {
      name: "عملیات",
      minWidth: "260px",
      cell: row => (
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          width: "100%"
        }}>
          <button
            style={{
              background: darkMode ? "#ffd666" : "#ffe066",
              color: darkMode ? "#222" : "#333",
              border: "none",
              borderRadius: 6,
              padding: "4px 12px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onClick={() => window.handleEditUser && window.handleEditUser(row)}
          >
            ویرایش
          </button>
          <button
            style={{
              background: darkMode ? "#1765ad" : "#1890ff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 12px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onClick={() => window.handleAccessUser && window.handleAccessUser(row)}
          >
            دسترسی
          </button>
          <button
            style={{
              background: darkMode ? "#a61d24" : "#ff4d4f",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 12px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onClick={() => window.handleDeleteUser && window.handleDeleteUser(row)}
          >
            حذف
          </button>
        </div>
      )
    }
  ]

  // استایل دارک‌مد
  const darkStyles = {
    background: "#18191a",
    color: "#e4e6eb",
    borderColor: "#333",
    transition: "all 0.2s"
  }
  const darkInput = {
    background: "#23272b",
    color: "#e4e6eb",
    borderColor: "#444",
    transition: "all 0.2s"
  }

  return (
    <Fragment>
      <Breadcrumbs
        title="لیست کاربران"
        data={[
          { title: "داشبورد", link: "/" },
          { title: "کاربران" }
        ]}
      />
      <DeleteModal
        open={deleteModalOpen}
        user={selectedUser}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
      <AccessModal
        open={accessModalOpen}
        user={accessUser}
        onClose={handleAccessClose}
      />
      <Card className={darkMode ? "dark-mode" : ""} style={darkMode ? darkStyles : {}}>
        <CardHeader className='border-bottom' style={darkMode ? { borderColor: "#333" } : {}}>
          <CardTitle tag='h4' style={darkMode ? { color: "#e4e6eb" } : {}}>Server Side</CardTitle>
        </CardHeader>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='6'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select' style={darkMode ? { color: "#e4e6eb" } : {}}>show</Label>
              <Input
                className='dataTable-select'
                type='select'
                id='sort-select'
                value={rowsPerPage}
                onChange={handlePerPage}
                style={darkMode ? darkInput : {}}
              >
                <option value={7}>7</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
              <Label for='sort-select' style={darkMode ? { color: "#e4e6eb" } : {}}>entries</Label>
            </div>
          </Col>
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
            <Label className='me-1' for='search-input' style={darkMode ? { color: "#e4e6eb" } : {}}>
              Search
            </Label>
            <Input
              className='dataTable-filter'
              type='text'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleFilter}
              style={darkMode ? darkInput : {}}
            />
          </Col>
        </Row>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            paginationServer
            className={`react-dataTable${darkMode ? " dark-mode-table" : ""}`}
            columns={columns}
            sortIcon={<ChevronDown size={10} color={darkMode ? "#e4e6eb" : "#222"} />}
            paginationComponent={CustomPagination}
            data={dataToRender()}
            expandableRows
            expandableRowsComponent={ExpandableTable}
            customStyles={darkMode ? {
              rows: {
                style: {
                  background: "#23272b",
                  color: "#e4e6eb",
                  borderBottom: "1px solid #333"
                }
              },
              headCells: {
                style: {
                  background: "#18191a",
                  color: "#e4e6eb",
                  borderColor: "#333"
                }
              },
              cells: {
                style: {
                  background: "#23272b",
                  color: "#e4e6eb"
                }
              },
              pagination: {
                style: {
                  background: "#18191a",
                  color: "#e4e6eb"
                }
              }
            } : {}}
          />
        </div>
      </Card>
      {darkMode && (
        <style>
          {`
          .dark-mode {
            background: #18191a !important;
            color: #e4e6eb !important;
            border-color: #333 !important;
          }
          .dark-mode-table .rdt_TableHead {
            background: #18191a !important;
            color: #e4e6eb !important;
          }
          .dark-mode-table .rdt_TableRow {
            background: #23272b !important;
            color: #e4e6eb !important;
            border-bottom: 1px solid #333 !important;
          }
          .dark-mode-table .rdt_TableCell {
            background: #23272b !important;
            color: #e4e6eb !important;
          }
          .dark-mode-table .rdt_Pagination {
            background: #18191a !important;
            color: #e4e6eb !important;
          }
          .dark-mode-table .rdt_ExpanderRow {
            background: #23272b !important;
            color: #e4e6eb !important;
          }
          .dark-mode-table .rdt_Pagination .page-link {
            background: #23272b !important;
            color: #e4e6eb !important;
            border-color: #333 !important;
          }
          .dark-mode-table .rdt_Pagination .active .page-link {
            background: #ffd666 !important;
            color: #222 !important;
            border-color: #ffd666 !important;
          }
          `}
        </style>
      )}
    </Fragment>
  )
}

export default memo(DataTableServerSide)