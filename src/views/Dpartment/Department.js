import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { GetDepartment, AddDepartment, EditDepartment } from '../../services/api/Dpertment/GetDpartment';
import { Table, Spinner, Button } from "reactstrap";
import gsap from "gsap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
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
  const [dropdownOpen, setDropdownOpen] = useState(null);
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
    ({ id, data }) => EditDepartment(id, data),
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
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -40 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: "power3.out" }
      );
    }
    if (boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.7, delay: 0.35, ease: "back.out(1.7)" }
      );
    }
  }, []);

  useEffect(() => {
    if (!isLoading && data?.data?.length) {
      rowsRef.current = rowsRef.current.slice(0, data.data.length); 
      gsap.fromTo(
        rowsRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" }
      );
    }
  }, [data, isLoading]);

  useEffect(() => {
    const close = () => setDropdownOpen(null);
    if (dropdownOpen !== null) {
      window.addEventListener("click", close);
      return () => window.removeEventListener("click", close);
    }
  }, [dropdownOpen]);

  const animateDropdown = (el, show, up = false) => {
    if (!el) return;
    if (show) {
      gsap.fromTo(
        el,
        { opacity: 0, y: up ? 20 : -20, scale: 0.9, display: "block" },
        { opacity: 1, y: 0, scale: 1.05, duration: 0.35, display: "block", ease: "back.out(1.7)" }
      );
    } else {
      gsap.to(el, {
        opacity: 0,
        y: up ? 20 : -20,
        scale: 0.9,
        duration: 0.2,
        display: "none",
        ease: "power2.in",
      });
    }
  };

  const btnAnim = {
    onMouseEnter: (e) =>
      gsap.to(e.currentTarget, { scale: 1.08, boxShadow: "0 0 12px #1890ff55", duration: 0.18 }),
    onMouseLeave: (e) =>
      gsap.to(e.currentTarget, { scale: 1, boxShadow: "none", duration: 0.18 }),
    onMouseDown: (e) => gsap.to(e.currentTarget, { scale: 0.93, duration: 0.1 }),
    onMouseUp: (e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.1 }),
  };

  const darkBox = {
    background: "linear-gradient(135deg, #23272b 60%, #18191a 100%)",
    color: "#e4e6eb",
    borderRadius: 24,
    boxShadow: "0 8px 32px #0008",
  };
  const darkTable = {
    background: "#23272b",
    color: "#e4e6eb",
    borderRadius: 16,
    minWidth: 900,
  };
  const darkThead = {
    background: "#18191a",
    color: "#ffd666",
  };
  const darkDropdown = {
    background: "#23272b",
    color: "#ffd666",
    border: "1px solid #333",
  };

  useEffect(() => {
    if (isError) {
      toast.error("دریافت لیست دپارتمان‌ها با خطا مواجه شد.");
      console.error("Error fetching departments:", error);
    }
  }, [isError, error]);

  const departments = data?.data || [];
  const totalDepartments = data?.totalCount || 0;
  const totalPages = Math.ceil(totalDepartments / ITEMS_PER_PAGE);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) { 
      setCurrentDepartment(null); 
      setIsEditMode(false); 
    }
  };

  const handleAddDepartment = () => {
    setIsEditMode(false);
    setCurrentDepartment({ depName: "", buildingId: "" });
    setModalOpen(true);
    setDropdownOpen(null);
  };

  const handleEdit = (department) => {
    setIsEditMode(true);
    setCurrentDepartment({
      id: department.id,
      depName: department.depName || "",
      buildingId: department.buildingId || ""
    });
    setModalOpen(true);
    setDropdownOpen(null); 
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
    <div
      ref={containerRef}
      className="container py-4"
      style={{
        maxWidth: 1200,
        fontFamily: "Vazirmatn, Tahoma, Arial",
      }}
    >
      <ToastContainer rtl position="top-center" theme={darkMode ? "dark" : "light"} />
      <h2
        ref={titleRef}
        className="text-center mb-4 fw-bold"
        style={{
          letterSpacing: 1.5,
          fontSize: 32,
          color: darkMode ? "#ffd666" : "#1890ff",
        }}
      >
        لیست دپارتمان‌ها
      </h2>
      <div
        ref={boxRef}
        className="rounded-4 shadow-sm p-3 p-md-4"
        style={
          darkMode
            ? darkBox
            : {
                background: "#fff",
                borderRadius: 24,
                boxShadow: "0 8px 32px #0002",
              }
        }
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
            </div>
        ) : (
          <div className="table-responsive">
            <Table
              bordered
              hover
              className="align-middle text-center"
              style={
                darkMode
                  ? darkTable
                  : {
                      borderRadius: 16,
                      fontSize: 16,
                      minWidth: 900,
                      background: "#f6faff",
                    }
              }
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
                {departments.length > 0 ? (
                  departments.map((dep, i) => {
                    const isLast = i === departments.length - 1 && (departments.length % ITEMS_PER_PAGE) !== 0 ; 
                    const isSecondToLast = (i === departments.length - 2 && (departments.length % ITEMS_PER_PAGE) !== 0) || (i === departments.length - 1 && (departments.length % ITEMS_PER_PAGE) === 0);

                    const openUpwards = (isLast || isSecondToLast) && (page === totalPages); 

                    return (
                      <tr
                        key={dep.id}
                        ref={(el) => (rowsRef.current[i] = el)}
                        style={
                          darkMode
                            ? {
                                background: i % 2 === 0 ? "#23272b" : "#23272b",
                                transition: "background 0.3s, box-shadow 0.3s",
                                borderRadius: 12,
                                boxShadow: "0 2px 8px #0004",
                                cursor: "pointer",
                              }
                            : {
                                background: i % 2 === 0 ? "#fafdff" : "#f3f7fa",
                                transition: "background 0.3s, box-shadow 0.3s",
                                borderRadius: 12,
                                boxShadow: "0 2px 8px rgba(24,144,255,0.04)",
                                cursor: "pointer",
                              }
                        }
                        onMouseEnter={(e) => {
                          gsap.to(e.currentTarget, {
                            background: darkMode ? "#18191a" : "#e6f7ff",
                            scale: 1.01,
                            boxShadow: darkMode
                              ? "0 4px 16px #ffd66633"
                              : "0 4px 16px #91d5ff55",
                            duration: 0.2,
                          });
                        }}
                        onMouseLeave={(e) => {
                          gsap.to(e.currentTarget, {
                            background: darkMode ? "#23272b" : (i % 2 === 0 ? "#fafdff" : "#f3f7fa"),
                            scale: 1,
                            boxShadow: darkMode
                              ? "0 2px 8px #0004"
                              : "0 2px 8px rgba(24,144,255,0.04)",
                            duration: 0.2,
                          });
                        }}
                      >
                        <td style={{ fontWeight: "bold" }}>{(page - 1) * ITEMS_PER_PAGE + i + 1}</td>
                        <td>{dep.id}</td>
                        <td>{dep.depName}</td>
                        <td>{new Date(dep.insertDate).toLocaleDateString("fa-IR")}</td>
                        <td>{dep.buildingName}</td>
                        <td style={{ position: "relative", width: 60 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(dropdownOpen === i ? null : i);
                            }}
                            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.18, rotate: 18, duration: 0.18 })}
                            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, rotate: 0, duration: 0.18 })}
                          >
                            <FiMoreVertical size={26} style={{ cursor: "pointer", color: darkMode ? "#ffd666" : "#222" }} />
                          </div>
                          {dropdownOpen === i && (
                            <div
                              ref={(el) => {
                                if (el) animateDropdown(el, dropdownOpen === i, openUpwards);
                              }}
                              className="position-absolute border rounded shadow-sm"
                              style={{
                                ...(darkMode ? darkDropdown : { background: "#fff", color: "#222" }),
                                left: "50%",
                                ...(openUpwards
                                  ? { bottom: 36 }
                                  : { top: 36 }),
                                minWidth: 120,
                                zIndex: 3000,
                                padding: 0,
                                opacity: 0,
                                pointerEvents: dropdownOpen === i ? "auto" : "none",
                                display: dropdownOpen === i ? "block" : "none",
                                transform: "translateX(-50%)"
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                className="py-2 px-3 text-info fw-bold"
                                style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
                                onClick={() => handleEdit(dep)}
                                onMouseEnter={(e) => gsap.to(e.currentTarget, { background: darkMode ? "#1a2a2a" : "#e6f7ff", scale: 1.05, duration: 0.15 })}
                                onMouseLeave={(e) => gsap.to(e.currentTarget, { background: darkMode ? "#23272b" : "#fff", scale: 1, duration: 0.15 })}
                              >
                                ویرایش
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6">دپارتمانی برای نمایش وجود ندارد.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
          <Button
            color={darkMode ? "light" : "primary"}
            outline
            size="md"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{
              minWidth: 100,
              fontWeight: "bold",
              fontSize: 18,
              borderRadius: 12,
              background: darkMode ? "#23272b" : undefined,
              color: darkMode ? "#ffd666" : undefined,
              borderColor: darkMode ? "#ffd666" : undefined,
            }}
            {...btnAnim}
          >
            قبلی
          </Button>
          <span
            className="fw-bold px-3 py-2 rounded"
            style={{
              fontSize: 18,
              minWidth: 120,
              textAlign: "center",
              background: darkMode ? "#18191a" : "#f6faff",
              color: darkMode ? "#ffd666" : "#222",
            }}
          >
            صفحه {page} از {totalPages || 1}
          </span>
          <Button
            color={darkMode ? "light" : "primary"}
            outline
            size="md"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              minWidth: 100,
              fontWeight: "bold",
              fontSize: 18,
              borderRadius: 12,
              background: darkMode ? "#23272b" : undefined,
              color: darkMode ? "#ffd666" : undefined,
              borderColor: darkMode ? "#ffd666" : undefined,
            }}
            {...btnAnim}
          >
            بعدی
          </Button>
        </div>
      </div>
      {darkMode && (
        <style>
          {`
          body, .container {
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
        </style>
      )}

      <DepartmentFormModal
        isOpen={modalOpen}
        toggle={toggleModal}
        onSubmit={handleSubmitForm}
        initialValues={currentDepartment || { depName: "", buildingId: "" }}
        isEdit={isEditMode}
      />
    </div>
  );
};

export default Department;