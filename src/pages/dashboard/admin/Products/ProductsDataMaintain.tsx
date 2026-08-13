// // import React, { useEffect, useState } from "react";
// // import {
// //   Button,
// //   Col,
// //   Form,
// //   Input,
// //   Modal,
// //   Rate,
// //   Row,
// //   Space,
// //   Table,
// //   Upload,
// // } from "antd";
// // import Swal from "sweetalert2";
// // import type { TableProps } from "antd";

// // import {
// //   DeleteOutlined,
// //   FundViewOutlined,
// //   UploadOutlined,
// // } from "@ant-design/icons";
// // import { toast } from "sonner";
// // import TextArea from "antd/es/input/TextArea";
// // // import { imageUpload } from "../../../../utils/uploadImage";
// // import MetaPagination from "../../../../components/Pagination/Pagination";
// // import { IPagination } from "@/types/setup";
// // import { PRODUCT_TYPE } from "@/types/product";
// // import { useDeleteProductMutation, useGetAllProductsQuery, useUpdateProductMutation } from "@/redux/features/products/productApi";
// // import { imageUpload } from "@/utils/uploadImage";

// // const Products: React.FC = () => {
// //   const [pagination, setPagination] = useState<IPagination>({} as IPagination);
// //   const { data: Product, isLoading } = useGetAllProductsQuery({
// //     page: pagination.page || 1,
// //     limit: pagination.limit || 10,
// //     sort: ''
// //   });
// //   useEffect(()=>{
// //     if(Product?.meta && Product){
// //       setPagination(Product.meta); 
// //     }
// //   },[Product])
// //   const [deleteProduct] = useDeleteProductMutation();
// //   const [updateProduct] = useUpdateProductMutation();
// //   const [form] = Form.useForm();
// //   const [updateFrom] = Form.useForm();
// //   const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
// //   const [currentProduct, setCurrentProduct] = useState<PRODUCT_TYPE.Products>({} as PRODUCT_TYPE.Products);
// //   const [isReviewView, setIsReviewView] = useState(false);
// //   const [ reviews, setReviews ] = useState([]);

// //   const handleDeleteProduct = async (id: string) => {
// //     const result = await Swal.fire({
// //       title: "Are you sure?",
// //       icon: "warning",
// //       showCancelButton: true,
// //       confirmButtonColor: "#3085d6",
// //       cancelButtonColor: "#d33",
// //       confirmButtonText: "Yes, delete it!",
// //     });
// //     if (result.isConfirmed) {
// //       const toastId = toast.loading("Updated Loading...");
// //       try {
// //         await deleteProduct(id);
// //         toast.success("Deleted Successfully!", {
// //           id: toastId,
// //           duration: 2000,
// //         });
// //       } catch (err) {
// //         toast.error("Something went wrong", { id: toastId });
// //       }
// //     }
// //   };
// // ;

// //   // const handleAddProduct = async () => {
// //   //   try {
// //   //     const values = await form.validateFields(); 
// //   //     console.log("Form values:", values);

// //   //     const toastId = toast.loading("Loading...");

// //   //     const img = values.upload[0].originFileObj as File;
// //   //     const image_url = await imageUpload(img);

// //   //     const payload = {
// //   //       name: values.name,
// //   //       brand: values.brand,
// //   //       model: values.model,
// //   //       cc: parseFloat(values.cc),
// //   //       pricePerHour: parseFloat(values.pricePerHour),
// //   //       year: parseFloat(values.year),
// //   //       description: values.description,
// //   //       image: image_url,
// //   //     };
// //   //     console.log("Image file:", img);

// //   //     const res = await addProduct(payload).unwrap();
// //   //     console.log("API Response:", res);
// //   //     if (res?.statusCode === 200 && res?.success) {
// //   //       toast.success("Product Added Successfully!", {
// //   //         id: toastId,
// //   //         duration: 1500,
// //   //       });
// //   //     } else {
// //   //       toast.error("Product Added Error!", { duration: 1000 });
// //   //     }
// //   //     setIsAddVisible(false)
// //   //     form.resetFields();
// //   //     // Modal.destroyAll();
// //   //   } catch (errorInfo) {
// //   //     console.log("Form validation or API call failed:", errorInfo);
// //   //     toast.error("Something went wrong!", { duration: 1000 });
// //   //   }
// //   // };

// //   // const handleUpdateProduct = (record: PRODUCT_TYPE.Products) => {
// //   //   setCurrentProduct(record);
// //   //   updateFrom.setFieldsValue(record);
// //   //   setIsUpdateModalVisible(true);
// //   // };

// //   const handleUpdateSubmit = async () => {
// //     const toastId = toast.loading("Updated Loading...");

