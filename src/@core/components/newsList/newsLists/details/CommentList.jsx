import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { 
  Card, 
  CardBody, 
  Button, 
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  FormGroup,
  ModalFooter
} from 'reactstrap'
import { Heart, CornerUpLeft, Send } from 'react-feather'
import PropTypes from 'prop-types'
import { getAdminNewsComments } from '../../../../../services/api/newList/getAdminNewsComments'
import { createNewsReplyComment } from '../../../../../services/api/newList/postCreateNewsReplyComment'
import toast from 'react-hot-toast'

const CommentList = ({ detailId, userId }) => {
  const [page, setPage] = useState(1);
  const [replyModal, setReplyModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyText, setReplyText] = useState('');
  const commentsPerPage = 5;
  
  const queryClient = useQueryClient();

  const { 
    data: commentsData, 
    isLoading, 
    isError 
  } = useQuery(
    ['newsComments', detailId],
    () => getAdminNewsComments(detailId),
    { keepPreviousData: true }
  );

  const replyMutation = useMutation(
    (replyData) => createNewsReplyComment(
      replyData.newsId,
      replyData.userIpAddress,
      replyData.title,
      replyData.describe,
      replyData.userId,
      replyData.parentId
    ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['newsComments']);
        setReplyModal(false);
        setReplyText('');
        toast.success('پاسخ با موفقیت ارسال شد');
      },
      onError: (error) => {
        toast.error('خطا در ارسال پاسخ');
        console.error('Reply error:', error);
      }
    }
  );

  const handleReplyClick = (comment) => {
    setSelectedComment(comment);
    setReplyModal(true);
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) {
      toast.error('لطفا متن پاسخ را وارد کنید');
      return;
    }
    
    replyMutation.mutate({
      newsId: detailId,
      parentId: selectedComment.id || uuidv4(),
      title: 'پاسخ به نظر',
      describe: replyText.trim(),
    
    });
  };

  if (isLoading) return (
    <div className="text-center py-4">
      <Spinner color="primary" />
      <p className="mt-2">در حال دریافت نظرات...</p>
    </div>
  );

  if (isError) return (
    <Alert color="danger">
      خطا در دریافت نظرات
    </Alert>
  );

  if (!commentsData || commentsData.length === 0) return (
    <div className="text-muted text-center py-3">
      نظری وجود ندارد
    </div>
  );

  const totalComments = commentsData.length;
  const totalPages = Math.ceil(totalComments / commentsPerPage);
  const paginatedComments = commentsData.slice(
    (page - 1) * commentsPerPage,
    page * commentsPerPage
  );

  return (
    <div className="comment-section">
      {paginatedComments.map(comment => (
        <Card className='mb-3' key={comment?.id}>
          <CardBody>
            <div className='d-flex'>
              <div className='flex-grow-1'>
                <div className='d-flex align-items-center mb-1'>
                  <h6 className='fw-bolder mb-0 me-2'>{comment?.author}</h6>
                  <small className='text-muted'>
                    {new Date(comment?.date).toLocaleDateString('fa-IR')}
                  </small>
                </div>
                <p className='mb-1'>{comment?.title}</p>
                <p className='mb-2 text-muted'>{comment?.describe}</p>
                
                <div className='d-flex align-items-center'>
                  <Button color='link' className='p-0 me-3 d-flex align-items-center'>
                    <Heart size={16} className='me-50' />
                    <span>{comment?.likeCount || 0}</span>
                  </Button>
                  <Button 
                    color='link' 
                    className='p-0 d-flex align-items-center'
                    onClick={() => handleReplyClick(comment)}
                  >
                    <CornerUpLeft size={16} className='me-50' />
                    <span>پاسخ</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}

      {totalPages > 1 && (
        <Pagination className="mt-3 justify-content-center">
          <PaginationItem disabled={page === 1}>
            <PaginationLink 
              previous 
              onClick={() => setPage(p => Math.max(p - 1, 1))} 
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <PaginationItem active={pageNumber === page} key={pageNumber}>
              <PaginationLink onClick={() => setPage(pageNumber)}>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem disabled={page === totalPages}>
            <PaginationLink 
              next 
              onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
            />
          </PaginationItem>
        </Pagination>
      )}

      <Modal isOpen={replyModal} toggle={() => setReplyModal(false)}>
        <ModalHeader toggle={() => setReplyModal(false)}>پاسخ به نظر</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="replyText">متن پاسخ</Label>
              <Input
                type="textarea"
                id="replyText"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="(حداقل ۱۰ کاراکتر)پاسخ خود را بنویسید..."
                maxLength={390}
                minLength={10}
                rows={4}
                required
              />
              <small className={replyText.length < 10 ? "text-danger" : "text-muted"}>
                {replyText.length}/10 (حداقل ۱۰ کاراکتر)
              </small>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="primary" 
            onClick={handleSubmitReply}
            disabled={replyMutation.isLoading || !replyText.trim()}
          >
            {replyMutation.isLoading ? 'در حال ارسال...' : (
              <>
                <Send size={16} className="me-50" />
                ارسال پاسخ
              </>
            )}
          </Button>{' '}
          <Button color="secondary" onClick={() => setReplyModal(false)}>
            انصراف
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

CommentList.propTypes = {
  detailId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

export default CommentList