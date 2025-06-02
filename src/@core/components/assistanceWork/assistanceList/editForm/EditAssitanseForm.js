// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Button, Label } from 'reactstrap'
import { useState } from 'react'
import { QueryClient, useMutation, useQueryClient } from 'react-query'
import { putAssistanceForCourse } from '../../../../../services/assistance/putAssistanceForCourse'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { toast } from 'react-hot-toast'
const EditableSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  isRtl,
  isClearable
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const selectedOption = options.find(opt => opt.value === value);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (selectedOption) => {
    onChange(selectedOption);
    setIsEditing(false);
    setInputValue(selectedOption?.label || '');
  };

  return (
    <div onClick={handleClick}>
      {isEditing ? (
        <Select
          autoFocus
          options={options}
          onChange={handleChange}
          onBlur={handleBlur}
          value={selectedOption}
          placeholder={placeholder}
          isClearable={isClearable}
          isRtl={isRtl}
          className="react-select"
          classNamePrefix="select"
          menuIsOpen
        />
      ) : (
        <Input
          type="text"
          value={inputValue || selectedOption?.label || ''}
          readOnly
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

const EditAssistanceForm = ({ assistanceData, coursesData }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const updateMutation = useMutation({
    mutationFn: ({ courseId, userId, id }) => 
      putAssistanceForCourse(courseId, userId, id),
    onSuccess: () => {
      queryClient.invalidateQueries(['assistances']);
      toast.success('اطلاعات با موفقیت به‌روزرسانی شد');
      navigate('/AssistanceList');
    },
    onError: () => {
      toast.error('خطا در به‌روزرسانی اطلاعات');
    }
  });

  const [selectedAssistance, setSelectedAssistance] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const uniqueTeachers = assistanceData?.filter((assistance, index, self) =>
    index === self.findIndex((a) => a.userId === assistance.userId)
  ).map(assistance => ({
    value: assistance.id,
    label: assistance.assistanceName,
    userId: assistance.userId,
    assistanceData: assistance
  })) || [];

  const courseOptions = coursesData?.courseFilterDtos?.map(course => ({
    value: course.courseId,
    label: course.title,
  })) || [];

  const handleTeacherChange = (selectedOption) => {
    const assistance = selectedOption?.assistanceData || null;
    setSelectedAssistance(assistance);
    setSelectedCourseId(assistance?.courseId || null);
  };

  const handleCourseChange = (selectedOption) => {
    setSelectedCourseId(selectedOption?.value || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAssistance && selectedCourseId) {
      updateMutation.mutate({
        courseId: selectedCourseId,
        userId: selectedAssistance.userId,
        id: selectedAssistance.id
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>ویرایش دستیار آموزشی</CardTitle>
      </CardHeader>

      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label'>دستیار آموزشی</Label>
              <EditableSelect
                options={uniqueTeachers}
                onChange={handleTeacherChange}
                value={selectedAssistance?.id}
                placeholder="انتخاب دستیار..."
                isRtl
                isClearable
              />
            </Col>

            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label'>درس مربوطه</Label>
              <EditableSelect
                options={courseOptions}
                onChange={handleCourseChange}
                value={selectedCourseId}
                placeholder="انتخاب درس..."
                isRtl
                isClearable
              />
            </Col>

            <Col sm='12'>
              <div className='d-flex'>
                <Button 
                  className='me-1' 
                  color='primary' 
                  type='submit'
                  disabled={!selectedAssistance || !selectedCourseId || updateMutation.isLoading}
                >
                  {updateMutation.isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
                <Button outline color='secondary' onClick={() => navigate('/AssistanceList')}>
                  بازگشت
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default EditAssistanceForm
