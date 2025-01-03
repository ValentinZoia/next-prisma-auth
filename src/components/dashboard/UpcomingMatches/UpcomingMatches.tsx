
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import UpcomingMatchesData from "./UpcomingMatchesData";




interface UpcomingMatchesProps {
  className?: string;
}




export default function UpcomingMatches({ className }: UpcomingMatchesProps) {
  return (
    <Card className={`${className} lg:block lg:col-span-1 lg:h-fit`} >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Partidos de San Lorenzo</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <UpcomingMatchesData />
        </div>
      </CardContent>
    </Card>
  );
}
