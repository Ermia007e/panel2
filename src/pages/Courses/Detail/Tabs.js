// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

// ** Icons Imports
import { User, Lock, Bookmark, Bell, Link } from 'react-feather'

// ** User Components
import Connections from './Connections'
import BillingPlanTab from './Comments'
import Notifications from './UserReserved'
import UserProjectsList from './UserProjectsList'
import SecurityTab from './GroupTab'
import GroupTab from './GroupTab'
import UserReserved from './UserReserved'

const UserTabs = ({ active, toggleTab }) => {
  return (
    <Fragment>
      <Nav pills className='mb-2'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <User className='font-medium-3 me-50' />
            <span className='fw-bold'>کاربر ها</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <Lock className='font-medium-3 me-50' />
            <span className='fw-bold'>گروه ها</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
            <Bookmark className='font-medium-3 me-50' />
            <span className='fw-bold'>کامنت ها</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
            <Bell className='font-medium-3 me-50' />
            <span className='fw-bold'>کاربران رزرو شده</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <UserProjectsList />
        </TabPane>

        <TabPane tabId='2'>
          <GroupTab />
        </TabPane>

        <TabPane tabId='3'>
          <BillingPlanTab />
        </TabPane>

        <TabPane tabId='4'>
          <UserReserved />
        </TabPane>

      </TabContent>
    </Fragment>
  )
}
export default UserTabs
