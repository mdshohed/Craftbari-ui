import { useMemo, useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Key,
  LayoutGrid,
  Loader2,
  LucideIcon,
  Pencil,
  Pill,
  PenTool,
  PiggyBank,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/types";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "@/redux/features/products/productApi";
import CreateProduct from "./CreateProduct"; 
import { EditProductForm } from "./EditProductForm";

/* ---------------- Icon registry ---------------- */
const ICONS: Record<string, LucideIcon> = {
  Clock,
  PenTool,
  PiggyBank,
  Pill,
  Key,
  CalendarDays,
};
const ICON_NAMES = Object.keys(ICONS);

const CATEGORY_PREFIX: Record<string, string> = {
  "Wall Clocks": "WC",
  "Desk Organizers": "DO",
  "Savings Banks": "SB",
  "Health & Wellness": "HW",
  Accessories: "AC",
  "Home & Living": "HL",
};
const CATEGORIES = Object.keys(CATEGORY_PREFIX);

function calcDiscount(price: number, was: number): number {
  if (!was || was <= price) return 0;
  return Math.round(((was - price) / was) * 100);
}

type ApiProduct = Omit<Product, "icon"> & { icon: string };

function mapApiToProduct(raw: ApiProduct): Product {
  return {
    ...raw,
    icon: ICONS[raw.icon] ?? ICONS[ICON_NAMES[0]],
  } as Product;
}

function unwrapList(res: any): ApiProduct[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  return [];
}

function unwrapItem(res: any): ApiProduct | null {
  if (!res) return null;
  if (res.data) return res.data;
  return res;
}

/* ---------------- Pagination meta shape ---------------- */
interface ListMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

function unwrapMeta(res: any): ListMeta {
  return (
    res?.meta ?? { page: 1, limit: 10, total: 0, totalPage: 1 }
  );
}

/* ---------------- Edit form shape ---------------- */
interface EditForm {
  _id: string;
  id: number;
  code: string;
  name: string;
  bn: string;
  price: string;
  was: string;
  minOrder: string;
  iconName: string;
  cat: string;
  quantity: string;
  existingImageUrls: string[];
  description: string;
}

function productToEditForm(p: Product): EditForm {
  const name = Object.entries(ICONS).find(([, comp]) => comp === p.icon)?.[0] ?? ICON_NAMES[0];
  return {
    _id: p._id,
    id: p.id,
    code: p.code ?? "",
    name: p.name ?? "",
    bn: p.bn ?? "",
    price: String(p.price ?? ""),
    was: String(p.was ?? ""),
    minOrder: String(p.minOrder ?? 1),
    iconName: name,
    cat: p.cat ?? CATEGORIES[0],
    quantity: String(p.quantity ?? 1),
    existingImageUrls: p.images ? [...p.images] : [],
    description: p.description ?? "",
  };
}

type ViewMode = "list" | "view" | "add" | "edit";

/* ---------------- Product Management Page ---------------- */
export default function ProductManagementPage() {
  const [mode, setMode] = useState<ViewMode>("list");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  /* ---------- pagination state ---------- */
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // debounce the search box so we don't refetch on every keystroke
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  // reset to page 1 whenever the (debounced) search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  /* ---------- data fetching ---------- */
  const {
    data: listRes,
    isLoading: listLoading,
    isFetching: listFetching,
    isError: listError,
    refetch: refetchList,
  } = useGetAllProductsQuery({
    page,
    limit,
    searchTerm: debouncedQuery || undefined,
  });

  const products: Product[] = useMemo(
    () => unwrapList(listRes).map(mapApiToProduct),
    [listRes]
  );

  const meta = useMemo(() => unwrapMeta(listRes), [listRes]);

  const { data: singleRes, isLoading: singleLoading } = useGetSingleProductQuery(
    activeId as string,
    { skip: activeId == null || (mode !== "view" && mode !== "edit") }
  );

  const activeProduct: Product | null = useMemo(() => {
    const raw = unwrapItem(singleRes);
    if (raw) return mapApiToProduct(raw);
    return products.find((p) => p._id === activeId) ?? null;
  }, [singleRes, products, activeId]);

  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  // search is now done server-side (searchTerm param), so `products`
  // returned from the API is already the filtered + paginated page
  const filtered = products;

  /* ---------- navigation helpers ---------- */
  const goList = () => {
    setMode("list");
    setActiveId(null);
  };
  const goView = (p: Product) => {
    setActiveId(p._id);
    setMode("view");
  };
  const goAdd = () => setMode("add");
  const goEdit = (p: Product) => {
    setActiveId(p._id);
    setMode("edit");
  };

  const goPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const goNextPage = () => setPage((p) => Math.min(meta.totalPage, p + 1));

  return (
    <div className="px-3 sm:px-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          {mode !== "list" && (
            <button
              onClick={goList}
              className="flex items-center gap-1 text-sm text-[#8a7860] hover:text-[#2B1D14] mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to products
            </button>
          )}
          <h6 className="font-[Fraunces] text-2xl sm:text-xl text-[#2B1D14] flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-[#A8823C]" />
            {mode === "list" && "Product Management"}
            {mode === "view" && "Product Details"}
            {mode === "add" && "Add Product"}
            {mode === "edit" && "Edit Product"}
          </h6>
          <p className="text-sm text-[#8a7860] mt-1">
            {mode === "list" && `${meta.total} products in your catalogue`}
            {mode === "view" && activeProduct?.code}
            {(mode === "add" || mode === "edit") &&
              "Fill in the details below — required fields are marked *"}
          </p>
        </div>

        {mode === "list" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetchList()}
              className="flex items-center gap-2 border border-[#D8C7A8] text-[#2B1D14] font-semibold px-4 py-2.5 rounded-full hover:bg-[#F7F3EA] transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={goAdd}
              className="flex items-center gap-2 bg-[#2B1D14] text-white font-semibold px-5 py-2.5 rounded-full hover:bg-[#4A3627] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        )}
      </div>

      {/* ---------------- LIST VIEW ---------------- */}
      {mode === "list" && (
        <div  style={{ minHeight: "80vh" }}>
          <div className="relative mb-5">
            <Search className="w-4 h-4 text-[#b3a385] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, code, or category..."
              className="w-full rounded-full border border-[#D8C7A8] bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8]"
            />
          </div>

          {listLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-[#8a7860]">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading products...
            </div>
          ) : listError ? (
            <div className="text-center py-16 border border-dashed border-[#E4B7A8] rounded-2xl">
              <p className="text-[#8C3B2E] mb-3">Couldn't load products from the server.</p>
              <button
                onClick={() => refetchList()}
                className="text-sm font-semibold text-[#2B1D14] underline"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#D8C7A8] rounded-2xl">
              <p className="text-[#8a7860]">No products match your search.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-[#E4D8C4] bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F7F3EA] text-left text-[#8a7860] text-xs uppercase tracking-wide">
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Discount</th>
                      <th className="px-4 py-3">Min. Order</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      const Icon = p.icon;
                      return (
                        <tr key={p.id} className="border-t border-[#E4D8C4] hover:bg-[#FAF6EF]">
                          <td className="px-4 py-3">
                            <button
                              onClick={() => goView(p)}
                              className="flex items-center gap-3 text-left"
                            >
                              {p.images?.[0] ? (
                                <img
                                  src={p.images[0]}
                                  alt={p.name}
                                  className="w-11 h-11 rounded-lg object-cover shrink-0 border border-[#E4D8C4]"
                                />
                              ) : (
                                <span className="w-11 h-11 rounded-lg bg-[#F7F3EA] flex items-center justify-center shrink-0 border border-[#E4D8C4]">
                                  {Icon && <Icon className="w-5 h-5 text-[#A8823C]" />}
                                </span>
                              )}
                              <span>
                                <span className="block font-[Fraunces] text-[#2B1D14] leading-snug">
                                  {p.name}
                                </span>
                                <span className="block text-xs text-[#8a7860]">{p.bn}</span>
                              </span>
                            </button>
                          </td>
                          <td className="px-4 py-3 text-[#8a7860]">{p.code}</td>
                          <td className="px-4 py-3 text-[#8a7860]">{p.cat}</td>
                          <td className="px-4 py-3">
                            <span className="text-[#A8823C] font-bold">৳{p.price}</span>
                            <span className="text-[#b3a385] text-xs line-through ml-1">
                              ৳{p.was}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#8C3B2E] font-semibold">
                            -{p.discount ?? calcDiscount(p.price, p.was)}%
                          </td>
                          <td className="px-4 py-3 text-[#8a7860]">{p.minOrder ?? 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => goEdit(p)}
                                className="p-2 rounded-full border border-[#D8C7A8] text-[#2B1D14] hover:bg-[#F7F3EA]"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(p)}
                                className="p-2 rounded-full border border-[#E4B7A8] text-[#8C3B2E] hover:bg-[#FBEEE9]"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ---------------- PAGINATION ---------------- */}
              {meta.totalPage > 1 && (
                <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
                  <p className="text-sm text-[#8a7860]">
                    Page <span className="font-semibold text-[#2B1D14]">{meta.page}</span> of{" "}
                    <span className="font-semibold text-[#2B1D14]">{meta.totalPage}</span>{" "}
                    &middot; {meta.total} total products
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goPrevPage}
                      disabled={page <= 1 || listFetching}
                      className="flex items-center gap-1 border border-[#D8C7A8] text-[#2B1D14] font-semibold px-4 py-2 rounded-full hover:bg-[#F7F3EA] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          disabled={listFetching}
                          className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
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
                      disabled={page >= meta.totalPage || listFetching}
                      className="flex items-center gap-1 border border-[#D8C7A8] text-[#2B1D14] font-semibold px-4 py-2 rounded-full hover:bg-[#F7F3EA] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ---------------- SINGLE PRODUCT VIEW ---------------- */}
      {mode === "view" &&
        (singleLoading && !activeProduct ? (
          <div className="flex items-center justify-center gap-2 py-16 text-[#8a7860]">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading product...
          </div>
        ) : activeProduct ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {activeProduct.images?.[0] ? (
                <img
                  src={activeProduct.images[0]}
                  alt={activeProduct.name}
                  className="w-full h-80 object-cover rounded-2xl border border-[#E4D8C4]"
                />
              ) : (
                <div className="w-full h-80 rounded-2xl border border-[#E4D8C4] bg-[#F7F3EA] flex items-center justify-center">
                  {activeProduct.icon && (
                    <activeProduct.icon className="w-16 h-16 text-[#A8823C]" />
                  )}
                </div>
              )}
              {activeProduct.images && activeProduct.images.length > 1 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {activeProduct.images.slice(1).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg border border-[#E4D8C4]"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs tracking-[0.2em] uppercase text-[#A8823C]">
                  {activeProduct.cat}
                </p>
                <p className="text-xs text-[#b3a385]">Code: {activeProduct.code}</p>
              </div>
              <h2 className="font-[Fraunces] text-2xl text-[#2B1D14] mt-2">
                {activeProduct.name}
              </h2>
              <p className="text-[#8a7860] mt-1">{activeProduct.bn}</p>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-[#A8823C] font-bold text-2xl">
                  ৳{activeProduct.price}
                </span>
                <span className="text-[#b3a385] text-base line-through">
                  ৳{activeProduct.was}
                </span>
                <span className="text-[#8C3B2E] text-sm font-semibold">
                  -{activeProduct.discount ?? calcDiscount(activeProduct.price, activeProduct.was)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                <div className="rounded-xl border border-[#E4D8C4] px-4 py-3">
                  <p className="text-[#8a7860] text-xs">Minimum Order</p>
                  <p className="text-[#2B1D14] font-semibold">{activeProduct.minOrder ?? 1} pcs</p>
                </div>
                <div className="rounded-xl border border-[#E4D8C4] px-4 py-3">
                  <p className="text-[#8a7860] text-xs">Product Code</p>
                  <p className="text-[#2B1D14] font-semibold">{activeProduct.code}</p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#E4D8C4]">
                <h3 className="font-[Fraunces] text-lg text-[#2B1D14] mb-2">Description</h3>
                <p className="whitespace-pre-line text-sm text-[#4A3627] leading-relaxed">
                  {activeProduct.description}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => goEdit(activeProduct)}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#2B1D14] text-[#2B1D14] font-semibold py-2.5 rounded-full hover:bg-[#2B1D14] hover:text-white transition-colors"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(activeProduct)}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#E4B7A8] text-[#8C3B2E] font-semibold py-2.5 rounded-full hover:bg-[#8C3B2E] hover:text-white hover:border-[#8C3B2E] transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-[#8a7860]">Product not found.</div>
        ))}

      {/* ---------------- ADD — delegated to the standalone page/component ---------------- */}
      {mode === "add" && (
        <CreateProduct
          onCreated={(created) => {
            setActiveId(created?._id ?? null);
            setMode(created ? "view" : "list");
          }}
          onCancel={goList}
        />
      )}

      {/* ---------------- EDIT ---------------- */}
      {mode === "edit" &&
        (singleLoading && !activeProduct ? (
          <div className="flex items-center justify-center gap-2 py-16 text-[#8a7860]">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading product...
          </div>
        ) : activeProduct ? (
          <EditProductForm
            product={activeProduct}
            saving={updating}
            onCancel={goList}
            onSaved={(id) => {
              setActiveId(id);
              setMode("view");
            }}
            updateProduct={updateProduct}
          />
        ) : (
          <div className="text-center py-16 text-[#8a7860]">Product not found.</div>
        ))}

      {/* ---------------- DELETE CONFIRM ---------------- */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="font-[Fraunces] text-lg text-[#2B1D14]">Delete product?</h3>
            <p className="text-sm text-[#8a7860] mt-2">
              This will permanently remove{" "}
              <span className="font-semibold text-[#2B1D14]">{deleteTarget.name}</span> from your
              catalogue. This can't be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 border border-[#D8C7A8] text-[#2B1D14] font-semibold py-2.5 rounded-full hover:bg-[#F7F3EA] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!deleteTarget) return;
                  try {
                    await deleteProduct(deleteTarget._id).unwrap();
                    toast.success(`"${deleteTarget.name}" removed.`);
                    setDeleteTarget(null);
                    goList();
                  } catch {
                    toast.error("Couldn't delete the product. Please try again.");
                  }
                }}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 bg-[#8C3B2E] text-white font-semibold py-2.5 rounded-full hover:bg-[#742f24] disabled:opacity-60"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
