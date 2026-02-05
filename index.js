import express from "express";
import Stripe from "stripe";

const app = express();
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.get('/', (req, res) => {
  res.send('Stripe server running');
});
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "ideal", "bancontact"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Order" },
            unit_amount: 100, // €1 test
          },
          quantity: 1,
        },
      ],
      success_url: "https://sevenicons.nl/pages/success",
      cancel_url: "https://sevenicons.nl/cart",
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(4242, () => console.log("Stripe server running"));
