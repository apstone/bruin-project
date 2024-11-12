'use client'
import { use, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { Database } from "@/lib/database.types";

type Session = Database['public']['Tables']['sessions']['Row'];

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {


  const { id } = use(params);

  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (id) {
        setLoading(true);
        const { data, error } = await supabase


          .from("sessions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching session data:", error);
        } else {
          setSessionData(data);
        }
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20">Loading session data...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-center flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Session Details</h1>
      {sessionData ? (
        <div>
          <p className="text-lg mb-2">Session ID: {sessionData.id}</p>
          <p className="text-md text-gray-700">Status: {sessionData.status}</p>
          {/* Placeholder for additional session data or functionality */}
          <div className="mt-6 p-4 bg-white shadow rounded-lg max-w-sm">
            <p>Additional session details and functionality will go here.</p>
          </div>
        </div>
      ) : (
        <p className="text-lg text-red-500">Session not found.</p>
      )}
    </div>
  );
}
