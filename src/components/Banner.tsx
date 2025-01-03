import { PropsWithChildren } from "react";
import "./Banner.css";

type Props = {
  variant: "success" | "error";
};

export function Banner({ variant, children }: PropsWithChildren<Props>) {
  return <div className={`banner ${variant}`}>{children}</div>;
}
