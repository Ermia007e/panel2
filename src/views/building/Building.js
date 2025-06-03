import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Table, Spinner, Badge, Button, Modal, ModalBody, ModalFooter, Input, Label, FormGroup } from "reactstrap";
import gsap from "gsap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiPlus, FiSearch, FiEdit, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useSelector } from "react-redux";

import {
  getBuilding as fetchBuildingsApi,
  activateBuilding as activateBuildingApi,
  deactivateBuilding as deactivateBuildingApi,
  addBuilding as addBuildingApi,
  updateBuilding as updateBuildingApi
} from "../../services/api/building/getBuilding";

function useDarkMode() {
  const skin = useSelector(state => state.layout?.skin);
  return skin === "dark";
}

function AnimatedModal({ isOpen, children, ...props }) {
  const modalRef = useRef();
  useLayoutEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} innerRef={modalRef} {...props} style={{ zIndex: 10000 }}>
      {children}
    </Modal>
  );
}

export default function Building() {
  const darkMode = useDarkMode();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsRef = useRef({});
  const queryClient = useQueryClient();

  const [modal, setModal] = useState({ open: false, type: "", building: null });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentBuildingToEdit, setCurrentBuildingToEdit] = useState(null);

  const containerRef = useRef();
  const titleRef = useRef();
  const boxRef = useRef();

  // --- Data Fetching با react-query ---
  const itemsPerPage = 10;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["buildings"],
    queryFn: async () => {
      console.log(`API Call: Fetching ALL buildings from backend.`);
      const response = await fetchBuildingsApi({});
      console.log("API Raw Response Data (as received by Building.js):", response);
      return response; 
    },
    onError: (err) => {
      toast.error("خطا در بارگذاری لیست ساختمان‌ها: " + err.message);
      console.error("Error fetching buildings:", err);
    }
  });

  const allBuildings = Array.isArray(data) ? data : [];

  const filteredBuildings = allBuildings.filter(b =>
    b.buildingName && b.buildingName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const buildingsToDisplay = filteredBuildings.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalBuildings = filteredBuildings.length;
  const totalPages = Math.ceil(totalBuildings / itemsPerPage);

  const activateMutation = useMutation({
    mutationFn: activateBuildingApi,
    onSuccess: (res) => {
      if (res && typeof res === 'object' && res.success === false) {
        toast.error(res.message || "فعال کردن ساختمان با خطا مواجه شد.");
      } else {
        toast.success("ساختمان فعال شد.");
        queryClient.invalidateQueries({ queryKey: ["buildings"] });
        closeModal();
      }
    },
    onError: (err) => {
      toast.error("فعال کردن ساختمان با خطا مواجه شد.");
      console.error("Activate error:", err);
    }
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateBuildingApi,
    onSuccess: (res) => {
      if (res && typeof res === 'object' && res.success === false) {
        toast.error(res.message || "غیرفعال کردن ساختمان با خطا مواجه شد.");
      } else {
        toast.success("ساختمان غیرفعال شد.");
        queryClient.invalidateQueries({ queryKey: ["buildings"] });
        closeModal();
      }
    },
    onError: (err) => {
      toast.error("غیرفعال کردن ساختمان با خطا مواجه شد.");
      console.error("Deactivate error:", err);
    }
  });

  const addBuildingMutation = useMutation({
    mutationFn: addBuildingApi,
    onSuccess: (res) => {
      if (res && typeof res === 'object' && res.success === false) {
        toast.error(res.message || "افزودن ساختمان با خطا مواجه شد.");
      } else {
        toast.success("ساختمان با موفقیت افزوده شد.");
        queryClient.invalidateQueries({ queryKey: ["buildings"] });
        setAddModalOpen(false);
        setNewBuilding({ buildingName: "", workDate: "", floor: 1, latitude: "", longitude: "", active: true });
      }
    },
    onError: (err) => {
      toast.error("افزودن ساختمان با خطا مواجه شد.");
      console.error("Add building error:", err);
    }
  });

  const updateBuildingMutation = useMutation({
    mutationFn: ({ id, updatedData }) => updateBuildingApi(id, updatedData),
    onSuccess: (res) => {
      if (res && typeof res === 'object' && res.success === false) {
        toast.error(res.message || "ویرایش ساختمان با خطا مواجه شد.");
      } else {
        toast.success("ساختمان با موفقیت ویرایش شد.");
        queryClient.invalidateQueries({ queryKey: ["buildings"] });
        setEditModalOpen(false);
        setCurrentBuildingToEdit(null);
      }
    },
    onError: (err) => {
      toast.error("ویرایش ساختمان با خطا مواجه شد.");
      console.error("Update building error:", err);
    }
  });

  useLayoutEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
    gsap.fromTo(titleRef.current, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: "power3.out" });
    gsap.fromTo(boxRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.7, delay: 0.35, ease: "back.out(1.7)" });
  }, []);
  useEffect(() => {
    if (!isLoading && buildingsToDisplay.length) {
      const currentRows = buildingsToDisplay.map(b => rowsRef.current[b.id]).filter(Boolean);
      gsap.killTweensOf(currentRows);
      gsap.fromTo(currentRows, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" });
    }
  }, [buildingsToDisplay, isLoading]);

  const openModal = (type, building) => {
    setModal({ open: true, type, building });
  };
  const closeModal = () => setModal({ open: false, type: "", building: null });

  const handleAction = () => {
    if (!modal.building) return;
    const id = modal.building.id;
    if (modal.type === "accept") activateMutation.mutate(id);
    if (modal.type === "reject") deactivateMutation.mutate(id);
  };

  const [newBuilding, setNewBuilding] = useState({
    buildingName: "", workDate: "", floor: 1, latitude: "", longitude: "", active: true
  });

  const handleAddInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBuilding(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddBuildingSubmit = (e) => {
    e.preventDefault();
    if (!newBuilding.buildingName || !newBuilding.workDate || !newBuilding.latitude || !newBuilding.longitude) {
      toast.error("لطفاً تمامی فیلدهای الزامی را پر کنید.");
      return;
    }
    addBuildingMutation.mutate(newBuilding);
  };

  const handleEditBuilding = (building) => {
    const formattedWorkDate = building.workDate ? new Date(building.workDate).toISOString().split('T')[0] : '';
    setCurrentBuildingToEdit({ ...building, workDate: formattedWorkDate });
    setEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentBuildingToEdit(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!currentBuildingToEdit?.buildingName || !currentBuildingToEdit?.workDate || !currentBuildingToEdit?.latitude || !currentBuildingToEdit?.longitude) {
      toast.error("لطفاً تمامی فیلدهای الزامی را پر کنید.");
      return;
    }
    updateBuildingMutation.mutate({
      id: currentBuildingToEdit.id,
      updatedData: currentBuildingToEdit
    });
  };

  const btnAnim = {
    onMouseEnter: e => gsap.to(e.currentTarget, { scale: 1.08, boxShadow: "0 0 12px #1890ff55", duration: 0.18 }),
    onMouseLeave: e => gsap.to(e.currentTarget, { scale: 1, boxShadow: "none", duration: 0.18 }),
    onMouseDown: e => gsap.to(e.currentTarget, { scale: 0.93, duration: 0.1 }),
    onMouseUp: e => gsap.to(e.currentTarget, { scale: 1, duration: 0.1 }),
  };

  const actionBtnAnim = {
    onMouseEnter: e => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.15 }),
    onMouseLeave: e => gsap.to(e.currentTarget, { scale: 1, duration: 0.15 }),
    onMouseDown: e => gsap.to(e.currentTarget, { scale: 0.95, duration: 0.08 }),
    onMouseUp: e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.08 }),
  };

  const darkBox = { background: "linear-gradient(135deg, #23272b 60%, #18191a 100%)", color: "#e4e6eb", borderRadius: 24, boxShadow: "0 8px 32px #0008" };
  const darkTable = {
    background: "#23272b",
    color: "#e4e6eb",
    borderRadius: 16,
    tableLayout: "fixed",
    wordWrap: "break-word"
  };
  const darkThead = { background: "#18191a", color: "#ffd666" };


  return (
    <div ref={containerRef} className="container py-4" style={{ maxWidth: 1200, fontFamily: "Vazirmatn, Tahoma, Arial" }}>
      <ToastContainer rtl position="top-center" theme={darkMode ? "dark" : "light"} />
      <h2 ref={titleRef} className="text-center mb-4 fw-bold" style={{ letterSpacing: 1.5, fontSize: 32, color: darkMode ? "#ffd666" : "#1890ff" }}>
        لیست ساختمان‌ها
      </h2>
      <div ref={boxRef} className="rounded-4 shadow-sm p-3 p-md-4" style={darkMode ? darkBox : { background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px #0002" }}>

        <div className="d-flex justify-content-end mb-3">
          <Button
            color="success"
            className="d-flex align-items-center gap-2"
            onClick={() => {
              setNewBuilding({ buildingName: "", workDate: "", floor: 1, latitude: "", longitude: "", active: true });
              setAddModalOpen(true);
            }}
            {...btnAnim}
          >
            <FiPlus size={20} />
            افزودن ساختمان جدید
          </Button>
        </div>
        <div className="mb-3 position-relative">
          <Input
            type="text"
            className="form-control"
            placeholder="جستجو بر اساس نام ساختمان..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); 
            }}
            style={{ borderRadius: 12, paddingRight: "45px", paddingLeft: "15px", border: darkMode ? "1px solid #333" : "1px solid #ddd", background: darkMode ? "#18191a" : "#fff", color: darkMode ? "#e4e6eb" : "#222", fontSize: 16 }}
          />
          <FiSearch size={20} style={{ position: "absolute", right: '15px', top: '50%', transform: 'translateY(-50%)', color: darkMode ? "#aaa" : "#555" }} />
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-5 text-danger">
            <p>خطا در بارگذاری داده‌ها: {error?.message || "مشکلی پیش آمد."}</p>
            <p>لطفاً اتصال به اینترنت خود را بررسی کنید یا با پشتیبانی تماس بگیگرید.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table bordered hover className="align-middle text-center" style={darkMode ? darkTable : { borderRadius: 16, fontSize: 16, tableLayout: "fixed", wordWrap: "break-word", background: "#f6faff" }}>
              <thead style={darkMode ? darkThead : {}}>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '20%' }}>نام ساختمان</th>
                  <th style={{ width: '15%' }}>تاریخ کار</th>
                  <th style={{ width: '10%' }}>طبقه</th>
                  <th style={{ width: '15%' }}>عرض جغرافیایی</th>
                  <th style={{ width: '15%' }}>طول جغرافیایی</th>
                  <th style={{ width: '10%' }}>وضعیت</th>
                  <th style={{ width: '15%' }}>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {buildingsToDisplay.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-4 text-muted">
                      {searchTerm ? "ساختمانی با این نام یافت نشد." : "داده‌ای برای نمایش وجود ندارد."}
                    </td>
                  </tr>
                ) : (
                  buildingsToDisplay.map((b, i) => {
                    const globalIndex = (page - 1) * itemsPerPage + i;

                    return (
                      <tr
                        key={b.id}
                        ref={el => (rowsRef.current[b.id] = el)}
                        style={darkMode ? { background: i % 2 === 0 ? "#23272b" : "#282c34", transition: "all 0.3s ease", boxShadow: "0 2px 8px #0004" } : { background: i % 2 === 0 ? "#fafdff" : "#f3f7fa", transition: "all 0.3s ease", boxShadow: "0 2px 8px rgba(24,144,255,0.04)" }}
                        onMouseEnter={e => { gsap.to(e.currentTarget, { background: darkMode ? "#18191a" : "#e6f7ff", scale: 1.01, boxShadow: darkMode ? "0 4px 16px #ffd66633" : "0 4px 16px #91d5ff55", duration: 0.2 }) }}
                        onMouseLeave={e => { gsap.to(e.currentTarget, { background: darkMode ? (i % 2 === 0 ? "#23272b" : "#282c34") : (i % 2 === 0 ? "#fafdff" : "#f3f7fa"), scale: 1, boxShadow: darkMode ? "0 2px 8px #0004" : "0 2px 8px rgba(24,144,255,0.04)", duration: 0.2 }) }}
                      >
                        <td style={{ fontWeight: "bold" }}>{globalIndex + 1}</td>
                        <td>
                          <span style={{ fontWeight: "bold", cursor: "pointer", transition: "color 0.2s", color: darkMode ? "#ffd666" : "#222" }} onMouseEnter={e => gsap.to(e.currentTarget, { color: "#52c41a", scale: 1.08, duration: 0.2 })} onMouseLeave={e => gsap.to(e.currentTarget, { color: darkMode ? "#ffd666" : "#222", scale: 1, duration: 0.2 })} >
                            {b.buildingName}
                          </span>
                        </td>
                        <td>{new Date(b.workDate).toLocaleDateString("fa-IR")}</td>
                        <td>{b.floor}</td>
                        <td>{b.latitude}</td>
                        <td>{b.longitude}</td>
                        <td>
                          {b.active
                            ? <Badge color="success" style={{ fontSize: 15 }}>فعال</Badge>
                            : <Badge color="danger" style={{ fontSize: 15 }}>غیرفعال</Badge>
                          }
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              color="info"
                              size="sm"
                              className="p-1"
                              onClick={() => handleEditBuilding(b)}
                              {...actionBtnAnim}
                              style={{ borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: darkMode ? "0 2px 8px rgba(0,255,255,0.3)" : "0 2px 8px rgba(0,0,0,0.1)" }}
                            >
                              <FiEdit size={18} />
                            </Button>
                            
                            {b.active ? (
                              <Button
                                color="warning"
                                size="sm"
                                className="p-1"
                                onClick={() => openModal("reject", b)}
                                {...actionBtnAnim}
                                style={{ borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: darkMode ? "0 2px 8px rgba(255,255,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)" }}
                              >
                                <FiXCircle size={18} />
                              </Button>
                            ) : (
                              <Button
                                color="success"
                                size="sm"
                                className="p-1"
                                onClick={() => openModal("accept", b)}
                                {...actionBtnAnim}
                                style={{ borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: darkMode ? "0 2px 8px rgba(0,255,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)" }}
                              >
                                <FiCheckCircle size={18} /> 
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        )}
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
          <Button
            color={darkMode ? "light" : "primary"}
            outline
            size="md"
            disabled={page === 1}
            onClick={() => { setPage(p => Math.max(1, p - 1)); }}
            style={{ minWidth: 100, fontWeight: "bold", fontSize: 18, borderRadius: 12, background: darkMode ? "#23272b" : undefined, color: darkMode ? "#ffd666" : undefined, borderColor: darkMode ? "#ffd666" : undefined }}
            {...btnAnim}
          >
            قبلی
          </Button>
          <span className="fw-bold px-3 py-2 rounded" style={{ fontSize: 18, minWidth: 120, textAlign: "center", background: darkMode ? "#18191a" : "#f6faff", color: darkMode ? "#ffd666" : "#222" }}>
            صفحه {totalPages === 0 ? 0 : page} از {totalPages || 1}
          </span>
          <Button
            color={darkMode ? "light" : "primary"}
            outline
            size="md"
            disabled={page >= totalPages || totalBuildings === 0}
            onClick={() => { setPage(p => p + 1); }}
            style={{ minWidth: 100, fontWeight: "bold", fontSize: 18, borderRadius: 12, background: darkMode ? "#23272b" : undefined, color: darkMode ? "#ffd666" : undefined, borderColor: darkMode ? "#ffd666" : undefined }}
            {...btnAnim}
          >
            بعدی
          </Button>
        </div>
      </div>

      <AnimatedModal isOpen={modal.open} toggle={closeModal} centered>
        <ModalBody className="text-center fs-5" style={darkMode ? { background: "#23272b", color: "#ffd666" } : {}}>
          {modal.type === "accept" && (
            <>آیا مطمئن هستید که می‌خواهید این ساختمان را <span className="text-success fw-bold">فعال</span> کنید؟</>
          )}
          {modal.type === "reject" && (
            <>آیا مطمئن هستید که می‌خواهید این ساختمان را <span className="text-warning fw-bold">غیرفعال</span> کنید؟</>
          )}
        </ModalBody>
        <ModalFooter style={darkMode ? { background: "#18191a", borderTop: "1px solid #333" } : {}}>
          <Button color={darkMode ? "secondary" : "secondary"} onClick={closeModal} {...btnAnim}>انصراف</Button>
          <Button
            color={modal.type === "accept" ? "success" : "warning"}
            onClick={handleAction}
            disabled={activateMutation.isLoading || deactivateMutation.isLoading}
            {...btnAnim}
          >
            تایید
          </Button>
        </ModalFooter>
      </AnimatedModal>

      <AnimatedModal isOpen={addModalOpen} toggle={() => setAddModalOpen(false)} centered>
        <ModalBody style={darkMode ? { background: "#23272b", color: "#ffd666" } : {}}>
          <h5 className="mb-4 text-center">افزودن ساختمان جدید</h5>
          <form onSubmit={handleAddBuildingSubmit}>
            <FormGroup className="mb-3">
              <Label htmlFor="buildingName">نام ساختمان:</Label>
              <Input
                type="text" id="buildingName" name="buildingName" value={newBuilding.buildingName} onChange={handleAddInputChange} required
                style={{ background: darkMode ? "#18191a" : "#fff", color: darkMode ? "#e4e6eb" : "#222", borderColor: darkMode ? "#333" : "#ddd" }}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label htmlFor="workDate">تاریخ کار:</Label>
              <Input
                type="date" id="workDate" name="workDate" value={newBuilding.workDate} onChange={handleAddInputChange} required
                style={{ background: darkMode ? "#18191a" : "#fff", color: darkMode ? "#e4e6eb" : "#222", borderColor: darkMode ? "#333" : "#ddd" }}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label htmlFor="floor">طبقه:</Label>
              <Input
                type="number" id="floor" name="floor" value={newBuilding.floor} onChange={handleAddInputChange} required min="1"
                style={{ background: darkMode ? "#18191a" : "#fff", color: darkMode ? "#e4e6eb" : "#222", borderColor: darkMode ? "#333" : "#ddd" }}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label htmlFor="latitude">عرض جغرافیایی:</Label>
              <Input
                type="text" id="latitude" name="latitude" value={newBuilding.latitude} onChange={handleAddInputChange} required
                style={{ background: darkMode ? "#18191a" : "#fff", color: darkMode ? "#e4e6eb" : "#222", borderColor: darkMode ? "#333" : "#ddd" }}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label htmlFor="longitude">طول جغرافیایی:</Label>
              <Input
                type="text" id="longitude" name="longitude" value={newBuilding.longitude} onChange={handleAddInputChange} required
                style={{ background: darkMode ? "#18191a" : "#fff", color: darkMode ? "#e4e6eb" : "#222", borderColor: darkMode ? "#333" : "#ddd" }}
              />
            </FormGroup>
            <FormGroup check className="mb-3">
              <Input type="checkbox" id="active" name="active" checked={newBuilding.active} onChange={handleAddInputChange} className="form-check-input" />
              <Label htmlFor="active" check>فعال</Label>
            </FormGroup>
            <ModalFooter style={darkMode ? { background: "#23272b", borderTop: "1px solid #333" } : {}}>
              <Button color={darkMode ? "secondary" : "secondary"} onClick={() => setAddModalOpen(false)} {...btnAnim}>انصراف</Button>
              <Button color="success" type="submit" disabled={addBuildingMutation.isLoading} {...btnAnim}>
                {addBuildingMutation.isLoading ? <Spinner size="sm" /> : "افزودن"}
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </AnimatedModal>
      <AnimatedModal isOpen={editModalOpen} toggle={() => setEditModalOpen(false)} centered>
        <ModalBody style={darkMode ? { background: "#23272b", color: "#ffd666" } : {}}>
          <h5 className="mb-4 text-center">ویرایش ساختمان</h5>
          {currentBuildingToEdit && (
            <form onSubmit={handleEditSubmit}>
              <FormGroup className="mb-3">
                <Label htmlFor="editBuildingName">نام ساختمان:</Label>
                <Input
                  type="text" id="editBuildingName" name="buildingName"
                  value={currentBuildingToEdit.buildingName || ''} onChange={handleEditInputChange} required
                  style={{ background: darkMode ? "#18191a" : "#fff", color: darkMode ? "#e4e6eb" : "#222", borderColor: darkMode ? "#333" : "#ddd" }}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label htmlFor="editWorkDate">تاریخ کار:</Label>
                <Input
                  type="date" id="editWorkDate" name="workDate"
                  value={currentBuildingToEdit.workDate ? new Date(currentBuildingToEdit.workDate).toISOString().split('T')[0] : ''} onChange={handleEditInputChange} required
                  style={{ background: darkMode ? "#18191a" : "#fff", color: darkMode ? "#e4e6eb" : "#222", borderColor: darkMode ? "#333" : "#ddd" }}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label htmlFor="editFloor">طبقه:</Label>
                <Input
                  type="number" id="editFloor" name="floor"
                  value={currentBuildingToEdit.floor || 1} onChange={handleEditInputChange} required min="1"
                  style={{ background: darkMode ? "#18191a" : "#fff", color: darkMode ? "#e4e6eb" : "#222", borderColor: darkMode ? "#333" : "#ddd" }}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label htmlFor="editLatitude">عرض جغرافیایی:</Label>
                <Input
                  type="text" id="editLatitude" name="latitude"
                  value={currentBuildingToEdit.latitude || ''} onChange={handleEditInputChange} required
                  style={{ background: darkMode ? "#18191a" : "#fff", color: darkMode ? "#e4e6eb" : "#222", borderColor: darkMode ? "#333" : "#ddd" }}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label htmlFor="editLongitude">طول جغرافیایی:</Label>
                <Input
                  type="text" id="editLongitude" name="longitude"
                  value={currentBuildingToEdit.longitude || ''} onChange={handleEditInputChange} required
                  style={{ background: darkMode ? "#18191a" : "#fff", color: darkMode ? "#e4e6eb" : "#222", borderColor: darkMode ? "#333" : "#ddd" }}
                />
              </FormGroup>
              <FormGroup check className="mb-3">
                <Input type="checkbox" id="editActive" name="active" checked={currentBuildingToEdit.active || false} onChange={handleEditInputChange} className="form-check-input" />
                <Label htmlFor="editActive" check>فعال</Label>
              </FormGroup>
              <ModalFooter style={darkMode ? { background: "#23272b", borderTop: "1px solid #333" } : {}}>
                <Button color={darkMode ? "secondary" : "secondary"} onClick={() => setEditModalOpen(false)} {...btnAnim}>انصراف</Button>
                <Button color="primary" type="submit" disabled={updateBuildingMutation.isLoading} {...btnAnim}>
                  {updateBuildingMutation.isLoading ? <Spinner size="sm" /> : "ذخیره تغییرات"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalBody>
      </AnimatedModal>

      {darkMode && (
        <style>
          {`
          body, .container { background: #18191a !important; color: #e4e6eb !important; }
          .table thead th, .table-light th { background: #18191a !important; color: #ffd666 !important; }
          .table-bordered { border-color: #333 !important; }
          .form-control, .form-select { background: ${darkMode ? "#18191a" : "#fff"} !important; color: ${darkMode ? "#e4e6eb" : "#222"} !important; border-color: ${darkMode ? "#333" : "#ddd"} !important; }
          .form-control:focus { border-color: ${darkMode ? "#ffd666" : "#1890ff"} !important; box-shadow: 0 0 0 0.25rem ${darkMode ? "rgba(255,214,102,.25)" : "rgba(24,144,255,.25)"} !important; }
          .form-check-input { background-color: ${darkMode ? "#333" : "#fff"} !important; border-color: ${darkMode ? "#555" : "#ccc"} !important; }
          .form-check-input:checked { background-color: #1890ff !important; border-color: #1890ff !important; }
          .form-check-label { color: ${darkMode ? "#e4e6eb" : "#222"} !important; }
          `}
        </style>
      )}
    </div>
  );
}