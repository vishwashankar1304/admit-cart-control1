import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { productApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await productApi.getAllProducts();
        // Get first 4 products as featured
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load featured products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div>Loading featured products...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-brand-blue text-white py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Quality Electricals at{" "}
              <span className="text-brand-yellow">Affordable Prices</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Discover our wide range of electricals and home improvement products with same-day delivery.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button  
                size="lg" 
                asChild
                className="bg-brand-orange hover:bg-orange-600 text-white"
              >
                <Link to="/products">
                  Shop Now <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://mail.google.com/mail/u/0?ui=2&ik=76c6bf2739&attid=0.1&permmsgid=msg-f:1832885847383820666&th=196fb7f79727497a&view=fimg&fur=ip&permmsgid=msg-f:1832885847383820666&sz=s0-l75-ft&attbid=ANGjdJ_ZQO2ZGTwhlikYShKkqxpinuj-FtdwAK8zvQf0U4hLE2e4_lVoHteGyg3H98BkEQHZ9-beO3mkpN-OhWjiXouZINQgrUaC-LP2uvzhBxkDD0sj7lkiHMDupdc&disp=emb&realattid=ii_196fb7f25242009b95b1&zw"
              alt="Electronics Showcase"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="link" asChild>
              <Link to="/products" className="flex items-center">
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* USP Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4 text-brand-blue">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On all orders over $50</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4 text-brand-blue">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4 text-brand-blue">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
