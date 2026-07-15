"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";

const EditDiscount = ({
  data,
  onEdit,
}: {
  data: any;
  onEdit?: (field: string, value: any) => void;
}) => {
  if (!data || !data.product) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">Loading discount…</div>
      </div>
    );
  }

  const rawOffer = Number(data.offer) || 0;
  const offerFraction = rawOffer > 1 ? rawOffer / 100 : rawOffer;
  const offerPercent = Math.round(offerFraction * 100);

  const originalCents = Number(data.product.priceInCents) || 0;
  const discountedCents = Math.max(
    0,
    Math.round(originalCents * (1 - offerFraction)),
  );
  const savingsCents = Math.max(0, originalCents - discountedCents);

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 w-full">
              <div>
                <CardTitle className="text-lg">{data.name}</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  {data.product.name}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary">{offerPercent}% off</Badge>

                <Dialog>
                  <DialogTrigger asChild>
                    <CardAction>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </CardAction>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogTitle>Select field to edit</DialogTitle>
                    <EditChooser
                      data={data}
                      onSubmit={(field, value) => {
                        if (onEdit) onEdit(field, value);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="col-span-1 flex items-center justify-center">
                <div className="w-36 h-36 bg-gray-100 rounded-md flex items-center justify-center text-sm text-muted-foreground">
                  Image
                </div>
              </div>

              <div className="col-span-2">
                <p className="mb-3 text-sm text-gray-700">
                  {data.product.description}
                </p>

                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Original Price
                    </span>
                    <strong>{formatCurrency(originalCents)}</strong>
                  </li>

                  <li className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Discounted Price
                    </span>
                    <strong className="text-green-700">
                      {formatCurrency(discountedCents)}
                    </strong>
                  </li>

                  <li className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      You Save
                    </span>
                    <strong className="text-destructive">
                      {formatCurrency(savingsCents)}
                    </strong>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <CardAction>
              <Button
                variant={"destructive"}
                onClick={async () =>
                  await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/discounts/delete`,
                  )
                }
              >
                Delete this Discount
              </Button>
            </CardAction>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EditDiscount;

function EditChooser({
  data,
  onSubmit,
}: {
  data: any;
  onSubmit?: (field: string, value: any) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [value, setValue] = useState<string>("");

  const startEdit = (field: string) => {
    setSelected(field);
    if (field === "name") setValue(data.name || "");
    else if (field === "offer") {
      const rawOffer = Number(data.offer) || 0;
      const offerFraction = rawOffer > 1 ? rawOffer / 100 : rawOffer;
      const offerPercent = Math.round(offerFraction * 100);
      setValue(String(offerPercent));
    } else setValue("");
  };

  const router = useRouter();

  if (!selected) {
    return (
      <div className="mt-4 flex flex-col gap-2">
        <Button variant="ghost" onClick={() => startEdit("name")}>
          Edit Name
        </Button>
        <Button variant="ghost" onClick={() => startEdit("offer")}>
          Edit Offer
        </Button>
      </div>
    );
  }

  const label =
    selected === "name"
      ? "Name"
      : selected === "offer"
        ? "Offer (%)"
        : selected === "price"
          ? "Price (in cents)"
          : "Value";

  const handleSubmit = async () => {
    if (value !== "") {
      if (selected === "name") {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/discounts/change/name`,
          {
            id: data.id,
            name: value,
          },
        );
      } else if (selected === "offer") {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/discounts/change/offer`,
          {
            id: data.id,
            offer: parseFloat(value) / 100,
          },
        );
      }
      setValue("");
      router.refresh();
    }
  };

  return (
    <div className="mt-4">
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldContent>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </FieldContent>
      </Field>

      <div className="mt-4 flex justify-end gap-2">
        <DialogClose asChild>
          <Button variant="ghost" onClick={() => setSelected(null)}>
            Cancel
          </Button>
        </DialogClose>

        <DialogClose asChild>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogClose>
      </div>
    </div>
  );
}
