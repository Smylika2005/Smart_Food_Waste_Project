import 'package:flutter/material.dart';
import 'food_menu_page.dart';

class LoginPage extends StatefulWidget {

  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {

  final TextEditingController usernameController =
  TextEditingController();

  final TextEditingController passwordController =
  TextEditingController();

  void login() {

    String username = usernameController.text;
    String password = passwordController.text;

    if (username == "admin" &&
        password == "1234") {

      Navigator.pushReplacement(

        context,

        MaterialPageRoute(
          builder: (context) =>
          const FoodMenuPage(),
        ),
      );

    } else {

      ScaffoldMessenger.of(context).showSnackBar(

        const SnackBar(
          content: Text(
            "Invalid Username or Password",
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor: Colors.orange.shade50,

      body: Center(

        child: Padding(

          padding: const EdgeInsets.all(20),

          child: Column(

            mainAxisAlignment:
            MainAxisAlignment.center,

            children: [

              const Icon(
                Icons.restaurant,
                size: 100,
                color: Colors.orange,
              ),

              const SizedBox(height: 20),

              const Text(

                "Smart Food Waste Management",

                textAlign: TextAlign.center,

                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.orange,
                ),
              ),

              const SizedBox(height: 10),

              const Text(
                "Smart Analytics System for Food Waste Reduction and Demand Prediction",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: Colors.black54,
                ),
              ),

              const SizedBox(height: 40),

              Semantics(
                label: "Username Input",
                child: TextField(

                  controller: usernameController,

                  decoration: InputDecoration(

                    labelText: "Username",

                    border: OutlineInputBorder(
                      borderRadius:
                      BorderRadius.circular(15),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              Semantics(
                label: "Password Input",
                child: TextField(

                  controller: passwordController,

                  obscureText: true,

                  decoration: InputDecoration(

                    labelText: "Password",

                    border: OutlineInputBorder(
                      borderRadius:
                      BorderRadius.circular(15),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 30),

              SizedBox(

                width: double.infinity,

                height: 50,

                child: Semantics(
                  label: "Login Button",
                  child: ElevatedButton(

                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                    ),

                    onPressed: login,

                    child: const Text(

                      "LOGIN",

                      style: TextStyle(
                        fontSize: 18,
                      ),
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
}