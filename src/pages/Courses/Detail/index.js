// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col, Alert } from 'reactstrap'

// ** User View Components
import UserTabs from './Tabs'

// ** Styles
import '@styles/react/apps/app-users.scss'
import { getUser } from './index copy'
import UserInfoCard from './UserInfoCard'
import PlanCard from './PlanCard'
import { getCourseDetails } from '../../../services/api/Courses'
import { useQuery } from 'react-query'

const UserView = () => {
  // ** Store Vars
  const store = useSelector(state => state.users)
  const dispatch = useDispatch()

  // ** Hooks
  const { id } = useParams()

  // ** Get suer on mount
  useEffect(() => {
    dispatch(getUser(parseInt(id)))
  }, [dispatch])

  const [active, setActive] = useState('1')

  const toggleTab = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const { courseId } = useParams()
  // console.log(courseId)

  //query
  const { data: courseDetail } = useQuery({
      queryKey: ["courseDetail"],
      queryFn: async () => {
          const result = await getCourseDetails(courseId)
          return result
      },
  });
  console.log(courseDetail, "courseDetail")


  return courseDetail !== null && courseDetail !== undefined ? (
    <div className='app-user-view'>
      <Row>
        <Col xl='4' lg='5' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <UserInfoCard courseDetail={courseDetail} />
          <PlanCard />
        </Col>
        <Col xl='8' lg='7' xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <UserTabs active={active} toggleTab={toggleTab} />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>User not found</h4>
      <div className='alert-body'>
        User with id: {id} doesn't exist. Check list of all Users: <Link to='/apps/user/list'>Users List</Link>
      </div>
    </Alert>
  )
}
export default UserView
