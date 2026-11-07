import Image from "next/image";
import { withBase } from "./base-path";

export function GameScreen({
  src,
  alt,
  className = ""
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <figure className={`gameScreen ${className}`}>
      <div className="screenCrop">
        <Image src={withBase(src)} alt={alt} width={920} height={2048} />
      </div>
    </figure>
  );
}
