// ** React Imports
import { useState } from 'react'

// ** Table columns & Expandable Data
import  { columns } from '../../newsList/common/formatDate/data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { Archive, ChevronDown, Edit, FileText, MoreVertical, Plus, Search, User } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Button, Card, CardHeader, CardTitle, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Spinner, } from 'reactstrap'
import { useMutation, useQuery } from 'react-query';
import { getCourseAssistanceById } from '../../../../services/assistance/getCourseAssistance'
import Select from 'react-select';
import { postAssistanceForCourse } from '../../../../services/assistance/postAssistanceForCourse'
import toast from 'react-hot-toast'

const DataTableWithButtons = ({ data, courses, coursesLoading }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseSearch, setCourseSearch] = useState('');

  const addAssistantMutation = useMutation(
    ({ courseId, userId }) => postAssistanceForCourse(courseId, userId),
    {
      onSuccess: () => {
        toast.success('استادیار با موفقیت به دوره اضافه شد');
        setShowAddModal(false);
        setSelectedCourse(null);
        setSelectedAssistant(null);
        
      },
      onError: (error) => {
        toast.error(`خطا در اضافه کردن استادیار: ${error.message}`);
      }
    }
  );

  const handleAddAssistantClick = (row) => {
    setSelectedAssistant(row);
    setShowAddModal(true);
  };

  const handleAddToCourse = () => {
    if (!selectedCourse || !selectedAssistant?.userId) {
      toast.warning('لطفاً دوره را انتخاب کنید');
      return;
    }

    addAssistantMutation.mutate({
      courseId: selectedCourse.value,
      userId: selectedAssistant.userId
    });
  };

  const filteredData = data?.filter(item => 
    String(item?.assistanceName || '').toLowerCase().includes(String(searchTerm).toLowerCase())
  ) || [];

  const filteredCourses = courses?.filter(course => 
    course.title.toLowerCase().includes(courseSearch.toLowerCase())
  ) || [];

  const handlePagination = page => {
    setCurrentPage(page.selected);
  };

  const handleRowExpand = (row) => {
    setExpandedRows(prev => 
      prev.includes(row.id) ? [] : [row.id]
    );
  };

  const ExpandedComponent = ({ data: rowData }) => {
    const { isLoading, isError, error, data: assistanceDetails } = useQuery(
      ['assistanceDetails', rowData.id],
      () => getCourseAssistanceById(rowData.id),
      {
        enabled: expandedRows.includes(rowData.id),
        cacheTime: 0
      }
    );

    return (
      <div className="p-3">
        {isLoading ? (
          <div className="text-center py-3">
            <Spinner size="sm" />
            <span className="ms-1">در حال دریافت اطلاعات...</span>
          </div>
        ) : isError ? (
          <div className="text-danger text-center py-3">
            خطا در دریافت اطلاعات: {error.message}
          </div>
        ) : (
          <div className="row">
            <div className="col-md-6">
              <div className="mb-2">
                <strong>نام استادیار:</strong> {assistanceDetails?.courseAssistanceDto?.assistanceName || '---'}
              </div>
              <div className="mb-2">
                <strong>نام دوره:</strong> {assistanceDetails?.courseAssistanceDto?.courseName || '---'}
              </div>
              <div className="mb-2">
                <strong>تاریخ ثبت:</strong> 
                {new Date(assistanceDetails?.courseAssistanceDto?.inserDate).toLocaleDateString('fa-IR')}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <strong>شناسه کاربری:</strong> {assistanceDetails?.courseAssistanceDto?.userId || '---'}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      forcePage={currentPage}
      onPageChange={handlePagination}
      pageCount={Math.ceil(filteredData.length / 10) || 1}
      breakLabel={'...'}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1'}
    />
  );

  return (
    <>
      <Card className='border-0 shadow-sm'>
        <CardHeader className='bg-white border-bottom d-flex justify-content-between align-items-center gap-3'>
          <CardTitle tag='h4' className='text-center'>لیست استادیارها</CardTitle>
          <div className='d-flex justify-content-center'>
            <div className='position-relative' style={{width: '250px'}}>
              <Input
                type='text'
                placeholder='جستجو نام استادیار...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='ps-4'
              />
              <Search size={16} className='position-absolute start-1 top-50 translate-middle-y text-secondary' />
            </div>
          </div>
        </CardHeader>

        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            data={filteredData}
            columns={columns(handleAddAssistantClick)}
            expandableRows
            expandableRowExpanded={row => expandedRows.includes(row.id)}
            onRowExpandToggled={(toggled, row) => handleRowExpand(row)}
            expandableRowsComponent={ExpandedComponent}
            expandOnRowClicked
            className='react-dataTable border-top-0'
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            noDataComponent={
              <div className='p-4 text-center text-muted'>
                <FileText size={24} className='mb-1' />
                <h5 className='mt-1'>هیچ استادیاری یافت نشد</h5>
                <p className='mb-0'>موردی برای نمایش وجود ندارد</p>
              </div>
            }
          />
        </div>
      </Card>

      <Modal isOpen={showAddModal} toggle={() => setShowAddModal(false)} size="lg">
        <ModalHeader toggle={() => setShowAddModal(false)}>
          اضافه کردن استادیار به دوره
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="courseSelect">انتخاب دوره:</Label>
            <Select
              id="courseSelect"
              options={filteredCourses.map(course => ({
                value: course.id,
                label: course.title
              }))}
              value={selectedCourse}
              onChange={setSelectedCourse}
              isSearchable
              placeholder={coursesLoading ? 'در حال دریافت دوره‌ها...' : 'جستجو و انتخاب دوره'}
              isLoading={coursesLoading}
              noOptionsMessage={() => "دوره‌ای یافت نشد"}
              loadingMessage={() => "در حال دریافت دوره‌ها..."}
              onInputChange={setCourseSearch}
              inputValue={courseSearch}
              className="react-select"
              classNamePrefix="select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  textAlign: 'right',
                  direction: 'rtl'
                }),
                menu: (provided) => ({
                  ...provided,
                  textAlign: 'right',
                  direction: 'rtl'
                })
              }}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null
              }}
            />
          </FormGroup>
          
          <div className='mb-3'>
            <p>استادیار: <strong>{selectedAssistant?.assistanceName}</strong></p>
            <p>شناسه کاربری: {selectedAssistant?.userId || '---'}</p>
          </div>
          
          <div className='d-flex justify-content-end gap-2'>
            <Button color='secondary' onClick={() => setShowAddModal(false)}>
              انصراف
            </Button>
            <Button 
              color='primary' 
              onClick={handleAddToCourse}
              disabled={!selectedCourse || addAssistantMutation.isLoading}
            >
              {addAssistantMutation.isLoading ? (
                <>
                  <Spinner size="sm" className="me-1" />
                  در حال پردازش...
                </>
              ) : (
                'تایید و اضافه کردن'
              )}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default DataTableWithButtons