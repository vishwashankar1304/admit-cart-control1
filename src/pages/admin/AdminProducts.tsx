
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from "@/utils/dataUtils";
import { Product } from "@/types";
import { formatPrice } from "@/utils/formatters";
import { Plus, Edit, Trash, Search } from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  // Form state
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [productInStock, setProductInStock] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const fetchedProducts = getProducts();
    setProducts(fetchedProducts);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductCategory("");
    setProductImageUrl("");
    setProductInStock(true);
    setCurrentProduct(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price.toString());
    setProductCategory(product.category);
    setProductImageUrl(product.imageUrl);
    setProductInStock(product.inStock);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleAddProduct = () => {
    try {
      // Validate inputs
      if (!productName || !productDescription || !productPrice || !productCategory || !productImageUrl) {
        toast({
          variant: "destructive",
          title: "Missing fields",
          description: "Please fill all required fields",
        });
        return;
      }
      
      const price = parseFloat(productPrice);
      if (isNaN(price) || price <= 0) {
        toast({
          variant: "destructive",
          title: "Invalid price",
          description: "Please enter a valid price",
        });
        return;
      }
      
      // Add product
      const newProduct = addProduct({
        name: productName,
        description: productDescription,
        price,
        category: productCategory,
        imageUrl: productImageUrl,
        inStock: productInStock,
      });
      
      // Close dialog and refresh
      setIsAddDialogOpen(false);
      resetForm();
      loadProducts();
      
      toast({
        title: "Product added",
        description: `${newProduct.name} has been added successfully`,
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product",
      });
    }
  };

  const handleEditProduct = () => {
    try {
      if (!currentProduct) return;
      
      // Validate inputs
      if (!productName || !productDescription || !productPrice || !productCategory || !productImageUrl) {
        toast({
          variant: "destructive",
          title: "Missing fields",
          description: "Please fill all required fields",
        });
        return;
      }
      
      const price = parseFloat(productPrice);
      if (isNaN(price) || price <= 0) {
        toast({
          variant: "destructive",
          title: "Invalid price",
          description: "Please enter a valid price",
        });
        return;
      }
      
      // Update product
      const updatedProduct = updateProduct({
        ...currentProduct,
        name: productName,
        description: productDescription,
        price,
        category: productCategory,
        imageUrl: productImageUrl,
        inStock: productInStock,
      });
      
      // Close dialog and refresh
      setIsEditDialogOpen(false);
      resetForm();
      loadProducts();
      
      toast({
        title: "Product updated",
        description: `${updatedProduct.name} has been updated successfully`,
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product",
      });
    }
  };

  const handleDeleteProduct = () => {
    try {
      if (!currentProduct) return;
      
      // Delete product
      const success = deleteProduct(currentProduct.id);
      
      if (success) {
        // Close dialog and refresh
        setIsDeleteDialogOpen(false);
        loadProducts();
        
        toast({
          title: "Product deleted",
          description: `${currentProduct.name} has been deleted successfully`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete product",
        });
      }
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={openAddDialog}>
          <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center max-w-sm border rounded-md overflow-hidden">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0"
          />
          <div className="px-3 text-gray-400">
            <Search size={18} />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <Badge variant={product.inStock ? "outline" : "secondary"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit size={16} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(product)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash size={16} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product to add to your store.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                value={productImageUrl}
                onChange={(e) => setProductImageUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="inStock" className="text-right">
                In Stock
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={productInStock}
                  onCheckedChange={setProductInStock}
                />
                <Label htmlFor="inStock">
                  {productInStock ? "Yes" : "No"}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Save Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details of this product.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Price
              </Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <Input
                id="edit-category"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                id="edit-imageUrl"
                value={productImageUrl}
                onChange={(e) => setProductImageUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-inStock" className="text-right">
                In Stock
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-inStock"
                  checked={productInStock}
                  onCheckedChange={setProductInStock}
                />
                <Label htmlFor="edit-inStock">
                  {productInStock ? "Yes" : "No"}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Product Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{currentProduct?.name}</span>
              {" "}from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
