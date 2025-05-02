// models/index.js
import db from "../config/Database.js";

async function cleanupUserUniqueIndexes() {
  const queryInterface = db.getQueryInterface();
  try {
    const indexes = await queryInterface.showIndex("users");
    const emailIndexes = indexes.filter(index => {
      if (Array.isArray(index.fields) && index.fields.length > 0) {
        return index.fields.some(field => field.attribute === "email") && index.unique;
      }
      return false;
    });

    if (emailIndexes.length > 1) {
      console.log(`Terdeteksi ${emailIndexes.length} unique index untuk kolom 'email'. Menghapus indeks duplikat.`);
      for (let i = 1; i < emailIndexes.length; i++) {
        console.log(`Menghapus unique index: ${emailIndexes[i].name}`);
        await queryInterface.removeIndex("users", emailIndexes[i].name);
      }
    } else {
      console.log("Tidak ada indeks UNIQUE duplikat pada kolom 'email' di tabel users.");
    }
  } catch (error) {
    console.error("Error saat membersihkan indeks pada tabel users:", error.message);
  }
};
export { Arduino, Relay };
