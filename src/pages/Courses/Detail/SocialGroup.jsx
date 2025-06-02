// ** Reactstrap Imports
import {
  Badge,
  Button,
  Card,
  CardHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  UncontrolledDropdown,
} from "reactstrap";

// ** Third Party Components
import {
  Archive,
  ChevronDown,
  Edit,
  FileText,
  MoreVertical,
  Plus,
  Trash,
} from "react-feather";
import DataTable from "react-data-table-component";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Label Images
import xdLabel from "@src/assets/images/icons/brands/xd-label.png";
import vueLabel from "@src/assets/images/icons/brands/vue-label.png";
import htmlLabel from "@src/assets/images/icons/brands/html-label.png";
import reactLabel from "@src/assets/images/icons/brands/react-label.png";
import sketchLabel from "@src/assets/images/icons/brands/sketch-label.png";

// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";
import {
  deleteCourse,
  getSocialGroup,
  getUserReserve,
} from "../../../services/api/Courses";
import { useMutation, useQuery, useQueryClient } from "react-query";
import dateModifier from "../../../utility/dateModifier";
import { useParams } from "react-router-dom";
import AddNewSocialGroup from "./AddNewSocialGroup";
import { useState } from "react";

export const columns = [
  {
    sortable: true,
    minWidth: "200px",
    name: "نام گروه",
    selector: (row) => row.groupName,
    cell: (row) => {
      return (
        <div className="d-flex flex-column">
          <span className="text-truncate fw-bolder">{row.groupName}</span>
        </div>
      );
    },
  },
  {
    sortable: true,
    minWidth: "200px",
    name: "لینک گروه",
    selector: (row) => row.groupLink,
    cell: (row) => {
      return (
        <div className="d-flex flex-column">
          <span className="text-truncate fw-bolder">{row.groupLink}</span>
        </div>
      );
    },
  },

  {
    name: "عملیات",
    allowOverflow: true,
    cell: (row) => {
      const queryClient = useQueryClient();

      const deleteCourseList = () => {
        mutation.mutate(row.id);
      };

      const deleteMutation = useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => {
          toast.success("عملیات موفقیت امیز بود");
          queryClient.invalidateQueries(["getCourseSocialGroup"]);
        },
        onError: () => {
          toast.error("خطا");
        },
      });

      return (
        <div className="d-flex">
          <UncontrolledDropdown>
            <DropdownToggle className="pe-1" tag="span">
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => e.preventDefault()}
              >
                <FileText size={15} />
                <span className="align-middle ms-50">جزئیات</span>
              </DropdownItem>
              <DropdownItem
                onClick={(e) => {
                  e.preventDefault();
                  deleteCourseList();
                }}
                tag="a"
                href="/"
                className="w-100"
              >
                <Trash size={15} />
                <span className="align-middle ms-50">پاک کردن</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Edit size={15} />
        </div>
      );
    },
  },
];

const SocialGroup = () => {
  const [modal, setModal] = useState(false);

  const handleModal = () => setModal(!modal);
  // const { courseId } = useParams()
  // console.log(courseId , "id")

  //query
  const { data: getCourseSocialGroup } = useQuery({
    queryKey: ["getCourseSocialGroup"],
    queryFn: () => {
      const res = getSocialGroup();
      return res;
    },
  });

  console.log(getCourseSocialGroup, "getCourseSocialGroup");

  return (
    <Card>
      <CardHeader tag="h4">لیست گروه های اجتماعی : </CardHeader>
      <div className="react-dataTable user-view-account-projects">
        <DataTable
          noHeader
          responsive
          columns={columns}
          data={getCourseSocialGroup}
          className="react-dataTable"
          sortIcon={<ChevronDown size={10} />}
        />
      </div>
      <Button className="ms-2" color="primary" onClick={handleModal}>
        <Plus size={15} />
        <span className="align-middle ms-50">افزودن گروه</span>
      </Button>
      <AddNewSocialGroup open={modal} handleModal={handleModal} />
    </Card>
  );
};

export default SocialGroup;
