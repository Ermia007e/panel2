import { Fragment, useState, useEffect, memo } from 'react'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle, Input, Label, Row, Col } from 'reactstrap'
import { ChevronDown } from 'react-feather'
import { getTeacherList } from "@src/services/api/TeacherList/getTeacherList"
import DeleteModal from './DeleteModal'
import AccessModal from './AccessModal'
import ReactPaginate from 'react-paginate'
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'
import Breadcrumbs from './Breadcrumbs' // اضافه شد

const DEFAULT_NAME = "نام‌ناشناخته"

const useDarkMode = () => {
  const skin = useSelector(state => state.layout?.skin)
  return skin === 'dark'
}

const columns = (navigate, darkMode) => [
  {
    name: "#",
    width: "60px",
    cell: (row, idx) => row.rowNumber
  },
  {
    name: "عکس",
    width: "70px",
    cell: row => (
      <img
        src={row.pictureAddress ? row.pictureAddress.replace(/\\/g, "/") : "https://tanzolymp.com/images/default-non-user-no-photo-1.jpg"}
        alt={row.fullName}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          objectFit: "cover",
          border: darkMode ? "2px solid #ffd666" : "2px solid #e3e8ff",
          background: darkMode ? "#23272b" : "#fff"
        }}
        onError={e => { e.target.src = "https://tanzolymp.com/images/default-non-user-no-photo-1.jpg" }}
      />
    )
  },
  {
    name: "نام کامل",
    selector: row => row.fullName,
    sortable: true,
    cell: row => (
      <span
        style={{
          color: darkMode ? "#ffd666" : "#7367f0",
          cursor: "pointer",
          fontWeight: 600
        }}
        onClick={() => navigate(`/users/details/${row.teacherId}`)}
      >
        {row.fullName || DEFAULT_NAME}
      </span>
    )
  },
  {
    name: "تعداد دوره",
    selector: row => row.courseCounts,
    sortable: true
  },
  {
    name: "تعداد اخبار",
    selector: row => row.newsCount,
    sortable: true
  },
  {
    name: "عملیات",
    cell: row => (
      <>
        <button
          style={{
            background: darkMode ? "#a61d24" : "#ff4d4f",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "4px 12px",
            fontWeight: "bold",
            marginRight: 8,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onClick={() => window.handleDeleteUser && window.handleDeleteUser(row)}
        >
          حذف
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
      </>
    )
  }
]

const PAGE_SIZE_OPTIONS = [7, 10, 25, 50, 75, 100]

function CustomPagination({ pageCount, onPageChange, currentPage }) {
  return (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      breakLabel='...'
      pageCount={pageCount || 1}
      marginPagesDisplayed={2}
      pageRangeDisplayed={2}
      activeClassName='active'
      forcePage={currentPage !== 0 ? currentPage - 1 : 0}
      onPageChange={onPageChange}
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

const List = () => {
  const darkMode = useDarkMode()
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [accessModalOpen, setAccessModalOpen] = useState(false)
  const [accessUser, setAccessUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    window.handleDeleteUser = (user) => {
      setSelectedUser(user)
      setDeleteModalOpen(true)
    }
    window.handleAccessUser = (user) => {
      setAccessUser(user)
      setAccessModalOpen(true)
    }
    return () => {
      window.handleDeleteUser = null
      window.handleAccessUser = null
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    getTeacherList(currentPage, rowsPerPage, searchValue).then(res => {
      const withRowNumber = res.users.map((item, idx) => ({
        ...item,
        rowNumber: (currentPage - 1) * rowsPerPage + idx + 1,
        fullName: item.fullName || DEFAULT_NAME
      }))
      setData(withRowNumber)
      setTotal(res.total)
      setLoading(false)
    })
  }, [currentPage, rowsPerPage, searchValue])

  const handleFilter = e => {
    setSearchValue(e.target.value)
    setCurrentPage(1)
  }

  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
  }

  const handlePerPage = e => {
    const value = parseInt(e.target.value)
    setRowsPerPage(value)
    setCurrentPage(1)
  }

  // استایل‌های دارک‌مد
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
      {/* --- breadcrumb بالای صفحه --- */}
      <Breadcrumbs
        title="لیست معلم‌ها"
        data={[
          { title: "داشبورد", link: "/" },
          { title: "کاربران", link: "/users" },
          { title: "معلم‌ها" }
        ]}
      />
      {/* --- پایان breadcrumb --- */}
      <DeleteModal
        open={deleteModalOpen}
        user={selectedUser}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => setDeleteModalOpen(false)}
      />
      <AccessModal
        open={accessModalOpen}
        user={accessUser}
        onClose={() => setAccessModalOpen(false)}
      />
      <Card className={darkMode ? "dark-mode" : ""} style={darkMode ? darkStyles : {}}>
        <CardHeader className='border-bottom' style={darkMode ? { borderColor: "#333" } : {}}>
          <CardTitle tag='h4' style={darkMode ? { color: "#e4e6eb" } : {}}>لیست معلم‌ها</CardTitle>
        </CardHeader>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='6'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select' style={darkMode ? { color: "#e4e6eb" } : {}}>نمایش</Label>
              <Input
                className='dataTable-select'
                type='select'
                id='sort-select'
                value={rowsPerPage}
                onChange={handlePerPage}
                style={darkMode ? darkInput : {}}
              >
                {PAGE_SIZE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </Input>
              <Label for='sort-select' style={darkMode ? { color: "#e4e6eb" } : {}}>سطر</Label>
            </div>
          </Col>
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
            <Label className='me-1' for='search-input' style={darkMode ? { color: "#e4e6eb" } : {}}>
              جستجو
            </Label>
            <Input
              className='dataTable-filter'
              type='text'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleFilter}
              placeholder="نام معلم..."
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
            columns={columns(navigate, darkMode)}
            sortIcon={<ChevronDown size={10} color={darkMode ? "#e4e6eb" : "#222"} />}
            paginationComponent={() =>
              <CustomPagination
                pageCount={Math.ceil(total / rowsPerPage)}
                onPageChange={handlePagination}
                currentPage={currentPage}
              />
            }
            data={data}
            progressPending={loading}
            highlightOnHover
            striped
            responsive
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

export default memo(List)