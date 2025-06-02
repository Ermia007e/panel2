import React, { Fragment, useState } from 'react';
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Label, Row, Col, Input, Button, FormFeedback, Spinner, Alert } from 'reactstrap';
import { ArrowLeft, CheckCircle, Image as ImageIcon, XCircle } from 'react-feather';

const HUGGING_FACE_API_TOKEN = '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'
const HUGGING_FACE_MODEL_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";

const generateImageFromHuggingFace = async (prompt) => {
    try {
        console.log("Calling Hugging Face Inference API directly with prompt:", prompt);
        const response = await fetch(HUGGING_FACE_MODEL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HUGGING_FACE_API_TOKEN}`,
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `خطا از API هوش مصنوعی: ${response.status} ${response.statusText}`;
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.error) {
                    errorMessage = `خطا از API هوش مصنوعی: ${errorJson.error}`;
                }
            } catch (e) {
            }
            throw new Error(errorMessage);
        }

        const imageBlob = await response.blob();
        
        if (imageBlob && imageBlob.type.startsWith('image/')) {
            return URL.createObjectURL(imageBlob);
        } else {
            throw new Error("پاسخ از API هوش مصنوعی یک تصویر معتبر نبود.");
        }
    } catch (error) {
        console.error("Error generating image from Hugging Face AI API:", error);
        throw error;
    }
};

// --- Validation Schema ---
const validationSchema = Yup.object({
    Image: Yup.mixed().nullable().test(
        "fileType",
        "فقط فایل‌های تصویری (JPEG, PNG, GIF) مجاز هستند.",
        value => {
            if (!value) return true;
            if (value instanceof File) {
                return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
            }
            return true;
        }
    ).test(
        "fileSize",
        "حجم فایل نمی‌تواند بیشتر از 5 مگابایت باشد.",
        value => {
            if (!value) return true;
            if (value instanceof File) {
                return value.size <= 5 * 1024 * 1024; // 5 MB
            }
            return true;
        }
    ),
    aiPrompt: Yup.string()
        .max(500, "توضیحات AI نمی‌تواند بیشتر از 500 کاراکتر باشد.")
        .when('Image', {
            is: (Image) => !Image,
            then: (schema) => schema.required("لطفاً برای ساخت تصویر AI توضیحات وارد کنید."),
            otherwise: (schema) => schema.notRequired()
        })
});

const ImageConfirmationStep = ({ stepper, formData, updateFormData, handleSubmit, loading }) => {
    const [aiPrompt, setAiPrompt] = useState(formData.aiPrompt || "");
    const [aiImageLoading, setAiImageLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState(() => {
        if (formData.Image instanceof File) {
            return URL.createObjectURL(formData.Image);
        }
        if (typeof formData.Image === 'string' && formData.Image.startsWith('http')) {
            return formData.Image;
        }
        return null;
    });

    const convertUrlToFile = async (url, filename, mimeType = 'image/png') => {
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            return new File([blob], filename, { type: mimeType || blob.type });
        } catch (error) {
            console.error("Error converting URL to File:", error);
            throw new Error("تبدیل URL تصویر به فایل با شکست مواجه شد.");
        }
    };

    // --- Handle AI Image Generation ---
    const handleGenerateAIImage = async (setFieldValue) => {
        if (!aiPrompt.trim()) {
            setAiError("لطفاً توضیحات برای ساخت تصویر را وارد کنید.");
            return;
        }

        setAiImageLoading(true);
        setAiError(null);
        if (generatedImageUrl && generatedImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(generatedImageUrl);
        }
        setGeneratedImageUrl(null);

        try {
            const imageUrl = await generateImageFromHuggingFace(aiPrompt);
            
            if (imageUrl) {
                setGeneratedImageUrl(imageUrl);
                const file = await convertUrlToFile(imageUrl, "ai_generated_image.png");
                setFieldValue("Image", file);
                updateFormData({ Image: file, aiPrompt: aiPrompt });
            } else {
                setAiError("تصویری از هوش مصنوعی دریافت نشد.");
            }
        } catch (error) {
            console.error("خطا در ساخت تصویر با هوش مصنوعی:", error.message || error);
            setAiError(`خطا در ساخت تصویر با هوش مصنوعی: ${error.message || 'خطای ناشناخته'}.`);
            setFieldValue("Image", null);
            updateFormData({ Image: null, aiPrompt: aiPrompt });
        } finally {
            setAiImageLoading(false);
        }
    };

    // --- Clear Image Function ---
    const clearImage = (setFieldValue) => {
        if (generatedImageUrl && generatedImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(generatedImageUrl);
        }
        setFieldValue("Image", null);
        updateFormData({ Image: null, aiPrompt: "" });
        setGeneratedImageUrl(null);
        setAiPrompt("");
        setAiError(null);
    };

    return (
        <Fragment>
            <div className='content-header'>
                <h5 className='mb-0'>تصویر و تایید</h5>
                <small>تصویر خبر را انتخاب کرده یا با هوش مصنوعی بسازید و ثبت نهایی کنید.</small>
            </div>
            <Formik
                initialValues={{
                    Image: formData.Image || null,
                    aiPrompt: aiPrompt
                }}
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
                            {/* --- Manual Image Upload Section --- */}
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
                                        } else {
                                            clearImage(setFieldValue);
                                        }
                                    }}
                                    invalid={touched.Image && !!errors.Image}
                                    disabled={aiImageLoading || (!!generatedImageUrl && typeof values.Image === 'string')}
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
                                    placeholder="توضیحات خود را برای ساخت تصویر وارد کنید (مثال: 'گربه‌ای در حال خواندن کتاب در فضا')"
                                    value={aiPrompt}
                                    onChange={e => {
                                        setAiPrompt(e.target.value);
                                        setAiError(null);
                                    }}
                                    disabled={!!values.Image && values.Image instanceof File || aiImageLoading}
                                    invalid={touched.aiPrompt && !!errors.aiPrompt}
                                />
                                <ErrorMessage name="aiPrompt" component={FormFeedback} />
                                {aiError && <Alert color="danger" className="mt-2 p-2">{aiError}</Alert>}
                                <Button 
                                    color='info' 
                                    className='mt-2 d-flex align-items-center' 
                                    onClick={() => handleGenerateAIImage(setFieldValue)}
                                    disabled={!aiPrompt.trim() || aiImageLoading || (!!values.Image && values.Image instanceof File)}
                                >
                                    {aiImageLoading ? <Spinner size="sm" className="me-2" /> : <ImageIcon size={14} className='me-2' />}
                                    {aiImageLoading ? "در حال ساخت تصویر..." : "ساخت تصویر با AI"}
                                </Button>
                            </Col>

                            <Col md='12' className='mb-3'>
                                {values.Image instanceof File && (
                                    <div className="text-center mt-3 position-relative">
                                        <img
                                            src={URL.createObjectURL(values.Image)}
                                            alt="پیش‌نمایش تصویر آپلود شده"
                                            style={{
                                                maxWidth: 220, maxHeight: 180, borderRadius: 18,
                                                boxShadow: "0 2px 12px rgba(0,0,0,0.2)", border: "3px solid #ccc"
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
                                        <small className="d-block mt-1 text-muted">تصویر انتخابی شما</small>
                                    </div>
                                )}

                                {generatedImageUrl && typeof generatedImageUrl === 'string' && !(values.Image instanceof File) && (
                                    <div className="text-center mt-3 position-relative">
                                        <img
                                            src={generatedImageUrl}
                                            alt="پیش‌نمایش تصویر AI"
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
                                        <small className="d-block mt-1 text-muted">تصویر تولید شده با هوش مصنوعی</small>
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
                                disabled={loading || isSubmitting || (!values.Image)}
                            >
                                {loading || isSubmitting ? <Spinner size="sm" /> : <><CheckCircle size={14} className='align-middle me-sm-25 me-0'></CheckCircle>
                                <span className='align-middle d-sm-inline-block d-none'>ثبت خبر</span></>}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Fragment>
    );
};

export default ImageConfirmationStep;