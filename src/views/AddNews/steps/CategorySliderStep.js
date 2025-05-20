import React, { Fragment } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Label, Row, Col, Input, Button, FormFeedback } from 'reactstrap'
import { ArrowLeft, ArrowRight } from 'react-feather'

const validationSchema = Yup.object({
  NewsCatregoryId: Yup.string().required("لطفا دسته بندی را وارد کنید."),
  IsSlider: Yup.boolean()
});

const CategorySliderStep = ({ stepper, formData, updateFormData, categories, catLoading }) => {
  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>دسته‌بندی و اسلایدر</h5>
        <small>دسته‌بندی و نمایش در اسلایدر را انتخاب کنید.</small>
      </div>
      <Formik
        initialValues={{
          NewsCatregoryId: formData.NewsCatregoryId || "",
          IsSlider: formData.IsSlider || false
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          updateFormData(values);
          stepper.next();
        }}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <Form>
            <Row>
              <Col md='12' className='mb-1'>
                <Label className='form-label'>دسته‌بندی خبر</Label>
                <Field
                  name="NewsCatregoryId"
                  as="select"
                  className={`form-select ${touched.NewsCatregoryId && errors.NewsCatregoryId ? "is-invalid" : ""}`}
                  disabled={catLoading}
                >
                  <option value="">انتخاب کنید...</option>
                  {categories.map(cat => (
                    <option key={cat.id || cat.categoryId} value={cat.id || cat.categoryId}>
                      {cat.name || cat.categoryName}
                    </option>
                  ))}
                </Field>
                {catLoading && <div style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>در حال دریافت دسته‌بندی‌ها...</div>}
                <ErrorMessage name="NewsCatregoryId" component={FormFeedback} />
              </Col>
              <Col md='12' className='mb-1'>
                <div className="form-check form-switch">
                  <Field
                    name="IsSlider"
                    type="checkbox"
                    className="form-check-input"
                    checked={values.IsSlider}
                    onChange={e => setFieldValue("IsSlider", e.target.checked)}
                    id="isSliderSwitch"
                  />
                  <Label className="form-check-label ms-2" htmlFor="isSliderSwitch">
                    نمایش در اسلایدر
                  </Label>
                </div>
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

export default CategorySliderStep