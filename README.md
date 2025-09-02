# Redis Cache Implementation for a MySQL Database

## 🔹 Project Overview

[cite_start]This project demonstrates the implementation of a **Redis cache layer** on top of a MySQL database to optimize application performance. [cite: 8] [cite_start]The primary goal is to reduce database load and significantly decrease query response times by serving frequently accessed data directly from memory. [cite: 39] [cite_start]The solution ensures data consistency between the cache and the database for all operations performed through the application. [cite: 40]

---

## 💡 Key Features & Implemented Solution

* [cite_start]**Initial Cache Synchronization:** On server startup, a dedicated `/syncProducts` route automatically populates the Redis cache. [cite: 9, 10] [cite_start]It uses a **hash-based comparison** to identify new or modified products in the MySQL database and updates the cache accordingly, ensuring it is current. [cite: 12, 14, 15]

* **Cache-Aside Pattern (for Reads):**
    * [cite_start]When fetching a single product by ID, the system first queries the Redis cache. [cite: 21]
    * [cite_start]If the data is not found (a *cache miss*), it fetches the data from the MySQL database, adds it to the cache for future requests, and then returns it. [cite: 22]
    * [cite_start]Requests for all products are served directly from the synchronized cache. [cite: 18, 19]

* **Write-Through Strategy (for Writes):**
    * [cite_start]For data modification operations (**create, update, delete**), the system employs a write-through approach. [cite: 24, 28, 30]
    * [cite_start]Any change is applied to both the MySQL database and the Redis cache simultaneously, maintaining consistency. [cite: 25, 28, 30]

---

## 📈 Observed Results

* [cite_start]**Improved Performance:** A significant **reduction in query response time** was observed, as data is served from Redis's in-memory storage, minimizing database access. [cite: 39]
* [cite_start]**Data Consistency:** The write-through strategy proved effective in **maintaining synchronization** between the cache and the database for all application-driven inserts, updates, and deletions. [cite: 40]

---

## ⚠️ Limitations & Future Improvements

The current implementation has a key limitation:

* [cite_start]**External Database Updates:** The cache can become desynchronized if the database is modified by an external process, bypassing the application logic. [cite: 33, 34, 35]

**Proposed Solution:**
* [cite_start]Implement a **background worker** to periodically poll the database for external changes and automatically update the cache to ensure long-term data integrity. [cite: 36, 37]

---

## 🛠️ Technologies Used

* **Database:** MySQL
* **Cache:** Redis
* **Backend:** Node.js

---

## 🚀 How to Run

1.  **Clone the repository**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure environment variables:**
    * Create a `.env` file and add your MySQL and Redis connection details.

4.  **Start the server:**
    ```bash
    npm start
    ```

---

## 👥 Authors

* [cite_start]**Isabella Tressino** [cite: 6]
* [cite_start]**Izabelle de Oliveira** [cite: 6]
* [cite_start]**Jéssica Kushida** [cite: 6]
* [cite_start]**Natália Naomi Sumida** [cite: 6]
