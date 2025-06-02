// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Button, Label } from 'reactstrap'
import FileUploaderSingle from '../common/formatDate/FileUploaderSingle'
import { useState } from 'react';
import { useMutation } from 'react-query';
import { createNews } from '../../../../services/api/newList/postCreateNews';

const MultipleColumnForm = ({ categories, isLoading, isError, error }) => {
  const [formData, setFormData] = useState({
    iconName: '',
    iconAddress: '',
    categoryName: '', 
    title: '',
    shortDescription: '',
    keywords: '',
    googleTitle: '',
    googleDescribe: '',
    blogText: '',
    image: null,
  });

  const [validationErrors, setValidationErrors] = useState([]);

  const mutation = useMutation({
    mutationFn: (formData) => createNews(formData),
    onSuccess: () => {
      alert('خبر با موفقیت ایجاد شد!');
      setFormData({
        iconName: '',
        iconAddress: '',
        categoryName: '', 
        title: '',
        shortDescription: '',
        keywords: '',
        googleTitle: '',
        googleDescribe: '',
        blogText: '',
        image: null,
      });
      setValidationErrors([]);
    },
    onError: (error) => {
      if (error.response?.data?.ErrorMessage) {
        setValidationErrors(error.response.data.ErrorMessage);
      } else {
        setValidationErrors(['خطا در ایجاد خبر!']);
      }
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'googleTitle' && value.length > 70) return;
    if (name === 'googleDescribe' && value.length > 150) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleImageUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = [];
    
    if (!formData.title) errors.push('عنوان الزامی است');
    if (!formData.categoryName) errors.push('دسته‌بندی الزامی است');
    if (!formData.shortDescription) errors.push('توضیح کوتاه الزامی است');
    if (!formData.keywords) errors.push('کلمات کلیدی الزامی است');
    
    if (formData.googleTitle && (formData.googleTitle.length < 40 || formData.googleTitle.length > 70)) {
      errors.push('عنوان گوگل باید بین 40 تا 70 کاراکتر باشد');
    }
    
    if (formData.googleDescribe && (formData.googleDescribe.length < 70 || formData.googleDescribe.length > 150)) {
      errors.push('توضیحات گوگل باید بین 70 تا 150 کاراکتر باشد');
    }
    
    if (!formData.blogText) errors.push('متن بلاگ الزامی است');
    if (!formData.image) errors.push('تصویر الزامی است');
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    mutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>فرم ایجاد محتوا</CardTitle>
      </CardHeader>

      <CardBody>
        {validationErrors.length > 0 && (
          <div className="alert alert-danger">
            <ul className="mb-0">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md='6' sm='12' className='mb-2'>
              <Label className='form-label' for='title'>عنوان *</Label>
              <Input 
                type='text' 
                name='title' 
                id='title' 
                placeholder='عنوان را وارد کنید'
                style={{ height: '45px', fontSize: '14px' }}
                value={formData.title}
                onChange={handleInputChange}
                minLength={5}
                maxLength={70}
              />
              <small className="text-muted">حداقل 5 کاراکتر، حداکثر 70 کاراکتر</small>
            </Col>
            
            <Col md='6' sm='12' className='mb-2'>
              <Label className='form-label' for='categoryName'>دسته بندی *</Label>
              {isLoading ? (
                <Input disabled style={{ height: '45px', fontSize: '14px' }}>
                  <option>در حال دریافت لیست...</option>
                </Input>
              ) : isError ? (
                <div className="text-danger">خطا در دریافت لیست دسته‌بندی‌ها: {error.message}</div>
              ) : (
                <Input
                  type='select'
                  name='categoryName'
                  id='categoryName'
                  style={{ height: '45px', fontSize: '14px' }}
                  value={formData.categoryName}
                  onChange={handleInputChange}
                >
                  <option value=''>انتخاب دسته‌بندی</option>
                  {categories?.map((category) => (
                    <option key={category?.id} value={category?.categoryName}>
                      {category?.categoryName}
                    </option>
                  ))}
                </Input>
              )}
            </Col>
            
            <Col md='6' sm='12' className='mb-2'>
              <Label className='form-label' for='shortDescription'>توضیح کوتاه *</Label>
              <Input 
                type='text' 
                name='shortDescription' 
                id='shortDescription' 
                placeholder='توضیح کوتاه را وارد کنید'
                style={{ height: '45px', fontSize: '14px' }}
                value={formData.shortDescription}
                onChange={handleInputChange}
              />
            </Col>
            
            <Col md='6' sm='12' className='mb-2'>
              <Label className='form-label' for='keywords'>کلمات کلیدی *</Label>
              <Input 
                type='text' 
                name='keywords' 
                id='keywords' 
                placeholder='کلمات کلیدی را وارد کنید (با کاما جدا کنید)'
                style={{ height: '45px', fontSize: '14px' }}
                value={formData.keywords}
                onChange={handleInputChange}
              />
            </Col>
            
            <Col md='6' sm='12' className='mb-2'>
              <Label className='form-label' for='googleTitle'>عنوان گوگل</Label>
              <Input 
                type='text' 
                name='googleTitle' 
                id='googleTitle' 
                placeholder='عنوان گوگل را وارد کنید (40-70 کاراکتر)'
                style={{ height: '45px', fontSize: '14px' }}
                value={formData.googleTitle}
                onChange={handleInputChange}
                minLength={40}
                maxLength={70}
              />
              <small className="text-muted">{formData.googleTitle.length}/70 کاراکتر</small>
            </Col>
            
            <Col md='6' sm='12' className='mb-2'>
              <Label className='form-label' for='googleDescribe'>توضیحات گوگل</Label>
              <Input 
                type='textarea'
                name='googleDescribe' 
                id='googleDescribe' 
                placeholder='توضیحات گوگل را وارد کنید (70-150 کاراکتر)'
                style={{ height: '80px', fontSize: '14px' }}
                value={formData.googleDescribe}
                onChange={handleInputChange}
                minLength={70}
                maxLength={150}
              />
              <small className="text-muted">{formData.googleDescribe.length}/150 کاراکتر</small>
            </Col>
            
            <Col md='12' sm='12' className='mb-2'>
              <Label className='form-label' for='blogText'>متن بلاگ *</Label>
              <Input 
                type='textarea' 
                name='blogText' 
                id='blogText' 
                placeholder='متن کامل را وارد کنید'
                style={{ height: '150px', fontSize: '14px' }}
                value={formData.blogText}
                onChange={handleInputChange}
              />
            </Col>
            
            <Col md='12' sm='12' className='mb-3'>
              <Label className='form-label d-block'>تصویر *</Label>
              <div style={{ 
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '5px',
                margin: '15px 0'
              }}>
                <FileUploaderSingle onFileUpload={handleImageUpload} />
                {formData.image && (
                  <small className="text-success d-block mt-2">
                    تصویر انتخاب شده: {formData.image.name}
                  </small>
                )}
              </div>
            </Col>
            
            <Col sm='12'>
              <div className='d-flex'>
                <Button 
                  className='me-1' 
                  color='primary' 
                  type='submit'
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? 'در حال ارسال...' : 'ثبت تغییرات'}
                </Button>
                <Button 
                  outline 
                  color='secondary' 
                  type='reset'
                  onClick={() => {
                    setFormData({
                      iconName: '',
                      iconAddress: '',
                      categoryName: '', 
                      title: '',
                      shortDescription: '',
                      keywords: '',
                      googleTitle: '',
                      googleDescribe: '',
                      blogText: '',
                      image: null,
                    });
                    setValidationErrors([]);
                  }}
                >
                  بازنشانی
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default MultipleColumnForm