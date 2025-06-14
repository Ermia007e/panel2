import { useState } from "react";
import BreadcrumbsDefault from "./BreadcrumbsDefault";
import TableServerSide from "./table/TableServerSide";
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

const NewsList = () => {
  const [activeFilter, setActiveFilter] = useState(true)
  
  return (
    <section>
      <div class="d-flex pb-1">
        <h2 
          className="fw-medium text-secondary pe-3 me-2" 
          style={{ 
            borderLeft: "2px solid #e0e0e0", 
            display: "inline-block" 
          }}
        >
          لیست اخبار
        </h2>
        <div><BreadcrumbsDefault/></div>
      </div>
      <div className="d-flex gap-3">
        <div 
          style={{ width: '280px', cursor: 'pointer' }} 
          onClick={() => setActiveFilter(true)}
        >
          <StatsHorizontal 
            color={'primary'} 
            stats='13' 
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
            stats='13' 
            statTitle='اخبار غیرفعال' 
            className={!activeFilter ? 'bg-secondary bg-opacity-50 rounded' : 'transparent'}
          />
        </div>
      </div>
      
      <TableServerSide isActiveFilter={activeFilter} />
    </section>
  );
};
  
export default NewsList;