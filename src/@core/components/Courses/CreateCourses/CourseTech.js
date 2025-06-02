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
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CreateCourse, getCreateCourse } from '../../../../services/api/Create-Course/CreateCourse'
import toast from 'react-hot-toast'
import useCourseStore from '../../../../zustand/useCourseStore '
const CourseTech = ({ stepper, type }) => {

  const {
    setTechs
  } = useCourseStore()

  const { data: createCourse } = useQuery({
    queryKey: ["createCourse"],
    queryFn: getCreateCourse,
  });

  const techType = createCourse?.technologyDtos.map((e) => ({
    value: e?.id,
    label: e?.techName,
  }));

  return (
    <Fragment>
      <div className='content-header'>
        <h3 className='py-2'>تکنولوژی های دوره را وارد کنید </h3>
      </div>
      <Form onSubmit={e => e.preventDefault()}>
        <Col md='6' className='mb-1'>
          <Label className='form-label' for={`language-${type}`}>
            تکنولوژی ها             </Label>
          <Select
            isClearable={false}
            theme={selectThemeColors}
            options={techType}
            onChange={(selected) => setTechs(selected?.value)}
            className='react-select'
            classNamePrefix='select'
            placeholder='انتخاب کنید'
          />
        </Col>

      </Form>
    </Fragment>
  )
}

export default CourseTech
