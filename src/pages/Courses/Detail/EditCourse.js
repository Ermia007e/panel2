import React, { Fragment } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { getgroupList } from '../../../services/api/Blogs'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getCreateCourse, UpdateCourse } from '../../../services/api/Create-Course/CreateCourse'
import useCourseStore from '../../../zustand/useCourseStore '
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { formDataModifire } from '../../../utility/formDataModifire'
import generateUniqueString from '../../../utility/generateUniqueString'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

const EditCourse = ({ show, setShow,courseDetail }) => {
      const {
    title,
    describe,
    miniDescribe,
    unitPerCost,
    capacity,
    sessionNumber,
    cost,
    uniqeUrlString,
    image,
    startTime,
    endTime,
    googleSchema,
    googleTitle,
    coursePrerequisiteId,
    currentCoursePaymentNumber,
    shortLink,
    tumbImageAddress,
    imageAddress,
    courseTypeId,
    courseLvlId,
    classId,
    tremId,
    teacherId,
    setTitle,
    setCost,
    setStartTime,
    setEndTime,
    setCourseTypeId,
    setCourseLvlId,
    setTeacherId,
    setTremId,
  } = useCourseStore()

  const client = useQueryClient();

  // ** Hook
  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
  })




  const mutation = useMutation({
    mutationFn: UpdateCourse,
    onSuccess: () => {
      toast.success("دوره شما اپدیت شد");
      client.invalidateQueries({ queryKey: ["courseDetail"] });
      // navigate("/course-details/");

    },
    onError: () => {
      toast.error("خطا");
    },
  });

const uniqueStr = generateUniqueString();

  const updateCourse = () => {
    const obj = {
      title,
      describe: "قثنبحثهقدحقحقث",
      miniDescribe: "قثنبحثهقدحقحقث",
      unitPerCost: 90,
      capacity: 19,
      sessionNumber: 20,
      cost,
      image: "نکدثث",
      startTime,
      endTime,
      uniqeUrlString:uniqueStr,
      googleSchema: "cdpisdjpci",
      googleTitle: "feml;erl",
      CoursePrerequisiteId: uuidv4(),
      currentCoursePaymentNumber: Math.floor(Math.random() * 1000000),
      shortLink: "ثتحهتصحهتثحثکتصتثکنصتکن",
      tumbImageAddress: "خاکخاخاخ",
      imageAddress: "احهاهحاحاه",
      //feature
      courseTypeId,
      courseLvlId,
      classId: 2,
      teacherId,
      tremId,
      id:courseDetail

    };
    const formData = formDataModifire(obj);
    mutation.mutate(formData);
  };





  const { data: createCourse } = useQuery({
    queryKey: ["createCourse"],
    queryFn: getCreateCourse,
  });

  const getTeacher = createCourse?.teachers.map((e) => ({
    value: e?.teacherId,
    label: e?.fullName,
  }));

  const courseType = createCourse?.courseTypeDtos.map((e) => ({
    value: e?.id,
    label: e?.typeName,
  }));

  const courseLevel = createCourse?.courseLevelDtos.map((e) => ({
    value: e?.id,
    label: e?.levelName,
  }));

  // const technology = createCourse?.technologyDtos.map((e) => ({
  //   value: e?.id,
  //   label: e?.techName,
  // }));
  const getTerm = createCourse?.termDtos.map((e) => ({
    value: e?.id,
    label: e?.termName,
  }));




  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      setShow(false)
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  const handleReset = () => {
    reset({
      username: courseDetail.teacherName,
      lastName: courseDetail.teacherName.split(' ')[1],
      firstName: courseDetail.teacherName.split(' ')[0],
      title: courseDetail.title,

    })
  }
  return (
    <Fragment>
            <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 pt-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>ویرایش اطلاعات کاربری</h1>
            <p>بروزرسانی جزئیات اطلاعات دوره</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className='gy-1 pt-75'>
              <Col md={6} xs={12}>
                <Label className='form-label' for='username'>
                  نام استاد:
                </Label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  options={getTeacher}
                  className='react-select'
                  classNamePrefix='select'
                  placeholder='معلم دوره را انتخاب کنید'
                  onChange={(selected) => setTeacherId(selected?.value)} />

              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='title'>
                  نام دوره:
                </Label>

                    <Input id='title' placeholder='نام دوره را ویرایش کنید' value={title} onChange={(value) => { setTitle(value.target.value) }} invalid={errors.title && true} />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='lastName'>
                  ترم دوره :
                </Label>

                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  options={getTerm}
                  className='react-select'
                  classNamePrefix='select'
                  placeholder='ویرایش وضعیت دوره'
                  onChange={(selected) => setTremId(selected?.value)}

                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='username'>
                  سطح دوره :
                </Label>
                <Select

                  isClearable={false}
                  theme={selectThemeColors}
                  options={courseLevel}
                  className='react-select'
                  classNamePrefix='select'
                  placeholder='ویرایش سطح برگزاری'
                  onChange={(selected) => setCourseLvlId(selected?.value)}

                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='billing-email'>
                  نحوه برگزاری :
                </Label>
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  placeholder='ویرایش نحوه برگزاری دوره'
                  options={courseType}
                  onChange={(selected) => setCourseTypeId(selected?.value)}

                />
              </Col>
              {/* <Col md={6} xs={12}>
                <Label className='form-label' for='technology'>
                  تکنولوژی دوره :
                </Label>
                <Select
                  id='technology'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={technology}
                  placeholder='ویرایش تکنولوژی دوره'
                  theme={selectThemeColors}
                />
              </Col> */}
              <Col xs={12}>
                <Label className='form-label' for='tax-id'>
                  قیمت :
                </Label>
                <Input type='number' name='Cost' value={cost} onChange={(value) => { setCost(value.target.value) }} placeholder='قیمت دوره را ویرایش کنید' />

              </Col>

              <Col md={6} xs={12}>
                <Label className='form-label' for='language'>
                  تاریخ شروع :
                </Label>
                <Input type='Date' name='StartTime' value={startTime} onChange={(value) => { setStartTime(value.target.value) }} placeholder='تاریخ برگزاری دوره را ویرایش کنید' />

              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='country'>
                  تاریخ پایان :
                </Label>
                <Input type='Date' name='endTime' value={endTime} onChange={(value) => { setEndTime(value.target.value) }} placeholder='تاریخ اتمام دوره را ویرایش کنید' />

              </Col>

              <Col xs={12} className='text-center mt-2 pt-50'>
                <Button type='submit' className='me-1' color='primary' onClick={() => {
                  updateCourse()
                }}>
                  ثبت ویرایش
                </Button>
                <Button
                  type='reset'
                  color='secondary'
                  outline
                  onClick={() => {
                    handleReset()
                    setShow(false)
                  }}
                >
                  انصراف
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default EditCourse
