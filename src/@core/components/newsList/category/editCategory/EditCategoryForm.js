// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Button, Label } from 'reactstrap'
import FileUploaderSingle from '../../common/formatDate/FileUploaderSingle'
import { UpdateNewsCategory } from '../../../../../services/api/newList/putUpdateNewsCategory';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NewsCategoryById } from '../../../../../services/api/newList/getNewsCategoryById';
import toast from 'react-hot-toast';

const EditCategoryForm = () => {
  const { categoryId } = useParams();
  const id = categoryId
  const queryClient = useQueryClient();
  
  const { data: categoryData, isLoading } = useQuery(
    ['category', id],
    () => NewsCategoryById(id),
    {
      onSuccess: (data ) => {
        console.log('Received data:', data)
        if (data && data.id) {
          setFormData({
            categoryName: data.categoryName || '',
            iconAddress: data.iconAddress || '',
            iconName: data.iconName || '',
            googleTitle: data.googleTitle || '',
            googleDescribe: data.googleDescribe || '',
            image: null
          });
        }
      }
    }
  );

  const [formData, setFormData] = useState({
    categoryName: '',
    iconAddress: '',
    iconName: '',
    googleTitle: '',
    googleDescribe: '',
    image: null
  });

  const updateMutation = useMutation(
    (updatedData) => UpdateNewsCategory(
      id,
      updatedData.image,
      updatedData.categoryName,
      updatedData.iconName,
      updatedData.iconAddress,
      updatedData.googleDescribe,
      updatedData.googleTitle
    ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['category', id]);
        queryClient.invalidateQueries('categoryList');
        toast.success('ویرایش با موفقیت انجام شد');
      },
      onError: (error) => {
        console.error('Error updating category:', error);
        toast .error('خطا در ویرایش دسته بندی');
      }
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div>در حال بارگذاری...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>ویرایش دسته بندی</CardTitle>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md='6' sm='12' className='mb-1'>
              <Label for='categoryName'>عنوان <span className='text-danger'>*</span></Label>
              <Input 
                type='text' 
                name='categoryName' 
                placeholder={formData.categoryName} 
                onChange={handleInputChange}
                required
                minLength={3}
                maxLength={50}
              />
              <small className='text-muted'>حداقل ۳ و حداکثر ۵۰ کاراکتر</small>
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label for='iconAddress'>آدرس آیکون </Label>
              <Input 
                type='text' 
                name='iconAddress' 
                placeholder={formData.iconAddress} 
                onChange={handleInputChange}
                required
              />
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label for='iconName'>نام آیکون <span className='text-danger'>*</span></Label>
              <Input 
                type='text' 
                name='iconName' 
                placeholder={formData.iconName} 
                onChange={handleInputChange}
                required
                minLength={3}
                maxLength={50}
              />
              <small className='text-muted'>حداقل ۳ و حداکثر ۵۰ کاراکتر</small>
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label for='googleTitle'>عنوان گوگل <span className='text-danger'>*</span></Label>
              <Input 
                type='text' 
                name='googleTitle' 
                placeholder={formData.googleTitle} 
                onChange={handleInputChange}
                required
                minLength={40}
                maxLength={70}
              />
              <small className='text-muted'>حداقل ۴۰ و حداکثر ۷۰ کاراکتر</small>
            </Col>
            <Col sm='12' className='mb-1'>
              <Label for='googleDescribe'>توضیحات گوگل <span className='text-danger'>*</span></Label>
              <Input 
                type='textarea' 
                name='googleDescribe' 
                placeholder={formData.googleDescribe} 
                onChange={handleInputChange}
                required
                minLength={70}
                maxLength={140}
              />
              <small className='text-muted'>حداقل ۷۰ و حداکثر ۱۴۰ کاراکتر</small>
            </Col>
            <Col sm='12' className='mb-1'>
              <Label for='image'>تصویر</Label>
              <FileUploaderSingle onFileChange={handleFileChange} />
            </Col>
            <Col sm='12'>
              <Button 
                color='primary' 
                type='submit'
                disabled={updateMutation.isLoading}
              >
                {updateMutation.isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default EditCategoryForm