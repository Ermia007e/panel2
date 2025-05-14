
export default [
    {
      id: "newsList",
      title: "اخبار",
      navLink: "/NewsList",
      children: [
        {
          id: "newsList1",
          title: "لیست اخبار",
          // icon: ,
          navLink: "/NewsList",
        },
        {
          id: "addNews",
          title: "ایجاد خبر جدید",
          // icon: ,
          navLink: "/AddNews",
        },
        {
          id: "categoryList",
          title: "لیست دسته بندی",
          // icon: </>,
          navLink: "/CategoryList"
        },
      ],
    },
]
