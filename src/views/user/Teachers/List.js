import { Fragment, useState, useEffect, memo } from 'react'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle, Input, Label, Row, Col } from 'reactstrap'
import { ChevronDown } from 'react-feather'
import { getTeacherList } from "@src/services/api/TeacherList/getTeacherList"
import DeleteModal from './DeleteModal'
import AccessModal from './AccessModal'
import ReactPaginate from 'react-paginate'
import { useNavigate } from "react-router-dom"

const DEFAULT_NAME = "نام‌ناشناخته"

const columns = (navigate) => [
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
        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
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
        style={{ color: "#7367f0", cursor: "pointer", fontWeight: 600 }}
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
            background: "#ff4d4f",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "4px 12px",
            fontWeight: "bold",
            marginRight: 8,
            cursor: "pointer"
          }}
          onClick={() => window.handleDeleteUser && window.handleDeleteUser(row)}
        >
          حذف
        </button>
        <button
          style={{
            background: "#1890ff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "4px 12px",
            fontWeight: "bold",
            cursor: "pointer"
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

  return (
    <Fragment>
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
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>لیست معلم‌ها</CardTitle>
        </CardHeader>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='6'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select'>نمایش</Label>
              <Input
                className='dataTable-select'
                type='select'
                id='sort-select'
                value={rowsPerPage}
                onChange={handlePerPage}
              >
                {PAGE_SIZE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </Input>
              <Label for='sort-select'>سطر</Label>
            </div>
          </Col>
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
            <Label className='me-1' for='search-input'>
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
            />
          </Col>
        </Row>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            paginationServer
            className='react-dataTable'
            columns={columns(navigate)}
            sortIcon={<ChevronDown size={10} />}
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
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default memo(List)