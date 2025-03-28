import Image from "next/image";
import logoSrc from "@/assets/logo.svg";

export function BrandSection() {
  return (
    <div className="hidden lg:flex w-1/2 relative z-10">
      <div className="flex flex-col justify-center px-16">
        <div className="flex items-center pb-12">
          <Image src={logoSrc} alt="HighBridge Logo" width={60} height={60} className="mr-4" />
          <h1 className="text-5xl font-bold text-white">HighBridge</h1>
        </div>
        <p className="mt-4 text-[40px] text-white">Building the Future...</p>
        <p className="mt-2 text-white text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  );
}