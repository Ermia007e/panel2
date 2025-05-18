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

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>اضافه کردن اطلاعات دوره </h5>
      </div>
      <Form onSubmit={e => e.preventDefault()}>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`first-name-${type}`}>
              نام دوره
            </Label>
            <Input type='text' name='first-name' id={`first-name-${type}`} placeholder='نام دوره را .ارد کنید' />
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`last-name-${type}`}>
              قیمت دوره
            </Label>
            <Input type='text' name='last-name' id={`last-name-${type}`} placeholder='قیمت دوره را وارد کنید' />
          </Col>
        </Row>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`country-${type}`}>
              ظرفیت دوره
            </Label>
            <Select
              theme={selectThemeColors}
              isClearable={false}
              id={`country-${type}`}
              className='react-select'
              classNamePrefix='select'
              options={countryOptions}
              defaultValue={countryOptions[0]}
            />
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`language-${type}`}>
            توضیحات مخصتر درباره دوره
            </Label>
            <Input type='text' name='first-name' id={`first-name-${type}`} placeholder='توضیحات مختصر را وارد کنید' />

          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`language-${type}`}>
            تعداد جلسات دوره
            </Label>
            <Select
              isMulti
              isClearable={false}
              theme={selectThemeColors}
              id={`language-${type}`}
              options={languageOptions}
              className='react-select'
              classNamePrefix='select'
            />
          </Col>
                    <Col md='6' className='mb-1'>
            <Label className='form-label' for={`language-${type}`}>
            زمان برگذاری :            </Label>
            <Select
              isMulti
              isClearable={false}
              theme={selectThemeColors}
              id={`language-${type}`}
              options={languageOptions}
              className='react-select'
              classNamePrefix='select'
            />
          </Col>
        </Row>
      </Form>
    </Fragment>
  )
}

export default PersonalInfo
