import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Contact {
  user_id: string;
  full_name: string;
  email: string;
  role?: string;
  unread: number;
  lastMessage?: string;
  lastTime?: string;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadContacts();

    // Realtime subscription
    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id === user.id || msg.receiver_id === user.id) {
          if (selectedContact && (msg.sender_id === selectedContact.user_id || msg.receiver_id === selectedContact.user_id)) {
            setMessages((prev) => [...prev, msg]);
          }
          loadContacts();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    if (selectedContact && user) loadMessages(selectedContact.user_id);
  }, [selectedContact]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadContacts = async () => {
    if (!user) return;
    setLoading(true);

    // Get all profiles + roles to show as contacts
    const { data: profilesData } = await supabase.from("profiles").select("user_id, full_name, email");
    const { data: rolesData } = await supabase.from("user_roles").select("user_id, role");
    const { data: messagesData } = await supabase.from("messages").select("*").order("created_at", { ascending: false });

    const roleMap: Record<string, string> = {};
    rolesData?.forEach((r) => { roleMap[r.user_id] = r.role; });

    const contactList: Contact[] = (profilesData || [])
      .filter((p) => p.user_id !== user.id)
      .map((p) => {
        const userMsgs = (messagesData || []).filter(
          (m) => (m.sender_id === p.user_id && m.receiver_id === user.id) || (m.sender_id === user.id && m.receiver_id === p.user_id)
        );
        const unread = userMsgs.filter((m) => m.receiver_id === user.id && !m.is_read).length;
        const last = userMsgs[0];
        return {
          user_id: p.user_id,
          full_name: p.full_name || p.email || "User",
          email: p.email || "",
          role: roleMap[p.user_id],
          unread,
          lastMessage: last?.content,
          lastTime: last?.created_at,
        };
      })
      .sort((a, b) => {
        if (a.unread !== b.unread) return b.unread - a.unread;
        if (a.lastTime && b.lastTime) return new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime();
        return 0;
      });

    setContacts(contactList);
    setLoading(false);
  };

  const loadMessages = async (otherUserId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    setMessages(data || []);

    // Mark received messages as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", otherUserId)
      .eq("receiver_id", user.id)
      .eq("is_read", false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || !user) return;
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedContact.user_id,
      content: newMessage.trim(),
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setNewMessage("");
  };

  const filteredContacts = contacts.filter((c) =>
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.role || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role?: string) => {
    const map: Record<string, string> = { admin: "destructive", startup: "default", investor: "secondary", mentor: "outline" };
    return (map[role || ""] || "secondary") as any;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access messages</h1>
          <Button asChild><a href="/login">Login</a></Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
          {/* Contacts List */}
          <Card className="md:col-span-1 flex flex-col">
            <CardHeader className="pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search contacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.user_id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full text-left p-4 border-b border-border hover:bg-muted/50 transition-colors ${selectedContact?.user_id === contact.user_id ? "bg-muted" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {contact.full_name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">{contact.full_name}</span>
                          {contact.unread > 0 && (
                            <Badge variant="destructive" className="text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">{contact.unread}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {contact.role && <Badge variant={getRoleColor(contact.role)} className="text-[10px] h-4">{contact.role}</Badge>}
                        </div>
                        {contact.lastMessage && (
                          <p className="text-xs text-muted-foreground truncate mt-1">{contact.lastMessage}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
                {filteredContacts.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground text-sm">No contacts found</div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 flex flex-col">
            {selectedContact ? (
              <>
                <CardHeader className="border-b border-border py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{selectedContact.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{selectedContact.full_name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{selectedContact.role || "user"}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 flex flex-col">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {messages.map((msg) => {
                        const isMine = msg.sender_id === user.id;
                        return (
                          <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t border-border">
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                      <Input placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1" />
                      <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a contact to start messaging</p>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