// //     try {
// //       const values = await updateFrom.validateFields();
// //       const img = values.upload[0].originFileObj as File;
// //       const image_url = await imageUpload(img);
// //       const payload = {
// //         name: values.name,
// //         brand: values.brand,
// //         model: values.model,
// //         cc: parseFloat(values.cc),
// //         pricePerHour: parseFloat(values.pricePerHour),
// //         year: parseFloat(values.year),
// //         description: values.description,
// //         image: image_url,
// //       };

// //       // payload.image = image_url;

// //       const res = await updateProduct({
// //         id: currentProduct?.id,
// //         updatedProduct: payload,
// //       }).unwrap();
// //       console.log("API Response:", res);
// //       if (res?.statusCode === 200 && res?.success) {
// //         toast.success("Product Updated Successfully!", {
// //           id: toastId,
// //           duration: 1500,
// //         });
// //       } else {
// //         toast.error("Product Updated Error!", { duration: 1000 });
// //       }
// //       setIsUpdateModalVisible(false);
// //       form.resetFields();
// //     } catch (error) {
// //       toast.error("Something went wrong", { id: toastId });
// //     }
// //   };

  
// //   const handleViewReview = (record: any) =>{
// //     setReviews(record?.review)
// //     setIsReviewView(true);
// //     // console.log(record);
    
// //   }

// //   const columns: TableProps<PRODUCT_TYPE.Products>["columns"] = [
    
// //     {
// //       title: "Product",
// //       dataIndex: "name",
// //       key: "name",
// //       render: (_, render) => (
// //         <div className="flex justify-start items-center">
// //           <img
// //             className="w-8 h-8 rounded-full me-3"
// //             src={render.images}
// //             alt=""
// //           />
// //           <div>
// //             <p className="text-md font-bold">{render.name}</p>
// //             <p>
// //               {render.description.length > 15
// //                 ? `${render.description.substring(0, 15)}...`
// //                 : render.description}
// //             </p>{" "}
// //           </div>
// //         </div>
// //       ),
// //     },
// //     {
// //       title: "Category",
// //       dataIndex: "category",
// //       key: "category",
// //     },
// //     {
// //       title: "Price",
// //       dataIndex: "salePrice",
// //       key: "salePrice",
// //     },
// //     {
// //       title: "Quantity",
// //       dataIndex: "quantity",
// //       key: "quantity",
// //     },
// //     {
// //       title: "Stock",
// //       dataIndex: "inStock",
// //       key: "inStock",
// //       render: (_, record) => (
// //         <div
// //         >
// //           <p
// //             className={`text-white w-10 text-center  rounded-md ${
// //               record.inStock ? "bg-green-500" : "bg-gray-500"
// //             }`}
// //           >
// //             {record.inStock ? "Yes" : "No"}
// //           </p>
// //         </div>
// //       ),
// //     },
// //     {
// //       title: "Discounts",
// //       dataIndex: "discounts",
// //       key: "discounts",
// //     },
// //     {
// //       title: "Review",
// //       dataIndex: "review",
// //       key: "review",
// //       render: (_, record) => (
// //         <Space size="middle">
// //           <FundViewOutlined
// //             onClick={() => handleViewReview(record )}
// //             className="text-blue-500 text-lg"
// //           />
// //         </Space>
// //       ),
// //     },
// //     {
// //       title: "Action",
// //       key: "action",
// //       render: (_, record) => (
// //         <Space size="middle">
// //           {/* <EditOutlined
// //             onClick={() => handleUpdateProduct(record)}
// //             className="text-blue-500 text-lg"
// //           /> */}
// //           <DeleteOutlined
// //             onClick={() => handleDeleteProduct(record?.id ? record?.id : "")}
// //             className="text-red-500 hover:text-red-600 text-lg"
// //           />
// //         </Space>
// //       ),
// //     },
// //   ];
// //   const columns2: TableProps<any>["columns"] = [
// //     {
// //       title: "User",
// //       dataIndex: "user",
// //       key: "user",
// //       render: (_, render) => (
// //         <div className="flex justify-start items-center">
// //           <p className="text-md font-semibold">#{render?.userId.slice(0,8)}</p>
// //         </div>
// //       ),
// //     },
// //     {
// //       title: "rating",
// //       dataIndex: "rating",
// //       key: "rating",
// //       render: (_, render) => (

// //         <div className="flex justify-start items-center">
// //           <Rate allowHalf defaultValue={_}></Rate>
// //         </div>
// //       ),
// //     },
// //     {
// //       title: "comment",
// //       dataIndex: "comment",
// //       key: "comment",
// //     },
// //   ];

// //   return (
// //     <div className="mt-5 overflow-x-auto">
// //       <div>
// //         <h1 className="text-lg mb-2 text-black font-semibold">Products</h1>
// //       </div>

