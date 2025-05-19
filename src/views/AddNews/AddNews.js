import React, { useRef, useLayoutEffect, useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import {
  Button,
  Spinner,
  Input,
  Label,
  Row,
  Col,
  FormFeedback,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Badge
} from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import gsap from "gsap"
import { AddNews as addNewsApi } from "../../services/api/AddNews/AddNews.api"
import { getListNewsCategory } from "../../services/api/AddNews/getListNewsCategory.api"

const steps = [
  { label: "اطلاعات اصلی", icon: "bi bi-info-circle" },
  { label: "سئو و کلیدواژه", icon: "bi bi-search" },
  { label: "دسته‌بندی و اسلایدر", icon: "bi bi-list-ul" },
  { label: "تصویر و تایید", icon: "bi bi-image" }
]

const initialValues = {
  Title: "",
  GoogleTitle: "",
  GoogleDescribe: "",
  MiniDescribe: "",
  Describe: "",
  Keyword: "",
  IsSlider: false,
  NewsCatregoryId: "",
  Image: null
}

const validationSchemas = [
  Yup.object({
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
  }),
  Yup.object({
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
  }),
  Yup.object({
    NewsCatregoryId: Yup.string().required("لطفا دسته بندی را وارد کنید."),
    IsSlider: Yup.boolean()
  }),
  Yup.object({
    Image: Yup.mixed().required("لطفا تصویر را وارد کنید.")
  })
]

const useDarkMode = () => {
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
}

const Stepper = ({ step, darkMode }) => (
  <div className="d-flex justify-content-center align-items-center mb-4" style={{ gap: 0 }}>
    {steps.map((s, idx) => (
      <React.Fragment key={idx}>
        <div className="text-center" style={{ minWidth: 90 }}>
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow-lg ${idx === step ? "bg-warning" : darkMode ? "bg-gradient-dark border border-warning" : "bg-light"}`}
            style={{
              width: 40,
              height: 40,
              fontSize: 20,
              color: idx === step ? "#222" : darkMode ? "#ffd66699" : "#888",
              borderWidth: idx === step ? 3 : 1,
              borderColor: "#ffd666",
              background: idx === step
                ? "#ffd666"
                : darkMode
                  ? "linear-gradient(135deg, #23272b 60%, #18191a 100%)"
                  : "#fff",
              transition: "all 0.3s"
            }}
          >
            <i className={s.icon}></i>
          </div>
          <div
            style={{
              color: idx === step ? "#ffd666" : darkMode ? "#ffd66699" : "#888",
              fontWeight: idx === step ? 700 : 500,
              fontSize: 13
            }}
          >
            {s.label}
          </div>
        </div>
        {idx < steps.length - 1 && (
          <div style={{
            width: 40,
            height: 5,
            background: idx < step ? "#ffd666" : (darkMode ? "#23272b" : "#e4e6eb"),
            borderRadius: 3,
            margin: "0 6px",
            transition: "background 0.3s"
          }} />
        )}
      </React.Fragment>
    ))}
  </div>
)

const AnimatedBox = React.forwardRef(({ children, darkMode }, ref) => (
  <Card
    ref={ref}
    className={`shadow-lg border-0 ${darkMode ? "bg-gradient-dark" : ""}`}
    style={{
      background: darkMode
        ? "linear-gradient(135deg, #23272b 60%, #18191a 100%)"
        : "linear-gradient(135deg, #fffbe6 60%, #f6faff 100%)",
      borderRadius: 24,
      boxShadow: darkMode ? "0 8px 32px #0008" : "0 8px 32px #0001",
      padding: 0,
      minHeight: 420,
      margin: "0 auto",
      maxWidth: 540,
      color: darkMode ? "#ffd666" : "#222",
      border: "none"
    }}
  >
    <CardBody>{children}</CardBody>
  </Card>
))

const sleep = ms => new Promise(res => setTimeout(res, ms))

const AddNews = () => {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [catLoading, setCatLoading] = useState(false)
  const boxRef = useRef()
  const darkMode = useDarkMode()

  useEffect(() => {
    setCatLoading(true)
    getListNewsCategory()
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data)
        } else if (Array.isArray(data?.data)) {
          setCategories(data.data)
        } else {
          setCategories([])
        }
      })
      .catch(() => {
        toast.error("دریافت دسته‌بندی‌ها با خطا مواجه شد.")
        setCategories([])
      })
      .finally(() => setCatLoading(false))
  }, [])

  useLayoutEffect(() => {
    if (boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        { opacity: 0, y: 60, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" }
      )
    }
  }, [step])

  // انیمیشن هدر و کل صفحه
  const headerRef = useRef()
  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      )
    }
  }, [])

  useLayoutEffect(() => {
    gsap.fromTo(
      ".add-news-root",
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: "power3.out" }
    )
  }, [])

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (key === "Image" && value) {
          formData.append(key, value)
        } else {
          formData.append(key, value)
        }
      })
      await sleep(700)
      const res = await addNewsApi(formData)
      if (res?.data?.success) {
        toast.success("خبر با موفقیت ثبت شد!")
        resetForm()
        setStep(0)
      } else if (res?.data?.ErrorMessage) {
        toast.error(Array.isArray(res.data.ErrorMessage) ? res.data.ErrorMessage.join(" / ") : res.data.ErrorMessage)
      } else {
        toast.error(res?.data?.message || "ثبت خبر با خطا مواجه شد.")
      }
    } catch (e) {
      if (e?.response?.data?.ErrorMessage) {
        toast.error(Array.isArray(e.response.data.ErrorMessage) ? e.response.data.ErrorMessage.join(" / ") : e.response.data.ErrorMessage)
      } else {
        toast.error("ثبت خبر با خطا مواجه شد.")
      }
    }
    setLoading(false)
    setSubmitting(false)
  }

  const charHints = [
    [
      "تعداد کارکتر های عنوان بین 10 الی 120 میباشد.",
      "تعداد کارکتر های توضیحات کوتاه بین 10 الی 300 میباشد.",
      "تعداد کارکتر های توضیحات اصلی حداقل 30 میباشد."
    ],
    [
      "تعداد کارکتر های عنوان گوگل بین 5 الی 70 میباشد.",
      "تعداد کارکتر های توضیحات گوگل بین 70 الی 150 میباشد.",
      "تعداد کارکتر های کلمه کلیدی بین 10 الی 300 میباشد."
    ]
  ]

  // استایل دارک‌مد مثل List.js
  const darkStyles = {
    background: "linear-gradient(135deg, #23272b 60%, #18191a 100%)",
    color: "#ffd666",
    borderColor: "#333",
    transition: "all 0.2s"
  }
  const darkInput = {
    background: "#23272b",
    color: "#ffd666",
    borderColor: "#ffd666",
    transition: "all 0.2s"
  }

  return (
    <div className={`add-news-root${darkMode ? " dark-mode" : ""}`} style={{
      minHeight: "100vh",
      background: darkMode ? "linear-gradient(135deg, #18191a 60%, #23272b 100%)" : "#fffbe6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 0"
    }}>
      <ToastContainer rtl position="top-center" theme={darkMode ? "dark" : "light"} />
      <Card className={`shadow-lg border-0`} style={{
        ...(darkMode ? darkStyles : {}),
        width: "100%",
        maxWidth: 540,
        margin: "0 auto",
        borderRadius: 28,
        boxShadow: darkMode ? "0 8px 32px #000a" : "0 8px 32px #0001"
      }}>
        <CardHeader
          ref={headerRef}
          className="text-center"
          style={{
            background: darkMode
              ? "linear-gradient(90deg,#23272b 60%,#18191a 100%)"
              : "linear-gradient(90deg,#fffbe6 60%,#ffe58f 100%)",
            borderRadius: "1.5rem 1.5rem 0 0",
            border: 0,
            color: "#ffd666",
            boxShadow: darkMode ? "0 2px 16px #0008" : "0 2px 16px #ffd66633"
          }}
        >
          <h2 className="fw-bold mb-0" style={{
            color: "#ffd666",
            fontSize: 30,
            letterSpacing: 1.5
          }}>
            <i className="bi bi-plus-circle ms-2"></i>
            افزودن خبر جدید
          </h2>
        </CardHeader>
        <CardBody style={{
          padding: "2.2rem 1.5rem 1.5rem 1.5rem",
          borderRadius: "0 0 1.5rem 1.5rem",
          background: darkMode ? "transparent" : "#fff"
        }}>
          <Stepper step={step} darkMode={darkMode} />
          <Progress
            value={((step + 1) / steps.length) * 100}
            color="warning"
            className="mb-4"
            style={{ height: 8, borderRadius: 8, background: darkMode ? "#23272b" : "#eee" }}
          />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[step]}
            onSubmit={async (values, actions) => {
              if (step < steps.length - 1) {
                setStep(s => s + 1)
              } else {
                await handleSubmit(values, actions)
              }
            }}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched }) => (
              <Form>
                <AnimatedBox ref={boxRef} darkMode={darkMode}>
                  {(step === 0 || step === 1) && (
                    <div className="mb-3">
                      {charHints[step].map((hint, idx) => (
                        <Badge
                          key={idx}
                          color="warning"
                          pill
                          className="me-2 mb-2"
                          style={{
                            color: "#222",
                            background: "#ffd666cc",
                            fontSize: 13,
                            fontWeight: 500
                          }}
                        >
                          {hint}
                        </Badge>
                      ))}
                      <hr style={{
                        borderColor: darkMode ? "#333" : "#eee",
                        margin: "8px 0 16px 0"
                      }} />
                    </div>
                  )}
                  {step === 0 && (
                    <Row>
                      <Col md={12} className="mb-3">
                        <Label className="fw-bold" style={darkMode ? { color: "#ffd666" } : {}}>عنوان خبر</Label>
                        <Field
                          name="Title"
                          as={Input}
                          invalid={touched.Title && !!errors.Title}
                          placeholder="مثلاً: افزایش قیمت دلار"
                          bsSize="lg"
                          className="shadow-sm"
                          style={darkMode ? darkInput : {}}
                        />
                        <ErrorMessage name="Title" component={FormFeedback} />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Label className="fw-bold" style={darkMode ? { color: "#ffd666" } : {}}>خلاصه کوتاه</Label>
                        <Field
                          name="MiniDescribe"
                          as={Input}
                          invalid={touched.MiniDescribe && !!errors.MiniDescribe}
                          placeholder="یک خلاصه کوتاه..."
                          bsSize="lg"
                          className="shadow-sm"
                          style={darkMode ? darkInput : {}}
                        />
                        <ErrorMessage name="MiniDescribe" component={FormFeedback} />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Label className="fw-bold" style={darkMode ? { color: "#ffd666" } : {}}>توضیحات کامل</Label>
                        <Field
                          name="Describe"
                          as="textarea"
                          rows={6}
                          className="form-control shadow-sm"
                          invalid={touched.Describe && !!errors.Describe}
                          placeholder="توضیحات کامل خبر..."
                          style={darkMode ? { ...darkInput, fontSize: 16 } : { fontSize: 16 }}
                        />
                        <ErrorMessage name="Describe" component={FormFeedback} />
                      </Col>
                    </Row>
                  )}
                  {step === 1 && (
                    <Row>
                      <Col md={12} className="mb-3">
                        <Label className="fw-bold" style={darkMode ? { color: "#ffd666" } : {}}>عنوان گوگل</Label>
                        <Field
                          name="GoogleTitle"
                          as={Input}
                          invalid={touched.GoogleTitle && !!errors.GoogleTitle}
                          placeholder="عنوان برای موتور جستجو"
                          bsSize="lg"
                          className="shadow-sm"
                          style={darkMode ? darkInput : {}}
                        />
                        <ErrorMessage name="GoogleTitle" component={FormFeedback} />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Label className="fw-bold" style={darkMode ? { color: "#ffd666" } : {}}>توضیح گوگل</Label>
                        <Field
                          name="GoogleDescribe"
                          as={Input}
                          invalid={touched.GoogleDescribe && !!errors.GoogleDescribe}
                          placeholder="توضیح برای موتور جستجو"
                          bsSize="lg"
                          className="shadow-sm"
                          style={darkMode ? darkInput : {}}
                        />
                        <ErrorMessage name="GoogleDescribe" component={FormFeedback} />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Label className="fw-bold" style={darkMode ? { color: "#ffd666" } : {}}>کلمات کلیدی</Label>
                        <Field
                          name="Keyword"
                          as={Input}
                          invalid={touched.Keyword && !!errors.Keyword}
                          placeholder="مثلاً: اقتصاد, دلار, ارز"
                          bsSize="lg"
                          className="shadow-sm"
                          style={darkMode ? darkInput : {}}
                        />
                        <ErrorMessage name="Keyword" component={FormFeedback} />
                      </Col>
                    </Row>
                  )}
                  {step === 2 && (
                    <Row>
                      <Col md={12} className="mb-3">
                        <Label className="fw-bold" style={darkMode ? { color: "#ffd666" } : {}}>دسته‌بندی خبر</Label>
                        <Field
                          name="NewsCatregoryId"
                          as="select"
                          className={`form-select form-select-lg shadow-sm${touched.NewsCatregoryId && errors.NewsCatregoryId ? " is-invalid" : ""}`}
                          style={darkMode ? darkInput : {}}
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
                      <Col md={12} className="mb-3">
                        <div className="form-check form-switch">
                          <Field
                            name="IsSlider"
                            type="checkbox"
                            className="form-check-input"
                            checked={values.IsSlider}
                            onChange={e => setFieldValue("IsSlider", e.target.checked)}
                            id="isSliderSwitch"
                          />
                          <Label className="form-check-label ms-2 fw-bold" htmlFor="isSliderSwitch" style={darkMode ? { color: "#ffd666" } : {}}>
                            نمایش در اسلایدر
                          </Label>
                        </div>
                      </Col>
                    </Row>
                  )}
                  {step === 3 && (
                    <Row>
                      <Col md={12} className="mb-3">
                        <Label className="fw-bold" style={darkMode ? { color: "#ffd666" } : {}}>تصویر خبر</Label>
                        <Input
                          name="Image"
                          type="file"
                          accept="image/*"
                          onChange={e => setFieldValue("Image", e.currentTarget.files[0])}
                          invalid={touched.Image && !!errors.Image}
                          bsSize="lg"
                          className="shadow-sm"
                          style={darkMode ? darkInput : {}}
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
                                boxShadow: "0 2px 12px #0004",
                                border: "3px solid #ffd666"
                              }}
                            />
                          </div>
                        )}
                      </Col>
                    </Row>
                  )}
                </AnimatedBox>
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Button
                    color={darkMode ? "light" : "secondary"}
                    outline
                    type="button"
                    disabled={step === 0 || loading || isSubmitting}
                    onClick={() => setStep(s => Math.max(0, s - 1))}
                    className="px-4 py-2 fs-5 rounded-4 shadow"
                    style={{
                      minWidth: 110,
                      fontWeight: "bold",
                      background: darkMode ? "#23272b" : undefined,
                      color: darkMode ? "#ffd666" : undefined,
                      borderColor: darkMode ? "#ffd666" : undefined
                    }}
                  >
                    <i className="bi bi-arrow-right-short ms-2"></i>
                    قبلی
                  </Button>
                  {step < steps.length - 1 ? (
                    <Button
                      color={darkMode ? "warning" : "primary"}
                      type="submit"
                      disabled={loading || isSubmitting}
                      className="px-4 py-2 fs-5 rounded-4 shadow"
                      style={{
                        minWidth: 110,
                        fontWeight: "bold",
                        background: darkMode ? "#ffd666" : undefined,
                        color: darkMode ? "#222" : undefined,
                        borderColor: darkMode ? "#ffd666" : undefined
                      }}
                    >
                      بعدی
                      <i className="bi bi-arrow-left-short me-2"></i>
                    </Button>
                  ) : (
                    <Button
                      color={darkMode ? "success" : "success"}
                      type="submit"
                      disabled={loading || isSubmitting}
                      className="px-4 py-2 fs-5 rounded-4 shadow"
                      style={{
                        minWidth: 130,
                        fontWeight: "bold",
                        background: darkMode ? "#52c41a" : undefined,
                        color: darkMode ? "#fff" : undefined,
                        borderColor: darkMode ? "#52c41a" : undefined
                      }}
                    >
                      {loading ? <Spinner size="sm" /> : <><i className="bi bi-check2-circle ms-2"></i>ثبت خبر</>}
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </div>
  )
}

export default AddNews