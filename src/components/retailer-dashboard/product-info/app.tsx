"use client";

import { useState } from "react";
import { Boxes, DollarSign, Eye, MapPin, Package, Pencil } from "lucide-react";
import axios from "axios";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  available: boolean;
  showing: boolean;
  priceInCents: number;
  stock: number;
  location?: {
    address?: string;
  };
}

type EditableField =
  | "name"
  | "description"
  | "priceInCents"
  | "stock"
  | "available"
  | "showing";

interface ProductProfileProps {
  product: Product;
}

export default function ProductProfile({
  product: initialProduct,
}: ProductProfileProps) {
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [activeField, setActiveField] = useState<EditableField | null>(null);
  const [editValue, setEditValue] = useState<string | boolean>("");
  const [editedFields, setEditedFields] = useState<EditableField[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.priceInCents / 100);

  const openEdit = (field: EditableField) => {
    setActiveField(field);
    setSaveError("");

    if (field === "priceInCents") {
      setEditValue((product.priceInCents / 100).toString());
    } else {
      setEditValue(product[field]);
    }
  };

  const saveEdit = async () => {
    if (!activeField) return;

    let updatedValue: string | boolean | number = editValue;

    if (activeField === "priceInCents") {
      const enteredPrice = Number(editValue);

      if (Number.isNaN(enteredPrice) || enteredPrice < 0) {
        setSaveError("Please enter a valid price.");
        return;
      }

      updatedValue = Math.round(enteredPrice * 100);
    }

    if (activeField === "stock") {
      const enteredStock = Number(editValue);

      if (
        Number.isNaN(enteredStock) ||
        enteredStock < 0 ||
        !Number.isInteger(enteredStock)
      ) {
        setSaveError("Stock must be a whole number of 0 or more.");
        return;
      }

      updatedValue = enteredStock;
    }

    if (
      (activeField === "name" || activeField === "description") &&
      !String(editValue).trim()
    ) {
      setSaveError(`${fieldTitle} cannot be empty.`);
      return;
    }

    const requests: Record<
      EditableField,
      {
        endpoint: string;
        body: Record<string, unknown>;
      }
    > = {
      name: {
        endpoint: "/product/change-name",
        body: {
          product_id: product.id,
          name: String(updatedValue).trim(),
        },
      },

      description: {
        endpoint: "/product/change-description",
        body: {
          product_id: product.id,
          description: String(updatedValue).trim(),
        },
      },

      priceInCents: {
        endpoint: "/product/change-price",
        body: {
          product_id: product.id,
          priceInCents: updatedValue,
        },
      },

      stock: {
        endpoint: "/product/change-stock",
        body: {
          product_id: product.id,
          stock: updatedValue,
        },
      },

      available: {
        endpoint: "/product/change-available",
        body: {
          product_id: product.id,
          isAvailable: updatedValue,
        },
      },

      showing: {
        endpoint: "/product/change-showing",
        body: {
          product_id: product.id,
          isShowing: updatedValue,
        },
      },
    };

    const request = requests[activeField];

    try {
      setIsSaving(true);
      setSaveError("");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${request.endpoint}`,
        request.body,
      );

      setProduct((current) => ({
        ...current,
        [activeField]: updatedValue,
      }));

      setEditedFields((current) =>
        current.includes(activeField) ? current : [...current, activeField],
      );

      setActiveField(null);
    } catch (error) {
      console.error(`Failed to update ${activeField}:`, error);

      if (axios.isAxiosError(error)) {
        setSaveError(
          error.response?.data?.message ||
            `Unable to update ${fieldTitle.toLowerCase()}.`,
        );
      } else {
        setSaveError(`Unable to update ${fieldTitle.toLowerCase()}.`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const EditButton = ({ field }: { field: EditableField }) => (
    <Button variant="outline" size="sm" onClick={() => openEdit(field)}>
      <Pencil className="mr-2 h-4 w-4" />
      Edit
    </Button>
  );

  const EditedBadge = ({ field }: { field: EditableField }) =>
    editedFields.includes(field) ? (
      <Badge variant="secondary">Edited</Badge>
    ) : null;

  const deleteProduct = async () => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/product/delete-product`,
      {
        productId: product.id,
      },
    );
    router.push("/retailer-dashboard/view-products");
  };

  const FieldCard = ({
    field,
    title,
    icon,
    children,
  }: {
    field: EditableField;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div
      className={`rounded-xl border p-5 ${
        editedFields.includes(field)
          ? "border-primary/40 bg-primary/5"
          : "bg-muted/30"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {icon}
            {title}
          </div>

          <div className="mt-2">
            <EditedBadge field={field} />
          </div>
        </div>

        <EditButton field={field} />
      </div>

      {children}
    </div>
  );

  const fieldTitle =
    activeField === "priceInCents"
      ? "Price"
      : activeField === "showing"
        ? "Visibility"
        : activeField === "available"
          ? "Availability"
          : activeField
            ? activeField.charAt(0).toUpperCase() + activeField.slice(1)
            : "";

  const isBoolean = activeField === "available" || activeField === "showing";

  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-3xl">{product.name}</CardTitle>

                      <EditedBadge field="name" />
                    </div>

                    <CardDescription className="mt-2 break-all">
                      Product ID: {product.id}
                    </CardDescription>
                  </div>

                  <EditButton field="name" />
                </div>
              </div>

              <Button onClick={() => deleteProduct()} variant="destructive">
                Delete
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-8">
            <FieldCard
              field="description"
              title="Description"
              icon={<Pencil className="h-4 w-4" />}
            >
              <p className="text-muted-foreground">
                {product.description || "No description provided."}
              </p>
            </FieldCard>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldCard
                field="priceInCents"
                title="Price"
                icon={<DollarSign className="h-4 w-4" />}
              >
                <p className="text-2xl font-bold">{price}</p>
              </FieldCard>

              <FieldCard
                field="stock"
                title="Stock"
                icon={<Boxes className="h-4 w-4" />}
              >
                <p className="text-2xl font-bold">{product.stock}</p>
              </FieldCard>

              <FieldCard
                field="available"
                title="Availability"
                icon={<Package className="h-4 w-4" />}
              >
                <Badge variant={product.available ? "default" : "secondary"}>
                  {product.available ? "Available" : "Unavailable"}
                </Badge>
              </FieldCard>

              <FieldCard
                field="showing"
                title="Visibility"
                icon={<Eye className="h-4 w-4" />}
              >
                <Badge variant={product.showing ? "outline" : "secondary"}>
                  {product.showing ? "Visible" : "Hidden"}
                </Badge>
              </FieldCard>
            </div>

            <div className="rounded-xl border bg-muted/20 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Production Location
              </div>

              <p className="font-medium">
                {product.location?.address || "No location assigned."}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                This location cannot be edited from the product page.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog
        open={activeField !== null}
        onOpenChange={(open) => {
          if (!open && !isSaving) {
            setActiveField(null);
            setSaveError("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {fieldTitle}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <Label>{fieldTitle}</Label>

            {isBoolean ? (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <span>{Boolean(editValue) ? "Enabled" : "Disabled"}</span>

                <Switch
                  checked={Boolean(editValue)}
                  onCheckedChange={setEditValue}
                  disabled={isSaving}
                />
              </div>
            ) : activeField === "description" ? (
              <Textarea
                value={String(editValue)}
                onChange={(event) => setEditValue(event.target.value)}
                disabled={isSaving}
              />
            ) : (
              <Input
                type={
                  activeField === "priceInCents" || activeField === "stock"
                    ? "number"
                    : "text"
                }
                min={
                  activeField === "priceInCents" || activeField === "stock"
                    ? 0
                    : undefined
                }
                step={
                  activeField === "priceInCents"
                    ? "0.01"
                    : activeField === "stock"
                      ? "1"
                      : undefined
                }
                value={String(editValue)}
                onChange={(event) => setEditValue(event.target.value)}
                disabled={isSaving}
              />
            )}

            {saveError && (
              <p className="text-sm text-destructive">{saveError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isSaving}
              onClick={() => {
                setActiveField(null);
                setSaveError("");
              }}
            >
              Cancel
            </Button>

            <Button onClick={saveEdit} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
