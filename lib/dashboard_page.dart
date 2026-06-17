import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'recommendation_page.dart';

class DashboardPage extends StatelessWidget {

  final List<Map<String, dynamic>> foodItems;

  const DashboardPage({
    super.key,
    required this.foodItems,
  });

  @override
  Widget build(BuildContext context) {

    // SAFETY CHECK
    if (foodItems.isEmpty) {

      return Scaffold(

        backgroundColor:
        Colors.orange.shade50,

        appBar: AppBar(

          title: const Text(
            "Waste Tracking Dashboard",
          ),

          backgroundColor:
          Colors.orange,
        ),

        body: const Center(

          child: Text(

            "No Food Data Available",

            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      );
    }

    // TOTAL SALES
    int totalOrders = 0;

    for (var item in foodItems) {

      totalOrders +=
      item["quantity"] as int;
    }

    // MOST SOLD ITEM
    var mostSold = foodItems.reduce(

          (a, b) =>

      a["quantity"] > b["quantity"]
          ? a
          : b,
    );

    // LEAST SOLD ITEM
    var leastSold = foodItems.reduce(

          (a, b) =>

      a["quantity"] < b["quantity"]
          ? a
          : b,
    );

    // AVERAGE DEMAND
    double averageDemand =
        totalOrders / foodItems.length;

    // WASTE %
    double wastePercentage =

        (leastSold["quantity"] /
            totalOrders) *
            100;

    // AI PREDICTION
    int predictedOrders = totalOrders;

    for (var item in foodItems) {

      // WEATHER EFFECT
      if (item["weather"] == "Rainy") {

        predictedOrders -= 10;
      }

      if (item["weather"] == "Sunny") {

        predictedOrders += 10;
      }

      // ATTENDANCE EFFECT
      predictedOrders +=

          ((item["attendance"] ?? 0)
          as int) ~/ 10;

      // FESTIVAL EFFECT
      if (item["festival"] == true) {

        predictedOrders += 30;
      }

      // HOLIDAY EFFECT
      if (item["holiday"] == true) {

        predictedOrders -= 20;
      }
    }

    return Scaffold(

      backgroundColor:
      Colors.orange.shade50,

      appBar: AppBar(

        title: const Text(
          "Waste Tracking Dashboard",
        ),

        backgroundColor:
        Colors.orange,
      ),

      body: SingleChildScrollView(

        child: Padding(

          padding:
          const EdgeInsets.all(12),

          child: Column(

            children: [

              // TOTAL SALES
              dashboardCard(

                Icons.shopping_cart,

                "Total Weekly Sales",

                "$totalOrders Orders",
              ),

              // MOST SOLD
              dashboardCard(

                Icons.star,

                "Most Sold Item",

                mostSold["name"],
              ),

              // LEAST SOLD
              dashboardCard(

                Icons.trending_down,

                "Least Sold Item",

                leastSold["name"],
              ),

              // AVERAGE DEMAND
              dashboardCard(

                Icons.analytics,

                "Average Demand",

                averageDemand
                    .toStringAsFixed(2),
              ),

              // PREDICTION
              dashboardCard(

                Icons.auto_graph,

                "Predicted Orders Tomorrow",

                "$predictedOrders Orders",
              ),

              // WASTE %
              dashboardCard(

                Icons.delete,

                "Waste Percentage",

                "${wastePercentage.toStringAsFixed(2)}%",
              ),

              const SizedBox(height: 25),

              // GRAPH TITLE
              const Text(

                "Weekly Sales Analytics",

                style: TextStyle(

                  fontSize: 22,

                  fontWeight:
                  FontWeight.bold,
                ),
              ),

              const SizedBox(height: 20),

              // BAR CHART
              SizedBox(

                height: 300,

                child: BarChart(
                  BarChartData(

                    alignment:
                    BarChartAlignment.spaceAround,

                    maxY: (foodItems
                        .map((e) => e["quantity"] as int)
                        .reduce((a, b) => a > b ? a : b))
                        .toDouble() +
                        20,

                    titlesData: FlTitlesData(

                      bottomTitles: AxisTitles(

                        sideTitles: SideTitles(

                          showTitles: true,

                          getTitlesWidget: (value, meta) {

                            int index = value.toInt();

                            if (index >= 0 &&
                                index < foodItems.length) {

                              return Text(
                                foodItems[index]["name"],
                                style:
                                const TextStyle(
                                  fontSize: 10,
                                ),
                              );
                            }

                            return const Text("");
                          },
                        ),
                      ),
                    ),

                    barGroups:
                    List.generate(



                      foodItems.length,

                          (index) {

                        return BarChartGroupData(

                          x: index,

                          barRods: [

                            BarChartRodData(

                              toY:
                              (foodItems[index]
                              ["quantity"]
                              as int)
                                  .toDouble(),

                              width: 22,

                              borderRadius:
                              BorderRadius
                                  .circular(6),

                              color:
                              Colors.orange,
                            ),
                          ],
                        );
                      },
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 30),

              // AI BUTTON
              Semantics(
                label: "View AI Recommendations Button",
                child: ElevatedButton(

                  style:
                  ElevatedButton.styleFrom(

                    backgroundColor:
                    Colors.orange,

                    padding:
                    const EdgeInsets.all(15),
                  ),

                  onPressed: () {

                    Navigator.push(

                      context,

                      MaterialPageRoute(

                        builder: (context) =>

                            RecommendationPage(

                              mostSoldItem:
                              mostSold["name"],
                            ),
                      ),
                    );
                  },

                  child: const Text(

                    "View AI Recommendations",

                    style: TextStyle(
                      fontSize: 18,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // REUSABLE CARD
  Widget dashboardCard(

      IconData icon,
      String title,
      String value,
      ) {

    return Card(

      margin:
      const EdgeInsets.only(
          bottom: 15),

      elevation: 5,

      shape: RoundedRectangleBorder(

        borderRadius:
        BorderRadius.circular(15),
      ),

      child: ListTile(

        leading: CircleAvatar(

          backgroundColor:
          Colors.orange.shade100,

          child: Icon(

            icon,

            color: Colors.orange,

            size: 30,
          ),
        ),

        title: Text(

          title,

          style: const TextStyle(

            fontWeight:
            FontWeight.bold,

            fontSize: 16,
          ),
        ),

        subtitle: Text(

          value,

          style: const TextStyle(
            fontSize: 17,
          ),
        ),
      ),
    );
  }
}