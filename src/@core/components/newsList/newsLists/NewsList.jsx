import { useState } from "react";
import BreadcrumbsDefault from "../common/formatDate/BreadcrumbsDefault";
import DataTableServerSide from './table/TableServerSide'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { BookOpen } from "react-feather";
import PageHeader from "../common/formatDate/BreadcrumbsDefault";
import { useNavigate } from "react-router-dom";

const NewsList = () => {
  const [activeFilter, setActiveFilter] = useState(true);
  const [activeCount, setActiveCount] = useState();
  const [inactiveCount, setInactiveCount] = useState();
  const navigate = useNavigate();

  const goToAddNews = () => {
    navigate('/AddNews', { state: { from: '/NewsList' } });
  };

  const handleCountUpdate = (counts) => {
    if (activeFilter) {
      setActiveCount(counts.active);
    } else {
      setInactiveCount(counts.inactive);
    }
  };

  return (
    <section>
      <PageHeader title="لیست اخبار" />
      <div className="d-flex gap-3">
        <div 
          style={{ width: '280px', cursor: 'pointer' }} 
          onClick={() => setActiveFilter(true)}
        >
          <StatsHorizontal 
            color={'primary'} 
            icon={<BookOpen size={20} />}
            stats={activeCount}
            statTitle='اخبار فعال' 
            className={activeFilter ? 'bg-secondary bg-opacity-50 rounded' : 'transparent'}
          />
        </div>
        <div 
          style={{ width: '280px', cursor: 'pointer' }} 
          onClick={() => setActiveFilter(false)}
        >
          <StatsHorizontal 
            color={'success'} 
            icon={<BookOpen size={20} />}
            stats={inactiveCount}
            statTitle='اخبار غیرفعال' 
            className={!activeFilter ? 'bg-secondary bg-opacity-50 rounded' : 'transparent'}
          />
        </div>
      </div>
      <DataTableServerSide 
        isActiveFilter={activeFilter} 
        goToAddNews={goToAddNews}
        onCountUpdate={handleCountUpdate}
      />
    </section>
  );
};
export default NewsList;