import pandas as pd
import mysql.connector
from mysql.connector import Error
import re
import random

# Define realistic probabilities for categories and statuses
category_weights = {
    'purchases': 0.15,
    'newsletters': 0.25,
    'updates': 0.10,
    'work': 0.20,
    'promotions': 0.10,
    'social': 0.05,
    'personal': 0.05,
    'forums': 0.05,
    'spam': 0.05
}

# Function to connect to MySQL database
def connect_to_db():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            database='databasepj',
            password='1234567'
        )
        if connection.is_connected():
            print("Connected to MySQL database")
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Function to select a random category based on weights
def select_random_category():
    categories = list(category_weights.keys())
    probabilities = list(category_weights.values())
    return random.choices(categories, probabilities)[0]


# Function to insert data into Categories and Status tables
def insert_into_categories_and_status(cursor):
    categories = ['purchases', 'newsletters', 'updates', 'work', 'promotions', 'social', 'personal', 'forums', 'spam']

    # Insert Categories
    for category in categories:
        cursor.execute("INSERT IGNORE INTO Categories (categoryName) VALUES (%s)", (category,))


# Function to get the ID for Categories and Status based on name
def get_id_by_name(cursor, table_name, column_name, value):
    id_column = 'categoryID' if table_name == 'Categories' else 'statusID'
    
    cursor.execute(f"SELECT {id_column} FROM {table_name} WHERE {column_name} = %s", (value,))
    result = cursor.fetchone()
    
    # Debugging: Print the result to verify it's retrieving IDs correctly
    print(f"Fetching {id_column} for {value}: {result}")
    
    return result[0] if result else None

# Function to insert data from CSV into Emails table
def insert_data_from_csv(csv_file, connection):
    cursor = connection.cursor()

    # Insert categories and status (make sure these are present)
    insert_into_categories_and_status(cursor)
    connection.commit()  # Commit changes after inserting categories and status

    # Read CSV file into a pandas DataFrame
    df = pd.read_csv(csv_file)

    total_rows = len(df)

    # Preprocess the date column to remove timezone name and parse the date
    df['Date'] = df['Date'].apply(lambda x: re.sub(r'\s+\([A-Z]+\)', '', x))  # Remove timezone name
    df['Date'] = pd.to_datetime(df['Date'], format='%a %d %b %Y %H:%M:%S %z', errors='coerce')  # Parse date

    # Define the maximum length allowed for recipientEmail
    max_email_length = 100  # Adjust based on your database schema

    # Loop through DataFrame rows and insert each record into Emails table
    for index, row in df.iterrows():
        # Randomly select an email category and status using weights
        selected_category = select_random_category()

        # Get emailCategoryID based on the category name
        email_category_id = get_id_by_name(cursor, 'Categories', 'categoryName', selected_category)

        # Truncate recipient email if it exceeds max_email_length
        recipient_email = row['recipient'][:max_email_length] if isinstance(row['recipient'], str) else None

        # Prepare the insert query
        insert_query = """
        INSERT INTO Emails (messageID, date, senderEmail, message, recipientEmail, size, CategoryID)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        # Execute the query
        cursor.execute(insert_query, (
            row['Message_ID'],
            row['Date'].strftime('%Y-%m-%d %H:%M:%S') if pd.notna(row['Date']) else None,
            row['From'],
            row['Subject'],
            recipient_email,  # Use truncated email
            row['Size'],
            email_category_id
        ))

        # Print progress
        print(f"Processed row {index + 1} of {total_rows}")

    # Commit the transaction
    connection.commit()
    cursor.close()


# Main function
def main():
    csv_file = 'updated_data.csv'  # Replace with the path to your CSV file

    # Connect to the database
    connection = connect_to_db()

    if connection is not None:
        # Insert data from CSV
        insert_data_from_csv(csv_file, connection)

        # Close the connection
        connection.close()

if __name__ == '__main__':
    main()
