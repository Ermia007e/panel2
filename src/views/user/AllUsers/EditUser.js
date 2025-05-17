import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import http from '@src/services/interceptor'
import { toast } from 'react-hot-toast'
import { Button, Label } from 'reactstrap'

const validationSchema = Yup.object().shape({
  fname: Yup.string().required('نام الزامی است'),
  lname: Yup.string().required('نام خانوادگی الزامی است'),
  gmail: Yup.string().email('ایمیل معتبر نیست').required('ایمیل الزامی است'),
  phoneNumber: Yup.string().required('شماره تماس الزامی است')
})

const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState({
    fname: '',
    lname: '',
    gmail: '',
    phoneNumber: ''
  })

useEffect(() => {
  http.get(`/User/Manage/${id}`)
    .then(res => {
      console.log('UserMannage response:', res)
      if (res && res.data) {
        setInitialValues({
          fname: res.data.fname || '',
          lname: res.data.lname || '',
          gmail: res.data.gmail || '',
          phoneNumber: res.data.phoneNumber || ''
        })
      }
    })
    .catch(err => {
      console.log('UserMannage error:', err)
      toast.error('خطا در دریافت اطلاعات کاربر')
    })
}, [id])

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await http.post('/User/UpdateUser', { id, ...values })
      if (response.data && (response.data.success || response.data.status === 'success')) {
        toast.success('اطلاعات کاربر با موفقیت ویرایش شد')
        navigate('/users')
      } else {
        toast.error('خطا در ویرایش اطلاعات کاربر')
      }
    } catch (err) {
      toast.error('خطا در ارتباط با سرور')
    }
    setSubmitting(false)
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <h3 className="mb-3">ویرایش کاربر</h3>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <div className="mb-2">
              <Label>نام</Label>
              <Field name="fname" className="form-control" />
              {errors.fname && touched.fname && <div className="text-danger">{errors.fname}</div>}
            </div>
            <div className="mb-2">
              <Label>نام خانوادگی</Label>
              <Field name="lname" className="form-control" />
              {errors.lname && touched.lname && <div className="text-danger">{errors.lname}</div>}
            </div>
            <div className="mb-2">
              <Label>ایمیل</Label>
              <Field name="gmail" className="form-control" />
              {errors.gmail && touched.gmail && <div className="text-danger">{errors.gmail}</div>}
            </div>
            <div className="mb-2">
              <Label>شماره تماس</Label>
              <Field name="phoneNumber" className="form-control" />
              {errors.phoneNumber && touched.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
            </div>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              ذخیره تغییرات
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default EditUser