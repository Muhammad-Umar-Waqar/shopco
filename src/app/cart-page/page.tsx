"use client";


import BreadcrumbCart from "@/components/cart-page/BreadcrumbCart";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { FaArrowRight } from "react-icons/fa6";
import React, { useState } from "react";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks/redux";
import ProductCard from "@/components/cart-page/ProductCard";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import Link from "next/link";
import { MdOutlineLocalOffer } from "react-icons/md";
import { TbBasketExclamation } from "react-icons/tb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { client } from "@/sanity/lib/client";
import { Product } from "@/types/product.types";
import axios from "axios";
import { toast } from "react-toastify";


// Define the type for formData
interface FormData {
  name: string;
  email: string;
  phone: string;
}



export default function CartPage() {
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts
  );



  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });




  // Handle input changes for all fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  // const createShipment = async (order, customer) => {
  //   try {
  //     // const shipmentObject = {
  //     //   _type: 'shipment',
  //     //   order: {
  //     //     _type: 'reference',
  //     //     _ref: order._id, // Reference to the created order
  //     //   },
  //     //   customer: {
  //     //     _type: 'reference',
  //     //     _ref: customer._id, // Reference to the customer
  //     //   },
  //     //   shipment_status: 'Pending', // You can update this based on Shippo's response
  //     //   tracking_number: shipmentData.tracking_number || 23445,
  //     //   carrier: shipmentData.carrier || "Shippo",
  //     //   shipping_label_url: shipmentData.label_url || "https://api.goshippo.com/",
  //     //   shipment_date: new Date().toISOString(),
       
  //     // };
  
  //     // const res = await client.create(shipmentObject);
  //     // console.log("Shipment created successfully In Sanity:", res);


  //     // const shipmentPayload = 
  
  //     // const response = await axios.post("/api/shippoOrder", {
  //     //   headers: {
  //     //     'Content-Type': 'application/json',

  //     //   },
  //     //   body: JSON.stringify({
  //     //     address_from: {
  //     //       name: "Your E-Commerce Store",
  //     //       street1: "123 Main St",
  //     //       city: "San Francisco",
  //     //       state: "CA",
  //     //       zip: "94107",
  //     //       country: "US",
  //     //       phone: "123-456-7890",
  //     //       email: "support@shopco.com",
  //     //     },
  //     //     address_to: {
  //     //        street1: customer.address.street1 || "123 Main St", // Include customer address
  //     //       city: customer.address.city || "CA",
  //     //       state: customer.address.state || "US",
  //     //       zip: customer.address.zip ||  "94105",
  //     //       country: customer.address.country || "US",
  //     //       phone: customer.phone,
  //     //       email: customer.email,
  //     //       name: customer.name,
  //     //     },
  
  //     //     parcels: order.cart.map((item) => ({
  //     //       length: 10, // Replace with item dimensions if available
  //     //       width: 5,
  //     //       height: 4,
  //     //       distance_unit: "in",
  //     //       weight: 1, // Replace with actual weight if available
  //     //       mass_unit: "lb",
  //     //     })),
  
  //     //     // shipment_date: new Date().toISOString().split("T")[0],
  
  //     //     orderId: order._id || "123",
  
  //     //     totalAmount: order.totalPrice || 2332,
  
  //     //   }),

  //     // });
  

  //     const response = await axios.post("/api/shippoOrder", {
  //       addressFrom: {
  //         name: "Your E-Commerce Store",
  //         street1: "123 Main St",
  //         city: "San Francisco",
  //         state: "CA",
  //         zip: "94107",
  //         country: "US",
  //       },
  //       addressTo: {
  //         street1: customer.address.street1 || "123 Main St",
  //         city: customer.address.city || "San Francisco",
  //         state: customer.address.state || "CA",
  //         zip: customer.address.zip || "94105",
  //         country: customer.address.country || "US",
  //       },
  //       parcels: order.cart.map((item) => ({
  //         length: 10,
  //         width: 5,
  //         height: 4,
  //         distance_unit: "in",
  //         weight: 1,
  //         mass_unit: "lb",
  //       })),
  //       orderId: order._id || "123",
  //       totalAmount: order.totalPrice || 232,
  //     });
      

  //     console.log("Shipment Created:", response.data);
  //     return response.data;

      
  //   } catch (error) {
  //     console.error("Error creating shipment in Sanity:", error);
  //     throw error;
  //   } 
  // };



  const createShipment = async (order, customer) => {
    try {
      const response = await fetch("/api/shippoOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressFrom: {
            name: "Your E-Commerce Store",
            street1: "123 Main St",
            city: "San Francisco",
            state: "CA",
            zip: String("94105"),
            country: "US",
          },
          addressTo: {
            street1: customer.address.street1 || "123 Main St",
            city: customer.address.city || "San Francisco",
            state: customer.address.state || "CA",
            zip: String("94345"),
            country: customer.address.country || "US",
          },
          parcels: order.cart.map((item) => ({
            length: 10,
            width: 5,
            height: 4,
            distance_unit: "in",
            weight: 1,
            mass_unit: "lb",
          })),
          orderId: order._id || "123",
          totalAmount: order.totalPrice || 232,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create shipment");
        toast.error("Failed to create shipment");
      }
  
      const data = await response.json();
      console.log("Shipment Created:", data);
      return data;
    } catch (error) {
      console.error("Error creating shipment:", error);
      throw error;
    }
  };
  
  




  const createCustomerInSanity = async (customerInfo: FormData) =>{
      try{
        const customerObject = {
          _type : "customer",
          name: customerInfo.name,
          email: customerInfo.email,
          phone:  customerInfo.phone,
        }
          const response = await client.create(customerObject);
       
        console.log("User Created SuccessFully", response);
        return response;

      } catch(e){
        console.log("Error creating Customer In Sanity ", e)
        
      }

  }


  const createOrderInSanity = async (cartData: Product[], customer_id, totalPrice, adjustedTotalPrice) => {
      try{
        const orderObject = {
          _type : "order",
          customer: {
            _type: "reference",
            _ref: customer_id
          },
          cart: cartData.items.map((item) => ({
                _type: "object", // Each cart item is an object
                id: item.id,
                name: item.name,
                srcUrl: item.srcUrl, // Assuming `image` is the URL in your `cartData`
                price: item.price,
                attributes: item.attributes || [], // Attributes (if available)
                quantity: item.quantity,
              })),
          
          totalPrice : adjustedTotalPrice ? adjustedTotalPrice  : totalPrice,
          
            }

        const response = await client.create(orderObject);
      
        console.log("Order Object Created SuccessFully", response);
        return response;

      } catch(e){
        console.log("Error creating Order In Sanity ", e)
        
      }

  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("userData", formData); // Log the entire form data
    console.log("Cart Data ", cart);
    console.log("total Price ", totalPrice);
    console.log("adjustedTotalPrice ", adjustedTotalPrice);


    const customer = await createCustomerInSanity(formData);
    console.log("CUSTOMER< > ", customer?._id );

    if(customer){
      const order = await createOrderInSanity(cart, customer._id, totalPrice, adjustedTotalPrice);


      const customerDetails = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street1:"123 Main St",
          city:  "CA",
          state: "US",
          zip:  94105,
          country:  "US",
        }
      };

      const shipment = await createShipment(order, customerDetails);
      if(shipment){
        console.log("Shipment Created Successfully", shipment);
        toast.success("Shipment Created Succesfully!");
            setFormData({
        name: "",
        email: "",
        phone: "",
            })
      }
    }

  };






  return (
    <main className="pb-20">
      <div className="max-w-frame xl:px-0 mx-auto px-4 ">
        {cart && cart.items.length > 0 ? (
          <>
            <BreadcrumbCart />
            <h2
              className={cn([
                integralCF.className,
                "text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6 font-bold ",
              ])}
            >
              your cart
            </h2>
            <div className="flex flex-col items-start lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5">
              <div className="w-full p-3.5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
                {cart?.items.map((product, idx, arr) => (
                  <React.Fragment key={idx}>
                    <ProductCard data={product} />
                    {arr.length - 1 !== idx && (
                      <hr className="border-t-black/10" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="p-5 w-full lg:max-w-[505px] md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
                <h6 className="text-xl md:text-2xl font-bold text-black">
                  Order Summary
                </h6>
                <div className="flex  space-y-5 flex-col ">
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">Subtotal</span>
                    <span className="md:text-xl font-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">
                      Discount (-
                      {Math.round(
                        ((totalPrice - adjustedTotalPrice) / totalPrice) * 100
                      )}
                      %)
                    </span>
                    <span className="md:text-xl font-bold text-red-600">
                      -${Math.round(totalPrice - adjustedTotalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">
                      Delivery Fee
                    </span>
                    <span className="md:text-xl font-bold">Free</span>
                  </div>
                  <hr className="border-t-black/10" />
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black">Total</span>
                    <span className="text-xl md:text-2xl font-bold">
                      ${Math.round(adjustedTotalPrice)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <InputGroup className="bg-[#F0F0F0]">
                    <InputGroup.Text>
                      <MdOutlineLocalOffer className="text-black/40 text-2xl" />
                    </InputGroup.Text>
                    <InputGroup.Input
                      type="text"
                      name="code"
                      placeholder="Add promo code"
                      className="bg-transparent placeholder:text-black/40"
                    />
                  </InputGroup>
                  <Button
                    type="button"
                    className="bg-black rounded-full w-full max-w-[119px] h-[48px]"
                  >
                    Apply
                  </Button>
                </div>
                {/* <Button
                  type="button"
                  className="text-sm md:text-base font-medium bg-black rounded-full w-full py-4 h-[54px] md:h-[60px] group"
                >
                  Go to Checkout{" "}
                  <FaArrowRight className="text-xl ml-2 group-hover:translate-x-1 transition-all" />
                </Button> */}

<AlertDialog>
      <AlertDialogTrigger className="flex items-center justify-center text-sm md:text-base font-medium bg-black rounded-full w-full py-4 h-[54px] md:h-[60px] group text-white"> Go to Checkout{" "}<FaArrowRight className=" text-white text-xl ml-3 group-hover:translate-x-1 transition-all" /></AlertDialogTrigger>
      <AlertDialogContent className="max-w-md w-full p-6">
        <Card className="p-4 ">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
            <CardDescription>Fill in the details below.</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name" // name attribute matches the state key
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email" // name attribute matches the state key
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone" // name attribute matches the state key
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </form>
          </CardContent>
          
          <CardFooter>
            <div className="flex justify-between w-full">
              <AlertDialogCancel className="text-gray-500 hover:text-gray-700">Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleSubmit}>Submit</AlertDialogAction>
            </div>
          </CardFooter>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center flex-col text-gray-300 mt-32">
            <TbBasketExclamation strokeWidth={1} className="text-6xl" />
            <span className="block mb-4">Your shopping cart is empty.</span>
            <Button className="rounded-full w-24" asChild>
              <Link href="/shop">Shop</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
