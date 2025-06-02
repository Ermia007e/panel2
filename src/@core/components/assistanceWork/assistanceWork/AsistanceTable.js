// ** React Imports
import { useState } from 'react'

// ** Table columns & Expandable Data
import  { assistanceColumns } from '../../newsList/common/formatDate/data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, ChevronLeft, ChevronRight, FileText, Plus } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Button, Card, CardHeader, CardTitle, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import toast from 'react-hot-toast'
import { Search } from 'react-feather';
import { potAssistanceWork } from '../../../../services/assistance/postWorkAssistance'
import Select from 'react-select';
import { useMutation, useQueryClient } from 'react-query'


const AsistanceTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    worktitle: '',
    workDescribe: '',
    assistanceId: '',
    workDate: ''
  });
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  const uniqueAssistances = Array.from(new Set(data?.map(item => item.id)))
    .map(id => {
      const assistance = data?.find(item => item.id === id);
      return {
        id: id,
        name: assistance?.assistanceName || `دستیار ${id}`
      };
    });

  const assistanceOptions = uniqueAssistances?.map(assistance => ({
    value: assistance.id,
    label: assistance.name
  })) || [];

  const workTitleOptions = data.map(item => ({
    value: item.worktitle,
    label: item.worktitle
  }));

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssistanceChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      assistanceId: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleWorkTitleChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      worktitle: selectedOption ? selectedOption.value : ''
    }));
  };

  const createMutation = useMutation(potAssistanceWork, {
    onSuccess: () => {
      queryClient.invalidateQueries('allAssistanceWorks');
      toast.success('کار استادیاری با موفقیت ایجاد شد');
      toggleModal();
      setFormData({
        worktitle: '',
        workDescribe: '',
        assistanceId: '',
        workDate: ''
      });
    },
    onError: () => {
      toast.error('خطا در ایجاد کار استادیاری');
    }
  });

  const handleCreate = async () => {
    if (!formData.worktitle || !formData.workDescribe || !formData.assistanceId || !formData.workDate) {
      toast.error('لطفا تمام فیلدهای ضروری را پر کنید');
      return;
    }

    createMutation.mutate({
      worktitle: formData.worktitle,
      workDescribe: formData.workDescribe,
      assistanceId: formData.assistanceId,
      workDate: formData.workDate
    });
  };

  const filteredData = data?.filter(item => 
    item.worktitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.assistanceName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={<ChevronLeft size={15} />}
      nextLabel={<ChevronRight size={15} />}
      forcePage={currentPage}
      onPageChange={page => setCurrentPage(page.selected)}
      pageCount={Math.ceil(filteredData.length / itemsPerPage) || 1}
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
      nextClassName='page-item next'
      previousClassName='page-item prev'
      containerClassName={'pagination react-paginate justify-content-center my-2'}
    />
  );

  const currentItems = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <Card className='border-0 shadow-sm'>
        <CardHeader className='bg-white border-bottom'>
          <div className='d-flex flex-column flex-md-row justify-content-between align-items-center w-100 gap-3'>
            <CardTitle tag='h4' className='text-primary text-nowrap p-0 m-0'>
              وظایف استادیاران
            </CardTitle>
            <div className='d-flex flex-column flex-md-row gap-3 align-items-center justify-content-end w-100 w-md-auto'>
              <div className='position-relative' style={{ maxWidth: '250px', width: '100%' }}>
                <Search 
                  size={16} 
                  className='position-absolute top-50 translate-middle-y'
                  style={{ right: '12px', color: '#6c757d' }}
                />
                <Input
                  type='search'
                  placeholder='جستجو عنوان کار یا نام استاد...'
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(0);
                  }}
                  className='form-control ps-3 rounded-pill'
                  style={{ 
                    paddingRight: '35px',
                    border: '1px solid #ced4da',
                    boxShadow: 'none',
                    height: '32px',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              <Button 
                color='primary'
                onClick={toggleModal}
                className='d-flex align-items-center gap-1 rounded-pill'
                style={{
                  height: '32px',
                  padding: '0 12px',
                  fontSize: '0.875rem'
                }}
              >
                <Plus size={14} />
                <span>ایجاد کار استادیاری</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            striped
            highlightOnHover
            pagination
            data={currentItems}
            columns={assistanceColumns}
            className='border-top-0'
            sortIcon={<ChevronDown size={12} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            persistTableHead
            responsive
            direction='rtl'
            noDataComponent={
              <div className='p-4 text-center text-muted'>
                <FileText size={24} className='mb-2' />
                <p className='mb-0'>هیچ داده‌ای یافت نشد</p>
              </div>
            }
          />
        </div>
      </Card>

      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>ایجاد کار استادیاری جدید</ModalHeader>
        <ModalBody>
          <div className='mb-3'>
            <label className='form-label'>عنوان کار *</label>
            <Select
              options={workTitleOptions}
              value={formData.worktitle ? { 
                value: formData.worktitle, 
                label: formData.worktitle 
              } : null}
              onChange={handleWorkTitleChange}
              placeholder="عنوان کار را انتخاب یا وارد کنید..."
              isClearable
              isRtl
              isSearchable
              required
              classNamePrefix="select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: '38px',
                  fontSize: '0.875rem',
                  border: '1px solid #ced4da',
                  '&:hover': {
                    borderColor: '#ced4da'
                  }
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999
                }),
                option: (provided) => ({
                  ...provided,
                  textAlign: 'right'
                }),
                singleValue: (provided) => ({
                  ...provided,
                  textAlign: 'right'
                })
              }}
            />
          </div>
          <div className='mb-3'>
            <label className='form-label'>دستیار *</label>
            <Select
              options={assistanceOptions}
              value={formData.assistanceId ? { 
                value: formData.assistanceId, 
                label: assistanceOptions.find(a => a.value === formData.assistanceId)?.label || ''
              } : null}
              onChange={handleAssistanceChange}
              placeholder="دستیار را انتخاب کنید..."
              isClearable
              isRtl
              isSearchable
              required
              classNamePrefix="select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: '38px',
                  fontSize: '0.875rem',
                  border: '1px solid #ced4da',
                  '&:hover': {
                    borderColor: '#ced4da'
                  }
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999
                }),
                option: (provided) => ({
                  ...provided,
                  textAlign: 'right'
                }),
                singleValue: (provided) => ({
                  ...provided,
                  textAlign: 'right'
                })
              }}
            />
          </div>
          <div className='mb-3'>
            <label className='form-label'>تاریخ *</label>
            <Input 
              type='date' 
              name='workDate'
              value={formData.workDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className='mb-3'>
            <label className='form-label'>توضیحات *</label>
            <Input 
              type='textarea' 
              name='workDescribe'
              value={formData.workDescribe}
              onChange={handleChange}
              placeholder='(حداقل 5کاراکتر)توضیحات کار را وارد کنید'
              rows={4}
              minLength={5}
              maxLength={450}
              required
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={toggleModal}>
            انصراف
          </Button>
          <Button color='primary' onClick={handleCreate} disabled={createMutation.isLoading}>
            {createMutation.isLoading ? 'در حال ایجاد...' : 'ایجاد کار'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AsistanceTable
