// No uso service ni aplico factory porque se supone que este mock representa un resultado especificamente de mongo


const mockProducts = [];

for (let i = 1; i <= 100; i++) {
  const product = {
    _id: `649d250bdbbe478c11434c${i.toString().padStart(2, "0")}`,
    title: `Producto ${i}`,
    description: `Descripción del producto ${i}`,
    price: 5.99 + i,
    thumbnail: `imagen${i}.jpg`,
    stock: 800 + i,
    categ: "Home",
  };
  mockProducts.push(product);
}


const getAllMocks = async (_, res) => {
    try {
      res.status(200).json({ success: true, mockProducts: mockProducts });
    } catch (error) {
      req.logger.error(error);
      res
        .status(500)
        .json({ success: false, error: "Error al cargar el mock" });
    }
  };

module.exports = {
  getAllMocks,
};
