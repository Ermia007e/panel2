import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import http from '@src/services/interceptor'
import toast from 'react-hot-toast'

const ROLES = [
  { key: 'Teacher', label: 'استاد' },
  { key: 'Student', label: 'دانشجو' },
  { key: 'Administrator', label: 'ادمین' }
]

const AccessModal = ({ open, onClose, user }) => {
  const modalRef = useRef(null)
  const [checkedRoles, setCheckedRoles] = useState([])
  const [isChanged, setIsChanged] = useState(false)
  const [pendingRoles, setPendingRoles] = useState([])
  useEffect(() => {
    if (open && user) {
      let userRoleNames = []
      if (Array.isArray(user.userRoles)) {
        userRoleNames = user.userRoles.map(r => typeof r === 'string' ? r.trim() : (r.roleName || r.name || r.title))
      } else if (typeof user.userRoles === 'string') {
        userRoleNames = user.userRoles.split(',').map(r => r.trim())
      }
      setCheckedRoles(userRoleNames)
      setPendingRoles(userRoleNames)
      setIsChanged(false)
      gsap.fromTo(
        modalRef.current,
        { y: '-100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' }
      )
    }
  }, [open, user])

  if (!open || !user) return null

  const handleCheckboxChange = (roleKey) => {
    let newRoles
    if (pendingRoles.includes(roleKey)) {
      newRoles = pendingRoles.filter(r => r !== roleKey)
    } else {
      newRoles = [...pendingRoles, roleKey]
    }
    setPendingRoles(newRoles)
    setIsChanged(true)
  }

  const handleSave = async () => {
    try {
      const response = await http.post('/User/AddUserAccess', {
        userId: user.id,
        roles: pendingRoles
      })
      if (response.data && (response.data.success || response.data.status === 'success')) {
        setCheckedRoles(pendingRoles)
        setIsChanged(false)
        toast.success('دسترسی با موفقیت بروزرسانی شد')
      } else {
        toast.error('خطا در بروزرسانی دسترسی!')
      }
    } catch (err) {
      toast.error('خطا در بروزرسانی دسترسی!')
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div
        ref={modalRef}
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 32,
          minWidth: 350,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          textAlign: 'center'
        }}
      >
        <h4 style={{ marginBottom: 16 }}>دسترسی‌های کاربر</h4>
        <div style={{ marginBottom: 24 }}>
          <b>{user?.fname || 'ناشناس'} {user?.lname || ''}</b>
        </div>
        <div style={{ marginBottom: 24 }}>
          {ROLES.map(role => (
            <div
              key={role.key}
              style={{
                border: '1px solid #eee',
                borderRadius: 6,
                padding: '12px 0 4px 0',
                margin: '12px 0',
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <span>{role.label}</span>
              <input
                type="checkbox"
                checked={pendingRoles.includes(role.key)}
                onChange={() => handleCheckboxChange(role.key)}
                style={{ marginTop: 8 }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button
            style={{
              background: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 24px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onClick={onClose}
          >
            بستن
          </button>
          <button
            style={{
              background: isChanged ? '#52c41a' : '#eee',
              color: isChanged ? '#fff' : '#888',
              border: 'none',
              borderRadius: 6,
              padding: '8px 24px',
              fontWeight: 'bold',
              cursor: isChanged ? 'pointer' : 'not-allowed'
            }}
            disabled={!isChanged}
            onClick={handleSave}
          >
            تغییر
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccessModal