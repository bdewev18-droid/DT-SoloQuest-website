import type {AnchorHTMLAttributes,ReactNode} from "react";

export function HardLink({children,...props}:AnchorHTMLAttributes<HTMLAnchorElement>&{children:ReactNode}){
  return <a {...props}>{children}</a>;
}
