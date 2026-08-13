import React, { useEffect, useRef, useState } from "react";
import { Product } from "@/types/types";
import {
  Loader2,
  LucideIcon,
  Clock,
  PenTool,
  PiggyBank,
  Pill,
  Key,
  CalendarDays,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAddProductMutation } from "@/redux/features/products/productApi";

/* ---------------- Icon registry --------------- */
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

/* ---------------- Form shape ---------------- */
interface ProductForm {
  id: number | null;
  code: string;
  name: string;
  bn: string;
  price: string;
  was: string;
  minOrder: string;
  iconName: string;
  cat: string;
  quantity: string;
  description: string;
}

function blankForm(nextId: number): ProductForm {
  return {
    id: nextId,
    code: "",
    name: "",
    bn: "",
    price: "",
    was: "",
    minOrder: "1",
    iconName: ICON_NAMES[0],
    cat: CATEGORIES[0],
    quantity: "1",
    description: "",
  };
}

function unwrapItem(res: any): any {
  if (!res) return null;
  if (res.data) return res.data;
  return res;
}

interface CreateProductProps {
  onCreated?: (product: Product) => void; 
  onCancel?: () => void;
}

export default function CreateProduct({ onCreated, onCancel }: CreateProductProps) {
  const [form, setForm] = useState<ProductForm>(blankForm(1));
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addProduct, { isLoading: saving }] = useAddProductMutation();

  // Clean up object URLs on unmount / when the list changes, to avoid memory leaks
  useEffect(() => {
    return () => imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const applyCategory = (cat: string) => {
    setField("cat", cat);
    if (!form.code.trim() && CATEGORY_PREFIX[cat]) {
      const prefix = CATEGORY_PREFIX[cat];
      const nextNum = String(form.id ?? 1).padStart(3, "0");
      setField("code", `${prefix}-${nextNum}`);
    }
  };

  /* ---------- image selection (real File objects, not base64) ---------- */
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (!files.length) {
      toast.error("Please choose image files only.");
      return;
    }
    const previews = files.map((f) => URL.createObjectURL(f));
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = ""; // allow re-selecting the same file later
  };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setImageFiles((prev) => [...prev, file]);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (!form.name.trim() || !form.price || !form.was || !form.code) {
      toast.error("Name, price, regular price, and Product Code are required.");
      return;
    }
    // if (imageFiles.length === 0) {
    //   toast.error("Please add at least one product image.");
    //   return;
    // }

    const price = Number(form.price);
    const was = Number(form.was);

    // Everything except the image files goes in "data" as JSON — matches
    // the parseBody middleware + createProductValidationSchema on the backend.
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
      isAvailable: true, 
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(productData));
    // imageFiles.forEach((file) => {
    //   formData.append("images", file); 
    // });

    for (let image of imageFiles) {
      formData.append("images", image);
    }

    try {
      const res = await addProduct(formData).unwrap();
      toast.success("Product added.");
      const created = unwrapItem(res);
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImageFiles([]);
      setImagePreviews([]);
      setForm(blankForm(1));
      onCreated?.(created);
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-2xl border border-[#E4D8C4] p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">
              Product Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="e.g. Desk Organizer with Watch Holder"
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
              placeholder="বাংলা নাম"
              className="w-full rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">Category</label>
            <select
              value={form.cat}
              onChange={(e) => applyCategory(e.target.value)}
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
              placeholder="e.g. DO-011"
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
              placeholder="700"
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
              placeholder="790"
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
          {/* <div>
            <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">
              Stock Quantity
            </label>
            <input
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) => setField("quantity", e.target.value)}
              className="w-full rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8]"
            />
          </div> */}
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
            Product Images *
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={[
              "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors",
              isDragging
                ? "border-[#A8823C] bg-[#F7F3EA]"
                : "border-[#D8C7A8] hover:bg-[#FAF6EF]",
            ].join(" ")}
          >
            <UploadCloud className="w-7 h-7 text-[#A8823C]" />
            <p className="text-sm text-[#2B1D14] font-medium">
              Click to upload, or drag and drop images here
            </p>
            <p className="text-xs text-[#8a7860]">PNG, JPG, or WEBP</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              // onChange={handleFileInputChange}
              onChange={(e) => handleImageChange(e)}
              className="hidden"
            />
          </div>

          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {imagePreviews.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E4D8C4] group"
                >
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
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
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={8}
            placeholder="Write the product description..."
            className="w-full rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8] resize-y"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 border border-[#D8C7A8] text-[#2B1D14] font-semibold py-3 rounded-full hover:bg-[#F7F3EA] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-[#2B1D14] text-white font-semibold py-3 rounded-full hover:bg-[#4A3627] transition-colors disabled:opacity-60"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving..." : "Add Product"}
        </button>
      </div>
    </form>
  );
}