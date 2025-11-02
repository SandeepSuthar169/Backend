// customers collection
const customers = [
    { 
        name: "John", 
        age: 30, 
        loyalty: true 
    },
    { 
        name: "Alice", 
        age: 25, 
        loyalty: false 
    },
    { 
        name: "Bob", 
        age: 40, 
        loyalty: true 
    },
    { 
        name: "Diana", 
        age: 35, 
        loyalty: false 
    },
    { 
        name: "Eve", 
        age: 28, 
        loyalty: true 
    },
]

// Insert and capture inserted _ids
const customerInsertResult = db.customers.insertMany(customers)
const customerIds = customerInsertResult.insertedIds

// sales collection
const sales = [
  {
    item: "apple",
    price: 10,
    quantity: 5,
    category: "fruit",
    store: "A",
    date: ISODate("2024-06-01T10:00:00Z"),
    customer_id: customerIds[0],
  },
  {
    item: "banana",
    price: 5,
    quantity: 10,
    category: "fruit",
    store: "B",
    date: ISODate("2024-06-02T11:00:00Z"),
    customer_id: customerIds[1],
  },
  {
    item: "carrot",
    price: 3,
    quantity: 20,
    category: "vegetable",
    store: "A",
    date: ISODate("2024-06-01T12:00:00Z"),
    customer_id: customerIds[2],
  },
  {
    item: "apple",
    price: 10,
    quantity: 8,
    category: "fruit",
    store: "B",
    date: ISODate("2024-06-03T09:00:00Z"),
    customer_id: customerIds[3],
  },
  {
    item: "broccoli",
    price: 7,
    quantity: 6,
    category: "vegetable",
    store: "A",
    date: ISODate("2024-06-02T14:00:00Z"),
    customer_id: customerIds[4],
  },
]

db.sales.insertMany(sales)