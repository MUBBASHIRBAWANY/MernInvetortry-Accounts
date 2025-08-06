import SaleOrderDcModal from "../modal/SaleOrderDcModal"


export const CreateSaleOrderDC = async (req, res) => {
    try {

        const data = await SaleOrderDcModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong", err)
    }
}

export const UpdateSaleOrderDC = async (req, res) => {
    const { id } = req.params
    try {
        const data = await SaleOrderDcModal.findByIdAndUpdate(id, req.body)
        res.send({ status: true, data: data });

    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong", err)
    }
}

export const GetAllSaleOrderDC = async (req, res) => {
    try {
        const data = await SaleOrderDcModal.find()
        res.send({ status: true, data: data });

    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong", err)
    }
}


export const LastSaleOrderDC = async (req, res) => {
    try {
        const data = await SaleOrderDcModal.find().sort({ _id: -1 }).limit(1)
        res.send({ status: true, data: data });
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong", err)
    }
}

export const DeleteSaleOrderDC = async (req, res) => {
    const { id } = req.params
    try {
        const data = await SaleOrderDcModal.findByIdAndDelete(id)
        res.status(200).send("data Delete")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong", err)
    }
}


export const PostSaleOrderDC = async (req, res) => {
        console.log(req.body)
}
