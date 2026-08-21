const mongoose = require("mongoose");


const orderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1, max: 99 },
        lineTotal: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const addressSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true, maxlength: 120 },
        phone: { type: String, required: true, match: [/^[6-9]\d{9}$/, "Invalid mobile number"] },
        line1: { type: String, required: true, trim: true, maxlength: 200 },
        line2: { type: String, trim: true, maxlength: 200 },
        landmark: { type: String, trim: true, maxlength: 120 },
        city: { type: String, required: true, trim: true, maxlength: 80 },
        state: { type: String, required: true, trim: true, maxlength: 80 },
        pincode: { type: String, required: true, match: [/^[1-9][0-9]{5}$/, "Invalid pincode"] },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: { type: String, required: true, unique: true },

        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: [(v) => v.length > 0, "Order must have at least one item"],
        },

        shippingAddress: { type: addressSchema, required: true },

        subtotal: { type: Number, required: true, min: 0 },
        installationFee: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 },

        paymentMethod: { type: String, enum: ["cod", "razorpay"], default: "cod", required: true },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
            index: true,
        },

        orderStatus: {
            type: String,
            enum: ["placed", "confirmed", "installing", "completed", "cancelled"],
            default: "placed",
            index: true,
        },

        installation: {
            preferredDate: Date,
            slot: { type: String, enum: ["morning", "afternoon", "evening"] },
            completedAt: Date,
        },

        notes: { type: String, trim: true, maxlength: 500 },
        cancelledAt: Date,
        cancelReason: { type: String, trim: true, maxlength: 300 },
    },
    { timestamps: true }
);

// Do hi queries chalengi: customer ki order history, aur admin ka status filter.
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);