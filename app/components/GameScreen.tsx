import Image from "next/image";

export function GameScreen({src,alt,className=""}:{src:string;alt:string;className?:string}){
  return <figure className={`gameScreen ${className}`}>
    <div className="screenCrop"><Image src={src} alt={alt} width={920} height={2048} /></div>
  </figure>
}
