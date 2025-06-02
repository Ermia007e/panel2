import { useQuery } from "react-query";
import Table from "./Table";
import { getListNewsCategory } from "../../../../services/api/newList/getListNewsCategory";
import PageHeader from "../common/formatDate/BreadcrumbsDefault";

const CategoryList = () => {
   const { data: categoryList, isLoading } = useQuery(['categoryList'], () => getListNewsCategory());

    return(
      <section>
        <PageHeader title="لیست دسته بندی اخبار" />
        <Table categoryList={categoryList} isLoading={isLoading} />
      </section>
    );
};
  
export default CategoryList;