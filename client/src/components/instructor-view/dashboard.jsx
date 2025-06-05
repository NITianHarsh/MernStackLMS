import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Users } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Dashboard({ listOfCourses }) {
  const [chartData, setChartData] = useState([]);
  const [chartTitle, setChartTitle] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28CFE",
    "#FE6F5E",
  ];

  // Calculate total students, profit, and student list
  const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
    (acc, course) => {
      const studentCount = course.students.length;
      acc.totalStudents += studentCount;
      acc.totalProfit += course.pricing * studentCount;

      course.students.forEach((student) => {
        acc.studentList.push({
          courseTitle: course.title,
          studentName: student.studentName,
          studentEmail: student.studentEmail,
        });
      });

      return acc;
    },
    {
      totalStudents: 0,
      totalProfit: 0,
      studentList: [],
    }
  );

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Sort the student list
  const sortedStudents = [...studentList].sort((a, b) => {
    if (sortField) {
      const valA = a[sortField]?.toLowerCase() ?? "";
      const valB = b[sortField]?.toLowerCase() ?? "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Configuration for the cards
  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: totalStudents,
      onClick: () => {
        setChartTitle("Students Distribution");
        const studentData = listOfCourses.map((course) => ({
          y: course.students.length,
          label: course.title,
        }));
        setChartData(studentData);
        setIsDialogOpen(true);
      },
    },
    {
      icon: IndianRupee,
      label: "Total Revenue",
      value: totalProfit,
      onClick: () => {
        setChartTitle("Revenue Distribution");
        const revenueData = listOfCourses.map((course) => ({
          y: course.pricing * course.students.length,
          label: course.title,
        }));
        setChartData(revenueData);
        setIsDialogOpen(true);
      },
    },
  ];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-8 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {config.map((item, index) => (
          <Card
            key={index}
            onClick={item.onClick}
            className="bg-emerald-100 dark:bg-gray-800 border border-emerald-300 dark:border-emerald-700 shadow-md hover:shadow-lg transition"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-emerald-900 dark:text-emerald-300">
                {item.label}
              </CardTitle>
              <item.icon className="h-5 w-5 text-emerald-700 dark:text-gray-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-800 dark:text-gray-200">
                {item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 text-white w-full rounded-lg shadow-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-[300px] sm:h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="y"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  label={renderCustomizedLabel}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Students Table */}
      <Card className="bg-emerald-100 dark:bg-gray-800 border border-emerald-300 dark:border-emerald-700 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-emerald-900 dark:text-emerald-300">
            Students List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer text-emerald-900 dark:text-gray-200"
                    onClick={() => handleSort("courseTitle")}
                  >
                    Course Name{" "}
                    {sortField === "courseTitle"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-emerald-900 dark:text-gray-200"
                    onClick={() => handleSort("studentName")}
                  >
                    Student Name{" "}
                    {sortField === "studentName"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </TableHead>
                  <TableHead className="text-emerald-900 dark:text-gray-200">
                    Student Email
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStudents.map((studentItem, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-emerald-200 dark:hover:bg-gray-700"
                  >
                    <TableCell className="font-medium text-emerald-800 dark:text-gray-300">
                      {studentItem.courseTitle}
                    </TableCell>
                    <TableCell className="text-emerald-800 dark:text-gray-300">
                      {studentItem.studentName}
                    </TableCell>
                    <TableCell className="text-emerald-800 dark:text-gray-300">
                      {studentItem.studentEmail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
