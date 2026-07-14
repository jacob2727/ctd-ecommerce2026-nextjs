"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ShowAllDiscounts = ({ discounts }: { discounts: any }) => {
  console.log(discounts);
  return (
    <div className="grid grid-cols-3 p-5">
      {discounts.map((item: any) => (
        <div className="col-span-1 w-full" key={item.id}>
          <Card>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardAction>
                <Button>View this Discount</Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 border-t p-3">
                <div className="flex flex-col gap-2">
                  <p className="text-gray-400">Product ID: {item.product.id}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Product Name: {item.product.name}</p>
                  <p>Product Stock: {item.product.stock}</p>
                  <p>
                    Product Original Price: $
                    {(item.product.priceInCents / 100).toFixed(2)}
                  </p>
                  <p>
                    Product Discounted Price: $
                    {(
                      (item.product.priceInCents -
                        item.product.priceInCents * item.offer) /
                      100
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ShowAllDiscounts;
