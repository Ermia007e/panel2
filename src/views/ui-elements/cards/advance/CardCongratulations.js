// ** Icons Imports
import { Award } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardBody, CardText } from 'reactstrap'


const CardCongratulations = () => {
  return (
    <Card className='card-congratulations'>
      <CardBody className='text-center'>
        <Avatar icon={<Award size={28} />} className='shadow' color='primary' size='xl' />
        <div className='text-center'>
          <h1 className='mb-1 text-white'>Congratulations John,</h1>
          <CardText className='m-auto w-75'>
            You have done <strong>57.6%</strong> more sales today. Check your new badge in your profile.
          </CardText>
        </div>
      </CardBody>
    </Card>
  )
}

export default CardCongratulations
