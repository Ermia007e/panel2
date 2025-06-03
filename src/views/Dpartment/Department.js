import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { GetDepartment, AddDepartment, EditDepartment } from '../../services/api/Dpertment/GetDpartment';
import {
  Table,
  Spinner,
  Button,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Badge,
} from "reactstrap";
import gsap from "gsap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi"; 
import { useSelector } from "react-redux";
import DepartmentFormModal from "./DepartmentFormModal";

function useDarkMode() {
  const skin = useSelector((state) => state.layout?.skin);
  return skin === "dark";
}

const Department = () => {
  const darkMode = useDarkMode();
  const [page, setPage] = useState(1);
  const rowsRef = useRef([]);
  const cardsRef = useRef([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);

  const containerRef = useRef();
  const titleRef = useRef();
  const boxRef = useRef();

  const queryClient = useQueryClient();
  const ITEMS_PER_PAGE = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["departments", page, ITEMS_PER_PAGE],
    queryFn: () => GetDepartment(page, ITEMS_PER_PAGE),
    keepPreviousData: true,
  });

  const addDepartmentMutation = useMutation(AddDepartment, {
    onSuccess: () => {
      toast.success("دپارتمان با موفقیت اضافه شد!");
      queryClient.invalidateQueries("departments");
      setModalOpen(false);
    },
    onError: (err) => {
      toast.error("خطا در افزودن دپارتمان. لطفا دوباره تلاش کنید.");
      console.error("Add Department Error:", err);
    },
  });

  const editDepartmentMutation = useMutation(
    ({ id, data: updatedData }) => EditDepartment(id, updatedData),
    {
      onSuccess: () => {
        toast.success("دپارتمان با موفقیت ویرایش شد!");
        queryClient.invalidateQueries("departments");
        setModalOpen(false);
      },
      onError: (err) => {
        toast.error("خطا در ویرایش دپارتمان. لطفا دوباره تلاش کنید.");
        console.error("Edit Department Error:", err);
      },
    }
  );

  useLayoutEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
    }
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: "power3.out" });
    }
    if (boxRef.current) {
      gsap.fromTo(boxRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.7, delay: 0.35, ease: "back.out(1.7)" });
    }
  }, []);

  useEffect(() => {
    if (!isLoading && data && Array.isArray(data) && rowsRef.current.length) {
      rowsRef.current = rowsRef.current.slice(0, data.length);
      gsap.fromTo(rowsRef.current, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" });
    }
    if (!isLoading && data && Array.isArray(data) && cardsRef.current.length) {
      cardsRef.current = cardsRef.current.slice(0, data.length);
      gsap.fromTo(cardsRef.current, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" });
    }
  }, [data, isLoading]);
  const btnAnim = {
    onMouseEnter: (e) => gsap.to(e.currentTarget, { scale: 1.08, boxShadow: "0 0 12px #1890ff55", duration: 0.18 }),
    onMouseLeave: (e) => gsap.to(e.currentTarget, { scale: 1, boxShadow: "none", duration: 0.18 }),
    onMouseDown: (e) => gsap.to(e.currentTarget, { scale: 0.93, duration: 0.1 }),
    onMouseUp: (e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.1 }),
  };

  const darkBox = { background: "linear-gradient(135deg, #23272b 60%, #18191a 100%)", color: "#e4e6eb", borderRadius: 24, boxShadow: "0 8px 32px #0008" };
  const darkTable = { background: "#23272b", color: "#e4e6eb", borderRadius: 16, minWidth: 900 };
  const darkThead = { background: "#18191a", color: "#ffd666" };

  useEffect(() => {
    if (isError) {
      toast.error("دریافت لیست دپارتمان‌ها با خطا مواجه شد.");
      console.error("Error fetching departments:", error);
    }
  }, [isError, error]);

  const departments = Array.isArray(data) ? data : data?.data || [];
  const totalDepartments = departments.length;
  const totalPages = Math.ceil(totalDepartments / ITEMS_PER_PAGE);

  const toggleModal = () => {
    setModalOpen((prev) => {
      if (prev) {
        setCurrentDepartment(null);
        setIsEditMode(false);
      }
      return !prev;
    });
  };

  const handleAddDepartment = () => {
    setIsEditMode(false);
    setCurrentDepartment({ depName: "", buildingId: "" });
    setModalOpen(true);
  };

  const handleEdit = (department) => {
    setIsEditMode(true);
    setCurrentDepartment({
      id: department.id,
      depName: department.depName || "",
      buildingId: department.buildingId || ""
    });
    setModalOpen(true);
  };

  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(true);
    if (isEditMode) {
      editDepartmentMutation.mutate({ id: values.id, data: { depName: values.depName, buildingId: values.buildingId } });
    } else {
      addDepartmentMutation.mutate({ depName: values.depName, buildingId: values.buildingId });
    }
  };

  return (
    <Container
      ref={containerRef}
      className="py-4"
      style={{ maxWidth: 1200, fontFamily: "Vazirmatn, Tahoma, Arial" }}
    >
      <style>{`
        /* --- استایل‌های ریسپانسیو برای نمایش کارت یا جدول --- */

        /* پیش‌فرض (دسکتاپ و بزرگتر): جدول نمایش داده شود، کارت‌ها پنهان باشند */
        .department-card-layout {
          display: none;
        }
        .department-table-layout {
          display: block;
          width: 100%;
          overflow-x: auto;
        }

        @media (max-width: 767px) {
          .department-table-layout {
            display: none;
          }
          .department-card-layout {
            display: block;
          }
          .container {
            padding: 0.5rem;
          }
          .btn {
            font-size: 14px;
            padding: 0.25rem 0.5rem;
          }
          .btn svg {
            font-size: 16px;
          }
          .pagination-button {
            font-size: 16px;
            min-width: 80px;
          }
          .pagination-span {
            font-size: 16px;
            min-width: 100px;
          }
          h2 {
            font-size: 24px;
          }
        }
        @media (max-width: 576px) {
          .btn {
            font-size: 12px;
            padding: 0.2rem 0.4rem;
          }
          .btn svg {
            font-size: 14px;
          }
          .pagination-button {
            font-size: 14px;
            min-width: 70px;
          }
          .pagination-span {
            font-size: 14px;
            min-width: 90px;
          }
          h2 {
            font-size: 20px;
          }
        }

        /* --- استایل‌های تم (Dark/Light Mode) --- */
        .department-card-layout .card {
          border: none;
          transition: all 0.3s ease;
          background: ${darkMode ? "linear-gradient(135deg, #2c3e50, #34495e)" : "linear-gradient(135deg, #e6f0fa, #f0f4f8)"};
        }
        .department-card-layout .card:hover {
          transform: scale(1.03);
          box-shadow: ${darkMode ? "0 10px 30px rgba(255,165,0,0.3)" : "0 10px 30px rgba(0,123,255,0.3)"};
        }
        .btn-primary {
          background: ${darkMode ? "linear-gradient(135deg, #ffd666, #e6b100)" : "linear-gradient(135deg, #1890ff, #007bff)"};
          border: none;
        }
        .btn-primary:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: ${darkMode ? "0 0 20px rgba(230,126,34,0.5)" : "0 0 20px rgba(0,123,255,0.5)"};
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        ${darkMode &&
        `
          body {
            background: #18191a !important;
            color: #e4e6eb !important;
          }
          .table thead th, .table-light th {
            background: #18191a !important;
            color: #ffd666 !important;
          }
          .table-bordered {
            border-color: #333 !important;
          }
        `}
      `}</style>

      <ToastContainer rtl position="top-center" theme={darkMode ? "dark" : "light"} />

      <h2
        ref={titleRef}
        className="text-center mb-4 fw-bold"
        style={{ letterSpacing: 1.5, fontSize: 32, color: darkMode ? "#ffd666" : "#1890ff" }}
      >
        لیست دپارتمان‌ها
      </h2>

      <div
        ref={boxRef}
        className="rounded-4 shadow-sm p-3 p-md-4"
        style={darkMode ? darkBox : { background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px #0002" }}
      >
        <div className="d-flex justify-content-end mb-3">
          <Button
            color="primary"
            className="fw-bold d-flex align-items-center gap-2"
            onClick={handleAddDepartment}
            {...btnAnim}
            style={{
              borderRadius: 12,
              fontSize: 16,
              background: darkMode ? "#ffd666" : "#1890ff",
              borderColor: darkMode ? "#ffd666" : "#1890ff",
              color: darkMode ? "#222" : "#fff",
              transition: "all 0.3s ease"
            }}
          >
            <FiPlus size={20} />
            اضافه کردن دپارتمان
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-5 text-danger fw-bold">
            خطا در بارگذاری دپارتمان‌ها. لطفاً دوباره تلاش کنید.
            {error?.message && <small><br />{error.message}</small>}
          </div>
        ) : (
          <>
            <div className="department-table-layout">
              {departments.length > 0 ? (
                <Table
                  bordered
                  hover
                  className="align-middle text-center"
                  style={darkMode ? darkTable : { borderRadius: 16, fontSize: 16, minWidth: 900, background: "#f6faff" }}
                >
                  <thead style={darkMode ? darkThead : {}}>
                    <tr>
                      <th>#</th>
                      <th>شناسه (ID)</th>
                      <th>نام دپارتمان</th>
                      <th>تاریخ ثبت</th>
                      <th>نام ساختمان</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dep, i) => {
                      const globalIndex = (page - 1) * ITEMS_PER_PAGE + i;

                      return (
                        <tr
                          key={dep.id}
                          ref={(el) => (rowsRef.current[i] = el)}
                          style={darkMode ? { background: i % 2 === 0 ? "#23272b" : "#2c3e50", transition: "background 0.3s, box-shadow 0.3s", borderRadius: 12, boxShadow: "0 2px 8px #0004", cursor: "pointer" } : { background: i % 2 === 0 ? "#fafdff" : "#f3f7fa", transition: "background 0.3s, box-shadow 0.3s", borderRadius: 12, boxShadow: "0 2px 8px rgba(24,144,255,0.04)", cursor: "pointer" }}
                          onMouseEnter={(e) => gsap.to(e.currentTarget, { background: darkMode ? "#18191a" : "#e6f7ff", scale: 1.01, boxShadow: darkMode ? "0 4px 16px #ffd66633" : "0 4px 16px #91d5ff55", duration: 0.2 })}
                          onMouseLeave={(e) => gsap.to(e.currentTarget, { background: darkMode ? (i % 2 === 0 ? "#23272b" : "#2c3e50") : (i % 2 === 0 ? "#fafdff" : "#f3f7fa"), scale: 1, boxShadow: darkMode ? "0 2px 8px #0004" : "0 2px 8px rgba(24,144,255,0.04)", duration: 0.2 })}
                        >
                          <td style={{ fontWeight: "bold" }}>{globalIndex + 1}</td>
                          <td>{dep.id}</td>
                          <td>{dep.depName}</td>
                          <td>{new Date(dep.insertDate).toLocaleDateString("fa-IR")}</td>
                          <td>{dep.buildingName}</td>
                          <td style={{ position: "relative", width: 100 }}>
                            <Button
                              color="info" 
                              size="sm"
                              className="d-flex align-items-center justify-content-center mx-auto"
                              onClick={() => handleEdit(dep)}
                              {...btnAnim}
                              style={{
                                borderRadius: 8,
                                fontSize: 14,
                                minWidth: 60,
                                background: darkMode ? "#17a2b8" : "#007bff",
                                borderColor: darkMode ? "#17a2b8" : "#007bff",
                                color: "#fff"
                              }}
                            >
                              <FiEdit size={16} />
                            </Button>
                      
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <p className="text-center text-muted">دپارتمانی برای نمایش وجود ندارد.</p>
              )}
            </div>

            <Row className="department-card-layout g-3">
              {departments.length > 0 ? (
                departments.map((dep, i) => {
                  const globalIndex = (page - 1) * ITEMS_PER_PAGE + i;
                  return (
                    <Col key={dep.id} xs={12} className="mb-2">
                      <Card
                        ref={(el) => (cardsRef.current[i] = el)}
                        className="bg-light shadow-sm"
                        style={darkMode ? {background: "linear-gradient(135deg, #2c3e50, #34495e)"} : {}}
                      >
                        <CardBody className="p-3 position-relative">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold text-muted">#{globalIndex + 1}</span>
                            <Button
                              color="info" 
                              size="sm"
                              className="d-flex align-items-center gap-1"
                              onClick={() => handleEdit(dep)}
                              {...btnAnim}
                              style={{
                                borderRadius: 8,
                                fontSize: 14,
                                padding: "5px 10px",
                                background: darkMode ? "#17a2b8" : "#007bff",
                                borderColor: darkMode ? "#17a2b8" : "#007bff",
                                color: "#fff"
                              }}
                            >
                              <FiEdit size={16} /> ویرایش
                            </Button>
                          </div>
                          <h5 className="mb-2" style={{ color: darkMode ? "#ffd700" : "#007bff", fontFamily: "cursive" }}>
                            {dep.depName}
                          </h5>
                          <hr className="my-1" style={{ borderColor: darkMode ? "#34495e" : "#dee2e6" }} />
                          <p className="mb-1 text-muted small">شناسه: <span style={{ color: darkMode ? "#e67e22" : "#28a745" }}>{dep.id}</span></p>
                          <p className="mb-1 text-muted small">تاریخ ثبت: {new Date(dep.insertDate).toLocaleDateString("fa-IR")}</p>
                          <p className="mb-1 text-muted small">ساختمان: <span style={{ color: darkMode ? "#e67e22" : "#28a745" }}>{dep.buildingName || "نامشخص"}</span></p>
                    
                        </CardBody>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <Col xs={12}>
                  <p className="text-center text-muted">دپارتمانی برای نمایش وجود ندارد.</p>
                </Col>
              )}
            </Row>
          </>
        )}
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
          <Button
            color={darkMode ? "light" : "primary"}
            outline
            size="md"
            disabled={page === 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="pagination-button rounded-pill"
            {...btnAnim}
            style={{ minWidth: 100, fontWeight: "bold", fontSize: 18, borderRadius: 12, background: darkMode ? "#23272b" : undefined, color: darkMode ? "#ffd666" : undefined, borderColor: darkMode ? "#ffd666" : undefined }}
          >
            قبلی
          </Button>
          <span
            className="fw-bold px-3 py-2 rounded-pill pagination-span"
            style={{ fontSize: 18, minWidth: 120, textAlign: "center", background: darkMode ? "#18191a" : "#f6faff", color: darkMode ? "#ffd666" : "#222" }}
          >
            صفحه {page} از {totalPages || 1}
          </span>
          <Button
            color={darkMode ? "light" : "primary"}
            outline
            size="md"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((p) => p + 1)}
            className="pagination-button rounded-pill"
            {...btnAnim}
            style={{ minWidth: 100, fontWeight: "bold", fontSize: 18, borderRadius: 12, background: darkMode ? "#23272b" : undefined, color: darkMode ? "#ffd666" : undefined, borderColor: darkMode ? "#ffd666" : undefined }}
          >
            بعدی
          </Button>
        </div>
      </div>

      <DepartmentFormModal
        isOpen={modalOpen}
        toggle={toggleModal}
        onSubmit={handleSubmitForm}
        initialValues={currentDepartment || { depName: "", buildingId: "" }}
        isEdit={isEditMode}
      />
    </Container>
  );
};

export default Department;