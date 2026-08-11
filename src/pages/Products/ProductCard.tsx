import { Product } from "@/types/types";
import ProductArt from "../home/ProductArt";
import TreeRingSeal from "../shared/TreeRingSeal";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/card/cardSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/* ---------------- Product Card ---------------- */
export default function ProductCard({ data }: { data: Product }) {
  // const { id } = useParams();
  // const data: Product = PRODUCTS.find((p) => data?.id === Number(id));
  const hasImage = data?.images && data.images.length > 0;
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); 
  
  const handleViewPage = (id: string | number) =>{
    navigate(`/product/${id}`)
  }

  const handleAddToCart = (product: any) => {
    const quantity: number = 1;
    const minOrder: number = product?.minOrder ?? 1;

    // If the product requires a minimum order quantity greater than
    // what's being added, block it and show a required message.
    if (quantity < minOrder) {
      toast.error(`এই পণ্যটি কিনতে হলে সর্বনিম্ন ${minOrder} পিস অর্ডার করতে হবে`);
      return;
    }
    const payload = { product, quantity };
    dispatch(addToCart(payload));
    toast.success("Added to Card Successfully");
    // setQuantity(1);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E4D8C4] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className="relative">
        <button onClick={()=>handleViewPage(data?.id ?? '')} className="block w-full h-64 overflow-hidden">
          {hasImage ? (
            <img
              src={data.images[0]}
              alt={data.name}
              className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <ProductArt Icon={data?.icon} className="h-48 w-full" />
          )}
        </button>
        <span className="absolute top-3 left-3 bg-[#8C3B2E] text-white text-[11px] font-[Karla] font-bold px-2 py-1 rounded-full">
          -{data?.discount}%
        </span>
        {data?.code && (
          <span className="absolute top-3 right-3 bg-white/90 text-[#2B1D14] text-[10px] font-[Karla] font-semibold px-2 py-1 rounded-full tracking-wide">
            {data.code}
          </span>
        )}
        <TreeRingSeal size={64} />
      </div>
      <div className="p-4">
        <button onClick={()=>handleViewPage(data?.id ?? '')} className="text-left block">
          <div className="flex items-center justify-between gap-2">
            <p className="font-[Karla] text-[#8a7860] text-xs">{data?.cat}</p>
            {data?.code && (
              <span className="shrink-0 font-[Karla] text-[10px] text-[#8a7860] bg-[#F7F3EA] border border-[#E4D8C4] rounded-full px-2 py-0.5 tracking-wide">
                #{data.code}
              </span>
              // <p className="font-[Karla] text-[#b3a385] text-[10px] tracking-wide">
              //   #{data.code}
              // </p>
            )}
          </div>
          <h3 className="font-[Fraunces] text-[#2B1D14] text-base leading-snug mt-0.5">{data?.name}</h3>
          <p className="font-[Karla] text-[#8a7860] text-xs mt-0.5">{data?.bn}</p>
        </button>
        <div className="flex items-baseline gap-2 mt-2 font-[Karla]">
          <span className="text-[#A8823C] font-bold text-lg">৳{data?.price}</span>
          <span className="text-[#b3a385] text-sm line-through">৳{data?.was}</span>
        </div>
        <div className="">
          {/* <button
            // onClick={() => onAdd(data?.id)}
             onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(data);
            }}
            className="flex-1 border border-[#2B1D14] text-[#2B1D14] text-sm font-[Karla] font-semibold py-2 rounded-full hover:bg-[#2B1D14] hover:text-white transition-colors"
          >
            Add to Cart
          </button>
          <button
            onClick={()=>handleViewPage(data?.id ?? '')}
            className="flex-1 bg-[#A8823C] text-white text-sm font-[Karla] font-semibold py-2 rounded-full hover:bg-[#96742f] transition-colors"
          >
            View Details
          </button> */}
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(data);
              }}
              className="w-full sm:flex-1 border border-[#2B1D14] text-[#2B1D14] text-sm font-[Karla] font-semibold py-2 rounded-full hover:bg-[#2B1D14] hover:text-white transition-colors"
            >
              Add to Cart
            </button>

            <button
              onClick={() => handleViewPage(data?.id ?? "")}
              className="w-full sm:flex-1 bg-[#A8823C] text-white text-sm font-[Karla] font-semibold py-2 rounded-full hover:bg-[#96742f] transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}