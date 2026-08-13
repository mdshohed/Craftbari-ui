import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useGetAllProductsQuery } from "@/redux/features/products/productApi";

/* ---------------- Product Page ---------------- */
export default function ProductPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10); 

  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  // reset to page 1 whenever the search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const { data, isLoading, isError, isFetching } = useGetAllProductsQuery({
    page,
    limit,
    searchTerm: debouncedQuery || undefined,
  });

  // Adjust this line depending on your actual API response shape.
  // e.g. if backend returns { data: [...] }, use data?.data
  const products = data?.data ?? data ?? [];

  // Adjust depending on your actual API response shape.
  const meta = data?.meta ?? { page: 1, limit, total: products.length, totalPage: 1 };

  // Search is now done server-side (searchTerm param), so `products`
  // is already filtered + paginated — no client-side filter needed.
  const filtered = products;

  const goPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const goNextPage = () => setPage((p) => Math.min(meta.totalPage, p + 1));

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

        {/* ---------------- PAGINATION ---------------- */}
        {meta.totalPage > 1 && (
          <div className="flex items-center justify-between mt-8 flex-wrap gap-3">
            <p className="text-sm font-[Karla] text-[#8a7860]">
              Page <span className="font-semibold text-[#2B1D14]">{meta.page}</span> of{" "}
              <span className="font-semibold text-[#2B1D14]">{meta.totalPage}</span>{" "}
              &middot; {meta.total} products
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={goPrevPage}
                disabled={page <= 1 || isFetching}
                className="flex items-center gap-1 border border-[#D8C7A8] text-[#2B1D14] font-[Karla] font-semibold px-4 py-2 rounded-full hover:bg-[#F7F3EA] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    disabled={isFetching}
                    className={`w-9 h-9 rounded-full text-sm font-[Karla] font-semibold transition-colors ${
                      n === meta.page
                        ? "bg-[#2B1D14] text-white"
                        : "text-[#2B1D14] hover:bg-[#F7F3EA]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                onClick={goNextPage}
                disabled={page >= meta.totalPage || isFetching}
                className="flex items-center gap-1 border border-[#D8C7A8] text-[#2B1D14] font-[Karla] font-semibold px-4 py-2 rounded-full hover:bg-[#F7F3EA] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}