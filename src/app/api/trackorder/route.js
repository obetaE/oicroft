import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";
import { Product } from "@/libs/models/Product";
import { Animal } from "@/libs/models/Animal";
import { Combo } from "@/libs/models/Combo";
import Location from "@/libs/models/Location";

// Utility function to calculate the delivery date
const calculateDeliveryDate = () => {
  const now = new Date();
  const currentThursday = new Date(now);
  currentThursday.setDate(now.getDate() + ((4 - now.getDay() + 7) % 7));
  currentThursday.setHours(0, 0, 0, 0);
  const currentWednesday = new Date(currentThursday);
  currentWednesday.setDate(currentThursday.getDate() + 6);
  currentWednesday.setHours(23, 59, 59, 999);
  const deliverySaturday = new Date(currentWednesday);
  deliverySaturday.setDate(currentWednesday.getDate() + 3);
  deliverySaturday.setHours(12, 0, 0, 0);
  if (now < currentThursday) {
    currentThursday.setDate(currentThursday.getDate() - 7);
    currentWednesday.setDate(currentWednesday.getDate() - 7);
  }
  if (now >= currentThursday && now <= currentWednesday) {
    return deliverySaturday;
  }
  const nextThursday = new Date(currentThursday);
  nextThursday.setDate(currentThursday.getDate() + 7);
  const nextWednesday = new Date(nextThursday);
  nextWednesday.setDate(nextThursday.getDate() + 6);
  const nextDeliverySaturday = new Date(nextWednesday);
  nextDeliverySaturday.setDate(nextWednesday.getDate() + 3);
  nextDeliverySaturday.setHours(12, 0, 0, 0);
  return nextDeliverySaturday;
};

// Utility function to find a product in all schemas
const findProductInSchemas = async (productId) => {
  console.log(`Looking for product with ID: ${productId}`);
  const schemas = [
    { schema: Product, type: "Product" },
    { schema: Animal, type: "Animal" },
    { schema: Combo, type: "Combo" },
  ];

  for (const { schema, type } of schemas) {
    const product = await schema.findOne({ _id: productId });
    if (product) {
      console.log(`Product found in ${type} schema:`, product.title);
      return { product, type };
    }
  }

  console.log(`Product with ID: ${productId} not found in any schema`);
  return null;
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
      console.log("Processing product:", product);

      if (typeof product.quantity !== "number" || isNaN(product.quantity)) {
        console.error(`Invalid quantity for product: ${product.productId}`);
        return NextResponse.json(
          { message: `Invalid quantity for product ${product.productId}` },
          { status: 400 }
        );
      }

      const productData = await findProductInSchemas(product.productId);

      if (!productData) {
        console.error("Product not found:", product.productId);
        return NextResponse.json(
          { message: `Product ${product.productId} not found` },
          { status: 404 }
        );
      }

      const { product: existingProduct, type: productType } = productData;

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

      selectedUnit.stock -= product.quantity;
      updatedProducts.push({ product: existingProduct, selectedUnit });
      console.log(
        `Stock updated for ${existingProduct.title}: Remaining stock: ${selectedUnit.stock}`
      );

      product.productType = productType; // Add product type to the order
    }

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
          state: location.pickup?.region?.state,
          logistics: location.pickup?.region?.logistics || 0,
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
