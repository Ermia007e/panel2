import { Fragment, useState, memo, useMemo } from 'react'
import { advSearchColumns } from '../common/formatDate/data' 
import DataTable from 'react-data-table-component'
import { ChevronDown, Plus } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { Card, CardHeader, CardTitle, Input, Label, Row, Col, Button } from 'reactstrap'
import { Link } from 'react-router-dom'

const Table = ({categoryList,isLoading}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  
 
  const filteredData = useMemo(() => {
    if (!categoryList) return [];
    return categoryList.filter(item => 
      item.categoryName?.toLowerCase().includes(searchValue.toLowerCase()) 
    );
  }, [categoryList, searchValue]);

  const paginatedData = useMemo(() => {
    const startIndex = currentPage * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      breakLabel='...'
      pageCount={Math.ceil(filteredData.length / rowsPerPage)}
      marginPagesDisplayed={2}
      pageRangeDisplayed={2}
      activeClassName='active'
      forcePage={currentPage}
      onPageChange={page => setCurrentPage(page.selected)}
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
    />
  );

  return (
    <Card>
      <CardHeader className='border-bottom'>
        <CardTitle tag='h4' style={{ color: '#82868b', fontWeight: 500, fontSize: '1.500rem' }}>
          لیست دسته بندی‌ها
        </CardTitle>
        <Link to="/AddCategory">
          <Button color="primary" style={{whiteSpace: 'nowrap', height: '50px', color: '#fff', fontWeight: 400, fontSize: '1rem', display: 'flex', alignItems: 'center',justifyContent: 'center',gap: '8px' }}>
            ساخت دسته بندی جدید
            <Plus/>
          </Button>
        </Link>
      </CardHeader>
      
      <Row className='mx-0 mt-1 mb-50'>
        <Col sm='6'>
          <div className='d-flex align-items-center'>
            <Label for='sort-select' style={{ fontSize: '0.857rem', color: '#5e5873' }}>
              تعداد در صفحه
            </Label>
            <Input
              className='dataTable-select'
              type='select'
              id='sort-select'
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(parseInt(e.target.value));
                setCurrentPage(0);
              }}
              style={{ width: '70px', height: '40px', marginRight: '8px', marginLeft: '8px' }}
            >
              {[10, 25, 50, 75, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </Input>
          </div>
        </Col>
        <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
          <Label className='me-1' for='search-input' style={{fontSize: '0.857rem', color: '#5e5873'}}>
            جستجو
          </Label>
          <Input
            className='dataTable-filter'
            type='text'
            bsSize='sm'
            id='search-input'
            value={searchValue}
            onChange={e => {
              setSearchValue(e.target.value);
              setCurrentPage(0);
            }}
            style={{ width: '220px', height: '30px' }}
          />
        </Col>
      </Row>

      <div className='react-dataTable'>
        <DataTable
          noHeader
          pagination
          paginationServer={false}
          paginationTotalRows={filteredData.length}
          paginationDefaultPage={currentPage + 1}
          paginationPerPage={rowsPerPage}
          paginationComponent={CustomPagination}
          onChangePage={page => setCurrentPage(page - 1)}
          onChangeRowsPerPage={perPage => {
            setRowsPerPage(perPage);
            setCurrentPage(0);
          }}
          columns={advSearchColumns}
          data={paginatedData}
          sortIcon={<ChevronDown size={10} />}
          progressPending={isLoading}
          noDataComponent={
            <div style={{ padding: '20px', textAlign: 'center', color: '#6e6b7b' }}>
              موردی برای نمایش وجود ندارد
            </div>
          }
          direction='rtl'
        />
      </div>
    </Card>
  );
};

export default memo(Table)