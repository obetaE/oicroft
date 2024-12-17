import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";
import { Product } from "@/libs/models/Product";
import Location from "@/libs/models/Location";

// Utility function to calculate the delivery date
const calculateDeliveryDate = () => {
  const now = new Date();

  const currentThursday = new Date(now);
  currentThursday.setDate(now.getDate() + ((4 - now.getDay() + 7) % 7));
  currentThursday.setHours(0, 0, 0, 0);

  const nextWednesday = new Date(currentThursday);
  nextWednesday.setDate(currentThursday.getDate() + 6);
  nextWednesday.setHours(23, 59, 59, 999);

  const deliverySaturday = new Date(nextWednesday);
  deliverySaturday.setDate(nextWednesday.getDate() + 3);
  deliverySaturday.setHours(12, 0, 0, 0);

  if (now >= currentThursday && now <= nextWednesday) {
    return deliverySaturday;
  }

  const nextBatchThursday = new Date(currentThursday);
  nextBatchThursday.setDate(currentThursday.getDate() + 7);

  const nextBatchWednesday = new Date(nextBatchThursday);
  nextBatchWednesday.setDate(nextBatchThursday.getDate() + 6);

  const nextBatchSaturday = new Date(nextBatchWednesday);
  nextBatchSaturday.setDate(nextBatchWednesday.getDate() + 3);

  return nextBatchSaturday;
};

export async function POST(request) {
  console.log("API called: /api/trackorder [POST]");
  await ConnectDB();
  console.log("Database connected successfully");

  try {
    const { products, total, userId, reference, deliveryOption } =
      await request.json();
    console.log("Request body received:", {
      products,
      total,
      userId,
      reference,
      deliveryOption,
    });

    // Check required fields
    if (!products || !total || !userId || !reference || !deliveryOption) {
      console.error("Missing required fields in request:", {
        products,
        total,
        userId,
        reference,
        deliveryOption,
      });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const deliveryDate = calculateDeliveryDate();
    console.log("Calculated delivery date:", deliveryDate);

    const updatedProducts = [];

    for (const product of products) {
      console.log("Checking product:", product);

      // Validate product quantity input
      if (typeof product.quantity !== "number" || isNaN(product.quantity)) {
        console.error(`Invalid quantity for product: ${product.id}`);
        return NextResponse.json(
          { message: `Invalid quantity for product ${product.id}` },
          { status: 400 }
        );
      }

      // Find the product in the database
      const existingProduct = await Product.findOne({
        _id: product.productId,
      });


      if (!existingProduct) {
        console.error("Product not found:", product.id);
        return NextResponse.json(
          { message: `Product ${product.id} not found` },
          { status: 404 }
        );
      }

      console.log("Found product in DB:", existingProduct.title);

      const selectedUnit = existingProduct.prices.find(
        (item) => item.unit === product.unit || (!product.unit && !item.unit)
      );

      if (!selectedUnit) {
        console.error(`No matching unit found for ${existingProduct.title}`);
        return NextResponse.json(
          {
            message: `Unit type mismatch for product ${existingProduct.title}`,
          },
          { status: 400 }
        );
      }

      // Validate stock
      if (typeof selectedUnit.stock !== "number" || isNaN(selectedUnit.stock)) {
        console.error(
          `Invalid stock value for ${existingProduct.title}, unit: ${product.unit}`
        );
        return NextResponse.json(
          {
            message: `Invalid stock value for ${existingProduct.title} (${product.unit})`,
          },
          { status: 500 }
        );
      }

      // Check stock sufficiency
      if (selectedUnit.stock < product.quantity) {
        console.error("Insufficient stock for:", {
          productTitle: existingProduct.title,
          unit: product.unit,
          requested: product.quantity,
          available: selectedUnit.stock,
        });
        return NextResponse.json(
          {
            message: `Insufficient stock for ${existingProduct.title} (${product.unit}). Available: ${selectedUnit.stock}`,
          },
          { status: 400 }
        );
      }

      // Deduct stock
      selectedUnit.stock = (selectedUnit.stock || 0) - product.quantity;
      updatedProducts.push({ product: existingProduct, selectedUnit });
      console.log(
        `Stock updated for ${existingProduct.title}: Remaining stock: ${selectedUnit.stock}`
      );
    }

    // Fetch location details for pickup or delivery
    let pickup = null;
    let delivery = null;

    if (deliveryOption.type.toLowerCase() === "pickup") {
      const location = await Location.findById(deliveryOption.locationId);

      if (!location) {
        console.error("Invalid pickup location ID:", deliveryOption.locationId);
        return NextResponse.json(
          { message: "Invalid pickup location ID" },
          { status: 400 }
        );
      }

      pickup = {
        region: {
          state: location.pickup?.region?.state, // Add "state" field explicitly
          logistics: location.pickup?.region?.logistics || 0, // Ensure logistics is a number
        },
        location: location.pickup?.location,
      };

      console.log("Pickup option selected:", pickup);
    } else if (deliveryOption.type.toLowerCase() === "delivery") {
      delivery = {
        region: deliveryOption.region,
        area: deliveryOption.area,
        deliveryAddress: deliveryOption.deliveryAddress,
      };
      console.log("Delivery option selected:", delivery);
    } else {
      console.error("Invalid delivery option type:", deliveryOption.type);
      return NextResponse.json(
        { message: "Invalid delivery option type" },
        { status: 400 }
      );
    }

    try {
      console.log("Saving stock updates to database...");
      await Promise.all(updatedProducts.map(({ product }) => product.save()));
      console.log("Stock updates committed successfully");

      const otpToken = Math.floor(1000 + Math.random() * 900000);
      console.log("Generated OTP Token:", otpToken);

      console.log("Creating new order in database...");
      const newOrder = await Order.create({
        userId,
        reference,
        products: products.map((product) => ({
          ...product,
          totalPrice: product.quantity * product.price,
        })),
        total,
        deliveryDate,
        otpToken,
        status: "Paid",
        orderDate: new Date(),
        pickup,
        delivery,
      });

      console.log("Order created successfully:", newOrder);

      return NextResponse.json(
        { message: "Order created successfully", order: newOrder },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating order, rolling back stock:", error.message);
      // Rollback stock
      for (const { product, selectedUnit } of updatedProducts) {
        selectedUnit.stock += product.quantity;
        await product.save();
      }
      console.log("Stock rollback completed");
      throw error;
    }
  } catch (error) {
    console.error("Failed to create order:", error.message);
    return NextResponse.json(
      { message: "Failed to create order", error: error.message },
      { status: 500 }
    );
  }
}
