// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

// ** Icons Imports
import { User, Lock, Bookmark, Bell, Link } from 'react-feather'

// ** User Components

import { AllUsers } from './AllUsers/AllUsers'

const UserTabs = ({ active, toggleTab }) => {
  return (
    <Fragment>
      <Nav pills className='mb-2'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <User className='font-medium-3 me-50' />
            <span className='fw-bold'>همه ی کاربران</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <User className='font-medium-3 me-50' />
            <span className='fw-bold'>دانشجویان</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
            <User className='font-medium-3 me-50' />
            <span className='fw-bold'>استادان</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
            <User className='font-medium-3 me-50' />
            <span className='fw-bold'>مدیران</span>
          </NavLink>
        </NavItem>

      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <AllUsers />

        </TabPane>
        <TabPane tabId='2'>
        </TabPane>
        <TabPane tabId='3'>
        </TabPane>
        <TabPane tabId='4'>
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default UserTabs
