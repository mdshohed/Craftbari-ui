import { Product } from "@/types/types";
import { useEffect, useState } from "react";
import { ChevronLeft, MessageCircle, Minus, Phone, Plus, ShoppingBag } from "lucide-react";
import ProductImageGallery from "./ProductImageGallery";
import TreeRingSeal from "../shared/TreeRingSeal";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/card/cardSlice";
import { toast } from "sonner";
import { useGetSingleProductQuery } from "@/redux/features/products/productApi";

/* ---------------- Product Detail Page ---------------- */
const BUSINESS_PHONE = "+8801869961011";     // used for the "tel:" link — shown in the dialer
const WHATSAPP_NUMBER = "8801869961011";     // used for wa.me — country code, no + no spaces

function handleCall() {
  window.location.href = `tel:${BUSINESS_PHONE}`;
}
function handleWhatsApp(data: Product) {
  const message = `আসসালামু আলাইকুম, আমি এই পণ্যটি অর্ডার করতে চাই:\n\n${data?.name}\nমূল্য: ৳${data?.price}\nলিংক: ${window.location.href}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

export default function ProductViewPage() {
  const { id } = useParams();

  const { data: response, isLoading, isError } = useGetSingleProductQuery(id, {
    skip: !id,
  });

  // Adjust depending on your actual API response shape.
  // e.g. if backend returns { data: {...} }, use response?.data
  const data: Product | undefined = response?.data ?? response;

  const minOrder: number = data?.minOrder ?? 1;
  const [quantity, setQty] = useState<number>(minOrder);

  useEffect(() => setQty(minOrder), [minOrder, id]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product: Product) => {
    if (quantity < minOrder) {
      toast.error(`এই পণ্যটি কিনতে হলে সর্বনিম্ন ${minOrder} পিস অর্ডার করতে হবে`);
      return;
    }
    const payload = { product, quantity };
    dispatch(addToCart(payload));
    toast.success("Added to Card Successfully");
  };

  const handleBuyNow = (product: Product) => {
    if (quantity < minOrder) {
      toast.error(`এই পণ্যটি কিনতে হলে সর্বনিম্ন ${minOrder} পিস অর্ডার করতে হবে`);
      return;
    }
    const payload = { product, quantity };
    dispatch(addToCart(payload));
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 text-center font-[Karla] text-[#8a7860]">
        Loading product...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 text-center font-[Karla]">
        <p className="text-red-500 mb-4">Product not found or failed to load.</p>
        <Link to="/">
          <button className="flex items-center gap-1 text-sm font-[Karla] text-[#8a7860] hover:text-[#2B1D14] mx-auto">
            <ChevronLeft className="w-4 h-4" /> Back to shop
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
      <Link to="/">
        <button className="flex items-center gap-1 text-sm font-[Karla] text-[#8a7860] mb-4 sm:mb-6 hover:text-[#2B1D14]">
          <ChevronLeft className="w-4 h-4" /> Back to shop
        </button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <ProductImageGallery
          images={data?.images}
          alt={data?.name}
          overlay={
            <>
              <span className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-[#8C3B2E] text-white text-[10px] sm:text-xs font-[Karla] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                -{data?.discount}% OFF
              </span>
              {data?.code && (
                <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 text-[#2B1D14] text-[10px] sm:text-xs font-[Karla] font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full tracking-wide">
                  {data.code}
                </span>
              )}
              <TreeRingSeal size={72} />
            </>
          }
        />

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-[Karla] text-xs tracking-[0.2em] uppercase text-[#A8823C]">{data?.cat}</p>
            {data?.code && (
              <p className="font-[Karla] text-xs text-[#b3a385] tracking-wide">
                Product Code: <span className="text-[#4A3627] font-semibold">{data.code}</span>
              </p>
            )}
          </div>
          <h1 className="font-[Fraunces] text-2xl sm:text-3xl text-[#2B1D14] mt-2 leading-snug">{data?.name}</h1>
          <p className="font-[Karla] text-[#8a7860] mt-1 text-sm sm:text-base">{data?.bn}</p>
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mt-4 sm:mt-5 font-[Karla]">
            <span className="text-[#A8823C] font-bold text-2xl sm:text-3xl">৳{data?.price}</span>
            <span className="text-[#b3a385] text-base sm:text-lg line-through">৳{data?.was}</span>
            <span className="text-[#8C3B2E] text-sm font-semibold">-{data?.discount}%</span>
          </div>
          {minOrder > 1 && (
            <p className="mt-2 text-xs font-[Karla] text-[#8C3B2E]">
              সর্বনিম্ন অর্ডার: {minOrder} পিস
            </p>
          )}
          <p className="flex items-center gap-2 mt-3 text-sm font-[Karla] text-[#5B6B4F]">
            <span className="w-2 h-2 rounded-full bg-[#5B6B4F] inline-block shrink-0" /> In stock — ready to ship
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6 sm:mt-7">
            <div className="flex items-center justify-center border border-[#D8C7A8] rounded-full w-fit self-center sm:self-auto">
              <button onClick={() => setQty(Math.max(minOrder, quantity - 1))} className="p-3 text-[#2B1D14]"><Minus className="w-4 h-4" /></button>
              <span className="w-8 text-center font-[Karla] text-[#2B1D14]">{quantity}</span>
              <button onClick={() => setQty(quantity + 1)} className="p-3 text-[#2B1D14]"><Plus className="w-4 h-4" /></button>
            </div>
            <button
              onClick={() => handleAddToCart(data)}
              className="flex-1 bg-[#2B1D14] text-[#FAF6EF] font-[Karla] font-semibold py-3 rounded-full flex items-center justify-center gap-2 hover:bg-[#4A3627] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
          </div>
          <button onClick={() => handleBuyNow(data)} className="w-full mt-3 bg-[#A8823C] text-white font-[Karla] font-semibold py-3 rounded-full hover:bg-[#96742f] transition-colors">
            Buy Now
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-2 border border-[#D8C7A8] rounded-full py-2.5 text-sm font-[Karla] text-[#2B1D14]"
            >
              <Phone className="w-4 h-4" /> Order by Call
            </button>
            <button
              onClick={() => handleWhatsApp(data)}
              className="flex items-center justify-center gap-2 bg-[#5B6B4F] text-white rounded-full py-2.5 text-sm font-[Karla] font-semibold"
            >
              <MessageCircle className="w-4 h-4" /> Order on WhatsApp
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E4D8C4] font-[Karla] text-sm text-[#4A3627] leading-relaxed">
            <h3 className="font-[Fraunces] text-lg text-[#2B1D14] mb-2">Description</h3>
            <p className="whitespace-pre-line font-[Karla] text-sm text-[#4A3627] leading-relaxed">
              {data?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}