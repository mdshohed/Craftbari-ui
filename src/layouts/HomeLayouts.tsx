
import { usePageViewTracking } from "@/hooks/usePageViewTracking";
import Footer from "@/pages/shared/Footer";
import Header from "@/pages/shared/Header";
import { Outlet } from "react-router-dom";

const MainLayouts = () => {
  usePageViewTracking();
  return (
    <div>
      <Header></Header>
        <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default MainLayouts;

// import React, { useEffect, useState, useCallback } from 'react';
// import { Order, OrdersApiResponse } from './orderTypes';

// interface OrdersTableProps {
//   /** Pass orders directly if you're fetching them elsewhere (e.g. a parent page). */
//   orders?: Order[];
//   /** Otherwise supply a fetcher and OrdersTable will load + manage its own state. */
//   fetchOrders?: () => Promise<OrdersApiResponse>;
// }

// const formatTaka = (amount: number): string => `৳${amount.toLocaleString('en-US')}`;

// const formatDate = (iso: string): string => {
//   const date = new Date(iso);
//   if (Number.isNaN(date.getTime())) return iso;
//   return new Intl.DateTimeFormat('en-US', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   }).format(date);
// };

// const orderTotal = (order: Order): number =>
//   order.orderProducts.reduce((sum, p) => sum + p.unitPrice * p.orderQuantity, 0);

// const itemCount = (order: Order): number =>
//   order.orderProducts.reduce((sum, p) => sum + p.orderQuantity, 0);

// const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     className={`transition-transform ${open ? 'rotate-90' : ''}`}
//   >
//     <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// export const MainLayouts: React.FC<OrdersTableProps> = ({ orders: ordersProp, fetchOrders }) => {
//   const [orders, setOrders] = useState<Order[] | null>(ordersProp ?? null);
//   const [loading, setLoading] = useState(!ordersProp && !!fetchOrders);
//   const [error, setError] = useState<string | null>(null);
//   const [expanded, setExpanded] = useState<Set<string>>(new Set());

//   const load = useCallback(async () => {
//     if (!fetchOrders) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetchOrders();
//       if (!res.success) throw new Error(res.message || 'Could not load orders');
//       setOrders(res.data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Could not load orders');
//     } finally {
//       setLoading(false);
//     }
//   }, [fetchOrders]);

//   useEffect(() => {
//     if (ordersProp) {
//       setOrders(ordersProp);
//       return;
//     }
//     load();
//   }, [ordersProp, load]);

//   const toggleRow = (id: string) => {
//     setExpanded((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });
//   };

//   if (loading) {
//     return (
//       <div className="rounded-xl border border-charcoal/10 bg-white overflow-hidden">
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-charcoal/5 last:border-0">
//             <div className="h-4 w-4 rounded bg-charcoal/10 animate-pulse" />
//             <div className="h-4 w-32 rounded bg-charcoal/10 animate-pulse" />
//             <div className="h-4 w-24 rounded bg-charcoal/10 animate-pulse" />
//             <div className="h-4 flex-1 rounded bg-charcoal/10 animate-pulse" />
//             <div className="h-4 w-20 rounded bg-charcoal/10 animate-pulse" />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="rounded-xl border border-rust/30 bg-rust/5 px-5 py-8 text-center">
//         <p className="text-sm text-rust mb-3">{error}</p>
//         <button
//           onClick={load}
//           className="px-4 py-1.5 text-sm font-medium text-white bg-rust rounded-md hover:bg-rust/90 transition"
//         >
//           Try again
//         </button>
//       </div>
//     );
//   }

//   if (!orders || orders.length === 0) {
//     return (
//       <div className="rounded-xl border border-charcoal/10 bg-white px-5 py-12 text-center">
//         <p className="text-sm text-charcoal/50">No orders yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-xl border border-charcoal/10 bg-white overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-charcoal/10 bg-charcoal/[0.02] text-left text-xs uppercase tracking-wide text-charcoal/50">
//               <th className="w-10 px-4 py-3" />
//               <th className="px-3 py-3 font-medium">Customer</th>
//               <th className="px-3 py-3 font-medium">Delivery address</th>
//               <th className="px-3 py-3 font-medium">Items</th>
//               <th className="px-3 py-3 font-medium">Total</th>
//               <th className="px-3 py-3 font-medium">Placed</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => {
//               const isOpen = expanded.has(order._id);
//               return (
//                 <React.Fragment key={order._id}>
//                   <tr
//                     onClick={() => toggleRow(order._id)}
//                     className="cursor-pointer border-b border-charcoal/5 last:border-0 hover:bg-charcoal/[0.02] transition"
//                   >
//                     <td className="px-4 py-3 text-charcoal/40">
//                       <ChevronIcon open={isOpen} />
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="font-medium text-charcoal">{order.name}</div>
//                       <div className="text-xs text-charcoal/50">{order.phoneNumber}</div>
//                     </td>
//                     <td className="px-3 py-3 text-charcoal/70">{order.deliveryAddress}</td>
//                     <td className="px-3 py-3 text-charcoal/70">
//                       {itemCount(order)} {itemCount(order) === 1 ? 'item' : 'items'}
//                     </td>
//                     <td className="px-3 py-3 font-medium text-charcoal">{formatTaka(orderTotal(order))}</td>
//                     <td className="px-3 py-3 text-charcoal/50 whitespace-nowrap">{formatDate(order.createdAt)}</td>
//                   </tr>

//                   {isOpen && (
//                     <tr className="border-b border-charcoal/5 last:border-0 bg-charcoal/[0.015]">
//                       <td colSpan={6} className="px-4 py-4">
//                         <div className="pl-8">
//                           {order.notes && (
//                             <p className="text-xs text-charcoal/50 mb-3">
//                               <span className="font-medium text-charcoal/70">Note:</span> {order.notes}
//                             </p>
//                           )}
//                           <table className="w-full text-xs">
//                             <thead>
//                               <tr className="text-left text-charcoal/40 uppercase tracking-wide">
//                                 <th className="pb-2 pr-3 font-medium">Product</th>
//                                 <th className="pb-2 pr-3 font-medium">Qty</th>
//                                 <th className="pb-2 pr-3 font-medium">Unit price</th>
//                                 <th className="pb-2 font-medium">Subtotal</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {order.orderProducts.map((p, i) => (
//                                 <tr key={`${order._id}-${p.productId}-${i}`} className="border-t border-charcoal/5">
//                                   <td className="py-2 pr-3 text-charcoal" style={{ fontFamily: '"Noto Sans Bengali", inherit' }}>
//                                     {p.name}
//                                   </td>
//                                   <td className="py-2 pr-3 text-charcoal/70">{p.orderQuantity}</td>
//                                   <td className="py-2 pr-3 text-charcoal/70">{formatTaka(p.unitPrice)}</td>
//                                   <td className="py-2 text-charcoal/70">{formatTaka(p.unitPrice * p.orderQuantity)}</td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MainLayouts;