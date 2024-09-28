import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_STRIPE } from "../utils/mutations";
import { QUERY_SEED_PACKAGES } from "../utils/queries";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PhknBRqQwYsxb6oCvDxnFuYzm9EAWdv9r4Yogd3zNL2rSIvdj7ivGd8sltNF1arQpJEcAjPL4nuxcTtr4l768Vc000x6zn0d0"
);

const CheckoutButton = ({ seedPackageId }) => {
  const [checkout] = useMutation(LOAD_STRIPE);

  const handleCheckout = async () => {
    console.log("clicked");
    const { data } = await checkout({ variables: { seedPackageId } });
    console.log("hello hello", data);
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.checkout.session,
    });

    if (error) {
      console.error("Error redirecting to checkout:", error);
    }
  };

  return (
    <button className="hover:bg-green-200 md:text-2xl" onClick={handleCheckout}>
      Buy Seeds
    </button>
  );
};

export default function BuyGoldenSeeds() {
  const { data } = useQuery(QUERY_SEED_PACKAGES);
  const [seedPackages, setSeedPackages] = useState([]);
  useEffect(() => {
    if (data && data.seedPackages) {
      setSeedPackages(data.seedPackages);
    }
  }, [data]);
  return (
    <div className="dark:text-white flex md:flex-row flex-col justify-center items-center h-screen">
      {seedPackages.map((seedPackage) => (
        <div
          key={seedPackage._id}
          className="p-4 border-2 dark:border-white m-2 md:text-4xl text-2xl hover:cursor-pointer border-green-700  text-center"
        >
          <p className="border-b-2 border-green-950 mb-2">
            {seedPackage.quantity.toLocaleString()} Seeds
          </p>
          <p className="">${seedPackage.price.toFixed(2)}</p>
          <CheckoutButton seedPackageId={seedPackage._id} />
        </div>
      ))}
    </div>
  );
}
