// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Button, Label } from 'reactstrap'
import FileUploaderSingle from '../../common/formatDate/FileUploaderSingle'
import { useMutation } from 'react-query';
import { CreateNewsCategory } from '../../../../../services/api/newList/postCreateNewsCategory';
import { useState } from 'react';
import toast from 'react-hot-toast';

const AddCategoryForm = () => {
  const [formData, setFormData] = useState({
    categoryName: '',
    googleTitle: '',
    googleDescribe: '',
    iconAddress: '',
    iconName: '',
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const mutation = useMutation(async () => {
    const { categoryName, image, googleTitle, googleDescribe, iconAddress, iconName } = formData;
    return await CreateNewsCategory(
      categoryName,
      image,
      iconAddress,
      iconName,
      googleTitle,
      googleDescribe
    );
  }, {
    onSuccess: () => {
      toast.success('دسته‌بندی با موفقیت ایجاد شد');
      setFormData({
        categoryName: '',
        googleTitle: '',
        googleDescribe: '',
        image: null
      });
    },
    onError: (error) => {
      toast.error('خطا در ایجاد دسته‌بندی');
      console.error(error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>فرم ایجاد دسته‌بندی</CardTitle>
      </CardHeader>

      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='categoryName'>نام دسته‌بندی</Label>
              <Input
                type='text'
                name='categoryName'
                id='categoryName'
                placeholder='نام دسته‌بندی را وارد کنید'
                value={formData.categoryName}
                onChange={handleInputChange}
                
              />
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='googleTitle'>عنوان گوگل</Label>
              <Input
                type='text'
                name='googleTitle'
                id='googleTitle'
                placeholder='عنوان گوگل را وارد کنید'
                value={formData.googleTitle}
                onChange={handleInputChange}
                maxLength={70}
                minLength={40}
              />
            </Col>
            <Col sm='12' className='mb-1'>
              <Label className='form-label' for='googleDescribe'>توضیحات گوگل</Label>
              <Input
                type='text'
                name='googleDescribe'
                id='googleDescribe'
                placeholder='توضیحات گوگل را وارد کنید'
                value={formData.googleDescribe}
                onChange={handleInputChange}
                maxLength={150}
                minLength={70}
              />
            </Col>
            <Col sm='12' className='mb-1'>
              <FileUploaderSingle onFileUpload={handleFileUpload} />
            </Col>
            <Col sm='12'>
              <div className='d-flex'>
                <Button 
                  className='me-1' 
                  color='primary' 
                  type='submit'
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? 'در حال ارسال...' : 'ثبت'}
                </Button>
                <Button 
                  outline 
                  color='secondary' 
                  type='reset'
                  onClick={() => setFormData({
                    categoryName: '',
                    googleTitle: '',
                    googleDescribe: '',
                    image: null
                  })}
                >
                  ریست
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default AddCategoryForm
