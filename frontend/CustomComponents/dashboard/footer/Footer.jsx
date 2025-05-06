import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const pathName = usePathname();
  const footerData = [
    { src: "/images/Home.png", route: "/" },
    { src: "/images/recommendations.png", route: "/recommendations" },
    { src: "/images/settings.png", route: "/settings" },
    { src: "/images/profile.png", route: "/profile" },
  ];
  const handleOnClick = (route) => {
    router.push(route);
  };
  return (
    <div className="py-2  sticky inset-0 bg-white">
      <div className="flex justify-around">
        {footerData.map((data, index) => {
          return (
            <button key={index} onClick={() => handleOnClick(data.route)}>
              <Image
                src={data.src}
                width={30}
                height={30}
                className={`${pathName === data.route ? "bg-black mix-blend-difference" : ""}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
