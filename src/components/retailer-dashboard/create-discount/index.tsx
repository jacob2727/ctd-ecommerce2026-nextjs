"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RetailerDashboardForm = () => {
  const session = useUser();
  const [name, setName] = useState("");
  const [offer, setOffer] = useState<number | string>("");
  const [id, setId] = useState("");
  const router = useRouter();

  const formHandler = async () => {
    if (name == "" || offer == 0 || id == "") {
      return;
    } else {
      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/discounts/create`,
        { name, offer, productId: id, userId: session.user?.sub },
      );

      setName("");
      setOffer("");
      setId("");
      router.push("/retailer-dashboard");
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <Card className="p-5 lg:w-[30vw] md:w-[30vw]">
        <FieldSet>
          <FieldLegend>Create a Discount</FieldLegend>
          <FieldDescription>
            This is the page where you create a discount
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel>Product ID</FieldLabel>
              <Input
                onChange={(e: any) => setId(e.target.value)}
                value={id}
                placeholder="Ex. 29342-4234-421424-4322"
                autoComplete="off"
              />
              <FieldDescription>
                This is the main identifier for a product
              </FieldDescription>
            </Field>
            <Field>
              <Field>
                <FieldLabel>Name of Discount</FieldLabel>
                <Input
                  onChange={(e: any) => setName(e.target.value)}
                  value={name}
                  placeholder="Ex. Our Special Safe"
                  autoComplete="off"
                />
                <FieldDescription>
                  This is the name that your customers will see when purchasing
                  your product
                </FieldDescription>
              </Field>
            </Field>
            <Field>
              <FieldLabel>Offer</FieldLabel>
              <Input
                onChange={(e: any) => setOffer(e.target.value)}
                value={offer}
                placeholder="Ex. 0.25"
                autoComplete="off"
              />
              <FieldDescription>
                Put in how much you will take off the price in DECIMAL
              </FieldDescription>
            </Field>
            <Field>
              <Button onClick={formHandler}>Create Discount</Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </Card>
    </div>
  );
};

export default RetailerDashboardForm;
