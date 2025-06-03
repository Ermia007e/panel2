import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import http from '@src/services/interceptor'
import { Card, CardBody, Row, Col, Spinner, Badge, Progress, Nav, NavItem, NavLink, TabContent, TabPane, Table } from 'reactstrap'
import Chart from 'react-apexcharts'
import { toast } from 'react-hot-toast'
import DeleteModal from './DeleteModal'
import gsap from 'gsap'
import classnames from 'classnames'
import { useSelector } from 'react-redux'

const MAX_DESC_LENGTH = 60 
const MAX_FAV_COURSES = 4 

// گرفتن حالت دارک از redux (مثل سایر بخش‌ها)
const useDarkMode = () => {
  const skin = useSelector(state => state.layout?.skin)
  return skin === 'dark'
}

const UserDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const darkMode = useDarkMode()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const [showAllFav, setShowAllFav] = useState(false)
  const cardRef = useRef(null)
  const imgRef = useRef(null)
  const infoRef = useRef(null)
  const btnsRef = useRef(null)
  const chartRef = useRef(null)
  const favRowRefs = useRef([])
  favRowRefs.current = []
  const favImgRefs = useRef([])
  favImgRefs.current = []
  const reserveRowRefs = useRef([])
  reserveRowRefs.current = []

  useEffect(() => {
    http.get(`/User/UserDetails/${id}`)
      .then(res => {
        setUser(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])
  useEffect(() => {
    if (!user) return
    gsap.fromTo(cardRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
    gsap.fromTo(imgRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, delay: 0.2, ease: "back.out(1.7)" })
    gsap.fromTo(infoRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.4, stagger: 0.08 })
    gsap.fromTo(btnsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.7 })
    gsap.fromTo(chartRef.current, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.7, delay: 0.8, ease: "back.out(1.7)" })
  }, [user])
  useLayoutEffect(() => {
    if (activeTab === '1' && favRowRefs.current.length) {
      gsap.fromTo(
        favRowRefs.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      )
      gsap.fromTo(
        favImgRefs.current,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.1, ease: "back.out(1.7)" }
      )
    }
    if (activeTab === '2' && reserveRowRefs.current.length) {
      gsap.fromTo(
        reserveRowRefs.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" }
      )
    }
  }, [activeTab, showAllFav, user])
  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      const res = await http.post('/User/DeleteUser', { id: user.id })
      if (res.data && (res.data.success || res.data.status === 'success')) {
        toast.success('کاربر با موفقیت حذف شد')
        setDeleteModalOpen(false)
        navigate('/users')
      } else {
        toast.error('خطا در حذف کاربر')
      }
    } catch (err) {
      toast.error('خطا در حذف کاربر')
    }
    setDeleting(false)
  }
  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
  }

  const handleEdit = () => {
    navigate(`/users/edit/${user.id}`)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
        <Spinner color="primary" />
      </div>
    )
  }

  if (!user) {
    return <div className="text-center text-danger mt-4">کاربر یافت نشد</div>
  }
  const favoriteCourses =
    user.favoriteCourses ||
    user.favorite_courses ||
    user.FavoriteCourses ||
    user.Favorite_courses ||
    user.courses ||
    []

  const reserves =
    user.reserves ||
    user.Reserves ||
    user.reserves_courses ||
    user.Reserves_courses ||
    user.reservedCourses ||
    []
  const favoriteCoursesToShow = favoriteCourses.length ? favoriteCourses : [
    {
      "title": "آموزش Tailwind css",
      "describe": "تیلویند، اولین فریم‌ورک CSS برای ایجاد سریع رابط‌های کاربند می‌تواند خسته‌کننده باشد.",
      "tumbImageAddress": "https://classapi.sepehracademy.ir/\\Pictures\\Course\\1499796-فضانورد-شروع-به-اجرا-می-کند-رسانه-های-مختلط_5ad55f4a-ae65-4f3b-9b6a-8c7bf2bbb74d.jpg",
      "lastUpdate": "2024-12-24T20:25:29.87",
      "courseId": "f4f2b093-8914-ef11-b6c2-f4b229435c5d"
    }
  ]
  const reservesToShow = reserves.length ? reserves : [
    {
      "reserveId": "8830b44a-2eac-ef11-b6ed-e2b8c6c9e309",
      "courseId": "7a7826ff-d09a-ef11-b6e7-9ae1b6d917d9",
      "courseName": "تستتتتت",
      "studentId": 1,
      "studentName": "مصطفی انجین",
      "reserverDate": "2024-11-26T23:10:37.323",
      "accept": true
    }
  ]
  const defaultCourseImg = "https://tanzolymp.com/images/default-non-user-no-photo-1.jpg"
  const getShortDesc = desc => {
    if (!desc) return ''
    if (desc.length <= MAX_DESC_LENGTH) return desc
    return desc.slice(0, MAX_DESC_LENGTH) + '...'
  }
  const favCoursesDisplay = showAllFav ? favoriteCoursesToShow : favoriteCoursesToShow.slice(0, MAX_FAV_COURSES)
  const hasMoreFav = favoriteCoursesToShow.length > MAX_FAV_COURSES
  const percent = parseFloat(user.profileCompletionPercentage) || 0
  const chartOptions = {
    chart: { type: 'radialBar', sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        hollow: { size: '70%' },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: '22px',
            fontWeight: 700,
            color: darkMode ? '#ffd666' : '#7367f0',
            offsetY: 8,
            formatter: val => `${val}%`
          }
        }
      }
    },
    colors: [darkMode ? '#ffd666' : '#7367f0']
  }
  const chartSeries = [percent]

  // استایل‌های دارک‌مد
  const darkCard = {
    background: 'linear-gradient(135deg, #23272b 60%, #18191a 100%)',
    color: '#e4e6eb',
    boxShadow: '0 8px 32px #0008',
    border: 'none'
  }
  const darkTable = {
    background: '#23272b',
    color: '#e4e6eb'
  }
  const darkTableHead = {
    background: '#18191a',
    color: '#ffd666'
  }
  const darkTableRow = idx => ({
    background: idx % 2 === 0 ? '#23272b' : '#18191a',
    color: '#e4e6eb'
  })
  const darkBtnEdit = {
    background: '#ffd666',
    color: '#222',
    border: 'none',
    borderRadius: 8,
    padding: '8px 32px',
    fontWeight: 'bold',
    fontSize: 16,
    cursor: 'pointer',
    marginRight: 8,
    boxShadow: '0 2px 8px #ffd66633',
    transition: 'background 0.2s, color 0.2s, transform 0.2s'
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
  const darkTab = isActive => ({
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 18,
    background: isActive ? '#ffd666' : 'transparent',
    color: isActive ? '#222' : '#e4e6eb',
    borderRadius: 12,
    margin: 2,
    padding: '8px 24px',
    border: 'none'
  })

  return (
    <>
      <DeleteModal
        open={deleteModalOpen}
        user={user}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
      <Card
        ref={cardRef}
        style={{
          maxWidth: 1200,
          margin: '40px auto',
          borderRadius: 22,
          overflow: 'hidden',
          ...(darkMode ? darkCard : {
            boxShadow: '0 8px 32px #0002',
            background: 'linear-gradient(135deg, #f8fafc 60%, #e3e8ff 100%)'
          })
        }}>
        <div style={{
          width: '100%',
          height: 150,
          background: darkMode
            ? `linear-gradient(90deg, #23272b 60%, #18191a 100%)`
            : `url('https://sepehracademy.ir/assets/profile-bg.af77345a.jpg') center/cover no-repeat`
        }} />
        <CardBody style={{ marginTop: -70 }}>
          <Row className="mb-3">
            <Col xs="12" className="text-center position-relative">
              <img
                ref={imgRef}
                src={user.currentPictureAddress && user.currentPictureAddress !== 'Not-set' ? user.currentPictureAddress : '/default-avatar.png'}
                alt="profile"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #fff',
                  boxShadow: '0 2px 16px #7367f055',
                  position: 'relative',
                  top: -60,
                  background: '#fff'
                }}
              />
              <div style={{ marginTop: -40 }}>
                <h3 className="mt-3 mb-1" style={{ fontWeight: 900, letterSpacing: 1, color: darkMode ? "#ffd666" : undefined }}>{user.fName} {user.lName}</h3>
                <Badge color={user.active ? 'success' : 'secondary'} pill style={{ fontSize: 17, padding: '8px 18px' }}>
                  {user.active ? 'فعال' : 'غیرفعال'}
                </Badge>
              </div>
              <div ref={btnsRef} className="d-flex justify-content-center gap-2 mt-3">
                <button
                  style={darkMode ? darkBtnEdit : {
                    background: '#ffe066',
                    color: '#333',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 32px',
                    fontWeight: 'bold',
                    fontSize: 16,
                    cursor: 'pointer',
                    marginRight: 8,
                    boxShadow: '0 2px 8px #ffe06633',
                    transition: 'background 0.2s, color 0.2s, transform 0.2s'
                  }}
                  onClick={handleEdit}
                >
                  ویرایش
                </button>
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
              </div>
            </Col>
          </Row>
          <div ref={infoRef}>
            <Row className="mb-2">
              <Col md="6"><b>نام کاربری:</b> <span className="text-primary">{user.userName}</span></Col>
              <Col md="6"><b>ایمیل:</b> <span className="text-primary">{user.gmail}</span></Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><b>شماره تماس:</b> {user.phoneNumber}</Col>
              <Col md="6"><b>ایمیل ریکاوری:</b> {user.recoveryEmail}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><b>کدملی:</b> {user.nationalCode}</Col>
              <Col md="6"><b>جنسیت:</b> {user.gender === false ? 'زن' : 'مرد'}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><b>آدرس:</b> {user.homeAdderess}</Col>
              <Col md="6"><b>تاریخ تولد:</b> {user.birthDay?.split('T')[0]}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><b>تلگرام:</b> {user.telegramLink}</Col>
              <Col md="6"><b>لینکدین:</b> {user.linkdinProfile}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><b>درباره کاربر:</b> {user.userAbout}</Col>
              <Col md="6"><b>دو مرحله‌ای:</b> {user.twoStepAuth ? 'فعال' : 'غیرفعال'}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><b>مختصات:</b> {user.latitude}, {user.longitude}</Col>
              <Col md="6"><b>تاریخ ثبت:</b> {user.insertDate?.split('T')[0]}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><b>نقش‌ها:</b> {(user.roles || []).join(', ')}</Col>
              <Col md="6"><b>دریافت پیام:</b> {user.receiveMessageEvent ? 'بله' : 'خیر'}</Col>
            </Row>
            <Row className="mb-4 mt-4 justify-content-center">
              <Col xs="12" className="text-center">
                <b>درصد تکمیل پروفایل:</b>
                <div ref={chartRef} className="d-flex flex-column align-items-center mt-2">
                  <Chart options={chartOptions} series={chartSeries} type="radialBar" height={170} width={170} />
                  <Progress value={percent} color={darkMode ? "warning" : "primary"} className="w-75 mt-3" style={{ height: 12, borderRadius: 8, transition: 'width 1s', background: darkMode ? "#23272b" : undefined }} />
                  <div className="mt-1" style={{ fontWeight: 700, color: darkMode ? "#ffd666" : "#7367f0" }}>{percent}%</div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="mt-5">
            <Nav tabs className="mb-3 justify-content-center" style={darkMode ? { background: "#18191a", borderRadius: 16 } : {}}>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => setActiveTab('1')}
                  style={darkMode ? darkTab(activeTab === '1') : { cursor: 'pointer', fontWeight: 700, fontSize: 18 }}
                >
                  دوره‌های محبوب
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => setActiveTab('2')}
                  style={darkMode ? darkTab(activeTab === '2') : { cursor: 'pointer', fontWeight: 700, fontSize: 18 }}
                >
                  رزروهای کاربر
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Table bordered responsive hover className="shadow-sm" style={darkMode ? { ...darkTable, borderRadius: 18, overflow: 'hidden' } : { borderRadius: 18, overflow: 'hidden', background: '#f9fafe' }}>
                  <thead className="table-light" style={darkMode ? darkTableHead : {}}>
                    <tr style={darkMode ? { fontWeight: 700, fontSize: 17, ...darkTableHead } : { fontWeight: 700, fontSize: 17, background: '#f1f3fa' }}>
                      <th style={{ width: 60, textAlign: 'center' }}>#</th>
                      <th>عنوان دوره</th>
                      <th>توضیحات</th>
                      <th style={{ width: 90, textAlign: 'center' }}>تصویر</th>
                      <th style={{ width: 130, textAlign: 'center' }}>آخرین بروزرسانی</th>
                    </tr>
                  </thead>
                  <tbody>
                    {favCoursesDisplay.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">دوره‌ای وجود ندارد</td>
                      </tr>
                    )}
                    {favCoursesDisplay.map((course, idx) => (
                      <tr
                        key={course.courseId || idx}
                        ref={el => favRowRefs.current[idx] = el}
                        style={darkMode ? darkTableRow(idx) : {
                          background: idx % 2 === 0 ? '#f7faff' : '#fff',
                          transition: 'background 0.2s'
                        }}
                      >
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{idx + 1}</td>
                        <td style={{ fontWeight: 600, color: darkMode ? "#ffd666" : "#7367f0" }}>{course.title}</td>
                        <td style={{ maxWidth: 300, whiteSpace: 'pre-line', fontSize: 15 }}>
                          {getShortDesc(course.describe)}
                          {course.describe && course.describe.length > MAX_DESC_LENGTH && (
                            <span title={course.describe} style={{ color: '#888', cursor: 'pointer', marginRight: 4 }}> ... </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <img
                            ref={el => favImgRefs.current[idx] = el}
                            src={course.tumbImageAddress ? course.tumbImageAddress.replace(/\\/g, '/') : defaultCourseImg}
                            alt={course.title}
                            style={{
                              width: 60,
                              height: 40,
                              objectFit: 'cover',
                              borderRadius: 10,
                              border: darkMode ? '2px solid #ffd666' : '2px solid #e3e8ff',
                              boxShadow: '0 2px 8px #7367f022',
                              background: darkMode ? "#23272b" : "#fff",
                              transition: 'transform 0.2s'
                            }}
                            onError={e => { e.target.src = defaultCourseImg }}
                          />
                        </td>
                        <td style={{ textAlign: 'center', fontSize: 15 }}>
                          {course.lastUpdate?.split('T')[0] || '-'}
                        </td>
                      </tr>
                    ))}
                    {hasMoreFav && !showAllFav && (
                      <tr>
                        <td colSpan={5} className="text-center">
                          <button
                            onClick={() => setShowAllFav(true)}
                            style={darkMode ? {
                              background: '#ffd666',
                              color: '#222',
                              border: 'none',
                              borderRadius: 8,
                              padding: '8px 32px',
                              fontWeight: 'bold',
                              fontSize: 16,
                              cursor: 'pointer',
                              margin: 8,
                              boxShadow: '0 2px 8px #ffd66633',
                              transition: 'background 0.2s, color 0.2s, transform 0.2s'
                            } : {
                              background: '#7367f0',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 8,
                              padding: '8px 32px',
                              fontWeight: 'bold',
                              fontSize: 16,
                              cursor: 'pointer',
                              margin: 8,
                              boxShadow: '0 2px 8px #7367f033',
                              transition: 'background 0.2s, color 0.2s, transform 0.2s'
                            }}
                          >
                            نمایش همه دوره‌های محبوب ({favoriteCoursesToShow.length})
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TabPane>
              <TabPane tabId="2">
                <Table bordered responsive hover className="shadow-sm" style={darkMode ? { ...darkTable, borderRadius: 18, overflow: 'hidden' } : { borderRadius: 18, overflow: 'hidden', background: '#f9fafe' }}>
                  <thead className="table-light" style={darkMode ? darkTableHead : {}}>
                    <tr style={darkMode ? { fontWeight: 700, fontSize: 17, ...darkTableHead } : { fontWeight: 700, fontSize: 17, background: '#f1f3fa' }}>
                      <th style={{ width: 60, textAlign: 'center' }}>#</th>
                      <th>نام دوره</th>
                      <th>نام دانشجو</th>
                      <th style={{ width: 130, textAlign: 'center' }}>تاریخ رزرو</th>
                      <th style={{ width: 90, textAlign: 'center' }}>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservesToShow.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">رزروی وجود ندارد</td>
                      </tr>
                    )}
                    {reservesToShow.map((reserve, idx) => (
                      <tr
                        key={reserve.reserveId || idx}
                        ref={el => reserveRowRefs.current[idx] = el}
                        style={darkMode ? darkTableRow(idx) : {
                          background: idx % 2 === 0 ? '#f7faff' : '#fff',
                          transition: 'background 0.2s'
                        }}
                      >
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{idx + 1}</td>
                        <td style={{ fontWeight: 600 }}>{reserve.courseName}</td>
                        <td>{reserve.studentName}</td>
                        <td style={{ textAlign: 'center', fontSize: 15 }}>{reserve.reserverDate?.split('T')[0]}</td>
                        <td style={{ textAlign: 'center' }}>
                          <Badge
                            color={reserve.accept ? 'success' : 'secondary'}
                            style={{
                              fontSize: 15,
                              padding: '6px 18px',
                              borderRadius: 12,
                              fontWeight: 700,
                              letterSpacing: 1
                            }}
                          >
                            {reserve.accept ? 'تایید شده' : 'در انتظار'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TabPane>
            </TabContent>
          </div>
        </CardBody>
      </Card>
      {darkMode && (
        <style>
          {`
          .table {
            background: #23272b !important;
            color: #e4e6eb !important;
          }
          .table thead {
            background: #18191a !important;
            color: #ffd666 !important;
          }
          .table tbody tr {
            border-color: #333 !important;
          }
          .nav-tabs {
            background: #18191a !important;
            border-radius: 16px !important;
            border: none !important;
          }
          .nav-tabs .nav-link.active {
            background: #ffd666 !important;
            color: #222 !important;
            border-radius: 12px !important;
          }
          `}
        </style>
      )}
    </>
  )
}

export default UserDetails