import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const DeleteModal = ({ open, onClose, onConfirm, user }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    if (open) {
      gsap.fromTo(
        modalRef.current,
        { y: '-100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' }
      )
    }
  }, [open])

  if (!open) return null

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
          minWidth: 320,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          textAlign: 'center'
        }}
      >
        <h4 style={{ marginBottom: 16 }}>حذف کاربر</h4>
        <div style={{ marginBottom: 24 }}>
          آیا از حذف کاربر <b>{user?.fname || 'ناشناس'} {user?.lname || ''}</b> مطمئن هستید؟
        </div>
        <button
          style={{
            background: '#ff4d4f',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 24px',
            marginRight: 12,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={onConfirm}
        >
          حذف
        </button>
        <button
          style={{
            background: '#eee',
            color: '#333',
            border: 'none',
            borderRadius: 6,
            padding: '8px 24px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={onClose}
        >
          انصراف
        </button>
      </div>
    </div>
  )
}

export default DeleteModal