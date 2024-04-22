import Stripe from "stripe";

export const createPaymentIntent = async (req, res) => {
  const stripe = Stripe(process.env.SECRET_KEY);
  console.log(process.env.SECRET_KEY);
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });
    res
      .status(200)
      .json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: error.message, success: false, hello: "payment intent" });
  }
};
