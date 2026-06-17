import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'dashboard_page.dart';

class FoodMenuPage extends StatefulWidget {
  const FoodMenuPage({super.key});

  @override
  State<FoodMenuPage> createState() =>
      _FoodMenuPageState();
}

class _FoodMenuPageState
    extends State<FoodMenuPage> {

  // FIREBASE
  final FirebaseFirestore firestore =
      FirebaseFirestore.instance;

  // FOOD DATA
  List<Map<String, dynamic>> foodItems = [];

  // DOCUMENT IDS
  List<String> documentIds = [];

  // CONTROLLERS
  final TextEditingController dayController =
  TextEditingController();

  final TextEditingController nameController =
  TextEditingController();

  final TextEditingController quantityController =
  TextEditingController();

  final TextEditingController attendanceController =
  TextEditingController();

  // WEATHER
  String selectedWeather = "Sunny";

  // SWITCHES
  bool isFestival = false;

  bool isHoliday = false;
  final TextEditingController searchController =
  TextEditingController();

  String searchText = "";

  @override
  void initState() {
    super.initState();
    fetchFoodItems();
  }

  // FETCH FROM FIREBASE
  void fetchFoodItems() async {
    QuerySnapshot snapshot =
    await firestore
        .collection("food_items")
        .get();

    List<Map<String, dynamic>>
    loadedItems = [];

    List<String> loadedIds = [];

    for (var doc in snapshot.docs) {
      loadedItems.add({

        "day": doc["day"],

        "name": doc["name"],

        "quantity": doc["quantity"],

        "weather": doc["weather"],

        "attendance":
        doc["attendance"],

        "festival": doc["festival"],

        "holiday": doc["holiday"],
      });

      loadedIds.add(doc.id);
    }

    setState(() {
      foodItems = loadedItems;

      documentIds = loadedIds;
    });
  }

  // ADD FOOD ITEM
  void addFoodItem() async {
    if (dayController.text.isEmpty ||
        nameController.text.isEmpty ||
        quantityController.text.isEmpty ||
        attendanceController.text.isEmpty) {
      return;
    }

    Map<String, dynamic> newFood = {

      "day": dayController.text,

      "name": nameController.text,

      "quantity":
      int.parse(quantityController.text),

      "weather": selectedWeather,

      "attendance":
      int.parse(attendanceController.text),

      "festival": isFestival,

      "holiday": isHoliday,
    };

    // SAVE TO FIREBASE
    DocumentReference docRef =
    await firestore
        .collection("food_items")
        .add(newFood);

    setState(() {
      foodItems.add(newFood);

      documentIds.add(docRef.id);
    });

    // CLEAR INPUTS
    dayController.clear();
    nameController.clear();
    quantityController.clear();
    attendanceController.clear();

    selectedWeather = "Sunny";
    isFestival = false;
    isHoliday = false;

    Navigator.pop(context);
  }

  // SHOW ADD DIALOG
  void showAddDialog() {
    showDialog(

      context: context,

      builder: (context) {
        return AlertDialog(

          title:
          const Text("Add Food Item"),

          content:
          SingleChildScrollView(

            child: Column(

              mainAxisSize:
              MainAxisSize.min,

              children: [

                // DAY
                Semantics(
                  label: "Day Input",
                  child: TextField(

                    controller:
                    dayController,

                    decoration:
                    const InputDecoration(
                      labelText: "Day",
                    ),
                  ),
                ),

                // FOOD NAME
                Semantics(
                  label: "Food Name Input",
                  child: TextField(

                    controller:
                    nameController,

                    decoration:
                    const InputDecoration(
                      labelText:
                      "Food Item",
                    ),
                  ),
                ),

                // QUANTITY
                Semantics(
                  label: "Quantity Input",
                  child: TextField(

                    controller:
                    quantityController,

                    keyboardType:
                    TextInputType.number,

                    decoration:
                    const InputDecoration(
                      labelText:
                      "Quantity",
                    ),
                  ),
                ),

                // WEATHER
                Semantics(
                  label: "Weather Dropdown",
                  child: DropdownButtonFormField(

                    value:
                    selectedWeather,

                    items: [

                      "Sunny",
                      "Rainy",
                      "Cloudy",

                    ].map((weather) {
                      return DropdownMenuItem(

                        value: weather,

                        child:
                        Text(weather),
                      );
                    }).toList(),

                    onChanged: (value) {
                      setState(() {
                        selectedWeather =
                        value!;
                      });
                    },

                    decoration:
                    const InputDecoration(
                      labelText:
                      "Weather",
                    ),
                  ),
                ),

                // ATTENDANCE
                Semantics(
                  label: "Attendance Input",
                  child: TextField(

                    controller:
                    attendanceController,

                    keyboardType:
                    TextInputType.number,

                    decoration:
                    const InputDecoration(
                      labelText:
                      "Attendance",
                    ),
                  ),
                ),

                // FESTIVAL
                Semantics(
                  label: "Festival Switch",
                  child: SwitchListTile(

                    title: const Text(
                        "Festival Day"),

                    value: isFestival,

                    onChanged: (value) {
                      setState(() {
                        isFestival =
                            value;
                      });
                    },
                  ),
                ),

                // HOLIDAY
                Semantics(
                  label: "Holiday Switch",
                  child: SwitchListTile(

                    title:
                    const Text("Holiday"),

                    value: isHoliday,

                    onChanged: (value) {
                      setState(() {
                        isHoliday =
                            value;
                      });
                    },
                  ),
                ),
              ],
            ),
          ),

          actions: [

            Semantics(
              label: "Submit Button",
              child: ElevatedButton(

                onPressed:
                addFoodItem,

                style:
                ElevatedButton.styleFrom(
                  backgroundColor:
                  Colors.orange,
                ),

                child:
                const Text("Add"),
              ),
            ),
          ],
        );
      },
    );
  }

  // DELETE ITEM
  void deleteItem(int index) async {
    await firestore
        .collection("food_items")
        .doc(documentIds[index])
        .delete();

    setState(() {
      foodItems.removeAt(index);

      documentIds.removeAt(index);
    });
  }

  // INCREASE QUANTITY
  void increaseQuantity(int index) async {
    int newQuantity =
        foodItems[index]["quantity"] + 1;

    await firestore
        .collection("food_items")
        .doc(documentIds[index])
        .update({
      "quantity": newQuantity,
    });

    setState(() {
      foodItems[index]["quantity"] =
          newQuantity;
    });
  }


  // DECREASE QUANTITY
  void decreaseQuantity(int index) async {
    if (foodItems[index]["quantity"] > 0) {
      int newQuantity =
          foodItems[index]["quantity"] - 1;

      await firestore
          .collection("food_items")
          .doc(documentIds[index])
          .update({
        "quantity": newQuantity,
      });

      setState(() {
        foodItems[index]["quantity"] =
            newQuantity;
      });
    }
  }

  void showEditDialog(int index) {
    dayController.text =
    foodItems[index]["day"];

    nameController.text =
    foodItems[index]["name"];

    quantityController.text =
        foodItems[index]["quantity"]
            .toString();

    attendanceController.text =
        foodItems[index]["attendance"]
            .toString();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(

          title:
          const Text("Edit Food Item"),

          content:
          SingleChildScrollView(

            child: Column(
              mainAxisSize:
              MainAxisSize.min,

              children: [

                Semantics(
                  label: "Day Input",
                  child: TextField(
                    controller:
                    dayController,
                    decoration:
                    const InputDecoration(
                      labelText: "Day",
                    ),
                  ),
                ),

                Semantics(
                  label: "Food Name Input",
                  child: TextField(
                    controller:
                    nameController,
                    decoration:
                    const InputDecoration(
                      labelText:
                      "Food Item",
                    ),
                  ),
                ),

                Semantics(
                  label: "Quantity Input",
                  child: TextField(
                    controller:
                    quantityController,
                    keyboardType:
                    TextInputType.number,
                    decoration:
                    const InputDecoration(
                      labelText:
                      "Quantity",
                    ),
                  ),
                ),

                Semantics(
                  label: "Attendance Input",
                  child: TextField(
                    controller:
                    attendanceController,
                    keyboardType:
                    TextInputType.number,
                    decoration:
                    const InputDecoration(
                      labelText:
                      "Attendance",
                    ),
                  ),
                ),
              ],
            ),
          ),

          actions: [

            Semantics(
              label: "Update Button",
              child: ElevatedButton(

                onPressed: () async {
                  await firestore
                      .collection(
                      "food_items")
                      .doc(
                      documentIds[index])
                      .update({

                    "day":
                    dayController.text,

                    "name":
                    nameController.text,

                    "quantity":
                    int.parse(
                        quantityController
                            .text),

                    "attendance":
                    int.parse(
                        attendanceController
                            .text),
                  });

                  fetchFoodItems();

                  Navigator.pop(
                      context);
                },

                child:
                const Text(
                    "Update"),
              ),
            ),
          ],
        );
      },
    );
  }

  List<Map<String, dynamic>> get filteredItems {
    return foodItems.where((item) {
      return item["name"]
          .toString()
          .toLowerCase()
          .contains(searchText);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Food Menu"),
        backgroundColor: Colors.orange,
      ),

      floatingActionButton: Semantics(
        label: "Add Food Item Button",
        child: FloatingActionButton(
          backgroundColor: Colors.orange,
          onPressed: showAddDialog,
          child: const Icon(Icons.add),
        ),
      ),

      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(10),
            child: Semantics(
              label: "Search Input",
              child: TextField(
                controller: searchController,
                decoration: InputDecoration(
                  hintText: "Search Food Item",
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                onChanged: (value) {
                  setState(() {
                    searchText = value.toLowerCase();
                  });
                },
              ),
            ),
          ),

          Expanded(
            child: filteredItems.isEmpty
                ? const Center(
              child: Text(
                "No Food Items Found",
                style: TextStyle(fontSize: 18),
              ),
            )
                : ListView.builder(
              itemCount: filteredItems.length,
              itemBuilder: (context, index) {
                return Card(
                  margin: const EdgeInsets.all(10),
                  elevation: 5,
                  child: ListTile(
                    leading: const Icon(
                      Icons.restaurant_menu,
                      color: Colors.orange,
                    ),
                    title: Text(
                      filteredItems[index]["name"],
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    subtitle: Text(
                      "Day: ${filteredItems[index]["day"]}\n"
                          "Quantity: ${filteredItems[index]["quantity"]}\n"
                          "Weather: ${filteredItems[index]["weather"]}\n"
                          "Attendance: ${filteredItems[index]["attendance"]}\n"
                          "Festival: ${filteredItems[index]["festival"]}\n"
                          "Holiday: ${filteredItems[index]["holiday"]}",
                      style: const TextStyle(fontSize: 15),
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          tooltip: "Decrease Quantity Button",
                          onPressed: () {
                            int realIndex = foodItems.indexOf(
                              filteredItems[index],
                            );
                            decreaseQuantity(realIndex);
                          },
                          icon: const Icon(Icons.remove_circle),
                          color: Colors.red,
                        ),
                        IconButton(
                          tooltip: "Increase Quantity Button",
                          onPressed: () {
                            int realIndex = foodItems.indexOf(
                              filteredItems[index],
                            );
                            increaseQuantity(realIndex);
                          },
                          icon: const Icon(Icons.add_circle),
                          color: Colors.green,
                        ),
                        IconButton(
                          tooltip: "Edit Button",
                          onPressed: () {
                            int realIndex = foodItems.indexOf(
                              filteredItems[index],
                            );
                            showEditDialog(realIndex);
                          },
                          icon: const Icon(Icons.edit),
                          color: Colors.blue,
                        ),
                        IconButton(
                          tooltip: "Delete Button",
                          onPressed: () {
                            int realIndex = foodItems.indexOf(
                              filteredItems[index],
                            );
                            deleteItem(realIndex);
                          },
                          icon: const Icon(Icons.delete),
                          color: Colors.black,
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),

      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(10),
        child: Semantics(
          label: "Go To Dashboard Button",
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              padding: const EdgeInsets.all(15),
            ),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      DashboardPage(
                        foodItems: foodItems,
                      ),
                ),
              );
            },
            child: const Text(
              "Go To Dashboard",
              style: TextStyle(
                fontSize: 18,
              ),
            ),
          ),
        ),
      ),
    );
  }
}


