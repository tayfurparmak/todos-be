import { addItem, removeItem, getItems } from "./db.js";
import express from "express";
import cors from "cors";

async function run() {
  // Yeni bir öğe ekleyin
  await addItem({
    id: new Date().getTime(),
    title: "süt",
    content: "süt al",
    time: new Date(),
  });
  console.log("Item added");

  // Verileri okuyun
  const items = await getItems();
  console.log("Current items:", items);

  // İlk öğeyi çıkarın
  await removeItem(1723295200890);
  console.log("Item removed");

  // Güncellenmiş verileri tekrar okuyun
  const updatedItems = await getItems();
  console.log("Updated items:", updatedItems);
}

// run().catch(console.error);

const app = express();
app.use(cors());
const port = 3001;

// JSON gövdesini işlemek için middleware
app.use(express.json());

// POST isteği ile veri ekleme endpoint'i
app.post("/add", async (req, res) => {
  try {
    const item = req.body;

    // `item` objesinin geçerli olduğunu doğrulama (isteğe bağlı)
    if (!item || typeof item !== "object") {
      return res.status(400).json({ message: "Invalid item data" });
    }

    await addItem({
      id: new Date().getTime(),
      time: new Date(),
      ...item,
    });
    res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Error adding item" });
  }
});

app.get("/get", async (req, res) => {
  const items = await getItems();
  res.status(200).json(items);
});

// DELETE isteği ile veri çıkarma endpoint'i
app.delete("/remove/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const idToRemove = parseInt(id, 10);

    // Geçerli bir indeks olduğunu doğrula
    if (isNaN(idToRemove) || idToRemove < 0) {
      return res.status(400).json({ message: "Invalid id" });
    }

    await removeItem(idToRemove);
    res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: "Error removing item" });
  }
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
