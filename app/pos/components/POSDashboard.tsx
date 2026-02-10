"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Gift } from "lucide-react";
import { EarnTab } from "./EarnTab";
import { RedeemTab } from "./RedeemTab";

export function POSDashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      <Tabs defaultValue="earn" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-800 border border-slate-700">
          <TabsTrigger
            value="earn"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Sumar Puntos
          </TabsTrigger>
          <TabsTrigger
            value="redeem"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            <Gift className="h-5 w-5 mr-2" />
            Canjear Premio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="earn">
          <EarnTab />
        </TabsContent>

        <TabsContent value="redeem">
          <RedeemTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
