import { Button, Card, Tag } from "antd";
import { FundViewOutlined, DeleteOutlined } from "@ant-design/icons";

interface OrderCardProps {
  order: {
    id: string;
    name?: string;
    code?: string;
    phone?: string;
    address?: string;
    date?: string;
    amount: number;
    isDelivered: boolean;
  };
  onView: () => void;
  onConfirm: () => void;
  onDelete: () => void;
  formatCurrency: (n: number) => string;
  formatDate: (d?: string) => string;
}

export default function OrderCard({ order, onView, onConfirm, onDelete, formatCurrency, formatDate }: OrderCardProps) {
  return (
    <Card size="small" className="mb-3" styles={{ body: { padding: 14 } }}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-sm text-black">#{order.id.slice(0, 8)}</p>
          <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {order.code && (
            <Tag className="!m-0" color="default">
              {order.code}
            </Tag>
          )}
          <Tag color={order.isDelivered ? "green" : "red"}>{order.isDelivered ? "Success" : "Pending"}</Tag>
        </div>
      </div>

      {order.name && <p className="text-sm font-medium text-black mb-1">{order.name}</p>}
      {order.phone && <p className="text-sm text-gray-700 mb-1">{order.phone}</p>}
      {order.address && <p className="text-sm text-gray-700 mb-3 line-clamp-2">{order.address}</p>}

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
        <span className="font-semibold text-black">{formatCurrency(order.amount)}</span>
        <div className="flex gap-2">
          <Button size="small" icon={<FundViewOutlined />} onClick={onView}>
            View
          </Button>
          <Button size="small" type="primary" disabled={order.isDelivered} onClick={onConfirm}>
            Confirm
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={onDelete} />
        </div>
      </div>
    </Card>
  );
}