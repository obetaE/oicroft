import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";
import { Product } from "@/libs/models/Product";

const calculateDeliveryDate = () => {
  const now = new Date();
  const currentDay = now.getDay();

  const daysToThursday =
    currentDay <= 4 ? 4 - currentDay : 4 + (7 - currentDay);
  const thursday = new Date(now);
  thursday.setDate(now.getDate() + daysToThursday);
  thursday.setHours(0, 0, 0, 0);

  const wednesday = new Date(thursday);
  wednesday.setDate(thursday.getDate() + 6);
  wednesday.setHours(23, 59, 59, 999);

  const saturday = new Date(wednesday);
  saturday.setDate(wednesday.getDate() + 3);
  saturday.setHours(12, 0, 0, 0);

  if (now < thursday) {
    saturday.setDate(saturday.getDate() - 7);
  } else if (now > wednesday) {
    saturday.setDate(saturday.getDate() + 7);
  }

  return saturday;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await ConnectDB();

      const { products, total } = req.body;
      const deliveryDate = calculateDeliveryDate();

      // Loop through products to validate and update stock
      for (const product of products) {
        const existingProduct = await Product.findById(product.productId);
        if (!existingProduct) {
          return res
            .status(404)
            .json({ message: `Product ${product.productId} not found` });
        }

        const selectedUnit = existingProduct.prices.find(
          (item) => item.unit === product.unit
        );

        if (!selectedUnit) {
          return res.status(400).json({
            message: `Unit '${product.unit}' does not exist for ${existingProduct.title}`,
          });
        }

        if (selectedUnit.stock < product.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${existingProduct.title} (${product.unit}). Available: ${selectedUnit.stock}`,
          });
        }

        // Deduct stock for the specific unit
        selectedUnit.stock -= product.quantity;
        await existingProduct.save();
      }

      // Create the order
      const newOrder = await Order.create({
        products: products.map((product) => ({
          ...product,
          totalPrice: product.quantity * product.price,
        })),
        total,
        deliveryDate,
        status: "Pending",
        date: new Date(),
      });

      res
        .status(201)
        .json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
