// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import Select from 'react-select'
import { ArrowLeft, ArrowRight } from 'react-feather'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Label, Row, Col, Form, Input, Button } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { getCreateCourse } from '../../../../services/api/Create-Course/CreateCourse'
import { useQuery } from 'react-query'

const CourseFeature = ({ type }) => {

  const { data: createCourse } = useQuery({
    queryKey: ["createCourse"],
    queryFn: getCreateCourse,
  });

  const courseType = createCourse?.courseTypeDtos.map((e) => ({
    value: e?.id,
    label: e?.typeName,
  }));

  const courseLevel = createCourse?.courseLevelDtos.map((e) => ({
    value: e?.id,
    label: e?.levelName,
  }));

  const classRoom = createCourse?.classRoomDtos.map((e) => ({
    value: e?.id,
    label: e?.classRoomName,
  }));

  const teacher = createCourse?.teachers.map((e) => ({
    value: e?.id,
    label: e?.fullName,
  }));

  const term = createCourse?.termDtos.map((e) => ({
    value: e?.id,
    label: e?.termName,
  }));
  return (
    <Fragment>
      <div className='content-header'>
        <h3 className='py-2'>کلمات کلیدی را وارد کنید </h3>
      </div>
      <Form onSubmit={e => e.preventDefault()}>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`first-name-${type}`}>
              GoogleTitle             </Label>
            <Input type='text' name='SessionNumber' id={`SessionNumber-${type}`} placeholder='GoogleTitle را وارد کنید' />
        </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`last-name-${type}`}>
              GoogleDescribe             </Label>
            <Input type='text' name='SessionNumber' id={`SessionNumber-${type}`} placeholder='GoogleDescribe را وارد کنید' />
         </Col>
        </Row>
        <Row>
 
        </Row>

      </Form>
    </Fragment>
  )
}

export default CourseFeature
