// ** Reactstrap Imports
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Button, Label, FormGroup } from 'reactstrap'
import Select from 'react-select';
import DatePicker from 'react-flatpickr';

const MultipleForm = ({ onSubmit, isSubmitting, initialData, works, assistants }) => {
  const [formData, setFormData] = useState({
    worktitle: '',
    workDescribe: '',
    assistanceId: '',
    workDate: '',
    id: '',
    assistanceName: ''
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const workOptions = works?.map(work => ({
    value: work.worktitle,
    label: work.worktitle
  })) || [];

  const assistantOptions = assistants?.map(assistant => ({
    value: assistant.id,
    label: assistant.assistanceName,
    name: assistant.assistanceName
  })) || [];

  const selectedWork = workOptions.find(option => option.value === formData.worktitle);
  const selectedAssistant = assistantOptions.find(option => option.value === formData.assistanceId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWorkChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, worktitle: selectedOption?.value || '' }));
  };

  const handleAssistantChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      assistanceId: selectedOption?.value || '',
      assistanceName: selectedOption?.name || ''
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, workDate: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData(initialData || {
      worktitle: '',
      workDescribe: '',
      assistanceId: '',
      workDate: '',
      id: '',
      assistanceName: ''
    });
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="bg-white border-bottom py-2">
        <CardTitle tag='h5' className="mb-0 fw-semibold">ویرایش کار کمک‌آموزشی</CardTitle>
      </CardHeader>

      <CardBody className="p-3">
        <Form onSubmit={handleSubmit}>
          <Row className="g-2">
            <Col md={6}>
              <FormGroup className="mb-2">
                <Label for='worktitle' className="form-label mb-1 small">عنوان کار</Label>
                <Select
                  id='worktitle'
                  name='worktitle'
                  options={workOptions}
                  value={selectedWork}
                  onChange={handleWorkChange}
                  placeholder="انتخاب عنوان..."
                  isSearchable
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: '38px',
                      minHeight: '38px',
                      borderRadius: '4px',
                      borderColor: '#ced4da',
                      fontSize: '0.875rem',
                      '&:hover': { borderColor: '#86b7fe' },
                      '&:focus-within': { 
                        borderColor: '#86b7fe',
                        boxShadow: '0 0 0 0.2rem rgba(13, 110, 253, 0.25)'
                      }
                    })
                  }}
                  required
                />
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup className="mb-2">
                <Label for='assistanceId' className="form-label mb-1 small">استاد مربوطه</Label>
                <Select
                  id='assistanceId'
                  name='assistanceId'
                  options={assistantOptions}
                  value={selectedAssistant}
                  onChange={handleAssistantChange}
                  placeholder="انتخاب استاد..."
                  isSearchable
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: '38px',
                      minHeight: '38px',
                      borderRadius: '4px',
                      borderColor: '#ced4da',
                      fontSize: '0.875rem',
                      '&:hover': { borderColor: '#86b7fe' },
                      '&:focus-within': { 
                        borderColor: '#86b7fe',
                        boxShadow: '0 0 0 0.2rem rgba(13, 110, 253, 0.25)'
                      }
                    })
                  }}
                  required
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="mb-2">
                <Label for='workDate' className="form-label mb-1 small">تاریخ انجام کار</Label>
                <div className="position-relative">
                  <DatePicker
                    inputClass="form-control py-1 ps-5"
                    value={formData.workDate}
                    onChange={handleDateChange}
                    inputPlaceholder="انتخاب تاریخ"
                    calendarPosition="bottom-right"
                    style={{
                      height: '38px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da',
                      width: '100%',
                      fontSize: '0.875rem'
                    }}
                  />
                  <span className="position-absolute start-0 top-50 translate-middle-y ms-2 text-muted" style={{ fontSize: '0.9rem' }}>
                    <i className="far fa-calendar-alt"></i>
                  </span>
                </div>
              </FormGroup>
            </Col>
            
            <Col sm={12}>
              <FormGroup className="mb-2">
                <Label for='workDescribe' className="form-label mb-1 small">توضیحات کار</Label>
                <Input
                  type='textarea'
                  name='workDescribe'
                  id='workDescribe'
                  value={formData.workDescribe}
                  onChange={handleChange}
                  className="form-control"
                  style={{ 
                    minHeight: '80px', 
                    resize: 'vertical',
                    fontSize: '0.875rem'
                  }}
                  placeholder="توضیحات مربوط به کار را وارد کنید"
                  required
                />
              </FormGroup>
            </Col>
            
            <Col sm={12} className="mt-1">
              <div className='d-flex justify-content-end gap-2'>
                <Button 
                  outline 
                  color='secondary' 
                  type='button'
                  onClick={handleReset}
                  className="px-3 py-1 rounded-1"
                  style={{ fontSize: '0.875rem' }}
                >
                  بازنشانی
                </Button>
                <Button 
                  color='primary' 
                  type='submit'
                  disabled={isSubmitting}
                  className="px-3 py-1 rounded-1 shadow-sm"
                  style={{ fontSize: '0.875rem' }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" />
                      در حال ذخیره...
                    </>
                  ) : 'ذخیره تغییرات'}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default MultipleForm;