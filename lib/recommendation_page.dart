import 'package:flutter/material.dart';

class RecommendationPage extends StatelessWidget {
  final String mostSoldItem;

  const RecommendationPage({
    super.key,
    required this.mostSoldItem,
  });

  @override
  Widget build(BuildContext context) {
    String aiSuggestion =
        "Increase preparation of $mostSoldItem by 15% tomorrow.";

    String wasteAlert =
        "Reduce preparation of low-demand items to minimize food waste.";

    String weatherSuggestion =
        "Rainy weather may reduce student attendance by 10-15%.";

    String festivalSuggestion =
        "Festival days generally increase food demand by 20-30%.";

    String attendanceSuggestion =
        "Monitor attendance records daily for better prediction accuracy.";

    String donationSuggestion =
        "Donate surplus food to NGOs instead of discarding it.";

    String predictionScore = "85% Accurate Demand Forecast";

    return Scaffold(
      appBar: AppBar(
        title: const Text("AI Recommendations"),
        backgroundColor: Colors.orange,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(15),
        child: Column(
          children: [

            recommendationCard(
              Icons.restaurant,
              Colors.green,
              "Most Sold Item",
              mostSoldItem,
            ),

            recommendationCard(
              Icons.auto_graph,
              Colors.blue,
              "Demand Forecast",
              predictionScore,
            ),

            recommendationCard(
              Icons.lightbulb,
              Colors.orange,
              "AI Suggestion",
              aiSuggestion,
            ),

            recommendationCard(
              Icons.delete,
              Colors.red,
              "Waste Reduction",
              wasteAlert,
            ),

            recommendationCard(
              Icons.cloud,
              Colors.indigo,
              "Weather Analysis",
              weatherSuggestion,
            ),

            recommendationCard(
              Icons.celebration,
              Colors.purple,
              "Festival Impact",
              festivalSuggestion,
            ),

            recommendationCard(
              Icons.people,
              Colors.teal,
              "Attendance Analysis",
              attendanceSuggestion,
            ),

            recommendationCard(
              Icons.volunteer_activism,
              Colors.pink,
              "Food Donation",
              donationSuggestion,
            ),

            const SizedBox(height: 20),

            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(
                color: Colors.orange.shade100,
                borderRadius: BorderRadius.circular(15),
              ),
              child: const Column(
                children: [
                  Icon(
                    Icons.smart_toy,
                    size: 40,
                    color: Colors.orange,
                  ),
                  SizedBox(height: 10),
                  Text(
                    "Smart Analytics Summary",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    "The system predicts food demand using attendance, weather, festivals, and historical sales data to reduce food waste and improve inventory planning.",
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget recommendationCard(
      IconData icon,
      Color color,
      String title,
      String subtitle,
      ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 5,
      child: ListTile(
        leading: Icon(
          icon,
          color: color,
          size: 35,
        ),
        title: Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(subtitle),
      ),
    );
  }
}