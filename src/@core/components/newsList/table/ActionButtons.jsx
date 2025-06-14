import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ActiveDeactiveNews } from '../../../services/api/PutActiveDeactiveNews';
import { useNavigate } from 'react-router-dom';

const ActionButtons = ({ row }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
  
    const { mutate: toggleStatus } = useMutation({
      mutationFn: () => ActiveDeactiveNews(!row.isActive, row.id),
      onSuccess: () => {
        queryClient.invalidateQueries('adminNewsList');
      }
    });
  
    const handleActionClick = (actionType) => {
      setShowDetails(false);
      switch (actionType) {
        case 'details':
          navigate(`/news/details/${row.id}`);
          break;
        case 'edit':
          navigate(`/news/edit/${row.id}`);
          break;
        default:
          break;
      }
    };
  
    return (
      <div className="d-flex align-items-center gap-2">
        {row.isActive && (
          <div className="position-relative">
            <button 
              className="btn btn-sm p-0 d-flex align-items-center justify-content-center"
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: showDetails ? '#f5f5f5' : 'transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: showDetails ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
            >
              <i className="fas fa-ellipsis-v" style={{ 
                fontSize: '13px',
                color: showDetails ? '#555' : '#777'
              }}></i>
            </button>
            
            {showDetails && (
              <div 
                className="action-dropdown"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  zIndex: 1000,
                  width: '140px',
                  backgroundColor: 'rgba(245, 245, 245, 0.98)',
                  borderRadius: '10px',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                  padding: '8px 0',
                  overflow: 'hidden',
                  border: '1px solid #eee',
                  transform: 'translateY(-5px)',
                  opacity: 0,
                  animation: 'fadeInDropdown 0.2s ease-out forwards',
                  fontFamily: 'IRANSans, sans-serif',
                  backdropFilter: 'blur(3px)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <style>
                  {`
                    @keyframes fadeInDropdown {
                      0% { opacity: 0; transform: translateY(-8px); }
                      100% { opacity: 1; transform: translateY(0); }
                    }
                  `}
                </style>
                
                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
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
                    <i className="fas fa-info-circle" style={{ 
                      fontSize: '13px',
                      width: '18px',
                      color: 'inherit'
                    }}></i>
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
                    <i className="fas fa-edit" style={{ 
                      fontSize: '13px',
                      width: '18px',
                      color: 'inherit'
                    }}></i>
                    <span>ویرایش</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div 
          className="status-toggle"
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: row.isActive ? 'rgba(40, 199, 111, 0.1)' : 'rgba(234, 84, 85, 0.1)',
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(false);
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
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid #444'
                }}
              />
            </div>
          )}
          
          {row.isActive ? (
            <i className="fas fa-eye-slash" style={{ 
              fontSize: '13px',
              color: '#ea5455'
            }}></i>
          ) : (
            <i className="fas fa-eye" style={{ 
              fontSize: '13px',
              color: '#28c76f'
            }}></i>
          )}
        </div>
      </div>
    );
};

export default ActionButtons;