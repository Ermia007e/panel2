import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { fetchComments, deleteComment, acceptComment, rejectComment } from "../../services/api/Comment/getComment"
import { Table, Spinner, Badge, Button, Modal, ModalBody, ModalFooter } from "reactstrap"
import gsap from "gsap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FiMoreVertical } from "react-icons/fi"

function AnimatedModal({ isOpen, children, ...props }) {
  const modalRef = useRef()
  useLayoutEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.7)" }
      )
    }
  }, [isOpen])
  return (
    <Modal isOpen={isOpen} innerRef={modalRef} {...props} style={{ zIndex: 9999 }}>
      {children}
    </Modal>
  )
}

export default function Comment() {
  const [page, setPage] = useState(1)
  const rowsRef = useRef([])
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [modal, setModal] = useState({ open: false, type: "", comment: null })
  const queryClient = useQueryClient()
  const containerRef = useRef()
  const titleRef = useRef()
  const boxRef = useRef()

  const { data, isLoading } = useQuery({
    queryKey: ["comments", page],
    queryFn: fetchComments,
    keepPreviousData: true,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: (res) => {
      if (res?.data?.success === false) {
        toast.error(res?.data?.message || "حذف کامنت با خطا مواجه شد.")
      } else {
        toast.success("کامنت با موفقیت حذف شد.")
        queryClient.invalidateQueries({ queryKey: ["comments"] })
        closeModal()
      }
    },
    onError: () => toast.error("حذف کامنت با خطا مواجه شد.")
  })
  const acceptMutation = useMutation({
    mutationFn: acceptComment,
    onSuccess: (res) => {
      if (res?.data?.success === false) {
        toast.error(res?.data?.message || "تایید کامنت با خطا مواجه شد.")
      } else {
        toast.success("کامنت تایید شد.")
        queryClient.invalidateQueries({ queryKey: ["comments"] })
        closeModal()
      }
    },
    onError: () => toast.error("تایید کامنت با خطا مواجه شد.")
  })
  const rejectMutation = useMutation({
    mutationFn: rejectComment,
    onSuccess: (res) => {
      if (res?.data?.success === false) {
        toast.error(res?.data?.message || "رد کامنت با خطا مواجه شد.")
      } else {
        toast.success("کامنت رد شد.")
        queryClient.invalidateQueries({ queryKey: ["comments"] })
        closeModal()
      }
    },
    onError: () => toast.error("رد کامنت با خطا مواجه شد.")
  })

  useLayoutEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      )
    }
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -40 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: "power3.out" }
      )
    }
    if (boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.7, delay: 0.35, ease: "back.out(1.7)" }
      )
    }
  }, [])

  useEffect(() => {
    if (!isLoading && data?.users?.length) {
      gsap.fromTo(
        rowsRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" }
      )
    }
  }, [data, isLoading])

  useEffect(() => {
    const close = () => setDropdownOpen(null)
    if (dropdownOpen !== null) {
      window.addEventListener("click", close)
      return () => window.removeEventListener("click", close)
    }
  }, [dropdownOpen])

  const animateDropdown = (el, show, up = false) => {
    if (!el) return
    if (show) {
      gsap.fromTo(
        el,
        { opacity: 0, y: up ? 20 : -20, scale: 0.9, display: "block" },
        { opacity: 1, y: 0, scale: 1.05, duration: 0.35, display: "block", ease: "back.out(1.7)" }
      )
    } else {
      gsap.to(el, { opacity: 0, y: up ? 20 : -20, scale: 0.9, duration: 0.2, display: "none", ease: "power2.in" })
    }
  }

  const openModal = (type, comment) => setModal({ open: true, type, comment })
  const closeModal = () => setModal({ open: false, type: "", comment: null })

  const handleAction = () => {
    if (!modal.comment) return
    const id = modal.comment.commentId
    if (modal.type === "delete") deleteMutation.mutate(id)
    if (modal.type === "accept") acceptMutation.mutate(id)
    if (modal.type === "reject") rejectMutation.mutate(id)
  }

  const btnAnim = {
    onMouseEnter: e => gsap.to(e.currentTarget, { scale: 1.08, boxShadow: "0 0 12px #1890ff55", duration: 0.18 }),
    onMouseLeave: e => gsap.to(e.currentTarget, { scale: 1, boxShadow: "none", duration: 0.18 }),
    onMouseDown: e => gsap.to(e.currentTarget, { scale: 0.93, duration: 0.1 }),
    onMouseUp: e => gsap.to(e.currentTarget, { scale: 1, duration: 0.1 }),
  }

  return (
    <div ref={containerRef} className="container py-4" style={{
      maxWidth: 1200,
      fontFamily: "Vazirmatn, Tahoma, Arial"
    }}>
      <ToastContainer rtl position="top-center" />
      <h2
        ref={titleRef}
        className="text-center mb-4 fw-bold text-primary"
        style={{
          letterSpacing: 1.5,
          fontSize: 32
        }}
      >
        لیست کامنت‌ها
      </h2>
      <div
        ref={boxRef}
        className="bg-white rounded-4 shadow-sm p-3 p-md-4"
        style={{
          overflowX: "auto",
          overflowY: "visible"
        }}
      >
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        ) : (
          <div className="table-responsive">
            <Table bordered hover className="align-middle text-center" style={{
              borderRadius: 16,
              fontSize: 16,
              minWidth: 900,
              background: "#f6faff"
            }}>
              <thead className="table-light">
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
                {data?.users?.map((c, i) => {
                  const isLast = i === data.users.length - 1
                  return (
                    <tr
                      key={c.commentId}
                      ref={el => (rowsRef.current[i] = el)}
                      style={{
                        background: i % 2 === 0 ? "#fafdff" : "#f3f7fa",
                        transition: "background 0.3s, box-shadow 0.3s",
                        borderRadius: 12,
                        boxShadow: "0 2px 8px rgba(24,144,255,0.04)",
                        cursor: "pointer"
                      }}
                      onMouseEnter={e => {
                        gsap.to(e.currentTarget, { background: "#e6f7ff", scale: 1.01, boxShadow: "0 4px 16px #91d5ff55", duration: 0.2 })
                      }}
                      onMouseLeave={e => {
                        gsap.to(e.currentTarget, { background: i % 2 === 0 ? "#fafdff" : "#f3f7fa", scale: 1, boxShadow: "0 2px 8px rgba(24,144,255,0.04)", duration: 0.2 })
                      }}
                    >
                      <td style={{ fontWeight: "bold" }}>{(page - 1) * 10 + i + 1}</td>
                      <td>
                        <span
                          style={{ fontWeight: "bold", cursor: "pointer", transition: "color 0.2s" }}
                          onMouseEnter={e => gsap.to(e.currentTarget, { color: "#52c41a", scale: 1.08, duration: 0.2 })}
                          onMouseLeave={e => gsap.to(e.currentTarget, { color: "#222", scale: 1, duration: 0.2 })}
                        >
                          {c.userFullName}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{ fontWeight: "bold", cursor: "pointer", transition: "color 0.2s" }}
                          onMouseEnter={e => gsap.to(e.currentTarget, { color: "#1890ff", scale: 1.05, duration: 0.2 })}
                          onMouseLeave={e => gsap.to(e.currentTarget, { color: "#222", scale: 1, duration: 0.2 })}
                        >
                          {c.courseTitle}
                        </span>
                      </td>
                      <td style={{ maxWidth: 200, wordBreak: "break-word" }}>
                        <div
                          style={{
                            borderRadius: 8,
                            padding: "8px 14px",
                            background: "#f7f7fa",
                            minWidth: 120,
                            fontSize: 15,
                            transition: "background 0.2s"
                          }}
                          onMouseEnter={e => gsap.to(e.currentTarget, { background: "#f6ffed", scale: 1.04, duration: 0.2 })}
                          onMouseLeave={e => gsap.to(e.currentTarget, { background: "#f7f7fa", scale: 1, duration: 0.2 })}
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
                          style={{ fontWeight: "bold", transition: "color 0.2s" }}
                          onMouseEnter={e => gsap.to(e.currentTarget, { color: "#52c41a", scale: 1.15, duration: 0.2 })}
                          onMouseLeave={e => gsap.to(e.currentTarget, { color: "#222", scale: 1, duration: 0.2 })}
                        >
                          👍 {c.likeCount}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{ fontWeight: "bold", transition: "color 0.2s" }}
                          onMouseEnter={e => gsap.to(e.currentTarget, { color: "#ff4d4f", scale: 1.15, duration: 0.2 })}
                          onMouseLeave={e => gsap.to(e.currentTarget, { color: "#222", scale: 1, duration: 0.2 })}
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
                            e.stopPropagation()
                            setDropdownOpen(dropdownOpen === i ? null : i)
                          }}
                          onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.18, rotate: 18, duration: 0.18 })}
                          onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, rotate: 0, duration: 0.18 })}
                        >
                          <FiMoreVertical size={26} style={{ cursor: "pointer" }} />
                        </div>
                        {dropdownOpen === i && (
                          <div
                            ref={el => {
                              if (el) animateDropdown(el, dropdownOpen === i, isLast)
                            }}
                            className="position-absolute bg-white border rounded shadow-sm"
                            style={{
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
                              onMouseEnter={e => gsap.to(e.currentTarget, { background: "#fff1f0", scale: 1.05, duration: 0.15 })}
                              onMouseLeave={e => gsap.to(e.currentTarget, { background: "#fff", scale: 1, duration: 0.15 })}
                            >
                              حذف
                            </div>
                            <div
                              className="py-2 px-3 text-success fw-bold"
                              style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
                              onClick={() => { setDropdownOpen(null); openModal("accept", c) }}
                              onMouseEnter={e => gsap.to(e.currentTarget, { background: "#f6ffed", scale: 1.05, duration: 0.15 })}
                              onMouseLeave={e => gsap.to(e.currentTarget, { background: "#fff", scale: 1, duration: 0.15 })}
                            >
                              تایید
                            </div>
                            <div
                              className="py-2 px-3 text-warning fw-bold"
                              style={{ cursor: "pointer" }}
                              onClick={() => { setDropdownOpen(null); openModal("reject", c) }}
                              onMouseEnter={e => gsap.to(e.currentTarget, { background: "#fffbe6", scale: 1.05, duration: 0.15 })}
                              onMouseLeave={e => gsap.to(e.currentTarget, { background: "#fff", scale: 1, duration: 0.15 })}
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
        )}
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
          <Button
            color="primary"
            outline
            size="md"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            style={{ minWidth: 100, fontWeight: "bold", fontSize: 18, borderRadius: 12 }}
            {...btnAnim}
          >
            قبلی
          </Button>
          <span className="fw-bold px-3 py-2 bg-light rounded" style={{
            fontSize: 18,
            minWidth: 120,
            textAlign: "center"
          }}>
            صفحه {page} از {Math.ceil((data?.total || 0) / 10) || 1}
          </span>
          <Button
            color="primary"
            outline
            size="md"
            disabled={page >= Math.ceil((data?.total || 0) / 10)}
            onClick={() => setPage(p => p + 1)}
            style={{ minWidth: 100, fontWeight: "bold", fontSize: 18, borderRadius: 12 }}
            {...btnAnim}
          >
            بعدی
          </Button>
        </div>
      </div>
      <AnimatedModal isOpen={modal.open} toggle={closeModal} centered>
        <ModalBody className="text-center fs-5">
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
        <ModalFooter>
          <Button color="secondary" onClick={closeModal} {...btnAnim}>انصراف</Button>
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
    </div>
  )
}