import fs from "fs/promises";
import path from "path";

// JSON dosyasının yolu
const dbFilePath = path.resolve("db.json");

// Veriyi JSON dosyasına yazan yardımcı fonksiyon
async function writeDataToFile(data) {
  await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), "utf8");
}

// JSON dosyasını okuyan yardımcı fonksiyon
async function readDataFromFile() {
  const fileContent = await fs.readFile(dbFilePath, "utf8");
  return JSON.parse(fileContent);
}

// Veri eklemek için fonksiyon
export async function addItem(item) {
  const data = await readDataFromFile();
  data.data.push(item);
  await writeDataToFile(data);
}

// Veri çıkarmak için fonksiyon
export async function removeItem(id) {
  const data = await readDataFromFile();
  const newData = data.data.filter((item) => item.id != id);
  await writeDataToFile({
    data: newData,
  });
}

// Veriyi okumak için fonksiyon
export async function getItems() {
  const data = await readDataFromFile();
  return data.data;
}
