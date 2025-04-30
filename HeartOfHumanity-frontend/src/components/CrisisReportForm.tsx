import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

// Web Speech API support
interface ExtendedWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

const SpeechRecognition = typeof window !== "undefined" &&
  ((window as ExtendedWindow).SpeechRecognition || (window as ExtendedWindow).webkitSpeechRecognition);
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

export const CrisisReportForm = () => {
  const [messages, setMessages] = useState<Array<{
    type: "user" | "ai";
    content: string;
    timestamp: Date;
  }>>([{
    type: "ai",
    content: "Please describe the crisis situation. Include details like the number of people affected, what resources are needed, and where this is happening.",
    timestamp: new Date(),
  }]);

  const [currentMessage, setCurrentMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const isRecordingRef = useRef(false);
  const startSound = useRef<HTMLAudioElement | null>(null);
  const stopSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      startSound.current = new Audio("/start.mp3");
      stopSound.current = new Audio("/stop.mp3");
    }
  }, []);

  const startRecognition = () => {
    if (!recognition) return;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.start();
    isRecordingRef.current = true;
    setIsRecording(true);
    startSound.current?.play();

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript + " ";
      }
      setCurrentMessage(prev => (prev + " " + transcript).trim());
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      stopRecording();
    };

    recognition.onend = () => {
      if (isRecordingRef.current) {
        recognition.start(); // auto-restart
      } else {
        setIsRecording(false);
      }
    };
  };

  const stopRecording = () => {
    if (recognition && isRecordingRef.current) {
      recognition.stop();
      isRecordingRef.current = false;
      setIsRecording(false);
      stopSound.current?.play();
    }
  };

  const handleRecording = () => {
    if (!recognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    if (!isRecording) {
      startRecognition();
    } else {
      stopRecording();
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      type: "user" as const,
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:3000/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: currentMessage,
          location: currentMessage,
          status: "reported",
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.status === false) {
          setMessages(prev => [
            ...prev,
            {
              type: "ai",
              content: responseData.message,
              timestamp: new Date(),
            },
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            {
              type: "ai",
              content: "Your crisis report has been submitted successfully. Thank you for your report.",
              timestamp: new Date(),
            },
          ]);
          setIsComplete(true);
        }
      } else {
        setMessages(prev => [
          ...prev,
          {
            type: "ai",
            content: "There was an issue submitting your report. Please try again.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          type: "ai",
          content: "An error occurred while submitting the report. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Crisis Report Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-80 overflow-y-auto p-4 space-y-4 border rounded-md bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg py-2 px-4 max-w-[80%] ${message.type === "user" ? "bg-relief-blue text-white" : "bg-gray-200 text-gray-800"}`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isSubmitting && (
              <div className="flex justify-start">
                <div className="rounded-lg py-2 px-4 bg-gray-200 text-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Input
                placeholder="Type your message here..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="pr-10"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              className={`flex items-center gap-2 ${isRecording ? "bg-red-100 text-red-600 border-red-300" : ""}`}
              onClick={handleRecording}
            >
              {isRecording ? (
                <>
                  <span className="animate-pulse">●</span> Recording...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" /> Voice
                </>
              )}
            </Button>

            <Button
              type="button"
              className="flex items-center gap-2 bg-relief-blue hover:bg-blue-600"
              onClick={handleSendMessage}
              disabled={isSubmitting || !currentMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
