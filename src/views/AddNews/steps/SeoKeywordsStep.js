import React, { Fragment } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Label, Row, Col, Input, Button, FormFeedback } from 'reactstrap'
import { ArrowLeft, ArrowRight } from 'react-feather'

const validationSchema = Yup.object({
  GoogleTitle: Yup.string()
    .required("لطفا عنوان گوگل را وارد کنید.")
    .min(5, "تعداد کارکتر های عنوان گوگل باید حداقل 5 باشد.")
    .max(70, "تعداد کارکتر های عنوان گوگل حداکثر 70 کاراکتر است."),
  GoogleDescribe: Yup.string()
    .required("لطفا توضیحات گوگل را وارد کنید.")
    .min(70, "تعداد کارکتر های توضیحات گوگل باید حداقل 70 باشد.")
    .max(150, "تعداد کارکتر های توضیحات گوگل حداکثر 150 کاراکتر است."),
  Keyword: Yup.string()
    .required("لطفا کلمه کلیدی را وارد کنید.")
    .min(10, "تعداد کارکتر های کلمه کلیدی باید حداقل 10 باشد.")
    .max(300, "تعداد کارکتر های کلمه کلیدی حداکثر 300 کاراکتر است.")
});

const SeoKeywordsStep = ({ stepper, formData, updateFormData }) => {
  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>سئو و کلیدواژه</h5>
        <small>اطلاعات سئو و کلمات کلیدی خبر را وارد کنید.</small>
      </div>
      <Formik
        initialValues={{
          GoogleTitle: formData.GoogleTitle || "",
          GoogleDescribe: formData.GoogleDescribe || "",
          Keyword: formData.Keyword || ""
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
                <Label className='form-label'>عنوان گوگل</Label>
                <Field
                  name="GoogleTitle"
                  as={Input}
                  invalid={touched.GoogleTitle && !!errors.GoogleTitle}
                  placeholder="عنوان برای موتور جستجو"
                />
                <ErrorMessage name="GoogleTitle" component={FormFeedback} />
              </Col>
              <Col md='12' className='mb-1'>
                <Label className='form-label'>توضیح گوگل</Label>
                <Field
                  name="GoogleDescribe"
                  as={Input}
                  invalid={touched.GoogleDescribe && !!errors.GoogleDescribe}
                  placeholder="توضیح برای موتور جستجو"
                />
                <ErrorMessage name="GoogleDescribe" component={FormFeedback} />
              </Col>
              <Col md='12' className='mb-1'>
                <Label className='form-label'>کلمات کلیدی</Label>
                <Field
                  name="Keyword"
                  as={Input}
                  invalid={touched.Keyword && !!errors.Keyword}
                  placeholder="مثلاً: اقتصاد, دلار, ارز"
                />
                <ErrorMessage name="Keyword" component={FormFeedback} />
              </Col>
            </Row>
            <div className='d-flex justify-content-between'>
              <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
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

export default SeoKeywordsStep