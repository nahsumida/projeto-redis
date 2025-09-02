# Redis Cache Implementation for a MySQL Database

## 🔹 Project Overview

This project demonstrates the implementation of a **Redis cache layer** on top of a MySQL database to optimize application performance. The primary goal is to reduce database load and significantly decrease query response times by serving frequently accessed data directly from memory. The solution ensures data consistency between the cache and the database for all operations performed through the application.

---

## 💡 Key Features & Implemented Solution

* **Initial Cache Synchronization:** On server startup, a dedicated `/syncProducts` route automatically populates the Redis cache. It uses a **hash-based comparison** to identify new or modified products in the MySQL database and updates the cache accordingly, ensuring it is current.
* **Cache-Aside Pattern (for Reads):**
    * When fetching a single product by ID, the system first queries the Redis cache.
    * If the data is not found (a *cache miss*), it fetches the data from the MySQL database, adds it to the cache for future requests, and then returns it.
    * Requests for all products are served directly from the synchronized cache.

* **Write-Through Strategy (for Writes):**
    * For data modification operations (**create, update, delete**), the system employs a write-through approach.
    * Any change is applied to both the MySQL database and the Redis cache simultaneously, maintaining consistency.

---

## 📈 Observed Results

* **Improved Performance:** A significant **reduction in query response time** was observed, as data is served from Redis's in-memory storage, minimizing database access.
* **Data Consistency:** The write-through strategy proved effective in **maintaining synchronization** between the cache and the database for all application-driven inserts, updates, and deletions.

---

## ⚠️ Limitations & Future Improvements

The current implementation has a key limitation:

* **External Database Updates:** The cache can become desynchronized if the database is modified by an external process, bypassing the application logic.

**Proposed Solution:**
* Implement a **background worker** to periodically poll the database for external changes and automatically update the cache to ensure long-term data integrity.

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

* []**Isabella Tressino**
* []**Izabelle de Oliveira**
* []**Jéssica Kushida**
* []**Natália Naomi Sumida**
