import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface TProduct {
  id?: string;
  name?: string;
  description?: string;
  category?: string;
  brand?: string;
  stockQuantity?: number;
  rating?: number; 
  productDescription?: string;
  price?: number;
  image?: string;
  isAvailable?: boolean;
  __v?: number; 
}

export type TUser = {
  _id?: string,
  name?: string,
  email?: string,
  phone?: string,
  role?: string,
  address?: string,
  password?: string,
  cpassword?: string,
  isActive?: boolean
  createdAt?: Date;
  updatedAt?: Date;
}


/* ---------------- Types ---------------- */
export type Page = "home" | "product" | "cart";

export interface Product {
  id: number;
  code: string;
  name: string;
  bn: string;
  price: number;
  was: number;
  icon: LucideIcon;
  cat: string;
  discount: number;
  images: string[]; 
  description: string;
  quantity: number;
}

export interface CartItem {
  id: number;
  quantity: number;
}

export interface CartItem2 {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  notes?: string;
}

type StepStatus = "done" | "current" | "upcoming";
export interface Step {
  id: number;
  label: string;
  status: StepStatus;
}

export type PaymentMethod = "cash" | "other";

export interface FieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}