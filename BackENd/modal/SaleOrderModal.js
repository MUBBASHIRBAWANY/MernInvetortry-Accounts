import mongoose from "mongoose";

const SaleOrderSchema = new mongoose.Schema({
    SaleOrderNumber: {
        type: String,
        required: true
    },
    Customer: {
        type: String,
        required: true
    },
    SaleOrderData: {
        type: Array,
        required: true
    },
    SaleOrderDate: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    Store: {
        type: String,
        required: true
    },
})

const SaleOrderModal = mongoose.model("SaleOrder", SaleOrderSchema)

export default SaleOrderModal