// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import Select from 'react-select'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Label, Row, Col, Form, Input, Button } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { CreateCourse } from '../../../../services/api/Create-Course/CreateCourse'
import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'

const PersonalInfo = ({ stepper, type }) => {
  const countryOptions = [
    { value: 'UK', label: 'UK' },
    { value: 'USA', label: 'USA' },
    { value: 'Spain', label: 'Spain' },
    { value: 'France', label: 'France' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Australia', label: 'Australia' }
  ]

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'French', label: 'French' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Japanese', label: 'Japanese' }
  ]
  const client = useQueryClient();


  const mutation = useMutation({
    mutationFn: CreateCourse,
    onSuccess: () => {
      toast.success("دوره شما ثبت شد");
      client.invalidateQueries({ queryKey: ["coursesList"] });
    },
    onError: () => {
      toast.error("خطا");
    },
  });

  const CreateCourses = async (values) => {
    const CreateCourseInfo = new FormData();
    const StartTime = new Date(values.StartTime).toISOString();
    CreateCourseInfo.append("Title", values.Title);
    CreateCourseInfo.append("Cost", values.Cost);
    CreateCourseInfo.append("Capacity", values.Capacity);
    CreateCourseInfo.append("MiniDescribe", values.MiniDescribe);
    CreateCourseInfo.append("SessionNumber", values.SessionNumber);
    CreateCourseInfo.append("StartTime", values.StartTime);
    mutation.mutate(CreateCourseInfo);
    console.log(CreateCourseInfo, "cnkdicp");
  };
  return (
    <Fragment>
      <div className='content-header'>
        <h3 className='py-2'>اضافه کردن اطلاعات بلاگ </h3>
      </div>
      <Form onSubmit={(values) => CreateCourses(values)}>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`Title-${type}`}>
              عنوان بلاگ
            </Label>
            <Input type='text' name='Title' id={`Title-${type}`} placeholder='عنوان بلاگ را وارد کنید' />
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`Cost-${type}`}>
              دسته بندی
            </Label>
            <Select
              isMulti
              isClearable={false}
              theme={selectThemeColors}
              id={`language-${type}`}
              // options={courseLevel}
              className='react-select'
              classNamePrefix='select'
              placeholder='انتخاب کنید'

            />           </Col>
        </Row>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`Capacity-${type}`}>
              توضیح کوتاه
            </Label>
            <Input type='text' name='Capacity' id={`Capacity-${type}`} placeholder='توضیحی مختصر وارد کنید' />

          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`MiniDescribe-${type}`}>
              کلمات کلیدی
            </Label>
            <Input type='text' name='MiniDescribe' id={`MiniDescribe-${type}`} placeholder='کلمات کلیدی را وارد کنید' />

          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`SessionNumber-${type}`}>
              متن بلاگ            </Label>
            <Input type='text' name='SessionNumber' id={`SessionNumber-${type}`} placeholder='متن بلاگ را وارد کنید' />

          </Col>

        </Row>
      </Form>
    </Fragment>
  )
}

export default PersonalInfo
