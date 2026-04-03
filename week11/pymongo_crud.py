import pymongo

# Connect
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["ics385_week11"]
collection = db["Customer"]
print("Connected to MongoDB\n")

# Delete collection if it exists for fresh start
collection.delete_many({})
print("DELETED ALL - Collection cleared\n")

# Insert into collection
collection.insert_many([
    {
        "first_name": "Lori",
        "last_name": "Norwood",
        "email": "lor.nor@email.com",
        "phone": "808-867-5309",
    },
    {
        "first_name": "Sajida",
        "last_name": "AlSharif",
        "email": "saji.alsharif@email.com",
        "phone": "808-555-1234"
    },
    {
        "first_name": "Eden",
        "last_name": "Torres",
        "email": "eden.t@email.com",
        "phone": "808-555-5678"
    },
])
print("INSERT MANY - Added 3 customers")
for c in collection.find():
    print(" ", c)
print()

# Update one email and one phone number
collection.update_one(
    {"last_name": "Norwood"},
    {"$set": {"email": "lori.norwood@email.com"}}
)
print("Updated Email - Lori's new email:")
print(" ", collection.find_one({"last_name": "Norwood"}))
print()

collection.update_one(
    {"last_name": "AlSharif"},
    {"$set": {"phone": "808-555-9999"}}
)
print("Updated Phone Number - Sajida's new phone:")
print(" ", collection.find_one({"last_name": "AlSharif"}))
print()

# Query by last name and query by first name
query_by_last = collection.find_one({"last_name": "Torres"})
print("Query by Last Name -", query_by_last)
print()

query_by_first = collection.find_one({"first_name": "Sajida"})
print("Query by First Name -", query_by_first)
print()

# Drop collection
collection.drop()
print("DROP - Customer collection dropped")
print("\nAll CRUD operations complete")