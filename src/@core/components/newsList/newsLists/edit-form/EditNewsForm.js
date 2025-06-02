// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Button, Label } from 'reactstrap'
import FileUploaderSingle from '../../common/formatDate/FileUploaderSingle'
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useState } from 'react';
import { putUpdateNews } from '../../../../../services/api/newList/putUpdateNews';
import { getBlogDetails } from '../../../../../services/api/newList/getNewsDetails';
import toast from 'react-hot-toast';

const EditNewsForm = () => {
  const { editId } = useParams();
  const id = editId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    Id: editId,
    Title: '',
    MiniDescribe: '',
    Keyword: '',
    Describe: '',
    GoogleTitle: '',
    GoogleDescribe: '',
    NewsCatregoryId: '',
    CurrentImageAddress: null
  });

  const { data: newsDetails, isLoading } = useQuery(
    ['newsDetails', id],
    () => getBlogDetails(id),
    {
      onSuccess: (data) => {
        if (data?.detailsNewsDto) {
          setFormData({
            Id: data.detailsNewsDto.id,
            Title: data.detailsNewsDto.title || '',
            MiniDescribe: data.detailsNewsDto.miniDescribe || '',
            Keyword: data.detailsNewsDto.keyword || '',
            Describe: data.detailsNewsDto.describe || '',
            GoogleTitle: data.detailsNewsDto.googleTitle || '',
            GoogleDescribe: data.detailsNewsDto.googleDescribe || '',
            NewsCatregoryId: data.detailsNewsDto.newsCatregoryId || '',
            CurrentImageAddress: data.detailsNewsDto.currentImageAddress || null
          });
        }
      },
      onError: (error) => {
        toast.error('خطا در دریافت اطلاعات خبر');
        console.error(error);
      }
    }
  );

  const updateNewsMutation = useMutation(
    (updatedData) => putUpdateNews(updatedData),
    {
      onSuccess: () => {
        toast.success('خبر با موفقیت ویرایش شد');
        queryClient.invalidateQueries(['newsDetails']);
        navigate('/NewsList');
      },
      onError: (error) => {
        toast.error('خطا در ویرایش خبر');
        console.error(error);
      }
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      CurrentImageAddress: file
    }));
  };

  const handleNextStep = () => setStep(2);
  const handlePrevStep = () => setStep(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateNewsMutation.mutate(formData);
  };

  if (isLoading) return <div>در حال بارگذاری...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>ویرایش خبر</CardTitle>
      </CardHeader>

      <CardBody>
        <Form onSubmit={handleSubmit}>
          {step === 1 ? (
            <Row>
              <Col md='4' sm='12' className='mb-1'>
                <Label className='form-label' for='Title'>عنوان</Label>
                <Input
                  type='text'
                  name='Title'
                  id='Title'
                  value={formData.Title}
                  onChange={handleInputChange}
                  placeholder='عنوان را وارد کنید'
                />
              </Col>
              
              <Col md='4' sm='12' className='mb-1'>
                <Label className='form-label' for='MiniDescribe'>توضیحات کوتاه</Label>
                <Input
                  type='text'
                  name='MiniDescribe'
                  id='MiniDescribe'
                  value={formData.MiniDescribe}
                  onChange={handleInputChange}
                  placeholder='توضیحات کوتاه را وارد کنید'
                />
              </Col>
              
              <Col md='4' sm='12' className='mb-1'>
                <Label className='form-label' for='Keyword'>کلمات کلیدی</Label>
                <Input
                  type='text'
                  name='Keyword'
                  id='Keyword'
                  value={formData.Keyword}
                  onChange={handleInputChange}
                  placeholder='کلمات کلیدی را وارد کنید'
                />
              </Col>
              
              <Col sm='12' className='mb-1'>
                <Label className='form-label' for='Describe'>توضیحات کامل</Label>
                <Input
                  type='textarea'
                  name='Describe'
                  id='Describe'
                  value={formData.Describe}
                  onChange={handleInputChange}
                  placeholder='توضیحات کامل را وارد کنید'
                  rows='5'
                />
              </Col>
              
              <Col sm='12'>
                <div className='d-flex justify-content-between'>
                  <Button outline color='secondary' onClick={() => navigate(-1)}>
                    بازگشت
                  </Button>
                  <Button color='primary' onClick={handleNextStep}>
                    قدم بعدی
                  </Button>
                </div>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='GoogleTitle'>عنوان گوگل</Label>
                <Input
                  type='text'
                  name='GoogleTitle'
                  id='GoogleTitle'
                  value={formData.GoogleTitle}
                  onChange={handleInputChange}
                  placeholder='عنوان گوگل را وارد کنید'
                />
              </Col>
              
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='GoogleDescribe'>توضیحات گوگل</Label>
                <Input
                  type='text'
                  name='GoogleDescribe'
                  id='GoogleDescribe'
                  value={formData.GoogleDescribe}
                  onChange={handleInputChange}
                  placeholder='توضیحات گوگل را وارد کنید'
                />
              </Col>
              
              <Col sm='12' className='mb-1'>
                {formData.CurrentImageAddress && (
                  <div className='mb-2'>
                    <Label className='form-label'>عکس فعلی خبر</Label>
                    <div>
                      <img 
                        src={formData.CurrentImageAddress} 
                        alt='Current news' 
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                      />
                    </div>
                  </div>
                )}
                <FileUploaderSingle onFileUpload={handleImageUpload} />
              </Col>
              
              <Col sm='12'>
                <div className='d-flex justify-content-between'>
                  <Button outline color='secondary' onClick={handlePrevStep}>
                    قدم قبلی
                  </Button>
                  <Button color='success' type='submit' disabled={updateNewsMutation.isLoading}>
                    {updateNewsMutation.isLoading ? 'در حال ویرایش...' : 'ویرایش اطلاعات'}
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Form>
      </CardBody>
    </Card>
  );
};

export default EditNewsForm