import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import http from '@src/services/interceptor'
import { Card, CardBody, Row, Col, Spinner, Badge } from 'reactstrap'
import gsap from 'gsap'
import DeleteModal from './DeleteModal'
import classnames from 'classnames'
import { useSelector } from 'react-redux'

const useDarkMode = () => {
  const skin = useSelector(state => state.layout?.skin)
  return skin === 'dark'
}

const UserDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const darkMode = useDarkMode()
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const cardRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    http.get(`/Home/GetTeachers`, { params: { PageNumber: 1, RowsOFPage: 100, isActiveUser: true } })
      .then(res => {
        const found = (res.data?.listUser || []).find(t => String(t.teacherId) === String(id))
        setTeacher(found)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!teacher) return
    gsap.fromTo(cardRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
    gsap.fromTo(imgRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, delay: 0.2, ease: "back.out(1.7)" })
  }, [teacher])

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      const res = await http.post('/User/DeleteUser', { id: teacher.teacherId })
      if (res.data && (res.data.success || res.data.status === 'success')) {
        setDeleteModalOpen(false)
        navigate('/teachers')
      }
    } catch (err) {}
    setDeleting(false)
  }

  // استایل‌های دارک‌مد
  const darkCard = {
    background: 'linear-gradient(135deg, #23272b 60%, #18191a 100%)',
    color: '#e4e6eb',
    boxShadow: '0 8px 32px #0008',
    border: 'none'
  }
  const darkBtnDelete = {
    background: '#a61d24',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 32px',
    fontWeight: 'bold',
    fontSize: 16,
    cursor: deleting ? 'not-allowed' : 'pointer',
    opacity: deleting ? 0.7 : 1,
    boxShadow: '0 2px 8px #a61d2433',
    transition: 'background 0.2s, color 0.2s, transform 0.2s'
  }
  const darkBtnAccess = {
    background: '#1765ad',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 32px',
    fontWeight: 'bold',
    fontSize: 16,
    cursor: 'pointer',
    boxShadow: '0 2px 8px #1765ad33',
    transition: 'background 0.2s, color 0.2s, transform 0.2s'
  }
  const darkLink = {
    color: "#ffd666",
    textDecoration: "underline"
  }

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}><Spinner color="primary" /></div>
  if (!teacher) return <div className="text-center text-danger mt-4">معلم یافت نشد</div>

  return (
    <>
      <DeleteModal
        open={deleteModalOpen}
        user={teacher}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
      <Card
        ref={cardRef}
        style={{
          maxWidth: 600,
          margin: '40px auto',
          borderRadius: 22,
          boxShadow: darkMode ? '0 8px 32px #0008' : '0 8px 32px #0002',
          overflow: 'hidden',
          ...(darkMode ? darkCard : {
            background: 'linear-gradient(135deg, #f8fafc 60%, #e3e8ff 100%)'
          })
        }}>
        <CardBody>
          <Row className="mb-3">
            <Col xs="12" className="text-center position-relative">
              <img
                ref={imgRef}
                src={teacher.pictureAddress ? teacher.pictureAddress.replace(/\\/g, "/") : "https://tanzolymp.com/images/default-non-user-no-photo-1.jpg"}
                alt="profile"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #fff',
                  boxShadow: '0 2px 16px #7367f055',
                  background: '#fff'
                }}
                onError={e => { e.target.src = "https://tanzolymp.com/images/default-non-user-no-photo-1.jpg" }}
              />
              <div style={{ marginTop: 16 }}>
                <h3 style={{ fontWeight: 900, letterSpacing: 1, color: darkMode ? "#ffd666" : undefined }}>{teacher.fullName}</h3>
              </div>
              <div className="d-flex justify-content-center gap-2 mt-3">
                <button
                  style={darkMode ? darkBtnDelete : {
                    background: '#ff4d4f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 32px',
                    fontWeight: 'bold',
                    fontSize: 16,
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    opacity: deleting ? 0.7 : 1,
                    boxShadow: '0 2px 8px #ff4d4f33',
                    transition: 'background 0.2s, color 0.2s, transform 0.2s'
                  }}
                  onClick={() => setDeleteModalOpen(true)}
                  disabled={deleting}
                >
                  حذف
                </button>
                <button
                  style={darkMode ? darkBtnAccess : {
                    background: '#1890ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 32px',
                    fontWeight: 'bold',
                    fontSize: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #1890ff33',
                    transition: 'background 0.2s, color 0.2s, transform 0.2s'
                  }}
                  onClick={() => window.handleAccessUser && window.handleAccessUser(teacher)}
                >
                  دسترسی
                </button>
              </div>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md="6"><b>تعداد دوره‌ها:</b> <span style={darkMode ? { color: "#ffd666" } : {}}>{teacher.courseCounts}</span></Col>
            <Col md="6"><b>تعداد اخبار:</b> <span style={darkMode ? { color: "#ffd666" } : {}}>{teacher.newsCount}</span></Col>
          </Row>
          <Row className="mb-2">
            <Col md="12">
              <b>لینکدین:</b>{' '}
              {teacher.linkdinProfileLink
                ? <a href={teacher.linkdinProfileLink} target="_blank" rel="noopener noreferrer" style={darkMode ? darkLink : {}}>{teacher.linkdinProfileLink}</a>
                : <span style={{ color: "#888" }}>—</span>
              }
            </Col>
          </Row>
        </CardBody>
      </Card>
      {darkMode && (
        <style>
          {`
          .card {
            background: linear-gradient(135deg, #23272b 60%, #18191a 100%) !important;
            color: #e4e6eb !important;
            border: none !important;
          }
          .card h3, .card b, .card span {
            color: #ffd666 !important;
          }
          `}
        </style>
      )}
    </>
  )
}

export default UserDetails