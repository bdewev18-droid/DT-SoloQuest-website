import Image from "next/image";
import { withBase } from "./base-path";

export function GameScreen({
  src,
  alt,
  className = "",
  framed,
}: {
  src: string;
  alt: string;
  className?: string;
  framed?: boolean;
}) {
  // Phone-framed mockups (.webp/.png) already include a transparent-corner phone bezel.
  const isFramed = framed ?? /\.(webp|png)$/i.test(src);

  return (
    <figure className={`gameScreen ${isFramed ? "isFramed" : ""} ${className}`}>
      {isFramed ? (
        <div className="screenMockup">
          <Image src={withBase(src)} alt={alt} width={502} height={1024} />
        </div>
      ) : (
        <div className="screenCrop">
          <Image src={withBase(src)} alt={alt} width={920} height={2048} />
        </div>
      )}
    </figure>
  );
}