// //       {/* add Product part */}
// //       <div style={{ marginBottom: 16 }}>
// //         <div className="flex justify-between items-center">
// //           <div>
// //             <div>
// //               {/* <SearchField></SearchField> */}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* table part  */}
// //       <Table<PRODUCT_TYPE.Products>
// //         columns={columns}
// //         dataSource={Product?.data}
// //         loading={isLoading}
// //         pagination={false}
// //       />
// //      <MetaPagination setPagination={setPagination} pagination={pagination}></MetaPagination>
// //       {/* updated modal */}

// //       <Modal
// //         title="Update Product"
// //         visible={isUpdateModalVisible}
// //         onCancel={() => setIsUpdateModalVisible(false)}
// //         footer={[
// //           <Button key="cancel" onClick={() => setIsUpdateModalVisible(false)}>
// //             Cancel
// //           </Button>,
// //           <Button key="submit" type="primary" onClick={handleUpdateSubmit}>
// //             Update
// //           </Button>,
// //         ]}
// //       >
// //         <Form form={updateFrom} layout="vertical">
// //           <Row gutter={16}>
// //             <Col span={12}>
// //               <Form.Item
// //                 name="name"
// //                 label="Product Name"
// //                 rules={[
// //                   {
// //                     required: true,
// //                     message: "Please enter the Product Name",
// //                   },
// //                 ]}
// //               >
// //                 <Input placeholder="Enter product name" />
// //               </Form.Item>
// //             </Col>
// //             <Col span={12}>
// //               <Form.Item
// //                 name="brand"
// //                 label="Brand name"
// //                 rules={[
// //                   {
// //                     required: true,
// //                     message: "Please enter the Brand Name",
// //                   },
// //                 ]}
// //               >
// //                 <Input placeholder="Enter Brand Name" />
// //               </Form.Item>
// //             </Col>
// //           </Row>
// //           <Row gutter={16}>
// //             <Col span={12}>
// //               <Form.Item
// //                 name="model"
// //                 label="Model Name"
// //                 rules={[
// //                   {
// //                     required: true,
// //                     message: "Please enter the model",
// //                   },
// //                 ]}
// //               >
// //                 <Input placeholder="Enter Model" />
// //               </Form.Item>
// //             </Col>
// //             <Col span={12}>
// //               <Form.Item
// //                 name="cc"
// //                 label="Engine Capacity(CC)"
// //                 rules={[
// //                   {
// //                     required: true,
// //                     message: "Please enter the Engine Capacity",
// //                   },
// //                 ]}
// //               >
// //                 <Input
// //                   type="number"
// //                   min={0}
// //                   placeholder="Enter Engine Capacity"
// //                 />
// //               </Form.Item>
// //             </Col>
// //           </Row>
// //           <Row gutter={16}>
// //             <Col span={12}>
// //               <Form.Item
// //                 name="pricePerHour"
// //                 label="Price Per Hour"
// //                 rules={[
// //                   {
// //                     required: true,
// //                     message: "Please enter the Price Per Hour",
// //                   },
// //                 ]}
// //               >
// //                 <Input
// //                   type="number"
// //                   min={0}
// //                   placeholder="Enter Price Per Hour"
// //                 />
// //               </Form.Item>
// //             </Col>
// //             <Col span={12}>
// //               <Form.Item
// //                 name="year"
// //                 label="year"
// //                 rules={[
// //                   {
// //                     required: true,
// //                     message: "Please enter the Year",
// //                   },
// //                 ]}
// //               >
// //                 <Input type="number" min={0} placeholder="Enter Year" />
// //               </Form.Item>
// //             </Col>
// //           </Row>
// //           <Form.Item
// //             name="description"
// //             label="description"
// //             rules={[
// //               {
// //                 required: true,
// //                 message: "Please enter the description",
// //               },
// //             ]}
// //           >
// //             <TextArea
// //               autoSize={{ minRows: 2, maxRows: 3 }}
// //               placeholder="Enter description"
// //             />
// //           </Form.Item>

// //           <Form.Item
// //             name="upload"
// //             label="Upload Product Image"
// //             valuePropName="fileList"
// //             getValueFromEvent={(e) => e?.fileList}
// //           >
// //             <Upload
// //               listType="picture"
// //               maxCount={1}
// //               beforeUpload={() => false}
// //               // onChange={handleUploadChange}
// //             >
// //               <Button icon={<UploadOutlined />}>Select Image</Button>
// //             </Upload>
// //           </Form.Item>
// //           {/* </Row> */}
// //         </Form>
// //       </Modal>

// //       <Modal
// //         title="Product Review"
// //         visible={isReviewView}
// //         onCancel={() => setIsReviewView(false)}
// //       >
// //         <Table pagination={false} columns={columns2} dataSource={reviews || [] } />
// //       </Modal> 
// //     </div>
// //   );
// // };

