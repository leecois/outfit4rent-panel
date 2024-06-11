import type { Dayjs } from 'dayjs';

export interface IOrderChart {
  count: number;
  status:
    | 'waiting'
    | 'ready'
    | 'on the way'
    | 'delivered'
    | 'could not be delivered';
}

export interface IOrderTotalCount {
  total: number;
  totalDelivered: number;
}

export interface ISalesChart {
  date: string;
  title?: 'Order Count' | 'Order Amount';
  value: number;
}

export interface IOrderStatus {
  id: number;
  text: 'Pending' | 'Ready' | 'On The Way' | 'Delivered' | 'Cancelled';
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  picture: string;
  phone: string;
  address: string;
  status: number;
}

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
}

export interface IAddress {
  text: string;
  coordinate: [number, number];
}

export interface IFile {
  name: string;
  percent: number;
  size: number;
  status: 'error' | 'success' | 'done' | 'uploading' | 'removed';
  type: string;
  uid: string;
  url: string;
}

export interface IEvent {
  date: string;
  status: string;
}

export interface IStore {
  id: number;
  title: string;
  isActive: boolean;
  createdAt: string;
  gsm: string;
  email: string;
  address: IAddress;
  products: Array<IProduct>;
}

export interface ICourierStatus {
  id: number;
  text: 'Available' | 'Offline' | 'On delivery';
}

export interface ICourier {
  id: number;
  name: string;
  surname: string;
  email: string;
  gender: string;
  gsm: string;
  createdAt: string;
  accountNumber: string;
  licensePlate: string;
  address: string;
  avatar: Array<IFile>;
  store: IStore;
  status: ICourierStatus;
  vehicle: IVehicle;
}

export interface IOrder {
  id: number;
  user: IUser;
  createdAt: string;
  products: Array<IProduct>;
  status: IOrderStatus;
  adress: IAddress;
  store: IStore;
  courier: ICourier;
  events: Array<IEvent>;
  orderNumber: number;
  amount: number;
}

// src/interfaces/index.ts

export interface IBrand {
  id: number;
  name: string;
}

export interface IImage {
  id: number;
  link: string;
}

export interface IProductDetail {
  id: number;
  name: string;
  price: number;
  size: string;
  deposit: number;
  description: string;
  status: number;
  isUsed: string;
  category: ICategory;
  brand: IBrand;
  quantity: number;
  availableQuantity: number;
  type: string;
  images: IImage[];
}

export interface IProductList {
  id: number;
  name: string;
  price: number;
  size: string;
  deposit: number;
  description: string;
  status: string;
  category: string;
  brand: string;
  type: string;
  imgUrl: string;
}

export interface ICategory {
  id: number;
  name: string;
  description: string;
  status: number;
  imageUrl: string;
  isFeatured: boolean;
}

export interface IOrderFilterVariables {
  q?: string;
  store?: string;
  user?: string;
  createdAt?: [Dayjs, Dayjs];
  status?: string;
}

export interface IUserFilterVariables {
  q: string;
  status: boolean;
  createdAt: [Dayjs, Dayjs];
  gender: string;
  isActive: boolean;
}

export interface IReview {
  id: number;
  order: IOrder;
  user: IUser;
  star: number;
  createDate: string;
  status: 'pending' | 'approved' | 'rejected';
  comment: Array<string>;
}

export type IVehicle = {
  model: string;
  vehicleType: string;
  engineSize: number;
  color: string;
  year: number;
  id: number;
};

export interface ITrendingProducts {
  id: number;
  product: IProduct;
  orderCount: number;
}
