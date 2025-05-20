import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { Share2, Heart, MessageCircle, Send } from "lucide-react";

interface Post {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
}

export default function Social() {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      content: "Excited to announce our upcoming town planning conference! Join us for insightful discussions and networking opportunities.",
      author: {
        id: 1,
        name: "John Doe",
      },
      likes: 15,
      comments: 5,
      createdAt: "2024-03-20T10:00:00Z",
    },
    {
      id: 2,
      content: "Just completed a successful urban development project in Abuja. Proud of our team's dedication and hard work!",
      author: {
        id: 2,
        name: "Jane Smith",
      },
      likes: 23,
      comments: 8,
      createdAt: "2024-03-19T15:30:00Z",
    },
  ]);

  const handlePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: posts.length + 1,
      content: newPost,
      author: {
        id: user?.id || 0,
        name: `${user?.firstName} ${user?.lastName}`,
      },
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    };

    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Social Media</h1>

      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback>
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Input
              placeholder="Share your thoughts..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="mb-2"
            />
            <div className="flex justify-end">
              <Button onClick={handlePost}>
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>
                  {post.author.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{post.author.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mb-4">{post.content}</p>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 