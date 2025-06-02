// ** React Imports
import { Fragment} from 'react'

// ** Reactstrap Imports
import { Label, Row, Col, Form, Input, Button } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import useCourseStore from '../../../../zustand/useCourseStore '
const CourseDetail = ({ type }) => {
  const {
    describe, setDescribe
  } = useCourseStore()

  return (
    <Fragment>
      <div className='content-header'>
        <h3 className='py-2'>توضیحات دوره را وارد کنید </h3>
      </div>
      <Form >
        <Row>
          <Label className='form-label' for={`describe-${type}`}>توضیحات</Label>
          <Col md='6' className='mb-1'>
            <Input type='text' name='describe' id={`describe-${type}`} value={describe} onChange={(value) => { setDescribe(value.target.value) }} placeholder='توضیحات دوره ' />
          </Col>

        </Row>
      </Form>
    </Fragment>

  )
}

export default CourseDetail
