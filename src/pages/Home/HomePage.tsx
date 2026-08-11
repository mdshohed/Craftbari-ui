import { ChevronRight } from "lucide-react";
import { PRODUCTS } from "../data/ProductData";
import ProductCard from "../products/ProductCard";
import { Link } from "react-router-dom";

import { Signature } from "../data/SignatureProducts";


/* ---------------- Home Page ---------------- */
export default function HomePage() {
  const search = "";
  const filtered = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cat.toLowerCase().includes(search.toLowerCase())
  );

  const search2 = "";
  const filtered2 = Signature.filter(
    (p) =>
      p.name.toLowerCase().includes(search2.toLowerCase()) ||
      p.cat.toLowerCase().includes(search2.toLowerCase())
  );

  return (
    <div>
      {/* <Hero /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10">
        <div className="flex items-end justify-between mb-7">
          <div>
            <span className="font-[Karla] text-xs tracking-[0.2em] uppercase text-[#A8823C]">This Month</span>
            <h2 className="font-[Fraunces] text-3xl text-[#2B1D14] mt-1">New Arrivals</h2>
          </div>
          <Link to="/products">
            <span className="font-[Karla] text-sm text-[#A8823C] flex items-center gap-1 cursor-pointer">
              View all <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
          
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ProductCard data={p}  />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full font-[Karla] text-[#8a7860]">No products match "{search}".</p>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10">
        <div className="flex items-end justify-between mb-7">
          <div>
            <span className="font-[Karla] text-xs tracking-[0.2em] uppercase text-[#A8823C]">This Month</span>
            <h2 className="font-[Fraunces] text-3xl text-[#2B1D14] mt-1">Signature Blends</h2>
          </div>
          <Link to="/products">
            <span className="font-[Karla] text-sm text-[#A8823C] flex items-center gap-1 cursor-pointer">
              View all <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
          
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered2.map((p) => (
            <ProductCard data={p} />
          ))}
          {filtered2.length === 0 && (
            <p className="col-span-full font-[Karla] text-[#8a7860]">No products match "{search}".</p>
          )}
        </div>
      </div>
    </div>
  );
}