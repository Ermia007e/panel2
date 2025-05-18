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
const CourseDetail = ({ stepper, type }) => {
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
  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>توضیحات دوره را وارد کنید </h5>
      </div>
      <Form onSubmit={e => e.preventDefault()}>
        <Row>
          <Col md='6' className='mb-1'>
            <Input type='text' name='first-name' id={`first-name-${type}`} placeholder='توضیحات دوره ' />
          </Col>

        </Row>

      </Form>
    </Fragment>

  )
}

export default CourseDetail
