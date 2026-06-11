import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import InvestmentApplicationDialog from "@/components/InvestmentApplicationDialog";

const InvestmentTable = () => {
  const investmentApplications = [
    { id: 1, investor: "Sequoia Capital", amount: "$300K", status: "In Progress", date: "Dec 20, 2026" },
    { id: 2, investor: "Accel Partners", amount: "$220K", status: "Pending", date: "Dec 18, 2026" },
    { id: 3, investor: "Matrix Partners", amount: "$385K", status: "Under Review", date: "Dec 10, 2026" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investment Applications</h2>
        <InvestmentApplicationDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </InvestmentApplicationDialog>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investmentApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.investor}</TableCell>
                  <TableCell>{app.amount}</TableCell>
                  <TableCell>
                    <Badge variant={app.status === "In Progress" ? "default" : "secondary"}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{app.date}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View Details</Button>
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

export default InvestmentTable;