// // export default Products;
// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Col,
//   Form,
//   Input,
//   Modal,
//   Rate,
//   Row,
//   Space,
//   Table,
//   Upload,
//   Image,
// } from "antd";
// import Swal from "sweetalert2";
// import type { TableProps, UploadFile } from "antd";

// import {
//   DeleteOutlined,
//   FundViewOutlined,
//   PlusOutlined,
//   UploadOutlined,
// } from "@ant-design/icons";
// import { toast } from "sonner";
// import TextArea from "antd/es/input/TextArea";
// import MetaPagination from "../../../../components/Pagination/Pagination";
// import { IPagination } from "@/types/setup";
// import { PRODUCT_TYPE } from "@/types/product";
// import {
//   useAddProductMutation,
//   useDeleteProductMutation,
//   useGetAllProductsQuery,
//   useUpdateProductMutation,
// } from "@/redux/features/products/productApi";
// import { imageUpload } from "@/utils/uploadImage";

// const Products: React.FC = () => {
//   const [pagination, setPagination] = useState<IPagination>({} as IPagination);
//   const { data: Product, isLoading } = useGetAllProductsQuery({
//     page: pagination.page || 1,
//     limit: pagination.limit || 10,
//     sort: "",
//   });
//   useEffect(() => {
//     if (Product?.meta && Product) {
//       setPagination(Product.meta);
//     }
//   }, [Product]);

//   const [deleteProduct] = useDeleteProductMutation();
//   const [updateProduct] = useUpdateProductMutation();
//   const [addProduct] = useAddProductMutation();

//   const [form] = Form.useForm();
//   const [updateForm] = Form.useForm();

//   const [isAddModalVisible, setIsAddModalVisible] = useState(false);
//   const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState<PRODUCT_TYPE.Products>(
//     {} as PRODUCT_TYPE.Products
//   );
//   const [isReviewView, setIsReviewView] = useState(false);
//   const [reviews, setReviews] = useState([]);
//   const [submitting, setSubmitting] = useState(false);

//   const handleDeleteProduct = async (id: string) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     });
//     if (result.isConfirmed) {
//       const toastId = toast.loading("Deleting...");
//       try {
//         await deleteProduct(id);
//         toast.success("Deleted Successfully!", { id: toastId, duration: 2000 });
//       } catch (err) {
//         toast.error("Something went wrong", { id: toastId });
//       }
//     }
//   };

//   /** Uploads every file in a fileList and returns the resulting URLs, in order. */
//   const uploadAllImages = async (fileList: UploadFile[]): Promise<string[]> => {
//     const files = fileList
//       .map((f) => f.originFileObj as File)
//       .filter((f): f is File => !!f);

//     const urls = await Promise.all(files.map((file) => imageUpload(file)));
//     return urls;
//   };

//   const handleAddProduct = async () => {
//     const toastId = toast.loading("Adding product...");
//     setSubmitting(true);
//     try {
//       const values = await form.validateFields();

//       const fileList: UploadFile[] = values.upload || [];
//       if (fileList.length === 0) {
//         toast.error("Please select at least one image", { id: toastId });
//         setSubmitting(false);
//         return;
//       }

//       const images = await uploadAllImages(fileList);

//       const payload = {
//         name: values.name,
//         brand: values.brand,
//         model: values.model,
//         cc: parseFloat(values.cc),
//         pricePerHour: parseFloat(values.pricePerHour),
//         year: parseFloat(values.year),
//         description: values.description,
//         images, // array of uploaded image URLs
//       };

//       const res = await addProduct(payload).unwrap();
//       if (res?.success) {
//         toast.success("Product Added Successfully!", { id: toastId, duration: 1500 });
//         setIsAddModalVisible(false);
//         form.resetFields();
//       } else {
//         toast.error(res?.message || "Product could not be added", { id: toastId });
//       }
//     } catch (error: any) {
//       console.log("Add product failed:", error);
//       toast.error(error?.data?.message || "Something went wrong", { id: toastId });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleUpdateProduct = (record: PRODUCT_TYPE.Products) => {
//     setCurrentProduct(record);
//     updateForm.setFieldsValue({
//       ...record,
//       // Upload expects a fileList shape, not raw URLs — seed it so existing images show as previews
//       upload: (record.images || []).map((url: string, idx: number) => ({
//         uid: `existing-${idx}`,
//         name: `image-${idx}`,
//         status: "done",
//         url,
//       })),
//     });
//     setIsUpdateModalVisible(true);
//   };

//   const handleUpdateSubmit = async () => {
//     const toastId = toast.loading("Updating...");
//     setSubmitting(true);
//     try {
//       const values = await updateForm.validateFields();

//       const fileList: UploadFile[] = values.upload || [];
//       // Keep already-uploaded images (status "done" with a url) as-is, upload only new ones (with originFileObj)
//       const existingUrls = fileList
//         .filter((f) => f.status === "done" && f.url)
//         .map((f) => f.url as string);
//       const newFiles = fileList.filter((f) => f.originFileObj);
//       const newUrls = await uploadAllImages(newFiles);

