// ** Icons Imports
import { Award } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'
import fetchUsers from "../../../services/api/users/getUsers";
import {getUserInfo} from "../../../services/api/userInfo/getUserInfo";
// ** Reactstrap Imports
import { Card, CardBody, CardText } from 'reactstrap'
import { useQuery } from "react-query";
// ** Images
import decorationLeft from '@src/assets/images/elements/decore-left.png'
import decorationRight from '@src/assets/images/elements/decore-right.png'

const CardCongratulations = () => {
  const { data: usersData, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  
  const { data: userInfoData, isLoading: userInfoLoading, error: userInfoError } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });
  return (
    <Card className='card-congratulations'>
      <CardBody className='text-center'>
        <img className='congratulations-img-left' src={decorationLeft} alt='decor-left' />
        <img className='congratulations-img-right' src={decorationRight} alt='decor-right' />
        <Avatar icon={<Award size={28} />} className='shadow' color='primary' size='xl' />
        <div className='text-center'>
          <h1 className='mb-1 text-white'>خوش امدی , {userInfoData?.fName ?? "User"}</h1>
          <CardText className='m-auto w-75'>
            مقدار پرداخت های کل  <strong>{usersData?.allPaymentCost ?? 0}</strong> انقدر است.
          </CardText>
        </div>
      </CardBody>
    </Card>
  )
}

export default CardCongratulations
