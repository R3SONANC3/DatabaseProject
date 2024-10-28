import pandas as pd
import mysql.connector
from mysql.connector import Error
import re
import random
from typing import List, Dict, Any
from datetime import datetime

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

def connect_to_db():
    try:
        connection = mysql.connector.connect(
            host='databasepj.cps0aq0y2604.ap-southeast-2.rds.amazonaws.com',
            user='admin',
            database='databasepj',
            password='12345678',
            port='3306',
            # เพิ่ม configuration สำหรับ bulk insert
            allow_local_infile=True,
            charset='utf8mb4',
            use_pure=True,
            # เพิ่ม buffer sizes
            connection_timeout=300,
            buffered=True
        )
        if connection.is_connected():
            print("Connected to MySQL database")
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def prepare_categories(cursor):
    # Insert all categories at once
    categories = [(cat,) for cat in category_weights.keys()]
    cursor.executemany(
        "INSERT IGNORE INTO Categories (categoryName) VALUES (%s)",
        categories
    )
    
    # Get category mappings in one query
    cursor.execute("SELECT categoryName, categoryID FROM Categories")
    return {name: id for name, id in cursor.fetchall()}

def process_dataframe(df: pd.DataFrame, category_mapping: Dict[str, int], batch_size: int = 1000) -> List[tuple]:
    # Preprocess date column once
    df['Date'] = df['Date'].apply(lambda x: re.sub(r'\s+\([A-Z]+\)', '', x))
    df['Date'] = pd.to_datetime(df['Date'], format='%a %d %b %Y %H:%M:%S %z', errors='coerce')
    
    records = []
    max_email_length = 100

    for _, row in df.iterrows():
        category = random.choices(list(category_weights.keys()), 
                                weights=list(category_weights.values()))[0]
        category_id = category_mapping[category]
        
        recipient_email = row['recipient'][:max_email_length] if isinstance(row['recipient'], str) else None
        date_str = row['Date'].strftime('%Y-%m-%d %H:%M:%S') if pd.notna(row['Date']) else None

        record = (
            row['Message_ID'],
            date_str,
            row['From'],
            row['Subject'],
            recipient_email,
            row['Size'],
            category_id
        )
        records.append(record)

    return records

def bulk_insert_records(cursor, records: List[tuple], batch_size: int = 1000):
    insert_query = """
    INSERT INTO Emails (messageID, date, senderEmail, message, recipientEmail, size, CategoryID)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    
    total_records = len(records)
    for i in range(0, total_records, batch_size):
        batch = records[i:i + batch_size]
        cursor.executemany(insert_query, batch)
        print(f"Inserted {min(i + batch_size, total_records)} of {total_records} records")

def main():
    csv_file = 'updated_data.csv'
    batch_size = 1000  # ปรับขนาด batch ตามความเหมาะสม

    connection = connect_to_db()
    if connection is None:
        return

    try:
        # อ่าน CSV ทั้งไฟล์เข้า memory
        print("Reading CSV file...")
        df = pd.read_csv(csv_file)
        
        cursor = connection.cursor()
        
        # Set session variables for better performance
        cursor.execute("SET foreign_key_checks = 0")
        cursor.execute("SET unique_checks = 0")
        cursor.execute("SET autocommit = 0")
        
        # เตรียม categories ทั้งหมดในครั้งเดียว
        print("Preparing categories...")
        category_mapping = prepare_categories(cursor)
        connection.commit()
        
        # Process records in memory
        print("Processing records...")
        records = process_dataframe(df, category_mapping, batch_size)
        
        # Bulk insert with batching
        print("Inserting records...")
        bulk_insert_records(cursor, records, batch_size)
        
        # Commit changes
        connection.commit()
        
        # Reset session variables
        cursor.execute("SET foreign_key_checks = 1")
        cursor.execute("SET unique_checks = 1")
        cursor.execute("SET autocommit = 1")
        
        print("Data insertion completed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        connection.rollback()
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    main()