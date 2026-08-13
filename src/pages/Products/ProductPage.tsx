// import { PRODUCTS } from "../data/ProductData";
// import ProductCard from "./ProductCard";

// /* ---------------- Product Page ---------------- */
// export default function ProductPage() {
//   const query = "";
//   const filtered = PRODUCTS.filter(
//     (p) =>
//       p.name.toLowerCase().includes(query.toLowerCase()) ||
//       p.cat.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <div>
//       {/* <Hero /> */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10">
//         <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
//           {filtered.map((p) => (
//             <ProductCard data={p}  />
//           ))}
//           {filtered.length === 0 && (
//             <p className="col-span-full font-[Karla] text-[#8a7860]">No products match "{query}".</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import ProductCard from "./ProductCard";
import { useGetAllProductsQuery } from "@/redux/features/products/productApi";

/* ---------------- Product Page ---------------- */
export default function ProductPage() {
  const [query, setQuery] = useState("");

  const { data, isLoading, isError, isFetching } = useGetAllProductsQuery(undefined);

  // Adjust this line depending on your actual API response shape.
  // e.g. if backend returns { data: [...] }, use data?.data
  const products = data?.data ?? data ?? [];

  const filtered = products.filter(
    (p: any) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.cat.toLowerCase().includes(query.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10 text-center font-[Karla] text-[#8a7860]">
        Loading products...
      </div>
    );
  }

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
        {/* Optional search input, since `query` was previously hardcoded to "" */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="mb-6 w-full sm:w-80 border border-[#e4d9c7] rounded-md px-4 py-2 font-[Karla] text-sm focus:outline-none focus:ring-1 focus:ring-[#8a7860]"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p: any) => (
            <ProductCard key={p._id ?? p.id} data={p} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full font-[Karla] text-[#8a7860]">
              No products match "{query}".
            </p>
          )}
        </div>

        {isFetching && !isLoading && (
          <p className="text-xs text-[#8a7860] mt-4">Refreshing...</p>
        )}
      </div>
    </div>
  );
}