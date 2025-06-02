// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import Select from 'react-select'
// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Label, Row, Col, Form, Input } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { CreateCourse, getCreateCourse } from '../../../../services/api/Create-Course/CreateCourse'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import useCourseStore from '../../../../zustand/useCourseStore '
import toast from 'react-hot-toast'

const CourseFeature = ({ type }) => {
  const {
    setCourseTypeId,
    setCourseLvlId,
    setClassId,
    setTeacherId,
    setTremId,
    setShortLink
  } = useCourseStore()

  const { data: createCourse } = useQuery({
    queryKey: ["createCourse"],
    queryFn: getCreateCourse,
  });

  const getCourseType = createCourse?.courseTypeDtos.map((e) => ({
    value: e?.id,
    label: e?.typeName,
  }));

  const getCourseLevel = createCourse?.courseLevelDtos.map((e) => ({
    value: e?.id,
    label: e?.levelName,
  }));

  const getClassRoom = createCourse?.classRoomDtos.map((e) => ({
    value: e?.id,
    label: e?.classRoomName,
  }));

  const getTeacher = createCourse?.teachers.map((e) => ({
    value: e?.teacherId,
    label: e?.fullName,
  }));

  const getTerm = createCourse?.termDtos.map((e) => ({
    value: e?.id,
    label: e?.termName,
  }));


  return (
    <Fragment>
      <div className='content-header'>
        <h3 className='py-2'>ویژگی های دوره را وارد کنید </h3>
      </div>
      <Form onSubmit={e => e.preventDefault()}>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`typeName-${type}`}>
              نحوه برگذاری             </Label>
            <Select
              theme={selectThemeColors}
              isClearable={false}
              id={`country-${type}`}
              className='react-select'
              classNamePrefix='select'
              placeholder='نحوه برگزاری را انتخاب کنید'
              options={getCourseType}
              onChange={(selected) => setCourseTypeId(selected?.value)} />
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`levelName${type}`}>
              سطح برگذاری دوره             </Label>
            <Select
              isClearable={false}
              theme={selectThemeColors}
              id={`language-${type}`}
              options={getCourseLevel}
              className='react-select'
              classNamePrefix='select'
              placeholder='سطح برگزاری را انتخاب کنید'
              onChange={(selected) => setCourseLvlId(selected?.value)} />
          </Col>
        </Row>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`classRoomName-${type}`}>
              نام کلاس             </Label>
            <Select
              isClearable={false}
              theme={selectThemeColors}
              id={`language-${type}`}
              options={getClassRoom}
              className='react-select'
              classNamePrefix='select'
              placeholder='نام کلاس را انتخاب کنید'
              onChange={(selected) => setClassId(selected?.value)} />

          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`fullName-${type}`}>
              انتخاب معلم             </Label>
            <Select
              isClearable={false}
              theme={selectThemeColors}
              id={`language-${type}`}
              options={getTeacher}
              className='react-select'
              classNamePrefix='select'
              placeholder='معلم دوره را انتخاب کنید'
              onChange={(selected) => setTeacherId(selected?.value)} />

          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`termName-${type}`}>
              ترم دوره             </Label>
            <Select
              isClearable={false}
              theme={selectThemeColors}
              id={`language-${type}`}
              options={getTerm}
              className='react-select'
              classNamePrefix='select'
              placeholder='نوع ترم را انتخاب کنید'
              onChange={(selected) => setTremId(selected?.value)} />

          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`language-${type}`}>
              لینک کوتاه دوره          </Label>
            <Input
              type='text'
              name='url'
              id={`url-${type}`}
              placeholder='Url'
              onChange={(e) => setShortLink(e.target.value)}
            />
          </Col>
        </Row>
      </Form>
    </Fragment>
  )
}

export default CourseFeature
