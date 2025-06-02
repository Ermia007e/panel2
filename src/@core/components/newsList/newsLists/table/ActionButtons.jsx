
import { useMutation, useQueryClient } from 'react-query';
import { ActiveDeactiveNews } from '../../../../../services/api/newList/PutActiveDeactiveNews';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Edit3, FileText, MoreVertical, XCircle } from 'react-feather';
import toast from 'react-hot-toast';

import { useState, useRef, useEffect } from 'react';

const ActionButtons = ({ row, openedModalId, setOpenedModalId }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: toggleStatus } = useMutation({
    mutationFn: () => ActiveDeactiveNews(!row.isActive, row.id),
    onSuccess: () => {
      queryClient.invalidateQueries('adminNewsList');
      toast.success(
        row.isActive ? 'خبر با موفقیت غیرفعال شد' : 'خبر با موفقیت فعال شد',
        {
          style: {
            borderRadius: '10px',
            background: '#28c76f',
            color: '#fff',
            direction: 'rtl'
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#28c76f',
          },
        }
      );
    },
    onError: () => {
      toast.error('خطا در تغییر وضعیت خبر', {
        style: {
          borderRadius: '10px',
          background: '#ea5455',
          color: '#fff',
          fontFamily: 'IRANSans, sans-serif',
          direction: 'rtl'
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ea5455',
        },
      });
    }
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenedModalId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleActionClick = (actionType) => {
    setOpenedModalId(null);
    switch (actionType) {
      case 'details':
        navigate(`/NewsDetails/${row.id}`);
        break;
      case 'edit':
        navigate(`/EditNews/${row.id}`);
        break;
      default:
        break;
    }
  };

  const handleEllipsisClick = (e) => {
    e.stopPropagation();
    setClickPosition({ x: e.clientX, y: e.clientY });
    setOpenedModalId(openedModalId === row.id ? null : row.id);
  };

  return (
    <div className="d-flex align-items-center gap-1">
      {row.isActive && (
        <div className="position-relative" ref={dropdownRef}>
          <div 
            style={{ cursor: 'pointer', padding: '4px' }}
            onClick={handleEllipsisClick}
          >
            <MoreVertical 
              size={22}
              color={openedModalId === row.id ? '#555' : '#777'}
            />
          </div>
          
          {openedModalId === row.id && (
            <div 
              className="action-dropdown"
              style={{
                position: 'fixed',
                left: `${clickPosition.x}px`,
                top: `${clickPosition.y}px`,
                zIndex: 1000,
                width: '140px',
                backgroundColor: 'rgba(245, 245, 245, 0.98)',
                borderRadius: '10px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                padding: '8px 0',
                overflow: 'hidden',
                border: '1px solid #eee',
                transform: 'translateY(5px)',
                opacity: 0,
                animation: 'fadeInDropdown 0.2s ease-out forwards',
                fontFamily: 'IRANSans, sans-serif',
                backdropFilter: 'blur(3px)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <style>
                {`@keyframes fadeInDropdown {
                  0% { opacity: 0; transform: translateY(-8px); }
                  100% { opacity: 1; transform: translateY(0); }
                }`}
              </style>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                <div 
                  className="dropdown-item"
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    margin: '0 6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e9e9e9';
                    e.currentTarget.style.color = '#1a73e8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#444';
                  }}
                  onClick={() => handleActionClick('details')}
                >
                  <FileText size={20}/>
                  <span>جزئیات</span>
                </div>
                
                <div 
                  className="dropdown-item"
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    margin: '0 6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e9e9e9';
                    e.currentTarget.style.color = '#1a73e8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#444';
                  }}
                  onClick={() => handleActionClick('edit')}
                >
                  <Edit3 size={20}/>
                  <span>ویرایش</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div 
        style={{ cursor: 'pointer', padding: '4px', position: 'relative' }}
        onClick={(e) => {
          e.stopPropagation();
          setOpenedModalId(null);
          toggleStatus();
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {showTooltip && (
          <div 
            className="status-tooltip"
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#444',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              marginBottom: '8px',
              boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
              animation: 'fadeIn 0.15s ease-out'
            }}
          >
            {row.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #444'
            }}/>
          </div>
        )}
        
        {row.isActive ? (
          <XCircle size={25} color="#ea5455" />
        ) : (
          <CheckCircle size={22} color="#28c76f" />
        )}
      </div>
    </div>
  );
};

export default ActionButtons;