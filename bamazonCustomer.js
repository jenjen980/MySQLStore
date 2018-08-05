//package requirements npm install
var inquirer = require("inquirer");
var mysql = require("mysql");

//get connection to database
var connection = mysql.createConnection({
    host: "localhost",

    //port for database
    port: 3306,

    //database username
    user: "root",

    // Your password
    password: "root",
    //database
    database: "bamazon"
})

//make sure connection is good
connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
})

//display products function using select statement from database
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
     // console.log(res);
     for(var i = 0; i<res.length; i++){
         console.log("ID: " + res[i].item_id +" | " + "Product: " + res[i].product_name +" | " + "Department: " + res[i].department_name +
         " | " + "Price: " + res[i].price +" | " + "Stock Quantity: " + res[i].stock_quantity + "");
     }
     purchaseOrder();
    })

var purchaseOrder = function(){

//prompts user to provide input to what item they want to purchase
inquirer.prompt([
    {
        name: "item_id",
        message: "What is the ID of the product that you would like to purchase?",

        //make sure a number was typed
        validate: function(value){
            if(isNaN(value) == false){
                return true;
            } else{
                console.log("Enter a valid ID please");
                return false;
            }
        }
    },
    {
        name: "quantity",
        message: "How many would you like to purchase?",

        validate: function(value){
            if(isNaN(value) == false){
                return true;
            } else{
                console.log("Enter a valid ID please");
                return false;
            }
        }

    }]).then(function(answers){
    //variables for logic

    var currentItem = answers.id;
    var currentAmount = answers.quantity;
    
    // return new Function(function(resolve, reject){
        connection.query("SELECT * FROM products WHERE ?", {item_id:answers.item_id},
        function(err, res){
            //if(err) throw err;

            if (currentAmount > res[0].stock_quantity){
                console.log("Sorry, not enough in stock");
                
                purchaseOrder();

            } else {
                console.log("It is in stock");

                //calc new quantity
                var newQuantity = (res[0].stock_quantity - currentAmount);
                var totalCost = res[0].price*currentAmount;

                //update quantity
                connection.query('UPDATE products SET ? WHERE ?',[{
                    stock_quantity: newQuantity
                },{
                    item_id: currentItem
                }], function(err, res){
                    console.log("You were charged $" + totalCost);

                    purchaseOrder();
        });
    }
})
    })
}



