import Header from "../LandingPage/Header";
import { useState } from "react";
import OrderPage from "../../pages/OrderPage";

function OrderSection() {
  const [view, setView] = useState(true);

  if (!view) {
    return <OrderPage />;
  }
  return (
    <>
      <Header />
      <button className={styles.backBtn} onClick={() => setView(false)}>
        Indietro
      </button>
      <div className={styles.orderForm}></div>
    </>
  );
}

export default OrderSection;
