import React, { useRef, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Button, Label, Input, FormFeedback } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import gsap from "gsap";
import { useSelector } from "react-redux";

function useDarkMode() {
  const skin = useSelector((state) => state.layout?.skin);
  return skin === "dark";
}

const AnimatedModal = ({ children, isOpen, toggle, modalClassName, className = "", onClosed, title }) => {
  const modalContentRef = useRef(null);
  const darkMode = useDarkMode();

  const initialModalStyle = {
    opacity: 0,
    y: -100,
    scale: 0.8,
  };
  const finalModalStyle = {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.4,
    ease: "back.out(1.7)",
  };
  const exitModalStyle = {
    opacity: 0,
    y: 100,
    scale: 0.8,
    duration: 0.3,
    ease: "power2.in",
    onComplete: onClosed,
  };

  useEffect(() => {
    if (modalContentRef.current) {
      if (isOpen) {
        gsap.fromTo(modalContentRef.current, initialModalStyle, finalModalStyle);
      } else {
        gsap.to(modalContentRef.current, exitModalStyle);
      }
    }
  }, [isOpen]);

  const darkModalHeader = {
    background: "#18191a",
    color: "#ffd666",
    borderBottom: "1amentpx solid #333",
    fontSize: "1.4rem",
    fontWeight: "bold",
  };

  const darkModalBody = {
    background: "#23272b",
    color: "#e4e6eb",
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className={`${modalClassName} ${className}`}
      onClosed={onClosed}
      modalClassName="modal-animated"
      contentClassName="shadow-lg rounded-3"
      style={{ zIndex: 5000 }} 
    >
      <div ref={modalContentRef}>
        <ModalHeader
          className="d-flex align-items-center justify-content-between"
          style={darkMode ? darkModalHeader : {}}
        >
          {title}
        </ModalHeader>
        <ModalBody style={darkMode ? darkModalBody : {}}>
          {children}
        </ModalBody>
      </div>
    </Modal>
  );
};

const DepartmentFormModal = ({ isOpen, toggle, onSubmit, initialValues, isEdit }) => {
  const darkMode = useDarkMode();

  const validationSchema = Yup.object().shape({
    depName: Yup.string()
      .required("نام دپارتمان الزامی است")
      .min(2, "نام دپارتمان حداقل 2 کاراکتر باید باشد")
      .max(50, "نام دپارتمان حداکثر 50 کاراکتر می‌تواند باشد"),
    buildingId: Yup.number()
      .required("شناسه ساختمان الزامی است")
      .integer("شناسه ساختمان باید عدد صحیح باشد")
      .min(1, "شناسه ساختمان باید حداقل 1 باشد")
      .typeError("شناسه ساختمان باید یک عدد باشد"),
  });

  const darkInputStyle = {
    background: "#333",
    color: "#e4e6eb",
    borderColor: "#555",
  };
  const darkLabelStyle = {
    color: "#e4e6eb",
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      toggle={toggle}
      title={isEdit ? "ویرایش دپارتمان" : "افزودن دپارتمان جدید"}
      modalClassName="modal-lg"
      onClosed={() => {}}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <Label for="depName" style={darkMode ? darkLabelStyle : {}}>
                نام دپارتمان
              </Label>
              <Field
                name="depName"
                as={Input}
                className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''} ${
                  errors.depName && touched.depName ? "is-invalid" : ""
                }`}
                style={darkMode ? darkInputStyle : {}}
              />
              <ErrorMessage name="depName" component={FormFeedback} />
            </div>

            <div className="mb-3">
              <Label for="buildingId" style={darkMode ? darkLabelStyle : {}}>
                شناسه ساختمان
              </Label>
              <Field
                name="buildingId"
                as={Input}
                type="number"
                className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''} ${
                  errors.buildingId && touched.buildingId ? "is-invalid" : ""
                }`}
                style={darkMode ? darkInputStyle : {}}
              />
              <ErrorMessage name="buildingId" component={FormFeedback} />
            </div>

            <div className="d-flex justify-content-end mt-4">
              <Button
                type="submit"
                color="primary"
                className="fw-bold"
                disabled={isSubmitting}
                style={{ borderRadius: 8 }}
              >
                {isSubmitting ? "در حال ارسال..." : (isEdit ? "ذخیره تغییرات" : "افزودن")}
              </Button>
              <Button
                type="button"
                color="secondary"
                className="ms-2 fw-bold"
                onClick={toggle}
                style={{ borderRadius: 8 }}
              >
                انصراف
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </AnimatedModal>
  );
};

export default DepartmentFormModal;