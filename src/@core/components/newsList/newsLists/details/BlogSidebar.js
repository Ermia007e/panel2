// ** React Imports
import { Link } from 'react-router-dom'
import { useEffect, useState, Fragment } from 'react'

// ** Third Party Components
import axios from 'axios'
import classnames from 'classnames'
import * as Icon from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { InputGroup, Input, InputGroupText, Badge } from 'reactstrap'
import { useQuery } from 'react-query';
import { getAdminNewsFilterList } from '../../../../../services/api/newList/getAdminNewsFilterList'
import { getListNewsCategory } from '../../../../../services/api/newList/getListNewsCategory'
import { formatDate } from '../../common/formatDate/formatDate'

const BlogSidebar = () => {
  const { 
    data: recentPostsData,
    isLoading: isPostsLoading,
    error: postsError 
  } = useQuery('recentPosts', () =>
    getAdminNewsFilterList({
      PageNumber: 1,
      RowsOfPage: 5,
      SortingCol: "InsertDate",
      SortType: "DESC"
    })
  );

  const { 
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError 
  } = useQuery('categories', getListNewsCategory);

  const CategoryColorsArr = {
    Quote: 'light-info',
    Fashion: 'light-primary',
    Gaming: 'light-danger',
    Video: 'light-warning',
    Food: 'light-success'
  };

  const renderRecentPosts = () => {
    if (isPostsLoading) return <div className="text-center py-2">Loading posts...</div>;
    if (postsError) return <div className="text-danger py-2">Error loading posts</div>;
    if (!recentPostsData?.news?.length) return <div className="text-muted py-2">No posts found</div>;
   console.log(recentPostsData)
    return (
      <div className="recent-posts-list">
        {recentPostsData.news.map((post) => (
          <div key={post.id} className="recent-post-item d-flex align-items-start mb-3 pb-2 border-bottom">
            <div className="me-2 pt-1">
              <Avatar 
                color="light-primary" 
                icon={<Icon.Clock size={14} />} 
                className="rounded-circle"
              />
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-0">
                <Link 
                  className="text-body fw-bold" 
                  to={`/NewsDetails/${post.id}`}
                  style={{ lineHeight: '1.4', fontSize: '0.9rem' }}
                >
                  {post.title || 'Untitled Post'}
                </Link>
              </h6>
              <small className="text-muted d-block mt-1">
                <Icon.Calendar size={12} className="me-1" />
                {formatDate(post.updateDate)}
              </small>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCategories = () => {
    if (isCategoriesLoading) return <div className="text-center py-2">Loading categories...</div>;
    if (categoriesError) return <div className="text-danger py-2">Error loading categories</div>;
    if (!categoriesData?.length) return <div className="text-muted py-2">No categories found</div>;

    const displayedCategories = categoriesData.slice(0, 5);

    return (
      <div className="categories-list">
        {displayedCategories.map((item) => (
          <div 
            key={item.id} 
            className="category-item d-flex align-items-center mb-2 pb-1"
          >
            <Avatar 
              className="rounded-circle me-2" 
              color={CategoryColorsArr[item.categoryName] || 'light-secondary'} 
              icon={<Icon.Tag size={14} />} 
              size="sm"
            />
            <Link 
              to="#" 
              className="text-body flex-grow-1"
              style={{ fontSize: '0.9rem' }}
            >
              {item.categoryName || 'Uncategorized'}
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='sidebar-detached sidebar-right'>
      <div className='sidebar'>
        <div className='blog-sidebar right-sidebar my-2 my-lg-0'>
          <div className='right-sidebar-content'>
            <div className='blog-recent-posts mb-4'>
              <div className="d-flex align-items-center mb-3">
                <Icon.Bookmark size={18} className="me-2 text-primary" />
                <h6 className='section-label mb-0'>Recent Posts</h6>
              </div>
              <div className='mt-2'>{renderRecentPosts()}</div>
            </div>
            
            <div className='blog-categories'>
              <div className="d-flex align-items-center mb-3">
                <Icon.List size={18} className="me-2 text-primary" />
                <h6 className='section-label mb-0'>Categories</h6>
              </div>
              <div className='mt-2'>{renderCategories()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar