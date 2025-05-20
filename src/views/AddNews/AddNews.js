import React, { useRef, useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Spinner, Button } from "reactstrap" // Button and Spinner from Reactstrap for loading state

// Assuming you have a Wizard component similar to the provided example
import Wizard from "@components/wizard" // Adjust path as needed

// Steps for the form
import PrimaryInfoStep from "./steps/PrimaryInfoStep"
import SeoKeywordsStep from "./steps/SeoKeywordsStep"
import CategorySliderStep from "./steps/CategorySliderStep"
import ImageConfirmationStep from "./steps/ImageConfirmationStep"

// API Calls
import { AddNews as addNewsApi } from "../../services/api/AddNews/AddNews.api"
import { getListNewsCategory } from "../../services/api/AddNews/getListNewsCategory.api"

// Icons Imports (using react-feather as in the second example)
import { FileText, User, List, Image } from "react-feather"

const AddNews = () => {
  const ref = useRef(null)
  const [stepper, setStepper] = useState(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [catLoading, setCatLoading] = useState(false)
  const [formData, setFormData] = useState({}) // State to hold form data across steps

  // Fetch categories on component mount
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

  // Function to update form data from child steps
  const updateFormData = (stepData) => {
    setFormData(prevData => ({ ...prevData, ...stepData }));
  };

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const newsFormData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "Image" && value) {
          newsFormData.append(key, value)
        } else {
          newsFormData.append(key, value)
        }
      })
      
      // Simulate network delay
      await new Promise(res => setTimeout(res, 700))
      
      const res = await addNewsApi(newsFormData)
      if (res?.data?.success) {
        toast.success("خبر با موفقیت ثبت شد!")
        setFormData({}); // Reset form data
        stepper.to(0); // Go back to the first step
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
  }

  const steps = [
    {
      id: 'primary-info',
      title: 'اطلاعات اصلی',
      subtitle: 'عنوان و توضیحات خبر',
      icon: <FileText size={18} />,
      content: <PrimaryInfoStep stepper={stepper} formData={formData} updateFormData={updateFormData} />
    },
    {
      id: 'seo-keywords',
      title: 'سئو و کلیدواژه',
      subtitle: 'عنوان و توضیحات گوگل',
      icon: <User size={18} />, // Using User icon for SEO, as an example. You can change this.
      content: <SeoKeywordsStep stepper={stepper} formData={formData} updateFormData={updateFormData} />
    },
    {
      id: 'category-slider',
      title: 'دسته‌بندی و اسلایدر',
      subtitle: 'انتخاب دسته بندی و اسلایدر',
      icon: <List size={18} />,
      content: <CategorySliderStep stepper={stepper} formData={formData} updateFormData={updateFormData} categories={categories} catLoading={catLoading} />
    },
    {
      id: 'image-confirmation',
      title: 'تصویر و تایید',
      subtitle: 'انتخاب تصویر و ثبت نهایی',
      icon: <Image size={18} />,
      content: <ImageConfirmationStep stepper={stepper} formData={formData} updateFormData={updateFormData} handleSubmit={handleSubmit} loading={loading} />
    }
  ]

  return (
    <div className='add-news-wizard-wrapper' style={{ padding: '32px 0' }}>
      <ToastContainer rtl position="top-center" theme="light" />
      <Wizard
        type='modern-horizontal' // Using modern-horizontal type for horizontal stepper
        ref={ref}
        steps={steps}
        options={{
          linear: true // Set to true for strict linear progression (steps must be valid to proceed)
        }}
        instance={el => setStepper(el)}
      />
    </div>
  )
}

export default AddNews