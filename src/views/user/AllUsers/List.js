// ** React Imports
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useStore } from './store/index';

// ** Table Columns
import columns from './columns';

// ** Third Party Components
import ReactPaginate from 'react-paginate';
import { ChevronDown } from 'react-feather';
import DataTable from 'react-data-table-component';

// ** Reactstrap Imports
import { Button, Input, Row, Col, Card } from 'reactstrap';
import { getUserList } from '../../../services/api/userList/getUserList';
import { useQuery } from 'react-query';

import { useDispatch, useSelector } from 'react-redux';

// ** Styles
import '@styles/react/apps/app-invoice.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

const CustomHeader = ({ handleFilter, value, handleStatusValue, statusValue, handlePerPage, rowsPerPage }) => {
  const { pageNumber, setPageNumber } = useStore((state) => state);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", pageNumber],
    queryFn: () => getUserList(pageNumber),
  });

  const totalCount = data?.totalCount;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl">در حال بارگذاری...</h1>
      </div>
    );
  }

  if (error) {
    return <div>خطا: {error.message}</div>;
  }

  return (
    <div className='invoice-list-table-header w-100 py-2'>
      <Row>
        <Col lg='6' className='d-flex align-items-center px-0 px-lg-1'>
          <div className='d-flex align-items-center me-2'>
            <label htmlFor='rows-per-page'>Show</label>
            <Input
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              className='form-control ms-50 pe-3'
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </Input>
          </div>
          <Button tag={Link} to='/apps/invoice/add' color='primary'>Add Record</Button>
        </Col>
        <Col lg='6' className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0'>
          <div className='d-flex align-items-center'>
            <label htmlFor='search-invoice'>Search</label>
            <Input
              id='search-invoice'
              className='ms-50 me-2 w-100'
              type='text'
              value={value}
              onChange={e => handleFilter(e.target.value)}
              placeholder='Search Invoice'
            />
          </div>
          <h3 className='w-auto'>تعداد کاربران فعال شما: {data?.totalCount ?? 'داده‌ای موجود نیست'}</h3>
        </Col>
      </Row>
    </div>
  );
};

const List = () => {
  const { pageNumber, setPageNumber } = useStore((state) => state);
  const [value, setValue] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useDispatch();
  const store = useSelector(state => state.invoice);

  useEffect(() => {
    dispatch(getData({ page: pageNumber, perPage: rowsPerPage, status: statusValue }));
  }, [dispatch, pageNumber, rowsPerPage, statusValue]);

  const handlePagination = page => {
    const selectedPage = page.selected + 1;
    setPageNumber(selectedPage);
  };

  const handlePerPage = e => {
    setRowsPerPage(parseInt(e.target.value, 10));
  };

  const dataToRender = Array.isArray(store?.data) ? store.data : [];

  const CustomPagination = () => {
    const totalCount = store?.total ?? 0;
    const count = Math.ceil(totalCount / rowsPerPage);

    return (
      <ReactPaginate
        nextLabel=''
        breakLabel='...'
        previousLabel=''
        pageCount={count}
        activeClassName='active'
        onPageChange={handlePagination}
        forcePage={pageNumber - 1}
        containerClassName={'pagination react-paginate justify-content-end p-1'}
      />
    );
  };

  return (
    <div className='invoice-list-wrapper'>
      <Card>
        <div className='invoice-list-dataTable react-dataTable'>
          <DataTable
            noHeader
            pagination
            sortServer
            paginationServer
            subHeader={true}
            columns={columns}
            responsive={true}
            data={dataToRender}
            sortIcon={<ChevronDown />}
            paginationComponent={CustomPagination}
            subHeaderComponent={
              <CustomHeader
                value={value}
                handleFilter={val => setValue(val)}
                statusValue={statusValue}
                rowsPerPage={rowsPerPage}
                handlePerPage={handlePerPage}
              />
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default List;