//       const images = [...existingUrls, ...newUrls];

//       if (images.length === 0) {
//         toast.error("Please keep at least one image", { id: toastId });
//         setSubmitting(false);
//         return;
//       }

//       const payload = {
//         name: values.name,
//         brand: values.brand,
//         model: values.model,
//         cc: parseFloat(values.cc),
//         pricePerHour: parseFloat(values.pricePerHour),
//         year: parseFloat(values.year),
//         description: values.description,
//         images,
//       };

//       const res = await updateProduct({
//         id: currentProduct?.id,
//         updatedProduct: payload,
//       }).unwrap();

//       if (res?.success) {
//         toast.success("Product Updated Successfully!", { id: toastId, duration: 1500 });
//         setIsUpdateModalVisible(false);
//         updateForm.resetFields();
//       } else {
//         toast.error(res?.message || "Product could not be updated", { id: toastId });
//       }
//     } catch (error: any) {
//       console.log("Update product failed:", error);
//       toast.error(error?.data?.message || "Something went wrong", { id: toastId });
//     } finally {
//       setSubmitting(false);
//     }
//   };


//   const columns: TableProps<PRODUCT_TYPE.Products>["columns"] = [
//     {
//       title: "Product",
//       dataIndex: "name",
//       key: "name",
//       render: (_, render) => (
//         <div className="flex justify-start items-center">
//           <img
//             className="w-8 h-8 rounded-full me-3 object-cover"
//             src={render.images?.[0] || ""}
//             alt={render.name}
//           />
//           <div>
//             <p className="text-md font-bold">{render.name}</p>
//             <p>
//               {render.description && render.description.length > 15
//                 ? `${render.description.substring(0, 15)}...`
//                 : render.description}
//             </p>
//           </div>
//         </div>
//       ),
//     },
//     { title: "Price", dataIndex: "salePrice", key: "salePrice" },
//     { title: "Quantity", dataIndex: "quantity", key: "quantity" },
//     { title: "Discounts", dataIndex: "discounts", key: "discounts" },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <Space size="middle">
//           <FundViewOutlined
//             onClick={() => handleUpdateProduct(record)}
//             className="text-blue-500 text-lg cursor-pointer"
//           />
//           <DeleteOutlined
//             onClick={() => handleDeleteProduct(record?.id ? record?.id : "")}
//             className="text-red-500 hover:text-red-600 text-lg cursor-pointer"
//           />
//         </Space>
//       ),
//     },
//   ];


//   /** Shared image-upload form fields, used by both Add and Update forms. */
//   const renderProductFormFields = (formInstance: typeof form) => (
//     <>
//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item
//             name="name"
//             label="Product Name"
//             rules={[{ required: true, message: "Please enter the Product Name" }]}
//           >
//             <Input placeholder="Enter product name" />
//           </Form.Item>
//         </Col>
//       </Row>
//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item
//             name="pricePerHour"
//             label="Price Per Hour"
//             rules={[{ required: true, message: "Please enter the Price Per Hour" }]}
//           >
//             <Input type="number" min={0} placeholder="Enter Price Per Hour" />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item
//             name="year"
//             label="Year"
//             rules={[{ required: true, message: "Please enter the Year" }]}
//           >
//             <Input type="number" min={0} placeholder="Enter Year" />
//           </Form.Item>
//         </Col>
//       </Row>
//       <Form.Item
//         name="description"
//         label="Description"
//         rules={[{ required: true, message: "Please enter the description" }]}
//       >
//         <TextArea autoSize={{ minRows: 2, maxRows: 3 }} placeholder="Enter description" />
//       </Form.Item>

//       <Form.Item
//         name="upload"
//         label="Product Images"
//         valuePropName="fileList"
//         getValueFromEvent={(e) => e?.fileList}
//         rules={[{ required: true, message: "Please upload at least one image" }]}
//       >
//         <Upload
//           listType="picture-card"
//           multiple
//           maxCount={6}
//           beforeUpload={() => false} // prevent auto-upload; we upload manually on submit
//         >
//           <div>
//             <PlusOutlined />
//             <div style={{ marginTop: 8 }}>Upload</div>
//           </div>
//         </Upload>
//       </Form.Item>
//     </>
//   );

//   return (
//     <div className="mt-5 overflow-x-auto">
//       <div>
//         <h1 className="text-lg mb-2 text-black font-semibold">Products</h1>
//       </div>

//       <div style={{ marginBottom: 16 }}>
//         <div className="flex justify-between items-center">
//           <div />
//           <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)}>
//             Add Product
//           </Button>
//         </div>
//       </div>

