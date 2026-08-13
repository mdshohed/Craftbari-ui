import { ChevronRight } from "lucide-react";
import ProductCard from "../products/ProductCard";
import { Link } from "react-router-dom";
import { Product } from "@/types/types";
import { useGetAllProductsQuery } from "@/redux/features/products/productApi";

/* ---------------- Skeleton Card ---------------- */
function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#E4D8C4] bg-white animate-pulse">
      <div className="aspect-square bg-[#EDE3D0] blur-[2px]" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-1/3 bg-[#EDE3D0] rounded blur-[1px]" />
        <div className="h-4 w-3/4 bg-[#EDE3D0] rounded blur-[1px]" />
        <div className="h-4 w-1/2 bg-[#EDE3D0] rounded blur-[1px]" />
      </div>
    </div>
  );
}

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ---------------- Home Page ---------------- */
export default function HomePage() {
  const { data: response, isLoading, isError } = useGetAllProductsQuery(undefined);

  // Adjust depending on your actual API response shape.
  // e.g. if backend returns { data: [...] }, use response?.data
  const products: Product[] = response?.data ?? response ?? [];

  const search = "";
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cat.toLowerCase().includes(search.toLowerCase())
  );

  const search2 = "";
  // Fisher-Yates shuffle — doesn't mutate the original array
  function shuffleArray<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
    const filtered2 = shuffleArray(products).filter(
    (p) =>
      p.name.toLowerCase().includes(search2.toLowerCase()) ||
      p.cat.toLowerCase().includes(search2.toLowerCase())
  );

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10 text-center font-[Karla] text-red-500">
        Failed to load products. Please try again.
      </div>
    );
  }

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

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p._id ?? p.id} data={p} />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full font-[Karla] text-[#8a7860]">No products match "{search}".</p>
            )}
          </div>
        )}
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

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered2.map((p) => (
              <ProductCard key={p._id ?? p.id} data={p} />
            ))}
            {filtered2.length === 0 && (
              <p className="col-span-full font-[Karla] text-[#8a7860]">No products match "{search2}".</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}