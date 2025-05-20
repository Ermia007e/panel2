import React, { Fragment } from 'react'
import { Formik, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Label, Row, Col, Input, Button, FormFeedback, Spinner } from 'reactstrap'
import { ArrowLeft, CheckCircle } from 'react-feather'

const validationSchema = Yup.object({
  Image: Yup.mixed().required("لطفا تصویر را وارد کنید.")
});

const ImageConfirmationStep = ({ stepper, formData, updateFormData, handleSubmit, loading }) => {
  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>تصویر و تایید</h5>
        <small>تصویر خبر را انتخاب کرده و ثبت نهایی کنید.</small>
      </div>
      <Formik
        initialValues={{
          Image: formData.Image || null
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          updateFormData(values); // Update Image in formData
          handleSubmit(); // Call the main handleSubmit to send all data
        }}
      >
        {({ values, setFieldValue, touched, errors, isSubmitting }) => (
          <Form>
            <Row>
              <Col md='12' className='mb-1'>
                <Label className='form-label'>تصویر خبر</Label>
                <Input
                  name="Image"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    setFieldValue("Image", e.currentTarget.files[0]);
                    updateFormData({ Image: e.currentTarget.files[0] }); // Update immediately for preview
                  }}
                  invalid={touched.Image && !!errors.Image}
                />
                <ErrorMessage name="Image" component={FormFeedback} />
                {values.Image && (
                  <div className="text-center mt-3">
                    <img
                      src={URL.createObjectURL(values.Image)}
                      alt="preview"
                      style={{
                        maxWidth: 220,
                        maxHeight: 180,
                        borderRadius: 18,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                        border: "3px solid #ccc"
                      }}
                    />
                  </div>
                )}
              </Col>
            </Row>
            <div className='d-flex justify-content-between'>
              <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
                <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                <span className='align-middle d-sm-inline-block d-none'>قبلی</span>
              </Button>
              <Button color='success' type='submit' className='btn-submit' disabled={loading || isSubmitting}>
                {loading ? <Spinner size="sm" /> : <><CheckCircle size={14} className='align-middle me-sm-25 me-0'></CheckCircle>
                <span className='align-middle d-sm-inline-block d-none'>ثبت خبر</span></>}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Fragment>
  )
}

export default ImageConfirmationStep