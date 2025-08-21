
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BlogManagement = () => {
  const { toast } = useToast();

  const blogs = [
    {
      id: 1,
      title: "Market Trends in FinTech 2024",
      author: "Sarah Johnson",
      date: "Dec 20, 2024",
      status: "Published",
      views: 1250,
      category: "Market Analysis"
    },
    {
      id: 2,
      title: "Investment Strategies for Early Stage Startups",
      author: "Sarah Johnson",
      date: "Dec 18, 2024",
      status: "Draft",
      views: 0,
      category: "Investment Tips"
    },
    {
      id: 3,
      title: "Building a Diversified Portfolio",
      author: "Sarah Johnson",
      date: "Dec 15, 2024",
      status: "Published",
      views: 890,
      category: "Portfolio Management"
    }
  ];

  const handleCreateBlog = () => {
    toast({
      title: "Blog Created",
      description: "New blog post has been created successfully.",
    });
  };

  const handleEditBlog = (id: number) => {
    toast({
      title: "Blog Updated",
      description: `Blog post #${id} has been updated.`,
    });
  };

  const handleDeleteBlog = (id: number) => {
    toast({
      title: "Blog Deleted",
      description: `Blog post #${id} has been deleted.`,
    });
  };

  const handlePublishBlog = (id: number) => {
    toast({
      title: "Blog Published",
      description: `Blog post #${id} is now live.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blog-title">Title</Label>
                <Input id="blog-title" placeholder="Enter blog title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="e.g., Market Analysis" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="fintech, investment, startup" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" placeholder="Brief description of the blog post..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" className="min-h-[200px]" placeholder="Write your blog content here..." />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreateBlog} className="flex-1">
                  Publish Now
                </Button>
                <Button variant="outline" onClick={handleCreateBlog} className="flex-1">
                  Save as Draft
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blog Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Edit className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Total Blogs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">15.2K</p>
                <p className="text-xs text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">456</p>
                <p className="text-xs text-muted-foreground">Avg. Reads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{blog.category}</Badge>
                  </TableCell>
                  <TableCell>{blog.date}</TableCell>
                  <TableCell>
                    <Badge variant={blog.status === "Published" ? "default" : "secondary"}>
                      {blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{blog.views.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditBlog(blog.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {blog.status === "Draft" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePublishBlog(blog.id)}
                        >
                          Publish
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteBlog(blog.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement;
