import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleLayout, handleLastLayout } from "@store/layout";

export const useLayout = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.layout || { layout: "vertical", lastLayout: "vertical" });

  const setLayout = (value) => {
    dispatch(handleLayout(value));
  };

  const setLastLayout = (value) => {
    dispatch(handleLastLayout(value));
  };

  if (typeof window !== "undefined") {
    const breakpoint = 1200;

    useEffect(() => {
      if (window.innerWidth < breakpoint) {
        setLayout("vertical");
      }

      const resizeHandler = () => {
        if (
          window.innerWidth <= breakpoint &&
          store.lastLayout !== "vertical" &&
          store.layout !== "vertical"
        ) {
          setLayout("vertical");
        }
        if (
          window.innerWidth >= breakpoint &&
          store.lastLayout !== store.layout
        ) {
          setLayout(store.lastLayout);
        }
      };

      window.addEventListener("resize", resizeHandler);
      return () => window.removeEventListener("resize", resizeHandler);
    }, [store.layout, store.lastLayout]);
  }

  return {
    layout: store.layout || "vertical",
    setLayout,
    lastLayout: store.lastLayout || "vertical",
    setLastLayout,
  };
};