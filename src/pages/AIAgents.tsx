import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Scale, Target, Users, Send, Loader2, Sparkles, BrainCircuit, Briefcase, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const agents = [
  {
    id: "mock-vc",
    name: "Mock VC / Angel",
    icon: Briefcase,
    color: "from-primary to-orange-500",
    description: "Simulate a pitch session with a venture capitalist. Get tough questions, valuation feedback, and deal-readiness assessment.",
    systemPrompt: "You are a seasoned Silicon Valley venture capitalist with 20 years of experience investing in startups across Series A to C. You've evaluated 10,000+ pitches. When a founder pitches to you, ask probing questions about their market size, unit economics, competitive moat, team, traction, and go-to-market strategy. Be direct, constructive, and realistic. Give a preliminary assessment on investability (1-10 scale) and suggest improvements. Push back on weak assumptions. End with actionable advice.",
    placeholder: "Pitch your startup idea... e.g. 'We're building an AI-powered platform that helps SMBs automate their accounting. We have 500 users and $10K MRR.'",
    tags: ["Pitch Practice", "Valuation", "Due Diligence"],
  },
  {
    id: "startup-lawyer",
    name: "AI Startup Lawyer",
    icon: Scale,
    color: "from-blue-600 to-cyan-500",
    description: "Get guidance on incorporation, equity splits, term sheets, IP protection, compliance, and founder agreements.",
    systemPrompt: "You are an experienced startup lawyer specializing in Indian startup law, corporate governance, and venture financing. You've helped 500+ startups with incorporation, DPIIT registration, ESOP structures, SHA/SSA agreements, IP protection, and regulatory compliance. Provide clear, actionable legal guidance. Always clarify you're an AI providing general guidance and not formal legal advice. Reference relevant Indian laws (Companies Act, FEMA, etc.) when applicable. Be thorough but accessible.",
    placeholder: "Ask a legal question... e.g. 'How should we split equity between 3 co-founders when one is contributing capital and the others are contributing time?'",
    tags: ["Legal", "Compliance", "Agreements"],
  },
  {
    id: "gtm-adviser",
    name: "GTM Adviser",
    icon: Target,
    color: "from-emerald-600 to-teal-500",
    description: "Get expert go-to-market strategy advice covering pricing, distribution channels, customer acquisition, and market positioning.",
    systemPrompt: "You are a go-to-market strategy expert who has helped 200+ startups launch and scale in India and globally. You specialize in B2B SaaS, D2C, and marketplace models. When founders ask about GTM, provide structured advice on: ideal customer profile, pricing strategy, distribution channels, sales motions, content strategy, partnership plays, and key metrics to track. Give India-specific insights when relevant (e.g., WhatsApp commerce, regional distribution). Always be data-driven and practical.",
    placeholder: "Describe your product and market... e.g. 'We have a B2B SaaS tool for HR teams. How should we price and acquire our first 100 customers in India?'",
    tags: ["Strategy", "Growth", "Marketing"],
  },
  {
    id: "startup-buddy",
    name: "Startup Buddy",
    icon: Users,
    color: "from-purple-600 to-pink-500",
    description: "Your friendly AI co-pilot for all things startup — brainstorming, problem-solving, emotional support, and general entrepreneurship guidance.",
    systemPrompt: "You are a supportive, experienced startup mentor and buddy. You've been through the startup journey yourself — the highs, the lows, the pivots, and the breakthroughs. Be warm, encouraging, and practical. Help founders brainstorm ideas, work through challenges, validate assumptions, and stay motivated. Share relevant frameworks (Lean Startup, Jobs-to-be-Done, etc.) when helpful. Be honest but kind. Sometimes founders just need someone to talk to — be that person.",
    placeholder: "What's on your mind? e.g. 'I'm struggling to decide whether to pivot or persevere with my current idea. We've been at it for 6 months with slow traction.'",
    tags: ["Mentorship", "Brainstorm", "Support"],
  },
];

const AIAgents = () => {
  const [activeAgent, setActiveAgent] = useState(agents[0].id);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currentAgent = agents.find(a => a.id === activeAgent)!;
  const messages = conversations[activeAgent] || [];

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setConversations(prev => ({ ...prev, [activeAgent]: updatedMessages }));
    setInput("");
    setLoading(true);

    try {
      const resp = await supabase.functions.invoke("ai-agent-chat", {
        body: {
          messages: updatedMessages,
          agentId: activeAgent,
          systemPrompt: currentAgent.systemPrompt,
        },
      });

      if (resp.error) throw resp.error;

      const assistantMsg: Message = {
        role: "assistant",
        content: resp.data?.content || "I'm sorry, I couldn't generate a response. Please try again.",
      };

      setConversations(prev => ({
        ...prev,
        [activeAgent]: [...updatedMessages, assistantMsg],
      }));
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Startup Advisor</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get instant expert advice from our AI-powered startup advisors. Practice pitches, get legal guidance, plan your GTM strategy, or just talk through your challenges.
          </p>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isActive = activeAgent === agent.id;
            return (
              <Card
                key={agent.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${isActive ? "ring-2 ring-primary shadow-lg" : "hover:border-primary/50"}`}
                onClick={() => setActiveAgent(agent.id)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center mb-2`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{agent.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1">
                    {agent.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Chat Area */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentAgent.color} flex items-center justify-center`}>
                <currentAgent.icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{currentAgent.name}</CardTitle>
                <CardDescription className="text-xs">{currentAgent.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Sparkles className="h-12 w-12 mb-4 opacity-30" />
                  <p className="text-sm">Start a conversation with {currentAgent.name}</p>
                  <p className="text-xs mt-1 max-w-md">{currentAgent.placeholder}</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentAgent.placeholder}
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button onClick={sendMessage} disabled={loading || !input.trim()} size="icon" className="h-[60px] w-[60px]">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                AI responses are for guidance only and should not replace professional advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AIAgents;
