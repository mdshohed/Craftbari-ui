import { useUpdateProductMutation } from "@/redux/features/products/productApi";
import { Product } from "@/types/types";
import {
  CalendarDays,
  Clock,
  Key,
  Loader2,
  LucideIcon,
  Pill,
  PenTool,
  PiggyBank,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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

export function EditProductForm({
  product,
  saving,
  onCancel,
  onSaved,
  updateProduct,
}: {
  product: Product;
  saving: boolean;
  onCancel: () => void;
  onSaved: (id: string) => void;
  updateProduct: ReturnType<typeof useUpdateProductMutation>[0];
}) {
  const [form, setForm] = useState<EditForm>(productToEditForm(product));
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = <K extends keyof EditForm>(key: K, value: EditForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (!files.length) {
      toast.error("Please choose image files only.");
      return;
    }
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeExisting = (idx: number) =>
    setForm((f) => ({
      ...f,
      existingImageUrls: f.existingImageUrls.filter((_, i) => i !== idx),
    }));

  const removeNew = (idx: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.was) {
      toast.error("Name, price, and regular price are required.");
      return;
    }
    // if (form.existingImageUrls.length === 0 && newFiles.length === 0) {
    //   toast.error("Please keep at least one product image.");
    //   return;
    // }

    const price = Number(form.price);
    const was = Number(form.was);

    const productData = {
      code: form.code.trim(),
      name: form.name.trim(),
      bn: form.bn.trim(),
      price,
      was,
      discount: calcDiscount(price, was),
      minOrder: Math.max(1, Number(form.minOrder) || 1),
      icon: form.iconName,
      cat: form.cat,
      quantity: Math.max(0, Number(form.quantity) || 0),
      description: form.description,
      images: form.existingImageUrls,
    };
    console.log(productData);
    const formData = new FormData();
    formData.append("data", JSON.stringify(productData));
    newFiles.forEach((file) => formData.append("images", file));

    try {
      await updateProduct({ id: form._id, updatedProduct: formData }).unwrap();
      toast.success("Product updated.");
      onSaved(form._id);
    } catch {
      toast.error("Couldn't save changes. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="bg-white rounded-2xl border border-[#E4D8C4] p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">
              Product Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className="w-full rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">
              Bangla Name
            </label>
            <input
              value={form.bn}
              onChange={(e) => setField("bn", e.target.value)}
              className="w-full rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">Category</label>
            <select
              value={form.cat}
              onChange={(e) => setField("cat", e.target.value)}
              className="w-full rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8] bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">
              Product Code
            </label>
            <input
              value={form.code}
              onChange={(e) => setField("code", e.target.value)}
              className="w-full rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">
              Selling Price (৳) *
            </label>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              className="w-full rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">
              Regular Price (৳) *
            </label>
            <input
              type="number"
              min={0}
              value={form.was}
              onChange={(e) => setField("was", e.target.value)}
              className="w-full rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">Discount</label>
            <div className="w-full rounded-lg border border-[#E4D8C4] bg-[#F7F3EA] px-4 py-2.5 text-sm text-[#8C3B2E] font-semibold">
              -{calcDiscount(Number(form.price) || 0, Number(form.was) || 0)}%
              <span className="text-[#8a7860] font-normal"> (auto)</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">
              Minimum Order
            </label>
            <input
              type="number"
              min={1}
              value={form.minOrder}
              onChange={(e) => setField("minOrder", e.target.value)}
              className="w-full rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">Icon</label>
            <select
              value={form.iconName}
              onChange={(e) => setField("iconName", e.target.value)}
              className="w-full rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8] bg-white"
            >
              {ICON_NAMES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">
            Product Images
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={[
              "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors",
              isDragging ? "border-[#A8823C] bg-[#F7F3EA]" : "border-[#D8C7A8] hover:bg-[#FAF6EF]",
            ].join(" ")}
          >
            <UploadCloud className="w-7 h-7 text-[#A8823C]" />
            <p className="text-sm text-[#2B1D14] font-medium">
              Click to upload, or drag and drop new images here
            </p>
            <p className="text-xs text-[#8a7860]">PNG, JPG, or WEBP</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
              className="hidden"
            />
          </div>

          {(form.existingImageUrls.length > 0 || newPreviews.length > 0) && (
            <div className="flex flex-wrap gap-3 mt-3">
              {form.existingImageUrls.map((img, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E4D8C4] group"
                >
                  <img src={img} alt={`Existing ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExisting(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center py-0.5">
                      Cover
                    </span>
                  )}
                </div>
              ))}
              {newPreviews.map((img, idx) => (
                <div
                  key={`new-${idx}`}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E4D8C4] group"
                >
                  <img src={img} alt={`New ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNew(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8] resize-y"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 border border-[#D8C7A8] text-[#2B1D14] font-semibold py-3 rounded-full hover:bg-[#F7F3EA] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-[#2B1D14] text-white font-semibold py-3 rounded-full hover:bg-[#4A3627] transition-colors disabled:opacity-60"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}