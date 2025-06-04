// ** React Imports
import { Fragment } from 'react'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { ActiveTeachers } from './ActiveTeachers'
// ** Icons Imports
import { User, Lock, Bookmark, Bell, Link } from 'react-feather'



const Tabs = ({ active, toggleTab}) => {
  return (
    <Fragment>
      <Nav pills className='mb-2'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <User className='font-medium-3 me-50' />
            <span className='fw-bold'>استادان فعال</span>
          </NavLink>
        </NavItem>

      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          
<ActiveTeachers/>
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default Tabs
