import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchComments, deleteComment, acceptComment, rejectComment } from "../../services/api/Comment/getComment";
import { Table, Spinner, Badge, Button, Modal, ModalBody, ModalFooter, Input, Card, CardBody, CardTitle, CardText } from "reactstrap";
import gsap from "gsap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiMoreVertical, FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";

function useDarkMode() {
  const skin = useSelector(state => state.layout?.skin);
  return skin === "dark";
}

function AnimatedModal({ isOpen, children, ...props }) {
  const modalRef = useRef();
  useLayoutEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} innerRef={modalRef} {...props} centered style={{ zIndex: 9999 }}>
      {children}
    </Modal>
  );
}

export default function Comment() {
  const darkMode = useDarkMode();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsRef = useRef([]); 
  const cardsRef = useRef({}); 
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modal, setModal] = useState({ open: false, type: "", comment: null });
  const queryClient = useQueryClient();
  const containerRef = useRef();
  const titleRef = useRef();
  const boxRef = useRef();

  const itemsPerPage = 10; 
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
    keepPreviousData: true,
    onError: (err) => {
      toast.error("خطا در بارگذاری لیست کامنت‌ها: " + err.message);
      console.error("Error fetching comments:", err);
    }
  });
  console.log("Data from fetchComments:", data);
  const allComments = Array.isArray(data) ? data : (data?.comments || data?.users || []); 
  const filteredComments = allComments.filter(c =>
    c.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.describe?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const commentsToDisplay = filteredComments.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalComments = filteredComments.length;
  const totalPages = Math.ceil(totalComments / itemsPerPage);

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: (res) => {
      if (res?.data?.success === false) {
        toast.error(res?.data?.message || "حذف کامنت با خطا مواجه شد.");
      } else {
        toast.success("کامنت با موفقیت حذف شد.");
        queryClient.invalidateQueries({ queryKey: ["comments"] }); 
        closeModal();
      }
    },
    onError: () => toast.error("حذف کامنت با خطا مواجه شد.")
  });

  const acceptMutation = useMutation({
    mutationFn: acceptComment,
    onSuccess: (res) => {
      if (res?.data?.success === false) {
        toast.error(res?.data?.message || "تایید کامنت با خطا مواجه شد.");
      } else {
        toast.success("کامنت تایید شد.");
        queryClient.invalidateQueries({ queryKey: ["comments"] });
        closeModal();
      }
    },
    onError: () => toast.error("تایید کامنت با خطا مواجه شد.")
  });

  const rejectMutation = useMutation({
    mutationFn: rejectComment,
    onSuccess: (res) => {
      if (res?.data?.success === false) {
        toast.error(res?.data?.message || "رد کامنت با خطا مواجه شد.");
      } else {
        toast.success("کامنت رد شد.");
        queryClient.invalidateQueries({ queryKey: ["comments"] });
        closeModal();
      }
    },
    onError: () => toast.error("رد کامنت با خطا مواجه شد.")
  });

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
    if (!isLoading && commentsToDisplay.length) {
      if (window.innerWidth > 768) {
        const currentRows = commentsToDisplay.map((_, i) => rowsRef.current[i]).filter(Boolean);
        gsap.fromTo(
          currentRows,
          { opacity: 0, y: 40, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" }
        );
      }
      else {
        const currentCards = commentsToDisplay.map(c => cardsRef.current[c.commentId]).filter(Boolean);
        gsap.fromTo(currentCards, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" });
      }
    }
  }, [commentsToDisplay, isLoading]);
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
      gsap.to(el, { opacity: 0, y: up ? 20 : -20, scale: 0.9, duration: 0.2, display: "none", ease: "power2.in" });
    }
  };

  const openModal = (type, comment) => setModal({ open: true, type, comment });
  const closeModal = () => setModal({ open: false, type: "", comment: null });

  const handleAction = () => {
    if (!modal.comment) return;
    const id = modal.comment.commentId;
    if (modal.type === "delete") deleteMutation.mutate(id);
    if (modal.type === "accept") acceptMutation.mutate(id);
    if (modal.type === "reject") rejectMutation.mutate(id);
  };

  const btnAnim = {
    onMouseEnter: e => gsap.to(e.currentTarget, { scale: 1.08, boxShadow: "0 0 12px #1890ff55", duration: 0.18 }),
    onMouseLeave: e => gsap.to(e.currentTarget, { scale: 1, boxShadow: "none", duration: 0.18 }),
    onMouseDown: e => gsap.to(e.currentTarget, { scale: 0.93, duration: 0.1 }),
    onMouseUp: e => gsap.to(e.currentTarget, { scale: 1, duration: 0.1 }),
  };

  const darkBox = {
    background: "linear-gradient(135deg, #23272b 60%, #18191a 100%)",
    color: "#e4e6eb",
    borderRadius: 24,
    boxShadow: "0 8px 32px #0008"
  };
  const darkTable = {
    background: "#23272b",
    color: "#e4e6eb",
    borderRadius: 16,
    minWidth: 900
  };
  const darkThead = {
    background: "#18191a",
    color: "#ffd666"
  };
  const darkDropdown = {
    background: "#23272b",
    color: "#ffd666",
    border: "1px solid #333"
  };

  return (
    <div ref={containerRef} className="container py-4 px-3" style={{
      maxWidth: 1200,
      fontFamily: "Vazirmatn, Tahoma, Arial"
    }}>
      <ToastContainer rtl position="top-center" theme={darkMode ? "dark" : "light"} />
      <h2
        ref={titleRef}
        className="text-center mb-4 fw-bold"
        style={{
          letterSpacing: 1.5,
          fontSize: 32,
          color: darkMode ? "#ffd666" : "#1890ff"
        }}
      >
        لیست کامنت‌ها
      </h2>
      <div
        ref={boxRef}
        className="card shadow-sm p-3 p-md-4"
        style={darkMode ? darkBox : {
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 8px 32px #0002"
        }}
      >
        {/* نوار جستجو */}
        <div className="mb-4 position-relative">
          <Input
            type="text"
            className="form-control rounded-3"
            placeholder="جستجو بر اساس نام کاربر یا عنوان دوره یا متن کامنت..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); 
            }}
            style={{ borderRadius: 12, paddingRight: "45px", paddingLeft: "15px", border: darkMode ? "1px solid #333" : "1px solid #ddd", background: darkMode ? "#18191a" : "#fff", color: darkMode ? "#e4e6eb" : "#222", fontSize: 16 }}
          />
          <FiSearch size={20} style={{ position: "absolute", right: '15px', top: '50%', transform: 'translateY(-50%)', color: darkMode ? "#aaa" : "#555" }} />
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-5 text-danger">
            <p>خطا در بارگذاری کامنت‌ها: {error?.message || "خطای ناشناخته"}</p>
          </div>
        ) : commentsToDisplay.length === 0 ? (
          <div className="text-center py-5">
            <p className={darkMode ? "text-white-50" : "text-muted"}>هیچ کامنتی برای نمایش وجود ندارد.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive d-none d-md-block">
              <Table bordered hover className="align-middle text-center" style={darkMode ? darkTable : {
                borderRadius: 16,
                fontSize: 16,
                minWidth: 900,
                background: "#f6faff"
              }}>
                <thead style={darkMode ? darkThead : {}}>
                  <tr>
                    <th>#</th>
                    <th>نام کاربر</th>
                    <th>عنوان دوره</th>
                    <th>متن کامنت</th>
                    <th>تایید</th>
                    <th>لایک</th>
                    <th>دیس‌لایک</th>
                    <th>ریپلای</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {commentsToDisplay.map((c, i) => {
                    const isLast = i === commentsToDisplay.length - 1;
                    return (
                      <tr
                        key={c.commentId}
                        ref={el => (rowsRef.current[i] = el)}
                        style={darkMode ? {
                          background: i % 2 === 0 ? "#23272b" : "#23272b",
                          transition: "background 0.3s, box-shadow 0.3s",
                          borderRadius: 12,
                          boxShadow: "0 2px 8px #0004",
                          cursor: "pointer"
                        } : {
                          background: i % 2 === 0 ? "#fafdff" : "#f3f7fa",
                          transition: "background 0.3s, box-shadow 0.3s",
                          borderRadius: 12,
                          boxShadow: "0 2px 8px rgba(24,144,255,0.04)",
                          cursor: "pointer"
                        }}
                        onMouseEnter={e => {
                          gsap.to(e.currentTarget, { background: darkMode ? "#18191a" : "#e6f7ff", scale: 1.01, boxShadow: darkMode ? "0 4px 16px #ffd66633" : "0 4px 16px #91d5ff55", duration: 0.2 })
                        }}
                        onMouseLeave={e => {
                          gsap.to(e.currentTarget, { background: darkMode ? "#23272b" : (i % 2 === 0 ? "#fafdff" : "#f3f7fa"), scale: 1, boxShadow: darkMode ? "0 2px 8px #0004" : "0 2px 8px rgba(24,144,255,0.04)", duration: 0.2 })
                        }}
                      >
                        <td style={{ fontWeight: "bold" }}>{(page - 1) * itemsPerPage + i + 1}</td>
                        <td>
                          <span
                            style={{ fontWeight: "bold", cursor: "pointer", transition: "color 0.2s", color: darkMode ? "#ffd666" : "#222" }}
                            onMouseEnter={e => gsap.to(e.currentTarget, { color: "#52c41a", scale: 1.08, duration: 0.2 })}
                            onMouseLeave={e => gsap.to(e.currentTarget, { color: darkMode ? "#ffd666" : "#222", scale: 1, duration: 0.2 })}
                          >
                            {c.userFullName}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{ fontWeight: "bold", cursor: "pointer", transition: "color 0.2s", color: darkMode ? "#ffd666" : "#222" }}
                            onMouseEnter={e => gsap.to(e.currentTarget, { color: "#1890ff", scale: 1.05, duration: 0.2 })}
                            onMouseLeave={e => gsap.to(e.currentTarget, { color: darkMode ? "#ffd666" : "#222", scale: 1, duration: 0.2 })}
                          >
                            {c.courseTitle}
                          </span>
                        </td>
                        <td style={{ maxWidth: 200, wordBreak: "break-word" }}>
                          <div
                            style={{
                              borderRadius: 8,
                              padding: "8px 14px",
                              background: darkMode ? "#18191a" : "#f7f7fa",
                              minWidth: 120,
                              fontSize: 15,
                              color: darkMode ? "#ffd666" : "#222",
                              transition: "background 0.2s"
                            }}
                            onMouseEnter={e => gsap.to(e.currentTarget, { background: darkMode ? "#23272b" : "#f6ffed", scale: 1.04, duration: 0.2 })}
                            onMouseLeave={e => gsap.to(e.currentTarget, { background: darkMode ? "#18191a" : "#f7f7fa", scale: 1, duration: 0.2 })}
                          >
                            {c.describe}
                          </div>
                        </td>
                        <td>
                          {c.accept
                            ? <Badge color="success" style={{ fontSize: 15 }}>تایید</Badge>
                            : <Badge color="danger" style={{ fontSize: 15 }}>رد</Badge>
                          }
                        </td>
                        <td>
                          <span
                            style={{ fontWeight: "bold", transition: "color 0.2s", color: darkMode ? "#ffd666" : "#222" }}
                            onMouseEnter={e => gsap.to(e.currentTarget, { color: "#52c41a", scale: 1.15, duration: 0.2 })}
                            onMouseLeave={e => gsap.to(e.currentTarget, { color: darkMode ? "#ffd666" : "#222", scale: 1, duration: 0.2 })}
                          >
                            👍 {c.likeCount}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{ fontWeight: "bold", transition: "color 0.2s", color: darkMode ? "#ffd666" : "#222" }}
                            onMouseEnter={e => gsap.to(e.currentTarget, { color: "#ff4d4f", scale: 1.15, duration: 0.2 })}
                            onMouseLeave={e => gsap.to(e.currentTarget, { color: darkMode ? "#ffd666" : "#222", scale: 1, duration: 0.2 })}
                          >
                            👎 {c.dislikeCount}
                          </span>
                        </td>
                        <td>
                          <Badge color="info" style={{ fontSize: 15 }}>{c.replyCount}</Badge>
                        </td>
                        <td style={{ position: "relative", width: 60 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%"
                            }}
                            onClick={e => {
                              e.stopPropagation();
                              setDropdownOpen(dropdownOpen === i ? null : i);
                            }}
                            onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.18, rotate: 18, duration: 0.18 })}
                            onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, rotate: 0, duration: 0.18 })}
                          >
                            <FiMoreVertical size={26} style={{ cursor: "pointer", color: darkMode ? "#ffd666" : "#222" }} />
                          </div>
                          {dropdownOpen === i && (
                            <div
                              ref={el => {
                                if (el) animateDropdown(el, dropdownOpen === i, isLast)
                              }}
                              className="position-absolute border rounded shadow-sm"
                              style={{
                                ...(darkMode ? darkDropdown : { background: "#fff", color: "#222" }),
                                left: "50%",
                                ...(isLast
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
                              onClick={e => e.stopPropagation()}
                            >
                              <div
                                className="py-2 px-3 text-danger fw-bold"
                                style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
                                onClick={() => { setDropdownOpen(null); openModal("delete", c) }}
                                onMouseEnter={e => gsap.to(e.currentTarget, { background: darkMode ? "#2a1a1a" : "#fff1f0", scale: 1.05, duration: 0.15 })}
                                onMouseLeave={e => gsap.to(e.currentTarget, { background: darkMode ? "#23272b" : "#fff", scale: 1, duration: 0.15 })}
                              >
                                حذف
                              </div>
                              <div
                                className="py-2 px-3 text-success fw-bold"
                                style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
                                onClick={() => { setDropdownOpen(null); openModal("accept", c) }}
                                onMouseEnter={e => gsap.to(e.currentTarget, { background: darkMode ? "#1a2a1a" : "#f6ffed", scale: 1.05, duration: 0.15 })}
                                onMouseLeave={e => gsap.to(e.currentTarget, { background: darkMode ? "#23272b" : "#fff", scale: 1, duration: 0.15 })}
                              >
                                تایید
                              </div>
                              <div
                                className="py-2 px-3 text-warning fw-bold"
                                style={{ cursor: "pointer" }}
                                onClick={() => { setDropdownOpen(null); openModal("reject", c) }}
                                onMouseEnter={e => gsap.to(e.currentTarget, { background: darkMode ? "#2a2a1a" : "#fffbe6", scale: 1.05, duration: 0.15 })}
                                onMouseLeave={e => gsap.to(e.currentTarget, { background: darkMode ? "#23272b" : "#fff", scale: 1, duration: 0.15 })}
                              >
                                رد
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>

            <div className="d-block d-md-none">
              <div className="row row-cols-1 g-3">
                {commentsToDisplay.map((c, i) => (
                  <div key={c.commentId} className="col">
                    <Card
                      ref={el => (cardsRef.current[c.commentId] = el)}
                      className="shadow-sm border-0"
                      style={darkMode ? darkBox : { background: "#fff", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    >
                      <CardBody>
                        <CardTitle tag="h5" className="d-flex justify-content-between align-items-center mb-3" style={{ color: darkMode ? "#ffd666" : "#1890ff" }}>
                          {c.userFullName}
                          <div style={{ position: "relative" }}>
                            <div
                              onClick={e => {
                                e.stopPropagation();
                                setDropdownOpen(dropdownOpen === i ? null : i);
                              }}
                              onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.18, rotate: 18, duration: 0.18 })}
                              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, rotate: 0, duration: 0.18 })}
                            >
                              <FiMoreVertical size={24} style={{ cursor: "pointer", color: darkMode ? "#ffd666" : "#222" }} />
                            </div>
                            {dropdownOpen === i && (
                              <div
                                ref={el => {
                                  if (el) animateDropdown(el, dropdownOpen === i, true) 
                                }}
                                className="position-absolute border rounded shadow-sm"
                                style={{
                                  ...(darkMode ? darkDropdown : { background: "#fff", color: "#222" }),
                                  left: "50%",
                                  bottom: 36,
                                  minWidth: 120,
                                  zIndex: 3000,
                                  padding: 0,
                                  opacity: 0,
                                  pointerEvents: dropdownOpen === i ? "auto" : "none",
                                  display: dropdownOpen === i ? "block" : "none",
                                  transform: "translateX(-50%)"
                                }}
                                onClick={e => e.stopPropagation()}
                              >
                                <div
                                  className="py-2 px-3 text-danger fw-bold"
                                  style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
                                  onClick={() => { setDropdownOpen(null); openModal("delete", c) }}
                                  onMouseEnter={e => gsap.to(e.currentTarget, { background: darkMode ? "#2a1a1a" : "#fff1f0", scale: 1.05, duration: 0.15 })}
                                  onMouseLeave={e => gsap.to(e.currentTarget, { background: darkMode ? "#23272b" : "#fff", scale: 1, duration: 0.15 })}
                                >
                                  حذف
                                </div>
                                <div
                                  className="py-2 px-3 text-success fw-bold"
                                  style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
                                  onClick={() => { setDropdownOpen(null); openModal("accept", c) }}
                                  onMouseEnter={e => gsap.to(e.currentTarget, { background: darkMode ? "#1a2a1a" : "#f6ffed", scale: 1.05, duration: 0.15 })}
                                  onMouseLeave={e => gsap.to(e.currentTarget, { background: darkMode ? "#23272b" : "#fff", scale: 1, duration: 0.15 })}
                                >
                                  تایید
                                </div>
                                <div
                                  className="py-2 px-3 text-warning fw-bold"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => { setDropdownOpen(null); openModal("reject", c) }}
                                  onMouseEnter={e => gsap.to(e.currentTarget, { background: darkMode ? "#2a2a1a" : "#fffbe6", scale: 1.05, duration: 0.15 })}
                                  onMouseLeave={e => gsap.to(e.currentTarget, { background: darkMode ? "#23272b" : "#fff", scale: 1, duration: 0.15 })}
                                >
                                  رد
                                </div>
                              </div>
                            )}
                          </div>
                        </CardTitle>
                        <CardText>
                          <small className={darkMode ? "text-white-50" : "text-muted"}>عنوان دوره:</small>{" "}
                          <span className="fw-bold" style={{ color: darkMode ? "#e4e6eb" : "#222" }}>{c.courseTitle}</span>
                        </CardText>
                        <CardText className="mb-3">
                          <small className={darkMode ? "text-white-50" : "text-muted"}>متن کامنت:</small>{" "}
                          <div
                            className="p-2 rounded"
                            style={{ background: darkMode ? "#18191a" : "#f7f7fa", color: darkMode ? "#ffd666" : "#222", wordBreak: "break-word" }}
                          >
                            {c.describe}
                          </div>
                        </CardText>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                          <Badge color={c.accept ? "success" : "danger"} style={{ fontSize: 14 }}>
                            {c.accept ? "تایید شده" : "رد شده"}
                          </Badge>
                          <div>
                            <span className="me-3" style={{ color: darkMode ? "#e4e6eb" : "#222", fontSize: 14 }}>
                              👍 {c.likeCount}
                            </span>
                            <span className="me-3" style={{ color: darkMode ? "#e4e6eb" : "#222", fontSize: 14 }}>
                              👎 {c.dislikeCount}
                            </span>
                            <Badge color="info" style={{ fontSize: 14 }}>
                              پاسخ‌ها: {c.replyCount}
                            </Badge>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
          <Button
            color={darkMode ? "light" : "primary"}
            outline
            size="md"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            style={{
              minWidth: 100,
              fontWeight: "bold",
              fontSize: 18,
              borderRadius: 12,
              background: darkMode ? "#23272b" : undefined,
              color: darkMode ? "#ffd666" : undefined,
              borderColor: darkMode ? "#ffd666" : undefined
            }}
            {...btnAnim}
          >
            قبلی
          </Button>
          <span className="fw-bold px-3 py-2 rounded" style={{
            fontSize: 18,
            minWidth: 120,
            textAlign: "center",
            background: darkMode ? "#18191a" : "#f6faff",
            color: darkMode ? "#ffd666" : "#222"
          }}>
            صفحه {page} از {totalPages || 1}
          </span>
          <Button
            color={darkMode ? "light" : "primary"}
            outline
            size="md"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            style={{
              minWidth: 100,
              fontWeight: "bold",
              fontSize: 18,
              borderRadius: 12,
              background: darkMode ? "#23272b" : undefined,
              color: darkMode ? "#ffd666" : undefined,
              borderColor: darkMode ? "#ffd666" : undefined
            }}
            {...btnAnim}
          >
            بعدی
          </Button>
        </div>
      </div>

      <AnimatedModal isOpen={modal.open} toggle={closeModal}>
        <ModalBody className="text-center fs-5" style={darkMode ? { background: "#23272b", color: "#ffd666" } : {}}>
          {modal.type === "delete" && (
            <>آیا مطمئن هستید که می‌خواهید این کامنت را <span className="text-danger fw-bold">حذف</span> کنید؟</>
          )}
          {modal.type === "accept" && (
            <>آیا مطمئن هستید که می‌خواهید این کامنت را <span className="text-success fw-bold">تایید</span> کنید؟</>
          )}
          {modal.type === "reject" && (
            <>آیا مطمئن هستید که می‌خواهید این کامنت را <span className="text-warning fw-bold">رد</span> کنید؟</>
          )}
        </ModalBody>
        <ModalFooter style={darkMode ? { background: "#18191a", borderTop: "1px solid #333" } : {}}>
          <Button color={darkMode ? "secondary" : "secondary"} onClick={closeModal} {...btnAnim}>انصراف</Button>
          <Button
            color={
              modal.type === "delete" ? "danger" :
              modal.type === "accept" ? "success" :
              "warning"
            }
            onClick={handleAction}
            disabled={deleteMutation.isLoading || acceptMutation.isLoading || rejectMutation.isLoading}
            {...btnAnim}
          >
            تایید
          </Button>
        </ModalFooter>
      </AnimatedModal>
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
    </div>
  );
}