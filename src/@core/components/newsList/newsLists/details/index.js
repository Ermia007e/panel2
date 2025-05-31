// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'
import classnames from 'classnames'
import {
  Share2,
  GitHub,
  Gitlab,
  Twitter,
  Bookmark,
  Facebook,
  Linkedin,
  CornerUpLeft,
  MessageSquare,
  Heart,
  Edit
} from 'react-feather'

// ** Utils
import { kFormatter } from '@utils'

// ** Custom Components
import Sidebar from './BlogSidebar'
import Avatar from '@components/avatar'
import Breadcrumbs from '@components/breadcrumbs'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Badge,
  Input,
  Label,
  Button,
  CardImg,
  CardBody,
  CardText,
  CardTitle,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'
import { formatDate } from '../../common/formatDate/formatDate'
// ** Styles
import '@styles/base/pages/page-blog.scss'
import { useNavigate } from 'react-router-dom'
import CommentList from './CommentList'

const BlogDetails = ({ newsDetails, detailId }) => {
  const navigate = useNavigate();
  const badgeColorsArr = {
    Quote: 'light-info',
    Fashion: 'light-primary',
    Gaming: 'light-danger',
    Video: 'light-warning',
    Food: 'light-success'
  };

  const renderTags = () => {
    return newsDetails.blog.tags.map((tag, index) => (
      <a key={index} href='/' onClick={e => e.preventDefault()}>
        <Badge
          className={classnames({ 'me-50': index !== newsDetails.blog.tags.length - 1 })}
          color={badgeColorsArr[tag]}
          pill
        >
          {tag}
        </Badge>
      </a>
    ));
  };

  return (
    <Fragment>
      <div className='blog-wrapper'>
        <div className='content-detached content-left'>
          <div className='content-body'>
            <Row>
              <Col sm='12'>
                <Card className='mb-3'>
                  <CardBody>
                    {newsDetails?.detailsNewsDto?.currentImageAddress ? (
                      <CardImg 
                        src={newsDetails?.detailsNewsDto?.currentImageAddress} 
                        className='img-fluid w-100 rounded-top' 
                        style={{ borderRadius: '8px', objectFit: 'cover', height: '400px' }}
                        top 
                      />
                    ) : (
                      <div className='bg-secondary' style={{ height: '400px', width: '100%', borderRadius: '8px' }} />
                    )}

                    <CardTitle tag='h4' className='mt-1'>
                      {newsDetails?.detailsNewsDto?.title}
                    </CardTitle>

                    <div className='d-flex align-items-center mb-3'>
                      <div className='d-flex align-items-center'>
                        <Badge color='primary' pill>
                          {newsDetails?.detailsNewsDto?.newsCatregoryName}
                        </Badge>
                        <span className='mx-1'>|</span>
                        <span>{newsDetails?.detailsNewsDto?.addUserFullName}</span>
                        <span className='mx-1'>|</span>
                        <span className='text-muted'>{formatDate(newsDetails?.detailsNewsDto?.insertDate)}</span>
                      </div>
                    </div>

                    <div className='mb-3'>
                      <CardText>{newsDetails?.detailsNewsDto?.describe}</CardText>
                    </div>

                    <div className='d-flex align-items-start mb-4'>
                      <div className='me-1'>
                        <Avatar 
                          className='avatar-lg' 
                          color='light-primary'
                          style={{ width: '40px', height: '40px' }}
                        />
                      </div>
                      
                      <div className='flex-grow-1'>
                        <div className='d-flex align-items-center'>
                          <h5 className='fw-bold mb-0 me-2'>{newsDetails?.detailsNewsDto?.addUserFullName}</h5>
                          <span className='text-muted small'>{formatDate(newsDetails?.detailsNewsDto?.insertDate)}</span>
                        </div>
                        
                        <div className='d-flex align-items-center bg-light  rounded mt-1'>
                          <div className='d-flex align-items-center me-3'>
                            <MessageSquare size={18} className='text-primary me-1' />
                            <span className='text-primary fw-bold'>{newsDetails?.detailsNewsDto?.commentsCount || 0}</span>
                          </div>
                          
                          <div className='d-flex align-items-center me-3'>
                            <Heart size={18} className='text-danger me-1' />
                            <span className='fw-bold text-danger'>{newsDetails?.detailsNewsDto?.currentLikeCount || 0}</span>
                          </div>
                          
                          <div className='d-flex align-items-center'>
                            <Edit size={18} className='text-secondary me-1' />
                            <span className='text-muted me-1'>آخرین ویرایش:</span>
                            <span className='fw-bold me-2'>{formatDate(newsDetails?.detailsNewsDto?.updateDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr/>
                    <Button 
                      color='primary' 
                      outline
                      onClick={() => navigate('/EditNews/' + newsDetails?.detailsNewsDto?.id)}
                    >
                      ویرایش خبر
                    </Button>
                  </CardBody>
                </Card>
              </Col>
              
              <Col sm='12' id='blogComment'>
                <h6 className='section-label'>نظرات</h6>
                <CommentList detailId={detailId}  userId={newsDetails?.detailsNewsDto?.userId} />
              </Col>
            </Row>
          </div>
        </div>
        <Sidebar />
      </div>
    </Fragment>
  );
};

export default BlogDetails
