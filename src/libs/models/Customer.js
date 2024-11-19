const CustomerSchema = new mongoose.Schema(
  {
    customerEmail: {
      type: String,
      required: true,
      maxlength: 60,
    },
    address: {
      type: String,
      required: true,
      maxlength: 200,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      default: 0, // 0: Pending, 1: Processing, 2: Delivered
    },
    number: {
      type: Number,
      required: true,
    },
    deliveryOption: {
      type: String,
      enum: ["Pickup", "Delivery"],
      required: true,
    },
    pickupBranch: {
      type: String,
      required: function () {
        return this.deliveryOption === "Pickup";
      },
    },
    deliveryAddress: {
      type: String,
      required: function () {
        return this.deliveryOption === "Delivery";
      },
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

const Customer =
  mongoose.models?.Customer || mongoose.model("Customer", CustomerSchema);

export default Customer;
