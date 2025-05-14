
import fetchUsers from "../../../services/api/users/getUsers";
import Chart from 'react-apexcharts';
import { useQuery } from "react-query";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';

const SupportTracker2 = ({ danger, primary }) => {
  const defaultData = {
    title: 'Default Title',
    totalTicket: 0,
    newTicket: 0,
    openTicket: 0,
    responseTime: 'N/A',
    last_days: ['Last 7 days']
  };

    const { data = defaultData, isLoading, error } = useQuery({
      queryKey: ["users"],
      queryFn: fetchUsers,
    });

  const options = {
    plotOptions: {
      radialBar: {
        size: 150,
        offsetY: 20,
        startAngle: -150,
        endAngle: 150,
        hollow: { size: '65%' },
        track: { background: '#fff', strokeWidth: '100%' },
        dataLabels: {
          name: { offsetY: -5, fontFamily: 'Montserrat', fontSize: '1rem' },
          value: { offsetY: 15, fontFamily: 'Montserrat', fontSize: '1.714rem' }
        }
      }
    },
    colors: [danger || '#ff0000'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [primary || '#0000ff'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: { dashArray: 8 },
    labels: ['Completed Tickets']
  };

  const series = [parseFloat(data?.interActiveUserPercent)?.toFixed(2) ?? 0]; 

  return (
    <Card>
      <CardHeader className='pb-0'>
        <CardTitle tag='h4'>رزرو ها</CardTitle>
        <UncontrolledDropdown className='chart-dropdown'>
          <DropdownToggle color='' className='bg-transparent btn-sm border-0 p-50'>
            1122
          </DropdownToggle>
          <DropdownMenu end>
            {[].map((item, index) => (
              <DropdownItem className='w-100' key={index}>
                {item}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader>
      <CardBody>
        <Row>
          <Col sm='2' className='d-flex flex-column flex-wrap text-center'>
            <h1 className='font-large-2 fw-bolder mt-2 mb-0'>{data.allReserve}</h1>
            <CardText>کل رزرو ها</CardText>
          </Col>
          <Col sm='10' className='d-flex justify-content-center'>
            <Chart options={options} series={series} type='radialBar' height={270} id='support-tracker-card' />
          </Col>
        </Row>
        <div className='d-flex justify-content-between mt-1'>
          <div className='text-center'>
            <CardText className='mb-50'>رزرو های اکسپت نشده</CardText>
            <span className='font-large-1 fw-bold'>{data.allReserveAccept}</span>
          </div>
          <div className='text-center'>
            <CardText className='mb-50'>رزرو های اکسپت شده</CardText>
            <span className='font-large-1 fw-bold'>{data.allReserveNotAccept}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default SupportTracker2;