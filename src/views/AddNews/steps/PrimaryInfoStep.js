import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Label, Row, Col, Input, Button, FormFeedback } from 'reactstrap';
import { ArrowLeft, ArrowRight } from 'react-feather';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Code from '@editorjs/code';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import LinkTool from '@editorjs/link';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Delimiter from '@editorjs/delimiter';
import Embed from '@editorjs/embed';

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
    .min(30, "تعداد کارکتر های توضیحات اصلی باید حداقل 30 باشد."),
});

const PrimaryInfoStep = ({ stepper, formData, updateFormData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const editorInstance = useRef(null);

  const generateDescription = async (text) => {
    setIsLoading(true);
    const apiKey = "AIzaSyCbM-OuxxYDrSr0mZjc3xzYnA1FemvIJI4"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `توضیحات کامل و حرفه‌ای درباره این موضوع بساز: ${text}`,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response structure from API");
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      setIsEnhanced(true);

      const editorContent = {
        time: new Date().getTime(),
        blocks: [
          {
            type: 'paragraph',
            data: { text: generatedText },
          },
        ],
      };

      if (editorInstance.current) {
        await editorInstance.current.blocks.clear();
        editorInstance.current.render(editorContent);
      }
      return generatedText;
    } catch (error) {
      console.error("خطا در دریافت پاسخ از AI:", error);
      return text;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!editorInstance.current) {
      const initialData = formData.Describe
        ? {
            time: new Date().getTime(),
            blocks: [
              {
                type: 'paragraph',
                data: { text: formData.Describe },
              },
            ],
          }
        : undefined;

      editorInstance.current = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: {
            class: Header,
            config: {
              levels: [1, 2, 3, 4],
              defaultLevel: 2,
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          image: {
            class: Image,
            config: {
              uploader: {
                uploadByFile(file) {
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve({
                      success: 1,
                      file: { url: reader.result },
                    });
                  });
                },
              },
            },
          },
          code: Code,
          quote: {
            class: Quote,
            inlineToolbar: true,
          },
          table: {
            class: Table,
            inlineToolbar: true,
          },
          linkTool: {
            class: LinkTool,
          },
          marker: {
            class: Marker,
            inlineToolbar: true,
          },
          inlineCode: {
            class: InlineCode,
            inlineToolbar: true,
          },
          delimiter: Delimiter,
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                vimeo: true,
              },
            },
          },
        },
        placeholder: 'توضیحات کامل خبر...',
        data: initialData,
        onChange: async () => {
          if (editorInstance.current) {
            const savedData = await editorInstance.current.save();
            const text = savedData.blocks
              .map(block => block.data.text || '')
              .filter(text => text)
              .join('\n');
            document.getElementById('describe-hidden').value = text;
          }
        },
      });
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [formData.Describe]);

  return (
    <Fragment>
      <style>
        {`
          .editorjs-container {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            background-color: #fff;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            min-height: 300px;
            font-family: 'Vazir', sans-serif;
            direction: rtl;
          }

          .ce-block__content {
            max-width: 100% !important;
            margin: 0 !important;
          }

          .ce-block {
            margin-bottom: 10px;
          }

          .ce-toolbar__plus {
            background-color: #007bff;
            color: white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .ce-toolbar__plus:hover {
            background-color: #0056b3;
          }

          .ce-toolbox {
            background-color: #f8f9fa;
            border-radius: 5px;
            padding: 5px;
          }

          .ce-block--selected .ce-block__content {
            background-color: #e6f0ff;
          }

          .cdx-block {
            padding: 10px;
            border-radius: 5px;
          }

          .ce-paragraph {
            line-height: 1.6;
            color: #333;
          }

          .ce-header {
            font-weight: bold;
            color: #2c3e50;
          }

          .cdx-list {
            padding-right: 20px;
          }

          .cdx-quote {
            border-right: 4px solid #007bff;
            padding-right: 10px;
            color: #555;
          }

          .cdx-table {
            border-collapse: collapse;
            width: 100%;
          }

          .cdx-table td,
          .cdx-table th {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
          }

          .cdx-code {
            background-color: #f8f9fa;
            border-radius: 5px;
            padding: 10px;
            font-family: 'Fira Code', monospace;
          }

          .image-tool__image {
            border-radius: 8px;
            max-width: 100%;
          }

          .invalid-editor {
            border-color: #dc3545 !important;
          }
        `}
      </style>

      <div className='content-header'>
        <h5 className='mb-0'>اطلاعات اصلی</h5>
        <small>عنوان و توضیحات اصلی خبر را وارد کنید.</small>
      </div>
      <Formik
        initialValues={{
          Title: formData.Title || "",
          MiniDescribe: formData.MiniDescribe || "",
          Describe: formData.Describe || "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          if (editorInstance.current) {
            const savedData = await editorInstance.current.save();
            const text = savedData.blocks
              .map(block => block.data.text || '')
              .filter(text => text)
              .join('\n');
            updateFormData({ ...values, Describe: text });
            stepper.next();
          }
        }}
      >
        {({ values, touched, errors, setFieldValue }) => (
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
                  type="hidden"
                  id="describe-hidden"
                  value={values.Describe}
                  onChange={(e) => setFieldValue("Describe", e.target.value)}
                />
                <div
                  id="editorjs"
                  className={`editorjs-container ${touched.Describe && errors.Describe ? 'invalid-editor' : ''}`}
                ></div>
                {touched.Describe && errors.Describe && (
                  <div className="invalid-feedback d-block">{errors.Describe}</div>
                )}
                <Button
                  color="info"
                  className="mt-1"
                  onClick={async () => {
                    if (editorInstance.current) {
                      const savedData = await editorInstance.current.save();
                      const text = savedData.blocks
                        .map(block => block.data.text || '')
                        .filter(text => text)
                        .join('\n');
                      const enhancedText = await generateDescription(text);
                      setFieldValue("Describe", enhancedText);
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "در حال پردازش توسط AI..." : "ویرایش با AI"}
                </Button>
                {isEnhanced && (
                  <small className="text-success mt-1 d-block">این توضیحات توسط AI بهبود یافته است.</small>
                )}
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
  );
};

export default PrimaryInfoStep;