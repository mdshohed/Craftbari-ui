
import { Facebook, Heart, Instagram, Menu, Phone, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import logo from '../../../src/assets/logo/Craftbari.png'
import { Link } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

/* ---------------- Header ---------------- */

// export default function Header({ cartCount, onNav, onSearch }: HeaderProps) {
export default function Header() {
  const products = useAppSelector((state) => state.cart.products);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  return (
    <div className="">
      <div className="bg-[#2B1D14] ">
        <div className=" mx-auto max-w-7xl text-[#EFE6D8] text-xs px-4 py-2 flex items-center justify-between">
          <span className="hidden sm:inline">Please call to confirm stock before ordering.</span>
          <span className="sm:hidden">Call to confirm stock</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 "><Phone className="w-3.5 h-3.5" />+8801869961011</span>
            <Facebook className="w-3.5 h-3.5 hidden sm:block" />
            <Instagram className="w-3.5 h-3.5 hidden sm:block" />
          </div>
         </div>
      </div>
      <div className="bg-[#FAF6EF]">
        <div className=" max-w-7xl mx-auto border-b border-[#E4D8C4] px-4 sm:px-4 py-3 flex items-center gap-4">
          {/* <button className="lg:hidden text-[#2B1D14]" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button> */}
          <Link to="/">
              <button className="flex items-center gap-2 shrink-0">
              <img
                  src={logo}
                  alt="logo"
                  className="w-12 lg:w-20"
                  />
              <span className="font-[Fraunces] text-2xl text-[#2B1D14] leading-none">
                  Craft <span className="italic text-[#A8823C]">Bari</span>
              </span>
              </button>
          </Link>
          <div className="hidden md:flex flex-1 max-w-xl items-center border border-[#D8C7A8] rounded-full overflow-hidden bg-white ml-4">
            <input
              // onChange={(e) => onSearch(e.target.value)}
              placeholder="Search for wall clocks, organizers, gifts…"
              className="flex-1 px-4 py-2 text-sm outline-none bg-transparent font-[Karla] text-[#2B1D14] placeholder:text-[#9c8a72]"
            />
            <button className="bg-[#2B1D14] text-[#FAF6EF] px-4 py-2 text-sm font-[Karla] font-semibold">
              Search
            </button>
          </div>
          <div className="flex items-center gap-4 ml-auto text-[#2B1D14]">
            <Link to="/login">
              <User className="w-6 h-6 " />
            </Link>
            <Link to="">
              <Heart className="w-6 h-6 " />
            </Link>
            <Link to="/cart">
              <button className="relative">
                  <ShoppingBag className="w-6 h-6" />
                  {products.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#A8823C] text-white text-[12px] w-5 h-5 rounded-full flex items-center justify-center font-[Karla] font-bold">
                      {products.length}
                  </span>
                  )}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}