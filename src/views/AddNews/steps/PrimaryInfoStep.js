import React, { Fragment } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Label, Row, Col, Input, Button, FormFeedback } from 'reactstrap'
import { ArrowLeft, ArrowRight } from 'react-feather'

const validationSchema = Yup.object({
  Title: Yup.string()
    .required("لطفا عنوان را وارد کنید.")
    .min(10, "تعداد کارکتر های عنوان باید حداقل 10 باشد.")
    .max(120, "تعداد کارکتر های عنوان حداکثر 120 کاراکتر است."),
  MiniDescribe: Yup.string()
    .required("لطفا توضیحات کوتاه را وارد کنید.")
    .min(10, "تعداد کارکتر های توضیحات کوتاه باید حداقل 10 باشد.")
    .max(300, "تعداد کارکتر های توضیحات کوتاه حداکثر 300 کاراکتر است."),
  Describe: Yup.string()
    .required("لطفا توضیحات اصلی را وارد کنید.")
    .min(30, "تعداد کارکتر های توضیحات اصلی باید حداقل 30 باشد.")
});

const PrimaryInfoStep = ({ stepper, formData, updateFormData }) => {
  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>اطلاعات اصلی</h5>
        <small>عنوان و توضیحات اصلی خبر را وارد کنید.</small>
      </div>
      <Formik
        initialValues={{
          Title: formData.Title || "",
          MiniDescribe: formData.MiniDescribe || "",
          Describe: formData.Describe || ""
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          updateFormData(values);
          stepper.next();
        }}
      >
        {({ values, touched, errors }) => (
          <Form>
            <Row>
              <Col md='12' className='mb-1'>
                <Label className='form-label'>عنوان خبر</Label>
                <Field
                  name="Title"
                  as={Input}
                  invalid={touched.Title && !!errors.Title}
                  placeholder="مثلاً: افزایش قیمت دلار"
                />
                <ErrorMessage name="Title" component={FormFeedback} />
              </Col>
              <Col md='12' className='mb-1'>
                <Label className='form-label'>خلاصه کوتاه</Label>
                <Field
                  name="MiniDescribe"
                  as={Input}
                  invalid={touched.MiniDescribe && !!errors.MiniDescribe}
                  placeholder="یک خلاصه کوتاه..."
                />
                <ErrorMessage name="MiniDescribe" component={FormFeedback} />
              </Col>
              <Col md='12' className='mb-1'>
                <Label className='form-label'>توضیحات کامل</Label>
                <Field
                  name="Describe"
                  as="textarea"
                  rows={6}
                  className="form-control"
                  invalid={touched.Describe && !!errors.Describe}
                  placeholder="توضیحات کامل خبر..."
                />
                <ErrorMessage name="Describe" component={FormFeedback} />
              </Col>
            </Row>
            <div className='d-flex justify-content-between'>
              <Button color='secondary' className='btn-prev' outline disabled>
                <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                <span className='align-middle d-sm-inline-block d-none'>قبلی</span>
              </Button>
              <Button type='submit' color='primary' className='btn-next'>
                <span className='align-middle d-sm-inline-block d-none'>بعدی</span>
                <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Fragment>
  )
}

export default PrimaryInfoStep