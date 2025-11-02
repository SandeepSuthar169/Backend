// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("test");

// Find a document in a collection.
//1.  How do i list all sales from store A? 

db.sales.aggregate([
{
        $match: {
          store: "A",
          quantity: 5
        }
    },
])

//2. How do I sort all sales by data in descending order?
db.sales.aggregate([
    {
        $sort: {
            // data: 1   // means ascending order (from smallest to largest, or alphabetically A → Z).
            // data: -1, // means descending order (from largest to smallest, or Z → A).
            price: -1,
        }
    },
    ])
    
//3. How can i get the 2 most recent sales?
db.sales.aggregate([
    {
            $sort: {
              data: -1
            }
    },
    {
        $limit: 2
    }
])


//4. What is the total quantity sold for each item in the sales collection?

db.sales.aggregate([
    {
            $sort: {
              data: -1
            }
    },
    {
        $limit: 2
    }
])


// 5.What is the total quantity sold for each item in the sales collection?
db.sales.aggregate([
    {
        $group: {
          _id: "$item",
          totaQuantity: {
            $sum: "$quantity"
          }
        }
    }
])


//6 . How can I get total quantity sold for each  combination of store and category?

db.sales.aggregate([
    {
        $group: {
          _id: {
            store: "$store",
            category: "$category"
          },
          totalQuantity: {
            $sum: "$quantity"
          }
        }
    },
])

//7.  How can i get the total revenue for all sales?
db.sales.aggregate([
    {
        $group: {
          _id: null,
          totalReveunue: {
            $sum: {
                $multiply: ["$price", "$quantity"]
            }
          }
        }
    }
])

// 8. How do i add a field called revenue ( price * quantity ) to each document?
db.sales.aggregate([
    {
        $addFields: {
            revenue: {
                $multiply: ["$price" , "$quantity"]
            },
            abcd: "jfdkfl"
        }
    }
])

//9. How can i find the average quantity sold per store?
db.sales.aggregate([
    {
        $group: {
          _id: "$store",
          avgQuantity: {
            $avg: "$quantity"
          }
        }
    }
])

//10. How do i filter sales that happened on or after June 2, 2024?
db.sales.aggregate([
    {
        $match: {
            quantity: {
               ////$gt: 10
               ////$gte: 10
               ////$lt: 10
               $lte: 10
            }
        }
    }
])


//11. How do i show sales with the customer's name included?
db.sales.find(
    {
        _id: ObjectId('69049b928df940c298e3cd78')
    },
)


//12.  How can i showing sales details included item, store, date, with customerName

db.sales.aggregate([
    {
        $lookup: {
          from: "customers",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer"
        }
    },
    {
        $unwind: "$customer"
    },
    {
        $project: {
          item: 1,
          store: 1,
          customerName: "customer.name",
          date: 1,
          _id: 0,
        }
    }
])

//13. How can i list sales where the coutomer has loyalty true? 


db.sales.aggregate([
    {
        $lookup: {
          from: "customers",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer"
        }
    },
    {
        $unwind: "$customer"
    },
    {
        $match: {
          "customer.loyalty": true
        }
    },
    {
        $project: {
          item: 1,
          store: 1,
          customerName: "customer.name",
          date: 1,
          _id: 0
        }
    }
])

//14. How do i get total quantity sold grouped by whether the customer is loyel or not? 
db.sales.aggregate([
    {
        $lookup: {
          from: "customers",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer"
        }
    },
    {
        $unwind: "$customer"
    },
    {
        $group: {
          _id: "$customer.loyalty",
          totalQuantity: {
            $sum: "$quantity"
          }
        }
    }
])

//15. How can i get total quantity sold per day?
db.sales.aggregate([
    {
        $group: {
          _id: {
            $dateToString: {
                format: "%Y-%m-%d",
                date: "$date"
            }
          },
            totalQuantity:{
                $sum: "$quantity"
            }
        }
    }
])

//16. How can i bucket sales into quantity ranges of 0-5, 6-10, 11-20?

db.sales.aggregate([
    {
       $bucket: {
         groupBy: "$quantity",
         boundaries: [0, 6, 10, 20 ],
         default: "Other",
         output: {
            count: {
                $sum: 1
            },
            items: {
                $push: "$item"
            }
        }
       } 
    }
])