//       <Table<PRODUCT_TYPE.Products>
//         columns={columns}
//         dataSource={Product?.data}
//         loading={isLoading}
//         pagination={false}
//         rowKey="id"
//         scroll={{ x: "max-content" }}
//       />
//       <MetaPagination setPagination={setPagination} pagination={pagination} />

//       {/* Add Product modal */}
//       <Modal
//         title="Add Product"
//         open={isAddModalVisible}
//         onCancel={() => {
//           setIsAddModalVisible(false);
//           form.resetFields();
//         }}
//         width={640}
//         footer={[
//           <Button key="cancel" onClick={() => setIsAddModalVisible(false)}>
//             Cancel
//           </Button>,
//           <Button key="submit" type="primary" loading={submitting} onClick={handleAddProduct}>
//             Add
//           </Button>,
//         ]}
//       >
//         <Form form={form} layout="vertical">
//           {renderProductFormFields(form)}
//         </Form>
//       </Modal>

//       {/* Update Product modal */}
//       <Modal
//         title="Update Product"
//         open={isUpdateModalVisible}
//         onCancel={() => {
//           setIsUpdateModalVisible(false);
//           updateForm.resetFields();
//         }}
//         width={640}
//         footer={[
//           <Button key="cancel" onClick={() => setIsUpdateModalVisible(false)}>
//             Cancel
//           </Button>,
//           <Button key="submit" type="primary" loading={submitting} onClick={handleUpdateSubmit}>
//             Update
//           </Button>,
//         ]}
//       >
//         <Form form={updateForm} layout="vertical">
//           {renderProductFormFields(updateForm)}
//         </Form>
//       </Modal>

//     </div>
//   );
// };

// export default Products;

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  Clock,
  Key,
  LayoutGrid,
  LucideIcon,
  Pencil,
  Pill,
  PenTool,
  PiggyBank,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/types";
import { PRODUCTS } from "@/pages/data/ProductData";

/* ---------------- Icon registry ----------------
   Only icons already used across the catalogue are offered here.
   Add new entries to both ICONS and the <select> options below
   whenever a new product category needs a new glyph.
------------------------------------------------- */
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

function iconName(icon?: LucideIcon): string {
  const found = Object.entries(ICONS).find(([, comp]) => comp === icon);
  return found ? found[0] : ICON_NAMES[0];
}

function calcDiscount(price: number, was: number): number {
  if (!was || was <= price) return 0;
  return Math.round(((was - price) / was) * 100);
}

/* ---------------- Empty form shape ---------------- */
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
  images: string[];
  description: string;
}

function blankForm(): ProductForm {
  return {
    id: null,
    code: "",
    name: "",
    bn: "",
    price: "",
    was: "",
    minOrder: "1",
    iconName: ICON_NAMES[0],
    cat: CATEGORIES[0],
    quantity: "1",
    images: [""],
    description: "",
  };
}

function productToForm(p: Product): ProductForm {
  return {
    id: p.id,
    code: p.code ?? "",
    name: p.name ?? "",
    bn: p.bn ?? "",
    price: String(p.price ?? ""),
    was: String(p.was ?? ""),
    minOrder: String((p as any).minOrder ?? 1),
    iconName: iconName(p.icon),
    cat: p.cat ?? CATEGORIES[0],
    quantity: String(p.quantity ?? 1),
    images: p.images && p.images.length ? [...p.images] : [""],
    description: p.description ?? "",
  };
}

type ViewMode = "list" | "view" | "add" | "edit";

