import React, { Fragment, useState } from 'react';
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Label, Row, Col, Input, Button, FormFeedback, Spinner, Alert } from 'reactstrap';
import { ArrowLeft, CheckCircle, Image as ImageIcon, XCircle } from 'react-feather';

const HUGGING_FACE_API_TOKEN = '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'; // توکن فعلی شما
const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

const generateImageFromHuggingFace = async (prompt) => {
    try {
        console.log("Sending request to:", API_URL);
        console.log("Prompt:", prompt);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HUGGING_FACE_API_TOKEN}`, // عین Postman
                'Content-Type': 'application/json', // عین Postman
            },
            body: JSON.stringify({ inputs: prompt }), // عین Postman، بدون گزینه اضافی
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", [...response.headers.entries()]);

        if (!response.ok) {
            const errorText = await response.text();
            console.log("Raw error response:", errorText);
            let errorMessage = `خطا از API: ${response.status} ${response.statusText}`;
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.error) {
                    errorMessage = `خطا: ${errorJson.error}`;
                } else if (errorJson.detail) {
                    errorMessage = `جزئیات خطا: ${errorJson.detail}`;
                }
            } catch (e) {
                console.log("Error parsing JSON:", e);
                errorMessage += ` - متن خام: ${errorText}`;
            }
            throw new Error(errorMessage);
        }

        const contentType = response.headers.get('content-type');
        console.log("Content-Type:", contentType);
        if (contentType && contentType.includes('application/json')) {
            const jsonResponse = await response.json();
            throw new Error(`پاسخ JSON دریافت شد: ${JSON.stringify(jsonResponse)}`);
        }
        if (!contentType || !contentType.includes('image')) {
            throw new Error('پاسخ API تصویر نیست.');
        }

        const imageBlob = await response.blob();
        console.log("Image blob received:", imageBlob);
        return URL.createObjectURL(imageBlob);
    } catch (error) {
        console.error("Full error details:", error);
        throw error;
    }
};

const validationSchema = Yup.object({
    Image: Yup.mixed().nullable().test(
        "fileType",
        "فقط فایل‌های JPEG، PNG یا GIF مجاز هستند.",
        value => !value || (value instanceof File && ["image/jpeg", "image/png", "image/gif"].includes(value.type))
    ).test(
        "fileSize",
        "حجم فایل نمی‌تواند بیشتر از 5 مگابایت باشد.",
        value => !value || (value instanceof File && value.size <= 5 * 1024 * 1024)
    ),
    aiPrompt: Yup.string()
        .max(500, "توضیحات AI نمی‌تواند بیشتر از 500 کاراکتر باشد.")
        .when('Image', {
            is: (Image) => !Image,
            then: (schema) => schema.required("لطفاً توضیحات برای ساخت تصویر وارد کنید."),
            otherwise: (schema) => schema.notRequired()
        })
});

const ImageConfirmationStep = ({ stepper, formData, updateFormData, handleSubmit, loading }) => {
    const [aiPrompt, setAiPrompt] = useState(formData.aiPrompt || "");
    const [aiImageLoading, setAiImageLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState(() => {
        if (formData.Image instanceof File) return URL.createObjectURL(formData.Image);
        return null;
    });

    const convertUrlToFile = async (url, filename) => {
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            return new File([blob], filename, { type: 'image/png' });
        } catch (error) {
            throw new Error("خطا در تبدیل تصویر به فایل.");
        }
    };

    const handleGenerateAIImage = async (setFieldValue) => {
        if (!aiPrompt.trim()) {
            setAiError("لطفاً توضیحات برای ساخت تصویر وارد کنید.");
            return;
        }

        setAiImageLoading(true);
        setAiError(null);

        if (generatedImageUrl && generatedImageUrl.startsWith('blob:')) URL.revokeObjectURL(generatedImageUrl);
        setGeneratedImageUrl(null);

        try {
            const imageUrl = await generateImageFromHuggingFace(aiPrompt);
            const file = await convertUrlToFile(imageUrl, "ai_generated_image.png");
            setGeneratedImageUrl(imageUrl);
            setFieldValue("Image", file);
            updateFormData({ Image: file, aiPrompt });
        } catch (error) {
            setAiError(`خطا: ${error.message || 'مشکل در تولید تصویر.'}`);
            setFieldValue("Image", null);
            updateFormData({ Image: null, aiPrompt });
        } finally {
            setAiImageLoading(false);
        }
    };

    const clearImage = (setFieldValue) => {
        if (generatedImageUrl && generatedImageUrl.startsWith('blob:')) URL.revokeObjectURL(generatedImageUrl);
        setFieldValue("Image", null);
        updateFormData({ Image: null, aiPrompt: "" });
        setGeneratedImageUrl(null);
        setAiPrompt("");
        setAiError(null);
    };

    return (
        <Fragment>
            <div className='content-header'>
                <h5 className='mb-0'>تصویر و تأیید</h5>
                <small>تصویر خبر را انتخاب کرده یا با هوش مصنوعی بسازید و ثبت نهایی کنید.</small>
            </div>
            <Formik
                initialValues={{ Image: formData.Image || null, aiPrompt }}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    handleSubmit();
                    setSubmitting(false);
                }}
            >
                {({ values, setFieldValue, touched, errors, isSubmitting }) => (
                    <Form>
                        <Row>
                            <Col md='12' className='mb-3'>
                                <Label className='form-label'>انتخاب تصویر از دستگاه</Label>
                                <Input
                                    name="Image"
                                    type="file"
                                    accept="image/jpeg, image/png, image/gif"
                                    onChange={e => {
                                        const file = e.currentTarget.files[0];
                                        if (file) {
                                            clearImage(setFieldValue);
                                            setFieldValue("Image", file);
                                            updateFormData({ Image: file });
                                            setGeneratedImageUrl(URL.createObjectURL(file));
                                        }
                                    }}
                                    invalid={touched.Image && !!errors.Image}
                                    disabled={aiImageLoading}
                                />
                                <ErrorMessage name="Image" component={FormFeedback} />
                            </Col>
                            <Col md='12' className='mb-3'>
                                <div className="d-flex align-items-center mb-1">
                                    <hr className="w-100 me-2" />
                                    <span className="text-muted text-nowrap">یا</span>
                                    <hr className="w-100 ms-2" />
                                </div>
                            </Col>
                            <Col md='12' className='mb-3'>
                                <Label className='form-label'>تولید تصویر با هوش مصنوعی (AI)</Label>
                                <Input
                                    type="textarea"
                                    rows="3"
                                    name="aiPrompt"
                                    placeholder="توضیحات خود را برای ساخت تصویر وارد کنید (مثال: 'cats and dogs')"
                                    value={aiPrompt}
                                    onChange={e => setAiPrompt(e.target.value)}
                                    disabled={aiImageLoading || (values.Image instanceof File)}
                                    invalid={touched.aiPrompt && !!errors.aiPrompt}
                                />
                                <ErrorMessage name="aiPrompt" component={FormFeedback} />
                                {aiError && <Alert color="danger" className="mt-2 p-2">{aiError}</Alert>}
                                <Button
                                    color='info'
                                    className='mt-2 d-flex align-items-center'
                                    onClick={() => handleGenerateAIImage(setFieldValue)}
                                    disabled={aiImageLoading || !aiPrompt.trim() || (values.Image instanceof File)}
                                >
                                    {aiImageLoading ? <Spinner size="sm" className="me-2" /> : <ImageIcon size={14} className='me-2' />}
                                    {aiImageLoading ? "در حال ساخت تصویر..." : "ساخت تصویر با AI"}
                                </Button>
                            </Col>
                            <Col md='12' className='mb-3'>
                                {generatedImageUrl && (
                                    <div className="text-center mt-3 position-relative">
                                        <img
                                            src={generatedImageUrl}
                                            alt="پیش‌نمایش تصویر"
                                            style={{
                                                maxWidth: 220, maxHeight: 180, borderRadius: 18,
                                                boxShadow: "0 2px 12px rgba(0,0,0,0.2)", border: "3px solid #1890ff"
                                            }}
                                        />
                                        <Button
                                            color="danger"
                                            className="btn-icon rounded-circle position-absolute top-0 end-0 m-2"
                                            onClick={() => clearImage(setFieldValue)}
                                            style={{ transform: "translate(25%, -25%)", zIndex: 1 }}
                                        >
                                            <XCircle size={18} />
                                        </Button>
                                        <small className="d-block mt-1 text-muted">
                                            {values.Image instanceof File ? "تصویر انتخابی شما" : "تصویر تولید شده با AI"}
                                        </small>
                                    </div>
                                )}
                            </Col>
                        </Row>
                        <div className='d-flex justify-content-between'>
                            <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
                                <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                                <span className='align-middle d-sm-inline-block d-none'>قبلی</span>
                            </Button>
                            <Button
                                color='success'
                                type='submit'
                                className='btn-submit'
                                disabled={loading || isSubmitting || !values.Image}
                            >
                                {loading || isSubmitting ? <Spinner size="sm" /> : <><CheckCircle size={14} className='align-middle me-sm-25 me-0'></CheckCircle>
                                <span className='align-middle d-sm-inline-block d-none'>ثبت خبر</span></>}
                            </Button>
                        </div>
                    extensions</Form>
                )}
            </Formik>
        </Fragment>
    );
};

export default ImageConfirmationStep;