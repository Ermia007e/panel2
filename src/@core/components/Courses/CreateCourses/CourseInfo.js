// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Label, Row, Col, Form, Input } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import useCourseStore from '../../../../zustand/useCourseStore '

const PersonalInfo = ({ type }) => {

  const {
    title,
    cost,
    capacity,
    miniDescribe,
    sessionNumber,
    startTime,
    endTime,
    setTitle,
    setCost,
    setCapacity,
    setSessionNumber,
    setStartTime,
    setEndTime,
    setMiniDescribe,
  } = useCourseStore()

  return (
    <Fragment>
      <div className='content-header'>
        <h3 className='py-2'>اضافه کردن اطلاعات دوره </h3>
      </div>
      <Form>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`Title-${type}`}>
              نام دوره
            </Label>
            <Input type='text' name='Title' id={`Title-${type}`} value={title} onChange={(value) => { setTitle(value.target.value) }} placeholder='نام دوره را وارد کنید' />
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`Cost-${type}`}>
              قیمت دوره
            </Label>
            <Input type='number' name='Cost' id={`Cost-${type}`} value={cost} onChange={(value) => { setCost(value.target.value) }} placeholder='قیمت دوره را وارد کنید' />
          </Col>
        </Row>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`Capacity-${type}`}>
              ظرفیت دوره
            </Label>
            <Input type='number' name='Capacity' id={`Capacity-${type}`} value={capacity} onChange={(value) => { setCapacity(value.target.value) }} placeholder='ظرفیت دوره را وارد کنید' />

          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`MiniDescribe-${type}`}>
              توضیحات مخصتر درباره دوره
            </Label>
            <Input type='text' name='MiniDescribe' id={`MiniDescribe-${type}`} value={miniDescribe} onChange={(value) => { setMiniDescribe(value.target.value) }} placeholder='توضیحات مختصر را وارد کنید' />

          </Col>
          <Col xs={12} className='mb-1'>
            <Label className='form-label' for={`SessionNumber-${type}`}>
              تعداد جلسات دوره
            </Label>
            <Input type='number' name='SessionNumber' id={`SessionNumber-${type}`} value={sessionNumber} onChange={(value) => { setSessionNumber(value.target.value) }} placeholder='تعداد جلسات دوره را وارد کنید' />

          </Col>
          <Col md={6} className='mb-1'>
            <Label className='form-label' for={`StartTime-${type}`}>
              شروع دوره :            </Label>
            <Input type='Date' name='StartTime' id={`StartTime-${type}`} value={startTime} onChange={(value) => { setStartTime(value.target.value) }} placeholder='تاریخ برگزاری دوره را وارد کنید' />
          </Col>
          <Col md={6}  className='mb-1'>
            <Label className='form-label' for={`endTime-${type}`}>
              پایان دوره :            </Label>
            <Input type='Date' name='endTime' id={`endTime-${type}`} value={endTime} onChange={(value) => { setEndTime(value.target.value) }} placeholder='تاریخ اتمام دوره را وارد کنید' />
          </Col>
        </Row>

      </Form>
    </Fragment>
  )
}

export default PersonalInfo
