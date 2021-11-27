import React, { useState, useEffect } from "react";
import "./PlansScreen.css";
import db from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    db.collection("customers")
      .doc(user.uid)
      .collection("subscriptions")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (subscription) => {
          setSubscription({
            role: subscription.data().role,
            currentPeriodStart: subscription.data().current_period_start,
            currentPeriodEnd: subscription.data().current_period_end,
          });
        });
      });
  }, );


  useEffect(() => {
    db.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          const priceSnap = await productDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((doc) => {
            products[productDoc.id].prices = {
              priceId: doc.id,
              priceData: doc.data(),
            };
          });
        });
        setProducts(products);
      });
  }, []);

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });
    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        //show an error to your customer
        //inspect your cloud funtion logs in the firebase console
        alert(`An error occuredL: ${error.message}`);
      }
      if (sessionId) {
        //we ahve a session, lets redierct to checkout
        //initialise stripe
        const stripe = await loadStripe(
          "pk_test_51K0NYUSGFT0cDKelgtnP4VJKs8WDFG1GkDuiw6IUQF9z6I59ltg2p85RUmy0qXXJBbQ4swZBX7kqZPbQbRVHS23600qO8qu5fA"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className="planScreen">
      {subscription && (
        <p className="planScreen_Date">
          Renewal Date:{" "}
          {new Date(subscription?.currentPeriodEnd * 1000).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription.role);
        return (
          <div
            className={` ${
              isCurrentPackage && "plansScreen__plan--disabled"
            } plansScreen__plan`}
          >
            <div className="planScreen__info">
              <h4>{productData.name}</h4>
              <h6>{productData.description}</h6>
            </div>
            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
