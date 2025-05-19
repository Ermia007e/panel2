import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import http from '@src/services/interceptor'
import { toast } from 'react-hot-toast'
import { Button, Label } from 'reactstrap'
import { useSelector } from 'react-redux'

const useDarkMode = () => {
  const skin = useSelector(state => state.layout?.skin)
  return skin === 'dark'
}

const validationSchema = Yup.object().shape({
  fname: Yup.string().required('نام الزامی است'),
  lname: Yup.string().required('نام خانوادگی الزامی است'),
  gmail: Yup.string().email('ایمیل معتبر نیست').required('ایمیل الزامی است'),
  phoneNumber: Yup.string().required('شماره تماس الزامی است')
})

const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const darkMode = useDarkMode()
  const [initialValues, setInitialValues] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    http.get(`/User/Manage/${id}`)
      .then(res => {
        if (res && res.data) {
          setInitialValues({
            fname: res.data.fname || '',
            lname: res.data.lname || '',
            gmail: res.data.gmail || '',
            phoneNumber: res.data.phoneNumber || ''
          })
        }
        setLoading(false)
      })
      .catch(() => {
        toast.error('خطا در دریافت اطلاعات کاربر')
        setLoading(false)
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

  const darkStyles = {
    background: "#18191a",
    color: "#e4e6eb",
    borderRadius: 12,
    padding: 32,
    maxWidth: 500,
    margin: "40px auto"
  }
  const darkInput = {
    background: "#23272b",
    color: "#e4e6eb",
    borderColor: "#444"
  }

  // فقط زمانی فرم را نمایش بده که مقدار اولیه آمده باشد
  if (loading || !initialValues) {
    return (
      <div style={{
        color: darkMode ? "#e4e6eb" : "#333",
        textAlign: "center",
        marginTop: 40
      }}>
        در حال بارگذاری...
      </div>
    )
  }

  return (
    <div style={darkMode ? darkStyles : { maxWidth: 500, margin: '40px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <h3 className="mb-3" style={darkMode ? { color: "#e4e6eb" } : {}}>ویرایش کاربر</h3>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, values, handleChange }) => (
          <Form>
            <div className="mb-2">
              <Label style={darkMode ? { color: "#e4e6eb" } : {}}>نام</Label>
              <Field
                name="fname"
                className="form-control"
                style={darkMode ? darkInput : {}}
                placeholder="نام"
                value={values.fname}
                onChange={handleChange}
              />
              {errors.fname && touched.fname && <div className="text-danger">{errors.fname}</div>}
            </div>
            <div className="mb-2">
              <Label style={darkMode ? { color: "#e4e6eb" } : {}}>نام خانوادگی</Label>
              <Field
                name="lname"
                className="form-control"
                style={darkMode ? darkInput : {}}
                placeholder="نام خانوادگی"
                value={values.lname}
                onChange={handleChange}
              />
              {errors.lname && touched.lname && <div className="text-danger">{errors.lname}</div>}
            </div>
            <div className="mb-2">
              <Label style={darkMode ? { color: "#e4e6eb" } : {}}>ایمیل</Label>
              <Field
                name="gmail"
                className="form-control"
                style={darkMode ? darkInput : {}}
                placeholder="ایمیل"
                value={values.gmail}
                onChange={handleChange}
              />
              {errors.gmail && touched.gmail && <div className="text-danger">{errors.gmail}</div>}
            </div>
            <div className="mb-2">
              <Label style={darkMode ? { color: "#e4e6eb" } : {}}>شماره تماس</Label>
              <Field
                name="phoneNumber"
                className="form-control"
                style={darkMode ? darkInput : {}}
                placeholder="شماره تماس"
                value={values.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && touched.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
            </div>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              ذخیره تغییرات
            </Button>
          </Form>
        )}
      </Formik>
      {darkMode && (
        <style>
          {`
          .form-control {
            background: #23272b !important;
            color: #e4e6eb !important;
            border-color: #444 !important;
          }
          `}
        </style>
      )}
    </div>
  )
}

export default EditUser