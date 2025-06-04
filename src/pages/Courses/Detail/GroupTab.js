// ** Reactstrap Imports
import { Button, Card, CardHeader, Progress } from 'reactstrap'

// ** Third Party Components
import { ChevronDown, Plus } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'



// ** Custom Components
import Avatar from '@components/avatar'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useState } from 'react'
import AddNewModal from './AddNewModal'
// import { getgroupList } from '../../../services/api/Blogs'
import { useQuery } from 'react-query'
import useCourseStore from '../../../zustand/CourseSlice'
import { useParams } from 'react-router-dom'
import { getCourseGroupid } from '../../../services/api/Courses'


export const columns = [

  {
    sortable: true,
    minWidth: '200px',
    name: 'نام گروه',
    selector: row => row.groupName,
    cell: row => {
      return (
        <div className='d-flex justify-content-left align-items-center'>
          <div className='d-flex flex-column'>
            <span className='text-truncate fw-bolder'>{row.groupName}</span>
            <small className='text-muted'>{row.groupName}</small>
          </div>
        </div>
      )
    }
  },
  {
    name: 'ظرفیت دوره',
    selector: row => row.courseCapacity
  },
  {
    name: 'ظرفیت گروه',
    selector: row => row.groupCapacity
  },
  {
    name: 'نام استاد',
    selector: row => row.teacherName,
    sortable: true,
    cell: row => {
      return (
        <div className='d-flex flex-column w-100'>
          <small className='mb-1'>{row.teacherName}</small>

        </div>
      )
    }
  },
  {
    name: 'نام دوره',
    selector: row => row.courseName,
    sortable: true,
    cell: row => {
      return (
        <div className='d-flex flex-column w-100'>
          <small className='mb-1'>{row.courseName}</small>

        </div>
      )
    }
  },


]



const GroupTab = ({ courseDetail }) => {
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  // console.log(courseDetail.teacherId , "TeacherId")
  const { courseId } = useParams()

  const {
    PageNumber,
    SortingCol,
    SortingType,
    SearchInput
  } = useCourseStore()

  const handleModal = () => setModal(!modal)

  // const { data: groupListList } = useQuery({
  //   queryKey: [
  //     "groupListList",
  //     PageNumber,
  //     SearchInput,
  //     SortingCol,
  //     SortingType,
  //   ],
  //   queryFn: () => {
  //     const result = getgroupList(
  //       PageNumber,
  //       SearchInput,
  //       SortingCol,
  //       SortingType,
  //     )
  //     return result;
  //   }
  // });



  // const { teacherId } = useCourseStore();
  // console.log(teacherId , "teacherId")
  const { data: groupListList } = useQuery({
    queryKey: [
      "groupListList",
      PageNumber,
      SearchInput,
      SortingCol,
      SortingType,
    ],
    queryFn: () => {
      const result = getgroupList(
        PageNumber,
        SearchInput,
        SortingCol,
        SortingType,
      )
      return result;

    }
  });

  console.log(groupListList, "groupLislkrngdsng;qekflhboudfhgqpedhwr.tf gvjln jhpwfhugjhpunvhjnfuvgnoyudvhjyunkwsdguvntList")

  const TeacherId = groupListList?.courseGroupDtos.find((e) => ({
    value: e?.TeacherId,
  }));

  console.log(TeacherId, "TeacherId")

  const { data: groupListid } = useQuery({
    queryKey: ["groupListid", courseId, courseDetail.teacherId],
    queryFn: () => {
      const result = getCourseGroupid(
        courseId, courseDetail.teacherId
      );
      return result;
    },
  });

  console.log(groupListid, "groupList with id and techerid")


  const { handlePageNumber } = useCourseStore();

  const handlePagination = page => {
    setCurrentPage(page.selected)
    handlePageNumber(page.selected + 1);
  }

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={Math.ceil((groupListid?.length || 0) / 5)}
      breakLabel='...'
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
    />
  )



  return (
    <Card>
      <CardHeader tag='h4'>لیست گروه های دوره </CardHeader>
      <div className='react-dataTable user-view-account-projects'>
        <DataTable
          noHeader
          responsive
          pagination
          paginationPerPage={5}
          paginationComponent={CustomPagination}
          paginationDefaultPage={currentPage + 1}
          columns={columns}
          data={groupListid || []}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
        />
      </div>
      <Button className='ms-2' color='primary' onClick={handleModal}>
        <Plus size={15} />
        <span className='align-middle ms-50'>افزودن گروه</span>
      </Button>
      <AddNewModal open={modal} handleModal={handleModal} />

    </Card>
  )
}

export default GroupTab
