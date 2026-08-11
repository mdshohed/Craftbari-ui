import { DeleteOutlined, FundViewOutlined, SearchOutlined } from "@ant-design/icons";
import { Card, Checkbox, Input, message, Modal, Space, Table, Tag, TableProps, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { IPagination } from "../../../../types/setup";
import MetaPagination from "../../../../components/Pagination/Pagination";
import { useDeleteOrderMutation, useGetAllOrderQuery, useUpdateOrderMutation } from "@/redux/features/orders/orderApi";
import useIsMobile from "./useIsMobile";
import OrderCard from "./OrderCard";

interface IOrderProduct {
  id?: string;
  name?: string;
  code?: string;             
  price?: number;
  unitPrice?: number;
  quantity?: number;
  orderQuantity?: number;
  discount?: number;
}

interface IOrderRecord {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  createdAt?: string;
  isDelivered?: boolean;
  orderProducts: IOrderProduct[];
  transactionId?: string;
  vendor?: { name?: string; email?: string; contactNumber?: string };
  customer?: { name?: string; email?: string; contactNumber?: string };
}

interface IOrderRow {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  date?: string;
  amount: number;
  isDelivered: boolean;
  codes?: string;            
}

const formatCurrency = (amount: number): string =>
  `৳${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

const formatDate = (iso?: string): string => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

/** price/unitPrice and quantity/orderQuantity both appear across the codebase — support either. */
const lineTotal = (p: IOrderProduct): number => {
  const unit = p.unitPrice ?? p.price ?? 0;
  const qty = p.orderQuantity ?? p.quantity ?? 1;
  const discount = p.discount ?? 0;
  return unit * qty - discount;
};

const orderTotal = (order: IOrderRecord): number =>
  (order.orderProducts || []).reduce((acc, curr) => acc + lineTotal(curr), 0);

export default function Orders() {
  const isMobile = useIsMobile();

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [orderList, setOrderList] = useState<IOrderRow[]>([]);
  const [productList, setProductList] = useState<IOrderProduct[]>([]);
  const [orderDetails, setOrderDetails] = useState<IOrderRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<IPagination>({} as IPagination);

  const {
    data: orders,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllOrderQuery({
    page: pagination.page || 1,
    limit: pagination.limit || 10,
    sort: "",
  });

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

 useEffect(() => {
  if (orders && orders.data) {
    const transform: IOrderRow[] = orders.data.map((item: IOrderRecord) => ({
      id: (item?.id ?? item?._id ?? "") as string,
      name: item?.name,
      phone: item?.phoneNumber,
      address: item?.deliveryAddress,
      date: item?.createdAt,
      amount: orderTotal(item),
      isDelivered: !!item?.isDelivered,
      codes: (item?.orderProducts || [])
        .map((p) => p.code)
        .filter(Boolean)
        .join(", "), // ← added
    }));
    setOrderList(transform);
  }
  if (orders?.meta) {
    setPagination(orders.meta);
  }
}, [orders]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orderList;
    const term = searchTerm.trim().toLowerCase();
    return orderList.filter(
      (o) =>
        o.id.toLowerCase().includes(term) ||
        o.phone?.toLowerCase().includes(term) ||
        o.address?.toLowerCase().includes(term) ||
        o.email?.toLowerCase().includes(term)
    );
  }, [orderList, searchTerm]);

  const completedOrders = useMemo(() => filteredOrders.filter((o) => o.isDelivered), [filteredOrders]);
  const pendingOrders = useMemo(() => filteredOrders.filter((o) => !o.isDelivered), [filteredOrders]);

  const handleUpdateOrder = (record: IOrderRow) => {
    const fullOrder = orders?.data?.find(
      (item: IOrderRecord) => (item?.id ?? item?._id) === record?.id
    );
    setOrderDetails(fullOrder ?? null);
    setProductList(fullOrder?.orderProducts ?? []);
    setIsUpdateModalVisible(true);
  };

  const handleUpdate = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to confirm this order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await updateOrder({
          orderId,
          data: {
            isDelivered: true,
          },
        }).unwrap();

        if (res.success) {
          message.success("Order confirmed successfully");
          refetch();
        } else {
          message.error("Order confirmation failed");
        }
      } catch (error) {
        console.error(error);
        message.error("An error occurred while confirming the order");
      }
    }
  };
  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Delete this order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteOrder(orderId).unwrap();

        if (res.success) {
          message.success("Order deleted successfully");
          refetch();
        } else {
          message.error("Order deletion failed");
        }
      } catch (error) {
        console.error(error);
        message.error("An error occurred while deleting the order");
      }
    }
  };

  const columns: TableProps<IOrderRow>["columns"] = [
  // {
  //   title: "Order",
  //   dataIndex: "id",
  //   key: "id",
  //   render: (_, record) => (
  //     <p className="text-start">#{typeof record.id === "string" ? record.id.slice(0, 8) : ""}</p>
  //   ),
  // },
  {
    title: "Code",
    dataIndex: "codes",
    key: "codes",
    render: (codes: string) => codes || "—",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Placed",
      dataIndex: "date",
      key: "date",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Total",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (amount: number) => formatCurrency(amount),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Status",
      dataIndex: "isDelivered",
      key: "isDelivered",
      render: (_, record) => (
        <Tag color={record.isDelivered ? "green" : "red"}>
          {record.isDelivered ? "Success" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <FundViewOutlined
            onClick={() => handleUpdateOrder(record)}
            className="text-blue-500 text-lg cursor-pointer"
          />
          <Checkbox
            checked={record?.isDelivered}
            disabled={record?.isDelivered}
            onChange={() => handleUpdate(record?.id ? record?.id : "")}
          >
            Confirm
          </Checkbox>
          <DeleteOutlined
            onClick={() => handleDelete(record?.id ? record?.id : "")}
            className="text-red-500 text-lg cursor-pointer"
          />
        </Space>
      ),
    },
  ];

  const columns2: TableProps<IOrderProduct>["columns"] = [
  // {
  //   title: "Product",
  //   dataIndex: "id",
  //   key: "id",
  //   render: (_, record) => (
  //     <p className="text-start">#{typeof record.id === "string" ? record.id.slice(0, 8) : ""}</p>
  //   ),
  // },
  {
    title: "Code",
    key: "code",
    render: (_, record) => record.code || "—",
  },
  {
    title: "Name",
    key: "name",
    render: (_, record) => record.name,
  },
  {
    title: "Price",
    key: "price",
    render: (_, record) => formatCurrency(record.unitPrice ?? record.price ?? 0),
  },
  {
    title: "Quantity",
    key: "quantity",
    render: (_, record) => (
      <p className="text-center">{record.orderQuantity ?? record.quantity ?? "—"}</p>
    ),
  },
];

  const renderOrderList = (data: IOrderRow[]) => {
    if (isMobile) {
      return (
        <div>
          {data.map((order) => (
            // <OrderCard
            //   key={order.id}
            //   order={order}
            //   onView={() => handleUpdateOrder(order)}
            //   onConfirm={() => handleUpdate(order.id)}
            //   formatCurrency={formatCurrency}
            //   formatDate={formatDate}
            // />
            <OrderCard
              key={order.id}
              order={order}
              onView={() => handleUpdateOrder(order)}
              onConfirm={() => handleUpdate(order.id)}
              onDelete={() => handleDelete(order.id)}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          ))}
          {data.length === 0 && !isLoading && (
            <p className="text-center text-gray-400 text-sm py-8">No orders found.</p>
          )}
        </div>
      );
    }
    return (
      <Table
        columns={columns}
        pagination={false}
        loading={isLoading || isFetching}
        dataSource={data}
        rowKey="id"
        scroll={{ x: "max-content" }}
      />
    );
  };

  return (
    <div className="px-3 sm:px-0">
      <div>
        <h1 className="text-lg mb-2 text-black font-semibold">Orders</h1>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          allowClear
          placeholder="Search by order ID, phone, or address"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-xs"
        />
      </div>

      <Card style={{ height: "100%" }} styles={{ body: { padding: isMobile ? 12 : 24 } }}>
        <Tabs>
          <TabPane key="allOrder" tab={`All Orders (${filteredOrders.length})`}>
            {renderOrderList(filteredOrders)}
            {!isMobile && <MetaPagination setPagination={setPagination} pagination={pagination}></MetaPagination>}
          </TabPane>
          <TabPane key="completed" tab={`Completed (${completedOrders.length})`}>
            {renderOrderList(completedOrders)}
          </TabPane>
          <TabPane key="pending" tab={`Pending (${pendingOrders.length})`}>
            {renderOrderList(pendingOrders)}
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Order Details"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={null}
        width={isMobile ? "94%" : 640}
        style={{ top: isMobile ? 16 : undefined }}
      >
        <Card styles={{ body: { padding: isMobile ? 12 : 24 } }}>
          <div className="mb-4">
            <p className="font-semibold mb-1">Order Details</p>
            <p className="text-sm break-words">Delivery Name: {orderDetails?.name ?? "—"}</p>
            <p className="text-sm break-words">Delivery Address: {orderDetails?.deliveryAddress ?? "—"}</p>
            <p className="text-sm break-words">Phone Number: {orderDetails?.phoneNumber ?? "—"}</p>
            <p className="text-sm break-words">Transaction ID: {orderDetails?.transactionId ?? "—"}</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Product Details</p>
            <Table
              pagination={false}
              columns={columns2}
              dataSource={productList || []}
              rowKey="id"
              scroll={{ x: "max-content" }}
              size={isMobile ? "small" : "middle"}
            />
            <p className="text-right font-semibold mt-3">
              Order Total: {formatCurrency(orderDetails ? orderTotal(orderDetails) : 0)}
            </p>
          </div>
        </Card>
      </Modal>
    </div>
  );
}