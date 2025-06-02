import { create } from 'zustand'

const useCourseStore = create((set) => ({
    title: '',
    describe: '',
    miniDescribe:'',
    unitPerCost: '',
    capacity: '',
    sessionNumber: '',
    cost:'',
    uniqeUrlString: '',
    image:'',
    startTime: '',
    endTime: '',
    googleSchema: '',
    googleTitle: '',
    CoursePrerequisiteId:'',
    currentCoursePaymentNumber: '',
    shortLink: '',
    tumbImageAddress: ([]),
    imageAddress: '',
    //
    courseTypeId: [],
    courseLvlId: [],
    classId: [],
    teacherId: null,
    tremId: [],
    techId: [],

    // Actions
    setTitle: (title) => set({ title }),
    setDescribe: (describe) => set({ describe }),
    setMiniDescribe: (miniDescribe) => set({ miniDescribe }),
    setUnitPerCost: (unitPerCost) => set({ unitPerCost }),
    setCapacity: (capacity) => set({ capacity }),
    setSessionNumber: (sessionNumber) => set({ sessionNumber }),
    setCost: (cost) => set({ cost }),
    setUniqeUrlString: (uniqeUrlString) => set({ uniqeUrlString }),
    setImage: (image) => set({ image }),

    setStartTime: (startTime) => set({ startTime }),
    setEndTime: (endTime) => set({ endTime }),
    setGoogleSchema: (googleSchema) => set({ googleSchema }),
    setGoogleTitle: (googleTitle) => set({ googleTitle }),
    setCoursePrerequisiteId: (coursePrerequisiteId) => set({ coursePrerequisiteId }),

    setCurrentCoursePaymentNumber: (currentCoursePaymentNumber) => set({ currentCoursePaymentNumber }),
    setShortLink: (shortLink) => set({ shortLink }),
    setTumbImageAddress: (tumbImageAddress) => set({tumbImageAddress }),
    setImageAddress: (imageAddress) => set({ imageAddress }),
    //
    setCourseTypeId: (courseTypeId) => set({ courseTypeId }),
    setCourseLvlId: (courseLvlId) => set({ courseLvlId }),
    setClassId: (classId) => set({ classId }),
    setTeacherId: (teacherId) => set({ teacherId }),
    setTremId: (tremId) => set({ tremId }),
    setTechId: (techId) => set({ techId }),
}))

export default useCourseStore
