
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Address } from "@/types";

const formSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Valid pincode required").max(6),
  paymentMethod: z.enum(["cod", "razorpay"]),
});

type FormData = z.infer<typeof formSchema>;

export const CheckoutForm = () => {
  const { user } = useAuth();
  const { cart, checkout } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "cod",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "Please login to complete checkout",
      });
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    // Create address object
    const address: Address = {
      street: data.street,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    };

    // Simulate processing delay
    setTimeout(() => {
      try {
        // Pass payment method and address to checkout
        const orderId = checkout(address, data.paymentMethod);
        
        if (orderId) {
          // For Razorpay, in a real implementation, you would 
          // initialize Razorpay here and handle the payment flow
          if (data.paymentMethod === "razorpay") {
            // Simulate successful Razorpay payment
            toast({
              title: "Razorpay payment successful",
              description: "Your payment was processed successfully",
            });
          }
          
          navigate(`/orders/${orderId}`);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Checkout failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Shipping Address</h3>
          
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter your full address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIN Code</FormLabel>
                <FormControl>
                  <Input placeholder="6-digit PIN code" maxLength={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Payment Method</h3>
          
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="cod" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Cash on Delivery (COD)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="razorpay" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Pay Online (Razorpay)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isProcessing || cart.items.length === 0}
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </form>
    </Form>
  );
};
