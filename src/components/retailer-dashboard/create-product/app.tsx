"use client";

import { FormEvent, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";

import useUserData from "@/app/hooks/useUserData";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const ProductCreate = () => {
  const { user, isLoading: isUserLoading } = useUser();

  const userId = user?.sub;

  const retailerId = useUserData(userId);
  console.log(retailerId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [isAvailable, setIsAvailable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setIsAvailable(false);
    setIsVisible(false);
  };

  const submitNewProduct = async (event: any) => {
    event.preventDefault();

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!name.trim()) {
      console.error("A product name is required.");
      return;
    }

    if (price === "" || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      console.error("Enter a valid product price.");
      return;
    }

    if (stock === "" || !Number.isInteger(parsedStock) || parsedStock < 0) {
      console.error("Enter a valid whole-number stock amount.");
      return;
    }

    if (!userId || !retailerId) {
      console.error("The retailer account is not ready.");
      return;
    }

    const product = {
      name: name.trim(),
      description: description.trim(),
      priceInCents: parsedPrice * 100,
      stock: parsedStock,
      isAvailable,
      isVisible,
      ownerId: retailerId,
    };

    try {
      setIsSubmitting(true);

      console.log("Creating product:", product);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product/create-product`,
        {
          name: name.trim(),
          description: description.trim(),
          priceInCents: parsedPrice * 100,
          stock: parsedStock,
          isAvailable,
          isVisible,
          ownerId: retailerId,
        },
      );
      console.log("new prod: ", response.data);
      resetForm();
    } catch (error) {
      console.error("Could not create the product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-5 px-4 py-24">
      <h1 className="text-3xl font-semibold">Create a New Product</h1>

      <form
        className="w-full max-w-xl rounded-lg border p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 sm:p-10"
        onSubmit={submitNewProduct}
      >
        <div className="flex flex-col gap-6">
          <Field>
            <FieldLabel htmlFor="product-name">Product Name</FieldLabel>

            <Input
              id="product-name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex. Wireless Headphones"
              autoComplete="off"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="product-description">
              Product Description
            </FieldLabel>

            <Textarea
              id="product-description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-28 w-full resize-y"
              placeholder="Describe the product..."
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="product-price">Product Price</FieldLabel>

            <Input
              id="product-price"
              name="price"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="50.00"
              required
            />

            <FieldDescription>
              Enter the price using up to two decimal places.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="product-stock">Product Stock</FieldLabel>

            <Input
              id="product-stock"
              name="stock"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              placeholder="0"
              required
            />
          </Field>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="is-available">Product Available</Label>

            <Switch
              id="is-available"
              type="button"
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
              aria-label="Set product availability"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="is-visible">Product Visible</Label>

            <Switch
              id="is-visible"
              type="button"
              checked={isVisible}
              onCheckedChange={setIsVisible}
              aria-label="Set product visibility"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isUserLoading || !userId || !retailerId}
          >
            {isSubmitting ? "Creating Product..." : "Create Product"}
          </Button>
        </div>
      </form>
    </main>
  );
};

export default ProductCreate;
