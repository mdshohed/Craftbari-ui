import { ChangeEvent, useState } from "react";
import ProductArt from "../home/ProductArt";
import { Check, Lock, Minus, Plus, RotateCcw, Shield, ShoppingBag, Truck } from "lucide-react";
import { CartItem2, CartItemWithProduct, FieldProps, FormErrors, PaymentMethod, Product, Step } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import { clearCart, deleteFromCard, updateQuantity } from "@/redux/features/card/cardSlice";
import { toast } from "sonner";
import { useAddOrderInfoMutation } from "@/redux/features/orders/orderApi";


/* ---------------- Cart Page ---------------- */
function Field({ label, required, optional, error, children }: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-stone-700">
        {label} {required && <span className="text-red-500">*</span>}
        {optional && <span className="ml-1 font-normal text-stone-400">(optional)</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return [
    "w-full rounded-lg border bg-white px-4 py-2.5 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2",
    hasError
      ? "border-red-300 focus:ring-red-200"
      : "border-stone-200 focus:border-stone-400 focus:ring-stone-200",
  ].join(" ");
}

const STEPS: Step[] = [
  { id: 1, label: "Cart", status: "done" },
  { id: 2, label: "Checkout", status: "current" },
  { id: 3, label: "Confirmation", status: "upcoming" },
];

interface DeliveryDetails {
  name: string;
  email: string;
  phoneNumber: string;
  deliveryAddress: string;
  notes: string;
}

export default function CartPage() {
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [errors, setErrors] = useState<FormErrors>({});
  const [placing, setPlacing] = useState<boolean>(false);
  const products = useAppSelector((store) => store.cart.products);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    name: "",
    email: "",
    phoneNumber: "",
    deliveryAddress: "",
    notes: "",
  });
  const [addOrderInfo, { isError }] = useAddOrderInfoMutation();

  console.log({products})
  // const items: CartItemWithProduct[] = products.map((c: CartItem2) => ({
  //   ...c,
  //   product: PRODUCTS.find((p) => p._id === c._id) as Product,
  // }));
  // console.log({items})
  const total = products.reduce((s: number, i: Product) => s + i.price * i.quantity, 0);
  const dispatch = useAppDispatch();

  const handleQuantity = (type: string, _id: string) => {
    const payload = { type, _id };
    if (type == "increment") {
      // const foundProduct = products.find((product: any) => product.id === id);
      // const cardQuantity = foundProduct ? foundProduct.quantity : 0;
      // const stockquantity = foundProduct.stockQuantity;
      // if ( stockquantity <= cardQuantity) {
      //   toast.error("Stock Quantity limit Out");
      // } else {
        dispatch(updateQuantity(payload));
      // }
    } else {
      dispatch(updateQuantity(payload));
    }
  };

  const handleRemove = (_id: string) => {
    const payload = { _id };
    dispatch(deleteFromCard(payload));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!deliveryDetails.name.trim()) next.name = "Full name is required.";
    if (!/^01[0-9]{9}$/.test(deliveryDetails.phoneNumber.trim())) next.phoneNumber = "Enter a valid 11-digit mobile number.";
    if (!deliveryDetails.deliveryAddress.trim()) next.deliveryAddress = "Delivery address is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const navigate = useNavigate();
  // const handlePlaceOrder = () => {
  //   if (!validate() ) return;
  //   setPlacing(true);
  //   setTimeout(() => {
  //     setPlacing(false);
  //     navigate("/checkout/cart");
  //   }, 900);
  // };

  const handlePlaceOrder = async () => {
    // (Object.keys(deliveryDetails) as (keyof DeliveryDetails)[]).forEach((key) => {
    //   if (deliveryDetails[key] === '') {
    //     toast.warning(`${key} field is empty`);
    //     if (!validate() ) return;
    //   }
    // })
    if (!validate() ) return;
    
    const orderProduct = products.map((item: any) => ({
      productId: item?._id,
      name: item?.name,
      code: item?.code,
      minOrder: item?.minOrder,
      orderQuantity: item?.quantity,
      unitPrice: item?.price,
    }));
    const orderData = {
      name: deliveryDetails.name,
      phoneNumber: deliveryDetails.phoneNumber,
      deliveryAddress: deliveryDetails.deliveryAddress,
      notes: deliveryDetails.notes,
      orderProducts: orderProduct,
      isDelivered: false
    };
    const res = await addOrderInfo(orderData).unwrap();
    // if (res.statusCode === 200 && res.success) {
    if ( res.success) {
      setPlacing(true)
      setTimeout(() => {
        setPlacing(false);
        dispatch(clearCart());
        navigate("/checkout/success");
         toast.success(`Order Created Successfully`);
      }, 1000);
    }
    else {
      console.log(isError)
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-2 py-6">
      {/* <h1 className="font-[Fraunces] text-3xl text-[#2B1D14] mb-8">Your Cart</h1> */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="w-10 h-10 mx-auto text-[#D8C7A8]" />
          <p className="font-[Karla] text-[#8a7860] mt-4">Your cart is empty.</p>
          <Link to="/products">
            <button className="mt-5 bg-[#2B1D14] text-white font-[Karla] font-semibold px-6 py-2.5 rounded-full">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div>
          <div className="mb-6 rounded-xl border border-stone-200 bg-white px-4 py-4 sm:px-8">
            <ol className="flex items-center justify-center gap-2 sm:gap-4">
              {STEPS.map((step, idx) => (
                <li key={step.id} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                        step.status === "done"
                          ? "bg-stone-900 text-white"
                          : step.status === "current"
                          ? "border-2 border-stone-900 bg-white text-stone-900"
                          : "border-2 border-stone-300 bg-white text-stone-400",
                      ].join(" ")}
                    >
                      {step.status === "done" ? <Check size={16} /> : step.id}
                    </span>
                    <span
                      className={[
                        "text-sm font-medium sm:text-base",
                        step.status === "upcoming" ? "text-stone-400" : "text-stone-900",
                      ].join(" ")}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <span className="mx-2 h-px w-10 bg-stone-300 sm:mx-4 sm:w-24" />
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className="grid md:grid-cols-8 gap-4">
            <div className="space-y-6 md:col-span-5">
              {/* Billing details */}
              <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                <div className="flex items-start gap-3 bg-[#F7F3EA] px-6 py-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">
                    1
                  </span>
                  <div>
                    <h2 className="font-semibold text-stone-900">Billing Details</h2>
                    <p className="text-sm text-stone-500">Where should we deliver your order?</p>
                  </div>
                </div>
                <div className="space-y-4 px-6 py-6">
                  <Field label="Full Name" required error={errors.name}>
                    <input
                      type="text"
                      value={deliveryDetails.name}
                      // onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          name: e.target.value,
                        })
                      }
                      placeholder="Your full name"
                      className={inputClass(!!errors.name)}
                    />
                  </Field>

                  <Field label="Mobile Number" required error={errors.phoneNumber}>
                    <input
                      type="tel"
                      value={deliveryDetails.phoneNumber}
                      // onChange={(e: ChangeEvent<HTMLInputElement>) => setMobile(e.target.value)}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="01XXXXXXXXX"
                      className={inputClass(!!errors.phoneNumber)}
                    />
                  </Field>

                  <Field label="Delivery Address" required error={errors.deliveryAddress}>
                    <input
                      type="text"
                      value={deliveryDetails.deliveryAddress}
                      // onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          deliveryAddress: e.target.value,
                        })
                      }
                      placeholder="Thana, District, Area"
                      className={inputClass(!!errors.deliveryAddress)}
                    />
                  </Field>

                  <Field label="Order Notes" optional>
                    <textarea
                      value={deliveryDetails.notes}
                      // onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Any special instructions for your order..."
                      rows={3}
                      className={inputClass(false) + " resize-y"}
                    />
                  </Field>
                </div>
              </section>

              {/* Payment method */}
              <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                <div className="flex items-start gap-3 bg-[#F7F3EA] px-6 py-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">
                    2
                  </span>
                  <div>
                    <h2 className="font-semibold text-stone-900">Payment Method</h2>
                    <p className="text-sm text-stone-500">Choose how you want to pay.</p>
                  </div>
                </div>

                <div className="space-y-3 px-6 py-6">
                  <label
                    className={[
                      "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition",
                      payment === "cash"
                        ? "border-stone-900 bg-[#F7F3EA]"
                        : "border-stone-200 hover:border-stone-300",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === "cash"}
                      onChange={() => setPayment("cash")}
                      className="h-4 w-4 accent-stone-900"
                    />
                    <span className="font-medium text-stone-800">Cash Account</span>
                  </label>

                  <label
                    className={[
                      "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3 transition",
                      payment === "other"
                        ? "border-stone-900 bg-[#F7F3EA]"
                        : "border-amber-300 hover:border-amber-400",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === "other"}
                      onChange={() => setPayment("other")}
                      className="h-4 w-4 accent-stone-900"
                    />
                    <span className="text-stone-500">Other payment method</span>
                  </label>
                </div>
              </section>
            </div>
            
            <div className="bg-[#EFE6D8] md:col-span-3 rounded-2xl p-6 h-fit font-[Karla]">
              <h2 className="mb-4 text-base font-semibold text-stone-900">Order Summary</h2>
              <div className="border-t border-stone-100" />
              <div className="md:col-span-2 space-y-4 pb-4">
                {products.map((i: any) => (
                  <div key={i._id} className="flex gap-4 bg-white border border-[#E4D8C4] rounded-2xl p-3">
                    {/* <ProductArt Icon={i.product.icon} className="w-20 h-20 rounded-xl shrink-0" /> */}
                    {i?.images?.length ? (
                      <img
                        src={i.images[0]}
                        alt={i.name}
                        className="w-20 h-20 rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <ProductArt Icon={i.icon} className="w-20 h-20 rounded-xl shrink-0" />
                    )}
                    <div className="flex-1">
                      <h2 className="font-[Fraunces] text-[#2B1D14]">{i.name}</h2>
                      {i?.code && (
                        <p className="font-[Karla] text-[10px] text-[#b3a385] tracking-wide mt-0.5">
                          Code: {i.code}
                        </p>
                      )}
                      <p className="font-[Karla] text-[#A8823C] font-bold mt-1">৳{i.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-[#D8C7A8] rounded-full">
                          <button 
                            onClick={() =>
                              handleQuantity("decrement", i._id)
                            }
                            className="p-1.5 text-[#2B1D14]"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="w-6 text-center text-sm font-[Karla]">{i.quantity}</span>
                          <button 
                            onClick={() =>
                              handleQuantity("increment", i._id)
                            }                           
                            className="p-1.5 text-[#2B1D14]"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                        <button 
                        onClick={() => handleRemove(i._id)} 
                        className="text-xs font-[Karla] text-[#8C3B2E] hover:underline">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-[#D8C7A8] pt-4 mb-5 text-sm text-[#4A3627] mb-2">
                <span className="font-medium">Subtotal</span><span className="font-bold">৳{total}</span>
              </div>
              <div className="flex justify-between text-sm text-[#4A3627] mb-4">
                <span className="font-medium">Delivery</span><span className="font-bold">Free</span>
              </div>
              <div className="flex justify-between font-bold text-[#2B1D14] text-lg border-t border-[#D8C7A8] pt-4 mb-5">
                <span>Total</span><span>৳{total}</span>
              </div>
              {/* <button className="w-full bg-[#A8823C] text-white font-semibold py-3 rounded-full hover:bg-[#96742f] transition-colors">
                Place Order
              </button> */}
              
              <button
                onClick={handlePlaceOrder}
                disabled={ placing}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Lock size={16} />
                {placing ? "Placing order..." : `Place Order — ${total}৳`}
              </button>
              <div className="mt-4 flex items-center justify-center gap-5 border-t border-stone-100 pt-4 text-xs text-emerald-700">
                <span className="flex items-center gap-1">
                  <Shield size={14} /> Secure checkout
                </span>
                <span className="flex items-center gap-1">
                  <Truck size={14} /> Fast delivery
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw size={14} /> Easy returns
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}