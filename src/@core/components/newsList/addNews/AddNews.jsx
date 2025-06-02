import { getListNewsCategory } from "../../../../services/api/newList/getListNewsCategory";
import PageHeader from "../common/formatDate/BreadcrumbsDefault";
import MultipleColumnForm from "./MultipleColumnForm";
import { useQuery } from 'react-query'

const AddNews = () => {
  const { data: categories, isLoading, isError, error } = useQuery({
    queryKey: ['newsCategories'],
    queryFn: getListNewsCategory,
    onError: (error) => console.error('Error fetching categories:', error),
  });

  return (
    <section>
        <PageHeader title="ایجاد خبر جدید" />
      <MultipleColumnForm 
        categories={categories}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </section>
  );
};
export default AddNews;