/* ---------------- Product Management Page ---------------- */
export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [mode, setMode] = useState<ViewMode>("list");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<ProductForm>(blankForm());
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const activeProduct = useMemo(
    () => products.find((p) => p.id === activeId) ?? null,
    [products, activeId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.bn?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q) ||
        p.cat?.toLowerCase().includes(q)
    );
  }, [products, query]);

  /* ---------- navigation helpers ---------- */
  const goList = () => {
    setMode("list");
    setActiveId(null);
  };
  const goView = (p: Product) => {
    setActiveId(p.id);
    setMode("view");
  };
  const goAdd = () => {
    const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const f = blankForm();
    f.id = nextId;
    setForm(f);
    setMode("add");
  };
  const goEdit = (p: Product) => {
    setForm(productToForm(p));
    setActiveId(p.id);
    setMode("edit");
  };

  /* ---------- form field helpers ---------- */
  const setField = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setImageAt = (idx: number, value: string) =>
    setForm((f) => {
      const next = [...f.images];
      next[idx] = value;
      return { ...f, images: next };
    });

  const addImageField = () => setForm((f) => ({ ...f, images: [...f.images, ""] }));

  const removeImageField = (idx: number) =>
    setForm((f) => {
      const next = f.images.filter((_, i) => i !== idx);
      return { ...f, images: next.length ? next : [""] };
    });

  const applyCategory = (cat: string) => {
    setField("cat", cat);
    // Suggest a code only if the person hasn't typed one yet.
    if (!form.code.trim() && CATEGORY_PREFIX[cat]) {
      const prefix = CATEGORY_PREFIX[cat];
      const nextNum = String(form.id ?? products.length + 1).padStart(3, "0");
      setField("code", `${prefix}-${nextNum}`);
    }
  };

  /* ---------- save / delete ---------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price || !form.was) {
      toast.error("Name, price, and regular price are required.");
      return;
    }

    const price = Number(form.price);
    const was = Number(form.was);
    const cleanImages = form.images.map((i) => i.trim()).filter(Boolean);

    const product: Product = {
      id: form.id as number,
      code: form.code.trim(),
      name: form.name.trim(),
      bn: form.bn.trim(),
      price,
      was,
      discount: calcDiscount(price, was),
      minOrder: Math.max(1, Number(form.minOrder) || 1),
      icon: ICONS[form.iconName],
      cat: form.cat,
      quantity: Math.max(0, Number(form.quantity) || 0),
      images: cleanImages,
      description: form.description,
    } as Product;

    if (mode === "add") {
      setProducts((prev) => [product, ...prev]);
      toast.success("Product added.");
    } else {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
      toast.success("Product updated.");
    }
    setActiveId(product.id);
    setMode("view");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" removed.`);
    setDeleteTarget(null);
    goList();
  };

  /* ================= RENDER ================= */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 font-[Karla]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          {mode !== "list" && (
            <button
              onClick={goList}
              className="flex items-center gap-1 text-sm text-[#8a7860] hover:text-[#2B1D14] mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to products
            </button>
          )}
          <h1 className="font-[Fraunces] text-2xl sm:text-3xl text-[#2B1D14] flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-[#A8823C]" />
            {mode === "list" && "Product Management"}
            {mode === "view" && "Product Details"}
            {mode === "add" && "Add Product"}
            {mode === "edit" && "Edit Product"}
          </h1>
          <p className="text-sm text-[#8a7860] mt-1">
            {mode === "list" && `${products.length} products in your catalogue`}
            {mode === "view" && activeProduct?.code}
            {(mode === "add" || mode === "edit") &&
              "Fill in the details below — required fields are marked *"}
          </p>
        </div>

        {mode === "list" && (
          <button
            onClick={goAdd}
            className="flex items-center gap-2 bg-[#2B1D14] text-white font-semibold px-5 py-2.5 rounded-full hover:bg-[#4A3627] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {/* ---------------- LIST VIEW ---------------- */}
      {mode === "list" && (
        <div>
          <div className="relative mb-5 max-w-sm">
            <Search className="w-4 h-4 text-[#b3a385] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, code, or category..."
              className="w-full rounded-full border border-[#D8C7A8] bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8]"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#D8C7A8] rounded-2xl">
              <p className="text-[#8a7860]">No products match your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#E4D8C4] bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F7F3EA] text-left text-[#8a7860] text-xs uppercase tracking-wide">
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Discount</th>
                    <th className="px-4 py-3">Min. Order</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const Icon = p.icon;
                    return (
                      <tr key={p.id} className="border-t border-[#E4D8C4] hover:bg-[#FAF6EF]">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => goView(p)}
                            className="flex items-center gap-3 text-left"
                          >
                            {p.images?.[0] ? (
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-11 h-11 rounded-lg object-cover shrink-0 border border-[#E4D8C4]"
                              />
                            ) : (
                              <span className="w-11 h-11 rounded-lg bg-[#F7F3EA] flex items-center justify-center shrink-0 border border-[#E4D8C4]">
                                {Icon && <Icon className="w-5 h-5 text-[#A8823C]" />}
                              </span>
                            )}
                            <span>
                              <span className="block font-[Fraunces] text-[#2B1D14] leading-snug">
                                {p.name}
                              </span>
                              <span className="block text-xs text-[#8a7860]">{p.bn}</span>
                            </span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-[#8a7860]">{p.code}</td>
                        <td className="px-4 py-3 text-[#8a7860]">{p.cat}</td>
                        <td className="px-4 py-3">
                          <span className="text-[#A8823C] font-bold">৳{p.price}</span>
                          <span className="text-[#b3a385] text-xs line-through ml-1">
                            ৳{p.was}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#8C3B2E] font-semibold">
                          -{(p as any).discount ?? calcDiscount(p.price, p.was)}%
                        </td>
                        <td className="px-4 py-3 text-[#8a7860]">
                          {(p as any).minOrder ?? 1}
                        </td>
                        <td className="px-4 py-3 text-[#8a7860]">{p.quantity}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => goEdit(p)}
                              className="p-2 rounded-full border border-[#D8C7A8] text-[#2B1D14] hover:bg-[#F7F3EA]"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(p)}
                              className="p-2 rounded-full border border-[#E4B7A8] text-[#8C3B2E] hover:bg-[#FBEEE9]"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ---------------- SINGLE PRODUCT VIEW ---------------- */}
      {mode === "view" && activeProduct && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {activeProduct.images?.[0] ? (
              <img
                src={activeProduct.images[0]}
                alt={activeProduct.name}
                className="w-full h-80 object-cover rounded-2xl border border-[#E4D8C4]"
              />
            ) : (
              <div className="w-full h-80 rounded-2xl border border-[#E4D8C4] bg-[#F7F3EA] flex items-center justify-center">
                {activeProduct.icon && (
                  <activeProduct.icon className="w-16 h-16 text-[#A8823C]" />
                )}
              </div>
            )}
            {activeProduct.images && activeProduct.images.length > 1 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {activeProduct.images.slice(1).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg border border-[#E4D8C4]"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs tracking-[0.2em] uppercase text-[#A8823C]">
                {activeProduct.cat}
              </p>
              <p className="text-xs text-[#b3a385]">Code: {activeProduct.code}</p>
            </div>
            <h2 className="font-[Fraunces] text-2xl text-[#2B1D14] mt-2">{activeProduct.name}</h2>
            <p className="text-[#8a7860] mt-1">{activeProduct.bn}</p>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-[#A8823C] font-bold text-2xl">৳{activeProduct.price}</span>
              <span className="text-[#b3a385] text-base line-through">৳{activeProduct.was}</span>
              <span className="text-[#8C3B2E] text-sm font-semibold">
                -{(activeProduct as any).discount ?? calcDiscount(activeProduct.price, activeProduct.was)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
              <div className="rounded-xl border border-[#E4D8C4] px-4 py-3">
                <p className="text-[#8a7860] text-xs">Minimum Order</p>
                <p className="text-[#2B1D14] font-semibold">
                  {(activeProduct as any).minOrder ?? 1} pcs
                </p>
              </div>
              <div className="rounded-xl border border-[#E4D8C4] px-4 py-3">
                <p className="text-[#8a7860] text-xs">Stock Quantity</p>
                <p className="text-[#2B1D14] font-semibold">{activeProduct.quantity}</p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E4D8C4]">
              <h3 className="font-[Fraunces] text-lg text-[#2B1D14] mb-2">Description</h3>
              <p className="whitespace-pre-line text-sm text-[#4A3627] leading-relaxed">
                {activeProduct.description}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => goEdit(activeProduct)}
                className="flex-1 flex items-center justify-center gap-2 border border-[#2B1D14] text-[#2B1D14] font-semibold py-2.5 rounded-full hover:bg-[#2B1D14] hover:text-white transition-colors"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => setDeleteTarget(activeProduct)}
                className="flex-1 flex items-center justify-center gap-2 border border-[#E4B7A8] text-[#8C3B2E] font-semibold py-2.5 rounded-full hover:bg-[#8C3B2E] hover:text-white hover:border-[#8C3B2E] transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- ADD / EDIT FORM ---------------- */}
      {(mode === "add" || mode === "edit") && (
        <form onSubmit={handleSubmit} className="max-w-3xl">
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
                <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">
                  Discount
                </label>
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
                Image URLs
              </label>
              <div className="space-y-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      value={img}
                      onChange={(e) => setImageAt(idx, e.target.value)}
                      placeholder="/images/Category/image-1.jpg"
                      className="flex-1 rounded-lg border border-[#D8C7A8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8C7A8]"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageField(idx)}
                      className="p-2.5 rounded-lg border border-[#D8C7A8] text-[#8a7860] hover:text-[#8C3B2E] hover:border-[#E4B7A8]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addImageField}
                className="mt-2 flex items-center gap-1 text-sm text-[#A8823C] font-semibold hover:text-[#96742f]"
              >
                <Plus className="w-4 h-4" /> Add another image
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2B1D14] mb-1.5">
                Description
              </label>
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
            <button
              type="button"
              onClick={goList}
              className="flex-1 border border-[#D8C7A8] text-[#2B1D14] font-semibold py-3 rounded-full hover:bg-[#F7F3EA] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#2B1D14] text-white font-semibold py-3 rounded-full hover:bg-[#4A3627] transition-colors"
            >
              {mode === "add" ? "Add Product" : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* ---------------- DELETE CONFIRM ---------------- */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="font-[Fraunces] text-lg text-[#2B1D14]">Delete product?</h3>
            <p className="text-sm text-[#8a7860] mt-2">
              This will permanently remove{" "}
              <span className="font-semibold text-[#2B1D14]">{deleteTarget.name}</span> from your
              catalogue. This can't be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-[#D8C7A8] text-[#2B1D14] font-semibold py-2.5 rounded-full hover:bg-[#F7F3EA]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-[#8C3B2E] text-white font-semibold py-2.5 rounded-full hover:bg-[#742f24]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}