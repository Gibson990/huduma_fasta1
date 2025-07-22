import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function ProviderMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/contact?providerId=${user.id}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setMessages(data)
        setLoading(false)
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg mb-4 bg-white shadow-sm animate-pulse flex flex-col gap-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-1" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
          </div>
        ))}
      </div>
    )
  }

  const handleReply = async () => {
    if (!reply.trim() || !selectedMessage) return;
    setSending(true);
    try {
      const res = await fetch(`/api/contact/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          providerId: user.id,
          reply,
        }),
      });
      if (res.ok) {
        setMessages(msgs => msgs.map(m => m.id === selectedMessage.id ? { ...m, reply } : m));
        setReply("");
        setSelectedMessage(null);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm mt-6">
      <CardHeader>
        <CardTitle className="text-[#212121] flex items-center gap-2">
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-600">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-600">No messages yet.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg: any) => (
              <div key={msg.id} className="p-4 border rounded-lg flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{msg.customer_name}</Badge>
                  <a href={`mailto:${msg.customer_email}`} className="text-blue-600 flex items-center gap-1"><Mail className="h-4 w-4" />{msg.customer_email}</a>
                  <a href={`tel:${msg.customer_phone}`} className="text-blue-600 flex items-center gap-1"><Phone className="h-4 w-4" />{msg.customer_phone}</a>
                </div>
                <div className="text-sm text-gray-900">{msg.message}</div>
                <div className="text-xs text-gray-500">{msg.subject} • {new Date(msg.created_at).toLocaleString()}</div>
                {msg.reply ? (
                  <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400 text-green-800 rounded">
                    <strong>Your reply:</strong> {msg.reply}
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setSelectedMessage(msg)}>Reply</Button>
                )}
              </div>
            ))}
          </div>
        )}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-2">Reply to {selectedMessage.customer_name}</h3>
              <Textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                rows={4}
                placeholder="Type your reply..."
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button onClick={() => setSelectedMessage(null)} variant="outline">Cancel</Button>
                <Button onClick={handleReply} disabled={sending || !reply.trim()} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                  {sending ? "Sending..." : <><Send className="h-4 w-4 mr-2" />Send Reply</>}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 